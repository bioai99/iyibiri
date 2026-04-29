'use server'

// Vol-32-B sponsor admin actions — profile + posts + rewards CRUD.

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ─── Sponsor brand profile ────────────────────────────────────────

export interface SponsorProfileData {
  name: string
  short_name: string | null
  brand_color: string | null
  logo_url: string | null
  cover_url: string | null
  description: string | null
  website: string | null
}

export async function updateSponsorProfile(
  sponsorId: string,
  data: Partial<SponsorProfileData>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  try {
    const payload: Record<string, any> = {}
    if (data.name !== undefined) payload.name = data.name
    if (data.short_name !== undefined) payload.short_name = data.short_name || null
    if (data.brand_color !== undefined) payload.brand_color = data.brand_color || null
    if (data.logo_url !== undefined) payload.logo_url = data.logo_url || null
    if (data.cover_url !== undefined) payload.cover_url = data.cover_url || null
    if (data.description !== undefined) payload.description = data.description || null
    if (data.website !== undefined) payload.website = data.website || null

    const { error } = await (supabase as any)
      .from('sponsors')
      .update(payload)
      .eq('id', sponsorId)
    if (error) return { success: false, error: error.message }

    revalidatePath(`/admin/sponsor/${sponsorId}`)
    revalidatePath(`/admin/sponsor/${sponsorId}/profile`)
    revalidatePath(`/dashboard/sponsors/${sponsorId}`)
    revalidatePath('/dashboard/donate')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

// ─── Sponsor posts CRUD ───────────────────────────────────────────

export interface SponsorPostData {
  title: string
  summary: string | null
  content: string | null
  cover_image_url: string | null
  category: 'article' | 'update' | 'story' | 'tip' | null
  read_time: number
  published: boolean
}

export async function createSponsorPost(
  sponsorId: string,
  data: SponsorPostData,
): Promise<{ success: boolean; postId?: string; error?: string }> {
  const supabase = await createClient()
  try {
    const { data: post, error } = await (supabase as any)
      .from('posts')
      .insert({
        author_type: 'sponsor',
        sponsor_id: sponsorId,
        ngo_id: null,
        title: data.title,
        summary: data.summary,
        content: data.content,
        cover_image_url: data.cover_image_url,
        category: data.category,
        read_time: data.read_time,
        published: data.published,
      })
      .select('id')
      .single()
    if (error) return { success: false, error: error.message }
    revalidatePath(`/admin/sponsor/${sponsorId}/posts`)
    revalidatePath(`/dashboard/sponsors/${sponsorId}`)
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/donate')
    return { success: true, postId: post?.id }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateSponsorPost(
  sponsorId: string,
  postId: string,
  data: Partial<SponsorPostData>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  try {
    const payload: Record<string, any> = {}
    if (data.title !== undefined) payload.title = data.title
    if (data.summary !== undefined) payload.summary = data.summary
    if (data.content !== undefined) payload.content = data.content
    if (data.cover_image_url !== undefined) payload.cover_image_url = data.cover_image_url
    if (data.category !== undefined) payload.category = data.category
    if (data.read_time !== undefined) payload.read_time = data.read_time
    if (data.published !== undefined) payload.published = data.published

    const { error } = await (supabase as any)
      .from('posts')
      .update(payload)
      .eq('id', postId)
      .eq('sponsor_id', sponsorId)
      .eq('author_type', 'sponsor')
    if (error) return { success: false, error: error.message }
    revalidatePath(`/admin/sponsor/${sponsorId}/posts`)
    revalidatePath(`/admin/sponsor/${sponsorId}/posts/${postId}/edit`)
    revalidatePath(`/dashboard/posts/${postId}`)
    revalidatePath('/dashboard')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteSponsorPost(
  sponsorId: string,
  postId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  try {
    const { error } = await (supabase as any)
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('sponsor_id', sponsorId)
      .eq('author_type', 'sponsor')
    if (error) return { success: false, error: error.message }
    revalidatePath(`/admin/sponsor/${sponsorId}/posts`)
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

// ─── Sponsor rewards CRUD ─────────────────────────────────────────

export interface SponsorRewardData {
  id?: string
  title: string
  brand: string
  brand_logo: string | null
  description: string | null
  karma_required: number
  category: string | null
  active: boolean
  image_url: string | null
}

export async function createSponsorReward(
  sponsorId: string,
  data: SponsorRewardData,
): Promise<{ success: boolean; rewardId?: string; error?: string }> {
  const supabase = await createClient()
  try {
    const id =
      data.id ||
      `reward-${sponsorId}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
    const { error } = await (supabase as any).from('rewards').insert({
      id,
      title: data.title,
      brand: data.brand,
      brand_logo: data.brand_logo,
      description: data.description,
      karma_required: data.karma_required,
      category: data.category,
      active: data.active,
      image_url: data.image_url,
      sponsor_id: sponsorId,
    })
    if (error) return { success: false, error: error.message }
    revalidatePath(`/admin/sponsor/${sponsorId}/rewards`)
    revalidatePath('/dashboard/rewards')
    return { success: true, rewardId: id }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateSponsorReward(
  sponsorId: string,
  rewardId: string,
  data: Partial<SponsorRewardData>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  try {
    const payload: Record<string, any> = {}
    if (data.title !== undefined) payload.title = data.title
    if (data.brand !== undefined) payload.brand = data.brand
    if (data.brand_logo !== undefined) payload.brand_logo = data.brand_logo
    if (data.description !== undefined) payload.description = data.description
    if (data.karma_required !== undefined) payload.karma_required = data.karma_required
    if (data.category !== undefined) payload.category = data.category
    if (data.active !== undefined) payload.active = data.active
    if (data.image_url !== undefined) payload.image_url = data.image_url

    const { error } = await (supabase as any)
      .from('rewards')
      .update(payload)
      .eq('id', rewardId)
      .eq('sponsor_id', sponsorId)
    if (error) return { success: false, error: error.message }
    revalidatePath(`/admin/sponsor/${sponsorId}/rewards`)
    revalidatePath(`/admin/sponsor/${sponsorId}/rewards/${rewardId}/edit`)
    revalidatePath('/dashboard/rewards')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
