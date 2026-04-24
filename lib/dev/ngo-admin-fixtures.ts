/**
 * NGO Admin Fixtures Seed (dev-only)
 *
 * 5 STK için mock admin user oluşturur + ngo_admin_users link
 * Idempotent — yeniden çalıştırılınca duplicate değil, mevcut update.
 *
 * Guard: process.env.NODE_ENV !== 'production' (server action içinde).
 *
 * Kullanım:
 * - `lib/dev/ngo-admin-fixtures.ts` dosyasından export edilen
 *   `seedNgoAdminFixtures()` ve `clearNgoAdminFixtures()` fonksiyonları
 *   `/admin/devtools` sayfasındaki "Seed NGO Admin Fixtures" butonu tarafından çağrılır.
 *
 * Note: Supabase admin API gerekli (auth.admin.createUser, deleteUser).
 *       Development ortamında `.env.local` içinde SUPABASE_SERVICE_ROLE_KEY var olmalı.
 */

import { createClient } from '@/lib/supabase/server'

const NGO_ADMINS = [
  {
    ngoId: 'tema',
    email: 'admin@tema.dev',
    password: 'TemaAdmin2026!',
    name: 'TEMA Admin',
  },
  {
    ngoId: 'tegv',
    email: 'admin@tegv.dev',
    password: 'TegvAdmin2026!',
    name: 'TEGV Admin',
  },
  {
    ngoId: 'losev',
    email: 'admin@losev.dev',
    password: 'LosevAdmin2026!',
    name: 'LÖSEV Admin',
  },
  {
    ngoId: 'haytap',
    email: 'admin@haytap.dev',
    password: 'HaytapAdmin2026!',
    name: 'HAYTAP Admin',
  },
  {
    ngoId: 'kodluyoruz',
    email: 'admin@kodluyoruz.dev',
    password: 'KodluyorAdmin2026!',
    name: 'Kodluyoruz Admin',
  },
]

export async function seedNgoAdminFixtures(): Promise<{
  created: number
  existing: number
  errors: string[]
}> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'seedNgoAdminFixtures: production ortamda çalıştırılamaz'
    )
  }

  const supabase = await createClient()
  const stats = { created: 0, existing: 0, errors: [] as string[] }

  for (const admin of NGO_ADMINS) {
    try {
      // 1. Auth user oluştur (admin.createUser service role'ü gerekli)
      let userId: string | null = null

      // Mevcut user'ı kontrol et
      const { data: existingUsers } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      })

      const existingUser = existingUsers?.users.find((u) => u.email === admin.email)

      if (existingUser) {
        // Mevcut user var
        userId = existingUser.id
        stats.existing++
      } else {
        // Yeni user oluştur
        const { data: userData, error: authError } = await supabase.auth.admin.createUser({
          email: admin.email,
          password: admin.password,
          email_confirm: true,
          user_metadata: {
            name: admin.name,
            is_ngo_admin: true,
          },
        })

        if (authError) {
          stats.errors.push(`${admin.email}: auth create error — ${authError.message}`)
          continue
        }

        if (!userData?.user?.id) {
          stats.errors.push(`${admin.email}: user.id bulunamadı (auth create başarısız)`)
          continue
        }

        userId = userData.user.id
        stats.created++
      }

      // 2. Profile upsert (idempotent)
      const { error: profileError } = await supabase.from('profiles').upsert(
        {
          id: userId,
          name: admin.name,
          email: admin.email,
        },
        { onConflict: 'id' }
      )

      if (profileError) {
        stats.errors.push(
          `${admin.email}: profile upsert error — ${profileError.message}`
        )
        continue
      }

      // 3. ngo_admin_users link (idempotent)
      const { error: adminLinkError } = await supabase
        .from('ngo_admin_users')
        .upsert(
          {
            user_id: userId,
            ngo_id: admin.ngoId,
            role: 'admin',
          },
          { onConflict: 'user_id,ngo_id' }
        )

      if (adminLinkError) {
        stats.errors.push(
          `${admin.email}: ngo_admin_users link error — ${adminLinkError.message}`
        )
        continue
      }
    } catch (e) {
      stats.errors.push(
        `${admin.email}: unexpected error — ${(e as Error).message}`
      )
    }
  }

  return stats
}

export async function clearNgoAdminFixtures(): Promise<{
  deleted: number
  errors: string[]
}> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('clearNgoAdminFixtures: production ortamda çalıştırılamaz')
  }

  const supabase = await createClient()
  const stats = { deleted: 0, errors: [] as string[] }

  for (const admin of NGO_ADMINS) {
    try {
      // 1. ngo_admin_users link'i sil (user_id bulunarak)
      const { data: existingUsers } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      })

      const existing = existingUsers?.users.find((u) => u.email === admin.email)

      if (existing) {
        // ngo_admin_users link'i sil
        const { error: linkDeleteError } = await supabase
          .from('ngo_admin_users')
          .delete()
          .eq('user_id', existing.id)

        if (linkDeleteError) {
          stats.errors.push(
            `${admin.email}: ngo_admin_users delete error — ${linkDeleteError.message}`
          )
          continue
        }

        // Auth user'ı sil
        const { error: userDeleteError } = await supabase.auth.admin.deleteUser(
          existing.id
        )

        if (userDeleteError) {
          stats.errors.push(
            `${admin.email}: auth user delete error — ${userDeleteError.message}`
          )
          continue
        }

        stats.deleted++
      }
    } catch (e) {
      stats.errors.push(
        `${admin.email}: clear error — ${(e as Error).message}`
      )
    }
  }

  return stats
}

export const NGO_ADMIN_FIXTURES = NGO_ADMINS
