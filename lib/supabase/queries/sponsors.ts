// Vol-30 Migration 037 — sponsor markalar query helpers.
//
// Sponsor entity'si NGO'ya benzer ama bağımsız:
//   - Rewards her zaman sponsor'a bağlıdır (rewards.sponsor_id NOT NULL)
//   - Posts ya NGO ya sponsor yazarlıdır (author_type + XOR check)
//   - Vol-31'de sponsor_admin_users role + backoffice gelecek

import { createClient } from '../server'
import type { Sponsor, SponsorBrief } from '../types'

export async function getAllSponsors(): Promise<Sponsor[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getSponsorBriefs(): Promise<SponsorBrief[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('sponsors')
    .select('id, name, short_name, brand_color, logo_url')
    .eq('is_active', true)
    .order('name', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getSponsorById(id: string): Promise<Sponsor | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data
}
