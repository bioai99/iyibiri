'use client'

// app/admin/devtools/devtools-client.tsx
//
// Dev fixtures UI — current user için 4 state'in örnek datasını tek tıkla oluştur/temizle.
// NGO admin fixtures seed butonları.
// lib/dev/user-fixtures.ts + lib/dev/ngo-admin-fixtures.ts server action'ları çağırır.

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  seedUserFixtures,
  clearUserFixtures,
  type SeedReport,
} from '@/lib/dev/user-fixtures'
import {
  seedNgoAdminFixtures,
  clearNgoAdminFixtures,
} from '@/lib/dev/ngo-admin-fixtures'

interface Profile {
  id: string
  name: string | null
  email: string | null
  karma_total: number
}

interface Props {
  profile: Profile | null
  currentState: {
    memberships: number
    userMissions: number
    karmaTransactions: number
    referrals: number
  }
  seedHealth: {
    ngoCount: number
    missionCount: number
  }
  nodeEnv: string
}

interface NgoAdminSeedReport {
  created?: number
  existing?: number
  deleted?: number
  errors: string[]
}

export function DevtoolsClient({
  profile,
  currentState,
  seedHealth,
  nodeEnv,
}: Props) {
  const [pending, startTransition] = useTransition()
  const [lastReport, setLastReport] = useState<SeedReport | null>(null)
  const [lastError, setLastError] = useState<string | null>(null)
  const [ngoAdminReport, setNgoAdminReport] = useState<NgoAdminSeedReport | null>(null)
  const [ngoAdminError, setNgoAdminError] = useState<string | null>(null)

  const migrationReady = seedHealth.ngoCount >= 5 && seedHealth.missionCount >= 10

  const runSeed = () => {
    setLastError(null)
    startTransition(async () => {
      const res = await seedUserFixtures()
      if (res.ok) setLastReport(res.report)
      else setLastError(res.error)
    })
  }

  const runClear = () => {
    setLastError(null)
    if (!confirm('Bu kullanıcının tüm fixture verilerini silmek istediğinden emin misin?')) return
    startTransition(async () => {
      const res = await clearUserFixtures()
      if (res.ok) setLastReport(res.report)
      else setLastError(res.error)
    })
  }

  const runNgoAdminSeed = () => {
    setNgoAdminError(null)
    startTransition(async () => {
      try {
        const res = await seedNgoAdminFixtures()
        setNgoAdminReport(res)
      } catch (e) {
        setNgoAdminError((e as Error).message)
      }
    })
  }

  const runNgoAdminClear = () => {
    setNgoAdminError(null)
    if (!confirm('Tüm NGO admin fixture verilerini silmek istediğinden emin misin?')) return
    startTransition(async () => {
      try {
        const res = await clearNgoAdminFixtures()
        setNgoAdminReport(res)
      } catch (e) {
        setNgoAdminError((e as Error).message)
      }
    })
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-stone-900">Devtools</h1>
        <p className="mt-1 text-sm text-stone-600">
          Dev ortamında test fixture'ları oluştur — 9 state FSM için örnek data.
        </p>
      </header>

      {/* Environment + user info */}
      <section className="rounded-xl border border-stone-200 bg-white p-5">
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-stone-500">
          Ortam
        </h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-stone-500">NODE_ENV</dt>
            <dd className="font-mono text-stone-900">{nodeEnv}</dd>
          </div>
          <div>
            <dt className="text-stone-500">Kullanıcı</dt>
            <dd className="text-stone-900">
              {profile?.email ?? '—'}
              {profile?.name ? ` · ${profile.name}` : ''}
            </dd>
          </div>
          <div>
            <dt className="text-stone-500">Karma total</dt>
            <dd className="font-mono text-stone-900">
              {profile?.karma_total ?? 0}
            </dd>
          </div>
          <div>
            <dt className="text-stone-500">User ID</dt>
            <dd className="font-mono text-[11px] text-stone-700">{profile?.id}</dd>
          </div>
        </dl>
      </section>

      {/* Migration health */}
      <section
        className={`rounded-xl border p-5 ${
          migrationReady
            ? 'border-emerald-200 bg-emerald-50'
            : 'border-amber-200 bg-amber-50'
        }`}
      >
        <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-stone-600">
          Migration Sağlık
        </h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-stone-600">NGO sayısı</dt>
            <dd
              className={
                seedHealth.ngoCount >= 5
                  ? 'font-semibold text-emerald-700'
                  : 'font-semibold text-amber-700'
              }
            >
              {seedHealth.ngoCount} / 5
            </dd>
          </div>
          <div>
            <dt className="text-stone-600">Mission sayısı</dt>
            <dd
              className={
                seedHealth.missionCount >= 10
                  ? 'font-semibold text-emerald-700'
                  : 'font-semibold text-amber-700'
              }
            >
              {seedHealth.missionCount} / 12
            </dd>
          </div>
        </dl>
        {!migrationReady && (
          <p className="mt-3 text-[13px] text-amber-900">
            ⚠️ Migration 014 henüz apply edilmemiş görünüyor. Supabase SQL editor'de{' '}
            <code className="rounded bg-amber-100 px-1 py-0.5 text-[12px]">
              supabase/migrations/014_ngos_missions_seed.sql
            </code>{' '}
            dosyasını çalıştır.
          </p>
        )}
      </section>

      {/* Current fixture state */}
      <section className="rounded-xl border border-stone-200 bg-white p-5">
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-stone-500">
          Mevcut kullanıcı verisi
        </h2>
        <div className="grid grid-cols-4 gap-3 text-center">
          <StatCard label="STK üyeliği" value={currentState.memberships} />
          <StatCard label="User mission" value={currentState.userMissions} />
          <StatCard label="Karma txn" value={currentState.karmaTransactions} />
          <StatCard label="Referral" value={currentState.referrals} />
        </div>
      </section>

      {/* User Fixtures Actions */}
      <section className="rounded-xl border border-stone-200 bg-white p-5">
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-stone-500">
          User Fixtures Aksiyonları
        </h2>
        <p className="mb-4 text-sm text-stone-600">
          "Seed fixtures" çalıştırdığında şunlar oluşturulur:
        </p>
        <ul className="mb-4 space-y-1 text-[13px] text-stone-700">
          <li>→ 3 aktif <strong>ngo_membership</strong> (TEMA + HAYTAP + TEGV)</li>
          <li>→ 4 <strong>user_missions</strong>: taken / completed / failed_verification / cancelled</li>
          <li>→ 1 <strong>karma_transaction</strong> +100 (completed mission için)</li>
          <li>→ 1 <strong>referral</strong> (TEMA yetişkin ₺256 confirmed)</li>
        </ul>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={runSeed}
            disabled={pending || !migrationReady}
            className="h-10 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white disabled:opacity-50"
          >
            {pending ? 'Çalışıyor…' : '🌱 Seed fixtures'}
          </button>
          <button
            type="button"
            onClick={runClear}
            disabled={pending}
            className="h-10 rounded-lg border border-rose-300 bg-white px-4 text-sm font-semibold text-rose-700 disabled:opacity-50"
          >
            🧹 Temizle
          </button>
        </div>
      </section>

      {/* NGO Admin Fixtures Actions */}
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-amber-900">
          NGO Admin Fixtures Aksiyonları
        </h2>
        <p className="mb-4 text-sm text-amber-900">
          5 STK admin user oluştur (TEMA, TEGV, LÖSEV, HAYTAP, Kodluyoruz):
        </p>
        <ul className="mb-4 space-y-1 text-[13px] text-amber-900">
          <li>→ <strong>5 auth user</strong> (email + password, email_confirmed)</li>
          <li>→ <strong>5 profile</strong> (name, email)</li>
          <li>→ <strong>5 ngo_admin_users</strong> link (user × ngo, role='admin')</li>
        </ul>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={runNgoAdminSeed}
            disabled={pending}
            className="h-10 rounded-lg bg-amber-600 px-4 text-sm font-semibold text-white disabled:opacity-50"
          >
            {pending ? 'Çalışıyor…' : '🌱 Seed NGO admin'}
          </button>
          <button
            type="button"
            onClick={runNgoAdminClear}
            disabled={pending}
            className="h-10 rounded-lg border border-amber-600 bg-white px-4 text-sm font-semibold text-amber-700 disabled:opacity-50"
          >
            🧹 Clear NGO admin
          </button>
        </div>
      </section>

      {/* NGO Admin Report */}
      {ngoAdminReport && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-amber-900">
            NGO Admin Fixtures Raporu
          </h2>
          <dl className="mb-4 grid grid-cols-2 gap-2 text-[13px]">
            {ngoAdminReport.created !== undefined && (
              <div>
                <dt className="text-amber-900">Oluşturulanlar</dt>
                <dd className="font-semibold text-amber-900">
                  {ngoAdminReport.created}
                </dd>
              </div>
            )}
            {ngoAdminReport.existing !== undefined && (
              <div>
                <dt className="text-amber-900">Mevcut</dt>
                <dd className="font-semibold text-amber-900">
                  {ngoAdminReport.existing}
                </dd>
              </div>
            )}
            {ngoAdminReport.deleted !== undefined && (
              <div>
                <dt className="text-amber-900">Silinen</dt>
                <dd className="font-semibold text-amber-900">
                  {ngoAdminReport.deleted}
                </dd>
              </div>
            )}
          </dl>

          {ngoAdminReport.errors.length > 0 && (
            <>
              <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.1em] text-rose-600">
                Uyarılar
              </div>
              <ul className="space-y-1 text-[13px] text-rose-700">
                {ngoAdminReport.errors.map((e, i) => (
                  <li key={i}>⚠ {e}</li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-4 flex flex-wrap gap-2 text-[12px]">
            <Link
              href="/admin"
              className="rounded-md bg-amber-100 px-3 py-1.5 font-semibold text-amber-900 hover:bg-amber-200"
            >
              → Admin hub
            </Link>
          </div>
        </section>
      )}

      {/* Error + report */}
      {lastError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          <strong>Hata:</strong> {lastError}
        </div>
      )}

      {ngoAdminError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          <strong>NGO Admin Hatası:</strong> {ngoAdminError}
        </div>
      )}

      {lastReport && (
        <section className="rounded-xl border border-stone-200 bg-white p-5">
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-stone-500">
            Son rapor
          </h2>
          <dl className="mb-4 grid grid-cols-2 gap-2 text-[13px]">
            <div>
              <dt className="text-stone-500">ngo_memberships</dt>
              <dd className="font-semibold text-stone-900">
                {lastReport.ngoMembershipsCreated}
              </dd>
            </div>
            <div>
              <dt className="text-stone-500">user_missions</dt>
              <dd className="font-semibold text-stone-900">
                {lastReport.userMissionsCreated}
              </dd>
            </div>
            <div>
              <dt className="text-stone-500">karma_transactions</dt>
              <dd className="font-semibold text-stone-900">
                {lastReport.karmaTransactionsCreated}
              </dd>
            </div>
            <div>
              <dt className="text-stone-500">referrals</dt>
              <dd className="font-semibold text-stone-900">
                {lastReport.referralsCreated}
              </dd>
            </div>
          </dl>

          {lastReport.stateSummary.length > 0 && (
            <>
              <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.1em] text-stone-500">
                State özeti
              </div>
              <ul className="space-y-1 text-[13px] text-stone-700">
                {lastReport.stateSummary.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </>
          )}

          {lastReport.errors.length > 0 && (
            <>
              <div className="mt-4 mb-1 text-[11px] font-bold uppercase tracking-[0.1em] text-rose-500">
                Uyarılar
              </div>
              <ul className="space-y-1 text-[13px] text-rose-700">
                {lastReport.errors.map((e, i) => (
                  <li key={i}>⚠ {e}</li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-4 flex flex-wrap gap-2 text-[12px]">
            <Link
              href="/dashboard"
              className="rounded-md bg-stone-100 px-3 py-1.5 font-semibold text-stone-700 hover:bg-stone-200"
            >
              → Dashboard&apos;a git
            </Link>
            <Link
              href="/dashboard/missions"
              className="rounded-md bg-stone-100 px-3 py-1.5 font-semibold text-stone-700 hover:bg-stone-200"
            >
              → Mission list
            </Link>
            <Link
              href="/dashboard/my-missions"
              className="rounded-md bg-stone-100 px-3 py-1.5 font-semibold text-stone-700 hover:bg-stone-200"
            >
              → Görevlerim (state'ler)
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
      <div className="text-2xl font-bold text-stone-900">{value}</div>
      <div className="text-[11px] text-stone-500">{label}</div>
    </div>
  )
}
