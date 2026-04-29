'use server'

// Vol-32 STK kampanya CRUD — STK admin'in /admin/[ngoId]/campaigns altındaki işlemleri.

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { DonationScenarioType } from '@/lib/supabase/types'

export interface CampaignFormData {
  title: string
  summary?: string | null
  description?: string | null
  cause?: string | null
  image_url?: string | null
  end_date?: string | null
  scenario_type: DonationScenarioType
  status: 'draft' | 'active' | 'closed' | 'archived'
  is_featured: boolean
}

function slugify(input: string): string {
  return input
    .toLocaleLowerCase('tr-TR')
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i')
    .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

export async function createCampaign(
  ngoId: string,
  data: CampaignFormData,
): Promise<{ success: boolean; campaignId?: string; error?: string }> {
  const supabase = await createClient()
  try {
    const slug = slugify(data.title)
    const id = `camp-${ngoId}-${slug}-${Date.now().toString(36)}`

    const { error } = await supabase.from('campaigns').insert({
      id,
      ngo_id: ngoId,
      title: data.title,
      summary: data.summary || null,
      description: data.description || null,
      cause: data.cause || null,
      image_url: data.image_url || null,
      end_date: data.end_date || null,
      scenario_type: data.scenario_type,
      status: data.status,
      is_featured: data.is_featured,
    })

    if (error) return { success: false, error: error.message }

    revalidatePath(`/admin/${ngoId}/campaigns`)
    revalidatePath(`/admin/${ngoId}`)
    revalidatePath('/dashboard/donate')
    revalidatePath(`/dashboard/donate/${ngoId}`)

    return { success: true, campaignId: id }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateCampaign(
  ngoId: string,
  campaignId: string,
  data: Partial<CampaignFormData>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  try {
    const payload: Record<string, any> = {}
    if (data.title !== undefined) payload.title = data.title
    if (data.summary !== undefined) payload.summary = data.summary || null
    if (data.description !== undefined) payload.description = data.description || null
    if (data.cause !== undefined) payload.cause = data.cause || null
    if (data.image_url !== undefined) payload.image_url = data.image_url || null
    if (data.end_date !== undefined) payload.end_date = data.end_date || null
    if (data.scenario_type !== undefined) payload.scenario_type = data.scenario_type
    if (data.status !== undefined) payload.status = data.status
    if (data.is_featured !== undefined) payload.is_featured = data.is_featured

    const { error } = await (supabase as any)
      .from('campaigns')
      .update(payload)
      .eq('id', campaignId)
      .eq('ngo_id', ngoId)

    if (error) return { success: false, error: error.message }

    revalidatePath(`/admin/${ngoId}/campaigns`)
    revalidatePath(`/admin/${ngoId}/campaigns/${campaignId}/edit`)
    revalidatePath('/dashboard/donate')
    revalidatePath(`/dashboard/donate/${ngoId}`)

    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function archiveCampaign(
  ngoId: string,
  campaignId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  try {
    const { error } = await supabase
      .from('campaigns')
      .update({ status: 'archived', is_featured: false })
      .eq('id', campaignId)
      .eq('ngo_id', ngoId)

    if (error) return { success: false, error: error.message }

    revalidatePath(`/admin/${ngoId}/campaigns`)
    revalidatePath('/dashboard/donate')
    revalidatePath(`/dashboard/donate/${ngoId}`)

    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
