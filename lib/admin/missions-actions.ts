'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface MissionData {
  title: string
  description: string
  domain: string
  karma_points: number
  event_date: string
  location: string
  image_url: string
  status: 'draft' | 'active'
}

// BUG-053 fix (Vol-23.5): missions tablosunda iki paralel kolon var:
//   - active (boolean) — RLS policy + user-facing app filtresi
//   - status (enum) — backoffice yönetim
// Bunlar sync edilmezse "cancelled" görev kullanıcıda hâlâ görünür.
// Tüm write action'larda status set edilirken active boolean'ı türet.
function statusToActive(status: 'draft' | 'active' | 'cancelled' | 'completed'): boolean {
  return status === 'active'
}

/**
 * Create a new mission for an NGO
 */
export async function createMission(
  ngoId: string,
  data: MissionData
): Promise<{ success: boolean; missionId?: string; error?: string }> {
  const supabase = await createClient()

  try {
    const finalStatus = data.status === 'draft' ? 'draft' : 'active'
    const { data: mission, error } = await supabase
      .from('missions')
      .insert({
        ngo_id: ngoId,
        title: data.title,
        description: data.description,
        domain: data.domain as any,
        karma: data.karma_points,
        event_date: data.event_date,
        location: data.location,
        image_url: data.image_url,
        status: finalStatus,
        active: statusToActive(finalStatus), // BUG-053 sync
        verify_method: 'photo', // Default — V1
      })
      .select('id')
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    // Revalidate missions page
    revalidatePath(`/admin/${ngoId}/missions`)
    revalidatePath(`/admin/${ngoId}`)

    return { success: true, missionId: mission?.id }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

/**
 * Update an existing mission (Vol-23: tam edit akışı)
 */
export async function updateMission(
  ngoId: string,
  missionId: string,
  data: Partial<MissionData>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    const updatePayload: Record<string, any> = {}
    if (data.title !== undefined) updatePayload.title = data.title
    if (data.description !== undefined) updatePayload.description = data.description
    if (data.domain !== undefined) updatePayload.domain = data.domain
    if (data.karma_points !== undefined) updatePayload.karma = data.karma_points
    if (data.event_date !== undefined) updatePayload.event_date = data.event_date
    if (data.location !== undefined) updatePayload.location = data.location
    if (data.image_url !== undefined) updatePayload.image_url = data.image_url
    if (data.status !== undefined) {
      const finalStatus = data.status === 'draft' ? 'draft' : 'active'
      updatePayload.status = finalStatus
      updatePayload.active = statusToActive(finalStatus) // BUG-053 sync
    }

    const { error } = await (supabase as any)
      .from('missions')
      .update(updatePayload)
      .eq('id', missionId)
      .eq('ngo_id', ngoId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/admin/${ngoId}/missions`)
    revalidatePath(`/admin/${ngoId}/missions/${missionId}/edit`)
    revalidatePath(`/admin/${ngoId}`)

    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

/**
 * Update mission status (draft/published/cancelled)
 */
export async function updateMissionStatus(
  ngoId: string,
  missionId: string,
  status: 'draft' | 'active' | 'cancelled' | 'completed'
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    const { error } = await (supabase as any)
      .from('missions')
      .update({
        status,
        active: statusToActive(status), // BUG-053 sync
      })
      .eq('id', missionId)
      .eq('ngo_id', ngoId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/admin/${ngoId}/missions`)

    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

/**
 * Delete a mission (Vol-23: hard delete)
 *
 * Önce ilgili user_missions / karma_transactions kayıtlarını kontrol et.
 * Eğer katılımcı varsa silmek yerine 'cancelled' status'e çek (soft).
 */
export async function deleteMission(
  ngoId: string,
  missionId: string
): Promise<{ success: boolean; softDeleted?: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    // Katılımcı var mı?
    const { count: participantCount, error: countError } = await supabase
      .from('user_missions')
      .select('id', { count: 'exact', head: true })
      .eq('mission_id', missionId)

    if (countError) {
      return { success: false, error: countError.message }
    }

    if ((participantCount ?? 0) > 0) {
      // Soft delete: status'u cancelled yap + active=false sync
      const { error: updateError } = await (supabase as any)
        .from('missions')
        .update({
          status: 'cancelled',
          active: false, // BUG-053 sync — kullanıcı app'ten kaldır
        })
        .eq('id', missionId)
        .eq('ngo_id', ngoId)

      if (updateError) {
        return { success: false, error: updateError.message }
      }

      revalidatePath(`/admin/${ngoId}/missions`)
      revalidatePath(`/admin/${ngoId}`)

      return { success: true, softDeleted: true }
    }

    // Hard delete
    const { error } = await supabase
      .from('missions')
      .delete()
      .eq('id', missionId)
      .eq('ngo_id', ngoId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/admin/${ngoId}/missions`)
    revalidatePath(`/admin/${ngoId}`)

    return { success: true, softDeleted: false }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
