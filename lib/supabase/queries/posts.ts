// Vol-30.4 Posts queries — NGO + Sponsor author tipleri ayrı rail'lerde gösterilir.
// Migration 037'den sonra posts.author_type ('ngo' | 'sponsor') + sponsor_id eklendi.

import { createClient } from '../server'
import type { PostWithAuthor } from '../types'

const AUTHOR_JOIN =
  '*, ngos:ngo_id(id, name, short_name, logo_url, color_accent, cover_image_url), sponsors:sponsor_id(id, name, short_name, brand_color, logo_url)'

export async function getRecentNgoPosts(limit = 10): Promise<PostWithAuthor[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('posts')
    .select(AUTHOR_JOIN)
    .eq('published', true)
    .eq('author_type', 'ngo')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data as unknown as PostWithAuthor[]) ?? []
}

export async function getRecentSponsorPosts(limit = 6): Promise<PostWithAuthor[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('posts')
    .select(AUTHOR_JOIN)
    .eq('published', true)
    .eq('author_type', 'sponsor')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data as unknown as PostWithAuthor[]) ?? []
}

// Tüm postlar (author tipi ne olursa olsun) — discover sayfası için
export async function getRecentAllPosts(limit = 12): Promise<PostWithAuthor[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('posts')
    .select(AUTHOR_JOIN)
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data as unknown as PostWithAuthor[]) ?? []
}
