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

/**
 * Create a new mission for an NGO
 */
export async function createMission(
  ngoId: string,
  data: MissionData
): Promise<{ success: boolean; missionId?: string; error?: string }> {
  const supabase = await createClient()

  try {
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
        status: data.status === 'draft' ? 'draft' : 'active',
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
 * Update mission status (draft/published/cancelled)
 */
export async function updateMissionStatus(
  ngoId: string,
  missionId: string,
  status: 'draft' | 'active' | 'cancelled' | 'completed'
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('missions')
      .update({ status })
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
