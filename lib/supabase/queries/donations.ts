// Vol-31 donations query helpers — campaigns, donations, subscriptions, tax receipts.

import { createClient } from '../server'
import type {
  Campaign,
  CampaignWithNGO,
  Donation,
  DonationSubscription,
  DonationWithNGO,
  TaxReceipt,
} from '../types'

const CAMPAIGN_NGO_JOIN =
  '*, ngos:ngo_id(id, name, short_name, logo_url, color_accent, cover_image_url)'

// Featured campaigns — "Bu ayın kampanyaları" carousel için
export async function getFeaturedCampaigns(limit = 6): Promise<CampaignWithNGO[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('campaigns')
    .select(CAMPAIGN_NGO_JOIN)
    .eq('is_featured', true)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data as unknown as CampaignWithNGO[]) ?? []
}

// Belirli STK'nın aktif kampanyaları — NGO detail sayfasında
export async function getCampaignsForNgo(ngoId: string): Promise<Campaign[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('ngo_id', ngoId)
    .eq('status', 'active')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getCampaignById(id: string): Promise<CampaignWithNGO | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('campaigns')
    .select(CAMPAIGN_NGO_JOIN)
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data as unknown as CampaignWithNGO | null
}

// Kullanıcı bağışları — history sayfası
export async function getUserDonations(userId: string, limit = 50): Promise<DonationWithNGO[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('donations')
    .select(
      '*, ngos:ngo_id(id, name, short_name, logo_url, color_accent, cover_image_url), campaigns:campaign_id(id, title, image_url)',
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data as unknown as DonationWithNGO[]) ?? []
}

export async function getUserActiveSubscriptions(
  userId: string,
): Promise<DonationSubscription[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('donation_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['intent', 'active', 'paused'])
    .order('started_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getUserTaxReceipts(userId: string): Promise<TaxReceipt[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tax_receipts')
    .select('*')
    .eq('user_id', userId)
    .order('year', { ascending: false })
  if (error) throw error
  return data ?? []
}

// Aggregate — yıllık özet (history sayfası için)
export async function summarizeUserDonations(userId: string): Promise<{
  totalAmount: number
  eligibleAmount: number
  donationCount: number
  thisYearAmount: number
}> {
  const supabase = createClient()
  const { data } = await supabase
    .from('donations')
    .select('amount_try, tax_eligible, created_at, status')
    .eq('user_id', userId)
    .eq('status', 'completed')
  const list = data ?? []
  const currentYear = new Date().getFullYear()
  let total = 0
  let eligible = 0
  let thisYear = 0
  for (const d of list) {
    const amt = Number(d.amount_try) || 0
    total += amt
    if (d.tax_eligible) eligible += amt
    if (new Date(d.created_at).getFullYear() === currentYear) thisYear += amt
  }
  return {
    totalAmount: total,
    eligibleAmount: eligible,
    donationCount: list.length,
    thisYearAmount: thisYear,
  }
}
