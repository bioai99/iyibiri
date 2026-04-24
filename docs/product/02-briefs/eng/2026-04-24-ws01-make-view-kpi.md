# Eng Brief — WS-01 MAKE View + KPI Framework

**Tarih:** 2026-04-24
**Sahip (brief):** product-analyst
**Sonraki sahip:** supabase-backend (primary) + frontend-engineer (admin UI)
**Workstream:** WS-01 North-Star Metric + KPI
**Master plan:** `docs/product/01-workstreams/2026-04-24-v1-improvement-master-plan.md` #P0.11
**Priority:** P0 · **Effort:** M (1 hafta toplam)
**Bağlı ADR:** ADR-001 (NSM = Aylık Karma Kazanan Kullanıcı)

## 1. Problem (veri ile)

İyiBiri'nin 8 ADR + 12 strateji memosu üstüne **ölçüm katmanı yok.** North-Star Metric (MAKE — Monthly Active Karma Earner) tanımlandı ama hesaplama + gösterim altyapısı eksik. Admin paneli "bu ay MAKE kaç" sorusuna cevap veremiyor. Yatırımcı raporlama + içsel karar döngüsü için kritik eksik.

## 2. Çözüm (outcome)

- **Supabase view `make_monthly`** — `karma_transactions.type='mission_complete'` row'u olan distinct user_id rolling 30 gün.
- **Secondary metrikler view'ları:** W4 retention, Karma per MAKE, first-mission time.
- **Admin dashboard kartı** — `/admin` altında yeni section, MAKE sayısı + trend + ay karşılaştırma.
- **Weekly report Supabase Edge Function** — Pazartesi 09:00 email/Slack.

## 3. Scope

### Must (V1)
- `make_monthly` view.
- `make_secondary_metrics` view (W4 ret, Karma/MAKE, first-mission).
- Admin UI kartı (sayı + trend).
- CSV export butonu.

### Should (V1.1)
- Weekly cron email report.
- Alert mekanizması (MAKE %10+ düşüş warning).

### Won't (V2+)
- Real-time stream.
- PostHog entegrasyonu.
- A/B test altyapısı.

## 4. Başarı metriği

- MAKE tanımı production view'da hesaplanabilir durumda.
- Admin kartı sayı + trend gösteriyor (Ay 1 veri başlangıç).
- Cron raporu haftalık otomatik.
- Year 1 hedef: **Ay 12 MAKE ≥ 10.000** (konservatif); orta senaryo 30.000.

## 5. Teknik detay

### 5.1 Migration (veya direct DB view — migration gerekmeyebilir)

```sql
-- scripts/views/make_views.sql (migration'sız view; ayarlanabilir)
create or replace view public.make_monthly as
select
  date_trunc('month', kt.created_at) as month,
  count(distinct kt.user_id) as make
from public.karma_transactions kt
where kt.type = 'mission_complete'
  and kt.created_at >= now() - interval '6 months'
group by 1
order by 1 desc;

-- Secondary: W4 retention
create or replace view public.make_w4_retention as
...

-- Karma per MAKE
create or replace view public.karma_per_make as
select
  date_trunc('month', kt.created_at) as month,
  count(distinct kt.user_id) as make,
  sum(kt.amount) as total_karma,
  round(sum(kt.amount)::numeric / nullif(count(distinct kt.user_id), 0), 0) as karma_per_make
from public.karma_transactions kt
where kt.type = 'mission_complete'
  and kt.created_at >= now() - interval '6 months'
group by 1
order by 1 desc;

-- First-mission time (complete)
create or replace view public.first_mission_time as
select
  p.id as user_id,
  p.created_at as signup_at,
  min(um.completed_at) as first_mission_at,
  extract(epoch from min(um.completed_at) - p.created_at) / 3600 as hours_to_first_mission
from public.profiles p
left join public.user_missions um on um.user_id = p.id and um.status = 'completed'
where p.created_at >= now() - interval '3 months'
group by p.id;
```

**RLS:** Admin-only. Policy:
```sql
alter view public.make_monthly owner to postgres;
-- Direct view queries sadece service role'dan yapılmalı (admin secret)
```

### 5.2 `lib/supabase/queries/analytics.ts`

```typescript
// lib/supabase/queries/analytics.ts
import { createClient } from '@/lib/supabase/server'

export async function getMakeMonthly() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('make_monthly')
    .select('*')
    .limit(6)
  if (error) throw error
  return data
}

export async function getKarmaPerMake() { /* ... */ }
export async function getFirstMissionTime() { /* ... */ }
```

### 5.3 Admin UI — `app/admin/analytics/page.tsx`

```tsx
// Server component
import { getMakeMonthly } from '@/lib/supabase/queries/analytics'

export default async function AnalyticsPage() {
  const monthly = await getMakeMonthly()
  return (
    <div>
      <h1>Analytics</h1>
      <MakeCard data={monthly} />
      {/* Trend chart (recharts veya lightweight chart) */}
    </div>
  )
}
```

### 5.4 Weekly Cron — Supabase Edge Function

```typescript
// supabase/functions/weekly-make-report/index.ts
import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from '@supabase/supabase-js'

serve(async () => {
  const supabase = createClient(...)
  const { data } = await supabase.from('make_monthly').select('*').limit(1)
  // Email template + send via Resend/SendGrid
  return new Response('OK')
})

// Cron: Pazartesi 09:00 (Supabase cron config)
```

## 6. Dependencies

- `karma_transactions` tablosu mevcut (atlas Bölüm 4) ✓.
- Admin auth middleware (`middleware.ts` ADMIN_SECRET) mevcut ✓.
- Supabase Edge Functions deploy yetkisi.
- Email servis (Resend veya Supabase Auth email).

## 7. Test planı

- **Unit test yok** (V1 genel yaklaşım — test altyapısı Faz 4).
- **Manuel test:**
  - `karma_transactions`'a test row ekle, view güncelleniyor mu?
  - Admin UI açık, MAKE sayısı gösteriliyor mu?
  - CSV export çalışıyor mu?
- **Edge case:**
  - Hiç karma_transactions yoksa view boş döner (0 göster, null değil).
  - Rolling 30d boundary.

## 8. Açık sorular

- Cron infrastructure Supabase Edge mi, başka servis mi (Vercel Cron)?
- Email servisi hangisi? (Resend hızlı setup; Supabase Auth email limitli).
- Admin dashboard'da chart library — recharts (büyük, kullanılıyor) veya lightweight?

## 9. Risk

- View performance: `karma_transactions` büyüdüğünde index gerekli.
  ```sql
  create index if not exists karma_transactions_type_date_idx
    on public.karma_transactions(type, created_at)
    where type = 'mission_complete';
  ```
- Cron tetiklenmezse MAKE raporu kaçar — fallback: admin manuel refresh.

## 10. Handoff

- **supabase-backend:** view'ları yaz + test + index + cron function (4-5 gün).
- **frontend-engineer:** admin UI kartı + chart + CSV export (2-3 gün).
- **Visual QA:** minimal (admin UI, atlas pattern yok).

**Toplam:** ~1 hafta.
