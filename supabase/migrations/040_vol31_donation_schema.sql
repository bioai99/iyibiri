-- Vol-31 Migration 040: Bağış altyapısı (campaigns + donations + subscriptions + tax_receipts).
--
-- Bağlam (Bahadır kararı, 2026-04-29):
--   Vol-31 = Bağış sekmesi. Bottom nav'da Kelebek → Bağış swap.
--   V1 mock payment: gerçek para hareketi yok, sadece donations.status='completed' insert.
--   Real payment integration Vol-32+ (ADR-008 v2 hibrit: passthrough/embedded/marketplace).
--
-- Bu migration:
--   1. donation_scenario_type enum (general / specific_campaign / in_memory / gift / regular_supporter)
--   2. campaigns tablosu (her STK'nın aktif kampanyaları)
--   3. donations tablosu (tamamlanmış bağışlar)
--   4. donation_subscriptions tablosu (düzenli destekçilik V1: status='intent' mock)
--   5. tax_receipts tablosu (yıllık vergi karnesi placeholder, PDF Vol-33+)
--   6. karma_transactions.type enum'una 'donation' ekle
--   7. Fixture seed: 11 kampanya (8 STK için 1-2 kampanya)

begin;

-- ─────────────────────────────────────────────────────────────────
-- 1. Donation scenario type enum
-- ─────────────────────────────────────────────────────────────────
do $$ begin
  create type donation_scenario_type as enum (
    'general',              -- STK'ya genel bağış (kampanya bağımsız)
    'specific_campaign',    -- Belirli kampanyaya bağış
    'in_memory',            -- Anısına bağış
    'gift',                 -- Hediye bağış (başka biri adına)
    'regular_supporter'     -- Aylık düzenli destekçi
  );
exception
  when duplicate_object then null;
end $$;

-- ─────────────────────────────────────────────────────────────────
-- 2. campaigns tablosu (STK aktif kampanyaları)
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.campaigns (
  id              text        primary key,
  ngo_id          text        not null references public.ngos(id) on delete cascade,
  title           text        not null,
  summary         text,
  description     text,
  cause           text,                          -- 'env'|'edu'|'animal'|'health'|'child'|'crisis'
  image_url       text,
  scenario_type   donation_scenario_type not null default 'specific_campaign',
  end_date        timestamptz,                   -- NULL = açık uçlu
  supporter_count integer     not null default 0,
  status          text        not null default 'active'
                              check (status in ('draft', 'active', 'closed', 'archived')),
  is_featured     boolean     not null default false,  -- "Bu ayın kampanyaları" carousel
  created_at      timestamptz not null default now()
);

alter table public.campaigns enable row level security;

drop policy if exists "Anyone can view active campaigns" on public.campaigns;
create policy "Anyone can view active campaigns"
  on public.campaigns
  for select
  using (status = 'active' or status = 'closed');

create index if not exists idx_campaigns_ngo_status
  on public.campaigns (ngo_id, status)
  where status = 'active';

create index if not exists idx_campaigns_featured
  on public.campaigns (is_featured, created_at desc)
  where is_featured = true and status = 'active';

-- ─────────────────────────────────────────────────────────────────
-- 3. donations tablosu (tamamlanmış bağış kaydı)
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.donations (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null references public.profiles(id) on delete cascade,
  ngo_id          text        not null references public.ngos(id),
  campaign_id     text        references public.campaigns(id),  -- NULL = general/in_memory/gift
  amount_try      numeric(10,2) not null check (amount_try > 0),
  scenario_type   donation_scenario_type not null,
  intent_label    text,                          -- "Anneme · Ayşe için" gibi free text (in_memory/gift)
  is_recurring    boolean     not null default false,
  subscription_id uuid,                          -- regular_supporter ise hangi sub'tan geldi
  status          text        not null default 'completed'
                              check (status in ('pending', 'completed', 'failed', 'refunded')),
  tax_eligible    boolean     not null default false,  -- ngos.tax_exempt'tan kopyalanır
  receipt_email   text,                          -- bağış sırasında kullanıcı maili (snapshot)
  payment_method  text,                          -- mock: 'mock_card', real: 'iyzico'/'fonzip'/...
  external_transaction_id text, -- real payment processor id (V1'de NULL)
  metadata        jsonb       default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  completed_at    timestamptz default now()
);

alter table public.donations enable row level security;

drop policy if exists "Users view own donations" on public.donations;
create policy "Users view own donations"
  on public.donations
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own donations" on public.donations;
create policy "Users insert own donations"
  on public.donations
  for insert
  with check (auth.uid() = user_id);

create index if not exists idx_donations_user_created
  on public.donations (user_id, created_at desc);

create index if not exists idx_donations_ngo_completed
  on public.donations (ngo_id, completed_at desc)
  where status = 'completed';

-- ─────────────────────────────────────────────────────────────────
-- 4. donation_subscriptions (düzenli destekçilik)
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.donation_subscriptions (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null references public.profiles(id) on delete cascade,
  ngo_id          text        not null references public.ngos(id),
  amount_try      numeric(10,2) not null check (amount_try > 0),
  scenario_type   donation_scenario_type not null default 'regular_supporter',
  status          text        not null default 'intent'
                              check (status in ('intent', 'active', 'paused', 'cancelled', 'failed')),
  -- 'intent' = V1 mock; backend cron yok, kullanıcı niyetini gösterir
  -- 'active' = real recurring (Vol-33+)
  next_charge_at  timestamptz,                   -- real recurring için (V1 NULL)
  payment_method  text,
  external_subscription_id text,                  -- iyzico/fonzip subscription id
  started_at      timestamptz not null default now(),
  cancelled_at    timestamptz,
  metadata        jsonb       default '{}'::jsonb
);

alter table public.donation_subscriptions enable row level security;

drop policy if exists "Users view own subscriptions" on public.donation_subscriptions;
create policy "Users view own subscriptions"
  on public.donation_subscriptions
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own subscriptions" on public.donation_subscriptions;
create policy "Users insert own subscriptions"
  on public.donation_subscriptions
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update own subscriptions" on public.donation_subscriptions;
create policy "Users update own subscriptions"
  on public.donation_subscriptions
  for update
  using (auth.uid() = user_id);

create index if not exists idx_subscriptions_user
  on public.donation_subscriptions (user_id, status);

-- ─────────────────────────────────────────────────────────────────
-- 5. tax_receipts (yıllık vergi karnesi placeholder)
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.tax_receipts (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references public.profiles(id) on delete cascade,
  year              integer     not null,
  total_amount      numeric(12,2) not null default 0,
  eligible_amount   numeric(12,2) not null default 0,  -- tax_exempt STK'lara giden kısım
  donation_count    integer     not null default 0,
  pdf_url           text,                              -- generated PDF (Vol-33+)
  generated_at      timestamptz,
  created_at        timestamptz not null default now(),
  unique (user_id, year)
);

alter table public.tax_receipts enable row level security;

drop policy if exists "Users view own tax receipts" on public.tax_receipts;
create policy "Users view own tax receipts"
  on public.tax_receipts
  for select
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────
-- 6. karma_transactions.type enum'una 'donation' ekle
-- ─────────────────────────────────────────────────────────────────
alter table public.karma_transactions
  drop constraint if exists karma_transactions_type_check;

alter table public.karma_transactions
  add constraint karma_transactions_type_check
    check (type in ('mission_complete', 'reward_redemption', 'ngo_membership', 'donation', 'welcome_bonus'));

create index if not exists karma_transactions_donation_idx
  on public.karma_transactions (user_id, created_at desc)
  where type = 'donation';

-- ─────────────────────────────────────────────────────────────────
-- 7. Fixture seed: 11 kampanya (8 STK için)
-- ─────────────────────────────────────────────────────────────────
insert into public.campaigns (
  id, ngo_id, title, summary, description, cause, image_url,
  scenario_type, end_date, supporter_count, status, is_featured
) values
  -- TEMA (2 kampanya)
  ('camp-tema-fidan-2026', 'tema',
    '100.000 fidan, daha yeşil bir Anadolu',
    'TEMA gönüllüleri ile 100.000 fidanı toprakla buluşturuyoruz.',
    'Erozyonu durduran her ağaç, gelecek için bir nefes. Fidanların bir kısmı arı dostu türlerden seçildi.',
    'env', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&q=80',
    'specific_campaign', now() + interval '60 days', 1247, 'active', true),
  ('camp-tema-bozkir', 'tema',
    'Bozkır restorasyonu',
    'Konya Bozkır''da 50 hektar bozulan toprak yeniden hayata dönüyor.',
    'Bozkır ekosistemi Türkiye''nin en eski biyoçeşitlilik kaynaklarından biri. Restorasyon 5 yıllık plan.',
    'env', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80',
    'specific_campaign', now() + interval '180 days', 432, 'active', false),

  -- Kızılay (2 kampanya)
  ('camp-kizilay-deprem', 'kizilay',
    'Deprem hazırlık seti',
    'Riskli bölgelerde 5.000 aileye temel afet seti dağıtacağız.',
    'Su, ışık, ilk yardım, battaniye, gıda — bir afet anında ilk 72 saatin temel ihtiyaçları.',
    'crisis', 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=900&q=80',
    'specific_campaign', now() + interval '45 days', 2891, 'active', true),
  ('camp-kizilay-kan', 'kizilay',
    'Kan bağışı kampanyası',
    'Yaz aylarında düşen kan stoklarını tamamlamak için seferberlik.',
    'Bir ünite kan 3 hayata dokunabilir. Kızılay merkezlerinde randevusuz bağış.',
    'health', 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=900&q=80',
    'specific_campaign', now() + interval '30 days', 5670, 'active', false),

  -- ÇYDD (2 kampanya)
  ('camp-cydd-burs-2026', 'cydd',
    '2026 kız çocukları bursu',
    '5.000 öğrenciye yıllık eğitim bursu sağlamayı hedefliyoruz.',
    '37 yıllık birikim. Bursiyerin yüzde 87''si üniversiteyi tamamlıyor, yüzde 41''i lisansüstüne devam ediyor.',
    'edu', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80',
    'specific_campaign', now() + interval '90 days', 1834, 'active', true),
  ('camp-cydd-egitim', 'cydd',
    'İlk işime hazırım',
    'Bursiyer mezunlarına CV, mülakat ve sektör mentorluğu programı.',
    'Eğitimi tamamlamak yetmez — ilk işe geçişte güvenli bir köprü gerekir.',
    'edu', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80',
    'specific_campaign', now() + interval '120 days', 287, 'active', false),

  -- TEGV (1)
  ('camp-tegv-park', 'tegv',
    'Eğitim parkları yenileme',
    'Türkiye genelinde 12 eğitim parkının dijital donanımını yeniliyoruz.',
    '12 parkta tablet, kütüphane güncelleme, atölye malzemesi. 25.000 çocuğa direkt etki.',
    'edu', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=80',
    'specific_campaign', now() + interval '75 days', 612, 'active', false),

  -- LÖSEV (1)
  ('camp-losev-tedavi', 'losev',
    'Çocuk lösemi tedavi destek',
    'Tedavi gören 1.200 çocuğun aileleri için temel ihtiyaç desteği.',
    'Tedavi süresi 6 ay - 3 yıl arası değişir. Aileler genelde işten ayrılmak zorunda kalır.',
    'health', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80',
    'specific_campaign', now() + interval '365 days', 4123, 'active', true),

  -- Kodluyoruz (1)
  ('camp-kodluyoruz-kadin', 'kodluyoruz',
    'Kadın programcı bursu',
    'Yazılım sektörüne giriş yapmak isteyen 200 kadına 6 aylık ücretsiz bootcamp.',
    'Mezunların yüzde 78''i 3 ay içinde işe yerleşiyor. Mentor + iş yerleştirme dahil.',
    'edu', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=80',
    'specific_campaign', now() + interval '60 days', 891, 'active', false),

  -- Haytap (1)
  ('camp-haytap-barinak', 'haytap',
    'Sokak hayvanları için kış barınağı',
    '15 ilde mobil kış barınakları kurarak 3.000 sokak hayvanına sıcak yuva.',
    'Yalıtımlı kabin, kuru gıda istasyonu, su pompası. Belediyelerle ortak yürütülüyor.',
    'animal', 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=900&q=80',
    'specific_campaign', now() + interval '120 days', 1567, 'active', false),

  -- İBB (1)
  ('camp-ibb-park', 'ibb',
    'İstanbul mahalle parkları',
    '40 mahalle parkına yeni oyun ekipmanı + erişilebilirlik.',
    'Tekerlekli sandalye rampası, görme engelli rehber çizgileri, oyun ekipmanı yenileme.',
    'child', 'https://images.unsplash.com/photo-1597343908318-7036c25fd8a4?w=900&q=80',
    'specific_campaign', now() + interval '180 days', 2034, 'active', false)

on conflict (id) do update set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  cause = excluded.cause,
  image_url = excluded.image_url,
  scenario_type = excluded.scenario_type,
  end_date = excluded.end_date,
  supporter_count = excluded.supporter_count,
  status = excluded.status,
  is_featured = excluded.is_featured;

commit;

-- DOĞRULAMA SORGULARI:
--   select count(*) from public.campaigns where status = 'active';
--   -- Beklenen: 11
--
--   select count(*) from public.campaigns where is_featured = true;
--   -- Beklenen: 4 (TEMA fidan, Kızılay deprem, ÇYDD burs, LÖSEV tedavi)
--
--   select c.ngo_id, count(*) from public.campaigns c group by c.ngo_id order by count desc;
--   -- TEMA: 2, Kızılay: 2, ÇYDD: 2, TEGV: 1, LÖSEV: 1, Kodluyoruz: 1, Haytap: 1, İBB: 1
--
--   select unnest(enum_range(null::donation_scenario_type));
--   -- general, specific_campaign, in_memory, gift, regular_supporter
