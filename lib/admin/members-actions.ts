'use server'

import { createClient } from '@/lib/supabase/server'
import { requireNgoAdmin, AuthError, authErrorToResult } from '@/lib/auth/guards'

// ADR-015 Accepted (2026-04-26): Defense-in-depth + RLS double-check.

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('tr-TR')
}

/**
 * CSV dışa aktarma — KVKK uyumlu (email tam, profil ayrıntısı minimal)
 * Column: ad, soyad (split name), tier, başlama_tarihi, durum
 */
export async function exportMembersCSV(
  ngoId: string
): Promise<{ success: boolean; error?: string; csv?: string; code?: string }> {
  try {
    await requireNgoAdmin(ngoId)
  } catch (err) {
    if (err instanceof AuthError) return { success: false, ...authErrorToResult(err) }
    throw err
  }

  const supabase = await createClient()

  try {
    const { data: members, error } = await supabase
      .from('ngo_memberships')
      .select(`
        id,
        status,
        tier,
        joined_at,
        profiles:user_id(id, name, email)
      `)
      .eq('ngo_id', ngoId)
      .order('joined_at', { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    // CSV header
    const headers = ['İsim', 'E-posta', 'Üyelik Seviyesi', 'Başlama Tarihi', 'Durum']
    const rows: string[][] = []

    // CSV rows
    if (members) {
      for (const m of members) {
        const profile = m.profiles as any
        const name = profile?.name || 'Anonim'
        const email = profile?.email || ''
        const tier = TIER_LABEL_MAP[m.tier] || m.tier
        const startDate = formatDate(m.joined_at || new Date().toISOString())
        const status = STATUS_LABEL_MAP[m.status] || m.status

        rows.push([name, email, tier, startDate, status])
      }
    }

    // Build CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    return { success: true, csv: csvContent }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

const TIER_LABEL_MAP: Record<string, string> = {
  basic: 'Temel',
  standard: 'Standart',
  premium: 'Destek',
  donation_based: 'Bağış Bazlı',
}

const STATUS_LABEL_MAP: Record<string, string> = {
  active: 'Aktif',
  inactive: 'Pasif',
  cooling_off: 'Cayma Aşamasında',
}
