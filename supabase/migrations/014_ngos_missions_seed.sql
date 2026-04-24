-- 014_ngos_missions_seed.sql
-- Deterministic seed — 5 NGO + 12 mission, 9 state coverage.
-- Tarih: 2026-04-24 — supabase-backend
--
-- NEDEN BU MIGRATION:
-- Önceki migration 009/010'daki `update public.ngos set ... where id='tema'`
-- statement'ları `ngos` tablosunda hiç row olmadığı için SESSİZCE başarısız.
-- Bu migration eksik INSERT'leri yapar + 9 state test edilebilir mission'lar ekler.
--
-- Idempotent: hepsinde `on conflict (id) do nothing`. Tekrar apply edilebilir.

begin;

-- ============================================================
-- 1. NGO'lar — 5 pilot STK
-- ============================================================

-- TEMA — age_tiered membership, fonzip mevcut (embedded silent integration)
insert into public.ngos (
  id, name, short_name, tagline, description, category,
  color_accent, logo_url, website, member_count, volunteer_count, founded,
  membership_enabled, membership_description, membership_approval_required,
  membership_fee_config, payment_mode, payment_processor,
  donation_url, membership_url, tax_exempt, embed_config
) values (
  'tema',
  'TEMA Vakfı',
  'TEMA',
  'Türkiye''nin doğasını koruyoruz',
  'Türkiye Erozyonla Mücadele, Ağaçlandırma ve Doğal Varlıkları Koruma Vakfı olarak 1992''den bu yana doğa koruma alanında çalışmaktadır.',
  'Çevre',
  'emerald',
  null,
  'tema.org.tr',
  800000,
  12400,
  1992,
  true,
  'TEMA gönüllüsü olarak erozyonla mücadele ve ağaçlandırma çalışmalarına katkı sağla.',
  false,
  jsonb_build_object(
    'mode', 'age_tiered',
    'currency', 'TRY',
    'tiers', jsonb_build_array(
      jsonb_build_object('id', 'yas_0_13', 'name', '0-13 yaş', 'amount', 15, 'period', 'annual', 'age_min', 0, 'age_max', 13, 'display_order', 1),
      jsonb_build_object('id', 'yas_14_24', 'name', '14-24 yaş', 'amount', 15, 'period', 'annual', 'age_min', 14, 'age_max', 24, 'display_order', 2, 'impact_statement', '1 fidan dikilir'),
      jsonb_build_object('id', 'yetiskin', 'name', 'Yetişkin', 'amount', 256, 'period', 'annual', 'age_min', 25, 'region', 'metropolitan', 'display_order', 3, 'impact_statement', '7 fidan dikilir', 'recommended', true)
    ),
    'cooling_off_days', 14,
    'auto_renew_default', false
  ),
  'embedded',
  'fonzip',
  'https://fonzip.com/tema/bagis',
  'https://www.tema.org.tr/gonulluluk/gonullumuz-olun',
  true,
  jsonb_build_object('widget_type', 'fonzip_donation', 'note', 'TEMA fonzip müşterisi — silent integration (Yol D.2).')
) on conflict (id) do nothing;

-- TEGV — donation_based, min 100
insert into public.ngos (
  id, name, short_name, tagline, description, category,
  color_accent, logo_url, website, member_count, volunteer_count, founded,
  membership_enabled, membership_description, membership_approval_required,
  membership_fee_config, payment_mode, payment_processor, tax_exempt, embed_config
) values (
  'tegv',
  'TEGV — Türkiye Eğitim Gönüllüleri Vakfı',
  'TEGV',
  'Her çocuğa erişilebilir nitelikli eğitim',
  '1995''ten bu yana ilköğretim çağındaki çocuklara akıl, hayal ve duygu dünyalarını zenginleştirecek eğitim programları sunmaktadır.',
  'Eğitim',
  'blue',
  null,
  'tegv.org',
  190000,
  9800,
  1995,
  true,
  'Eğitim gönüllüsü olarak çocukların yanında ol.',
  false,
  jsonb_build_object(
    'mode', 'donation_based',
    'currency', 'TRY',
    'tiers', jsonb_build_array(),
    'donation_based', jsonb_build_object(
      'min_amount', 100,
      'suggested_amounts', jsonb_build_array(100, 250, 500, 1000),
      'note', 'Her bağış çocuk eğitimine katkıdır; gönüllü olmak için ayrıca başvuru.'
    ),
    'cooling_off_days', 14,
    'auto_renew_default', false
  ),
  'marketplace',
  'iyzico',
  true,
  jsonb_build_object('widget_type', 'iyzico_checkout_form', 'note', 'TEGV iyzico Marketplace sub-merchant.')
) on conflict (id) do nothing;

-- LÖSEV — donation_based, no min
insert into public.ngos (
  id, name, short_name, tagline, description, category,
  color_accent, logo_url, website, member_count, volunteer_count, founded,
  membership_enabled, membership_description,
  membership_fee_config, payment_mode, payment_processor, tax_exempt, embed_config
) values (
  'losev',
  'LÖSEV — Lösemili Çocuklar Sağlık ve Eğitim Vakfı',
  'LÖSEV',
  'Lösemili çocukların yanındayız',
  '1998''den bu yana lösemili çocuklar ve ailelerine tedavi, eğitim ve sosyal destek sağlamaktadır.',
  'Sağlık',
  'rose',
  null,
  'losev.org.tr',
  520000,
  6100,
  1998,
  true,
  'Her bağışın bir çocuğun tedavisine katkıdır.',
  jsonb_build_object(
    'mode', 'donation_based',
    'currency', 'TRY',
    'tiers', jsonb_build_array(),
    'donation_based', jsonb_build_object(
      'min_amount', null,
      'suggested_amounts', jsonb_build_array(50, 100, 250, 500),
      'note', 'Her bağış lösemili bir çocuğa umut olur.'
    ),
    'cooling_off_days', 14
  ),
  'marketplace',
  'iyzico',
  true,
  jsonb_build_object('widget_type', 'iyzico_checkout_form')
) on conflict (id) do nothing;

-- HAYTAP — aylık recurring
insert into public.ngos (
  id, name, short_name, tagline, description, category,
  color_accent, logo_url, website, member_count, volunteer_count, founded,
  membership_enabled, membership_description,
  membership_fee_config, payment_mode, payment_processor, tax_exempt
) values (
  'haytap',
  'Haytap — Hayvan Hakları Federasyonu',
  'Haytap',
  'Hayvanların sesi oluyoruz',
  '2006''dan bu yana Türkiye''de hayvan hakları savunuculuğu ve barınak iyileştirme çalışmaları yürütmektedir.',
  'Hayvanlar',
  'orange',
  null,
  'haytap.org',
  45000,
  2800,
  2006,
  true,
  'Aylık destekçi ol — sokak hayvanları için sürdürülebilir kaynak.',
  jsonb_build_object(
    'mode', 'monthly',
    'currency', 'TRY',
    'tiers', jsonb_build_array(
      jsonb_build_object('id', 'monthly_destekci', 'name', 'Aylık destekçi', 'amount', 50, 'period', 'monthly', 'display_order', 1, 'impact_statement', '2 sokak hayvanı bir ay beslenir')
    ),
    'cooling_off_days', 14,
    'auto_renew_default', true
  ),
  'embedded',
  'paytr',
  false
) on conflict (id) do nothing;

-- Kodluyoruz — flat annual membership
insert into public.ngos (
  id, name, short_name, tagline, description, category,
  color_accent, logo_url, website, member_count, volunteer_count, founded,
  membership_enabled, membership_description,
  membership_fee_config, payment_mode, payment_processor, tax_exempt
) values (
  'kodluyoruz',
  'Kodluyoruz',
  'Kodluyoruz',
  'Teknolojiyle geleceği inşa ediyoruz',
  'İstihdam edilebilirliği artırmak için dezavantajlı bireylere ücretsiz yazılım eğitimi veren sosyal girişim.',
  'Eğitim',
  'blue',
  null,
  'kodluyoruz.org',
  22000,
  890,
  2019,
  true,
  'Mentor gönüllüsü ol — 4 saat/ay öğrenci eşleştirmesi.',
  jsonb_build_object(
    'mode', 'annual',
    'currency', 'TRY',
    'tiers', jsonb_build_array(
      jsonb_build_object('id', 'annual_basic', 'name', 'Yıllık üyelik', 'amount', 120, 'period', 'annual', 'display_order', 1)
    ),
    'cooling_off_days', 14,
    'auto_renew_default', false
  ),
  'marketplace',
  'iyzico',
  false
) on conflict (id) do nothing;

-- ============================================================
-- 2. Missions — 12 görev, 9 state coverage
-- ============================================================

-- 2.1 IDLE state görevleri (4 adet — farklı NGO ve kategori)

insert into public.missions (
  id, title, description, long_description, ngo_id, category, difficulty,
  karma, duration, domain, style, verify_method, verify_code, verify_hint,
  featured, active, steps, impact_statement, photo_url,
  location, date_label, spots_left, status, event_date
) values (
  'm-tema-fidan',
  'Arı dostu fidan dikimi',
  'Beykoz''da TEMA ile beraber fidan dikimi',
  'Doğayı korumak için somut bir adım. TEMA yetkilisi seni karşılar, fidanları beraberce dikersin. Çiçekli fidanlar arıların yaşam alanına katkı sağlar.',
  'tema',
  'nature',
  'easy',
  80,
  '3 saat',
  'nature',
  'outside',
  'qr',
  'FIDAN2026',
  'Görev sonunda TEMA yetkilisinden QR kodunu tara.',
  true,
  true,
  '[]'::jsonb,
  '7 arı dostu fidan dikeceksin; 3 yıl sonra 1 ağaç olur.',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
  'Beykoz, İstanbul',
  '27 Nis Cumartesi 10:00',
  12,
  'active',
  (now() + interval '3 days')::timestamptz
) on conflict (id) do nothing;

insert into public.missions (
  id, title, description, long_description, ngo_id, category, difficulty,
  karma, duration, domain, style, verify_method, verify_code, verify_hint,
  featured, active, steps, impact_statement, photo_url,
  location, date_label, spots_left, status, event_date
) values (
  'm-tegv-okuma',
  'Okuma atölyesi gönüllülüğü',
  'TEGV ile çocuklara kitap okuma etkinliği',
  'İlköğretim çağındaki 8-12 yaş arası çocuklara 2 saatlik okuma atölyesi. TEGV öğretmenleri rehberlik eder, sen atölyede bir masaya destek olursun.',
  'tegv',
  'education',
  'easy',
  100,
  '2 saat',
  'education',
  'outside',
  'code',
  'OKUMA2026',
  'Etkinlik sonunda TEGV koordinatöründen kod al.',
  false,
  true,
  '[]'::jsonb,
  '15 çocuğa bir kitap keşif deneyimi.',
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
  'Kadıköy, İstanbul',
  '4 May Cumartesi 14:00',
  20,
  'active',
  (now() + interval '10 days')::timestamptz
) on conflict (id) do nothing;

insert into public.missions (
  id, title, description, long_description, ngo_id, category, difficulty,
  karma, duration, domain, style, verify_method, verify_code,
  featured, active, steps, impact_statement, photo_url,
  location, date_label, spots_left, status, event_date
) values (
  'm-haytap-mama',
  'Sokak hayvanı mama dağıtımı',
  'Haytap ile Ataşehir çevresi mama dağıtımı',
  'Belirlenmiş 5 noktada sokak hayvanlarına mama dağıtımı. Gönüllü ekip seninle birlikte yol planını paylaşır.',
  'haytap',
  'animals',
  'medium',
  60,
  '2 saat',
  'social',
  'outside',
  'photo',
  null,
  true,
  true,
  '[]'::jsonb,
  '30+ sokak hayvanına bir öğün.',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
  'Ataşehir, İstanbul',
  '28 Nis Pazar 11:00',
  8,
  'active',
  (now() + interval '4 days')::timestamptz
) on conflict (id) do nothing;

insert into public.missions (
  id, title, description, long_description, ngo_id, category, difficulty,
  karma, duration, domain, style, verify_method,
  featured, active, steps, impact_statement,
  location, date_label, spots_left, status
) values (
  'm-online-digital-literacy',
  'Dijital okuryazarlık online atölyesi',
  'Uzaktan katılım — 50+ kişi için teknik destek',
  'Senin gibi dijital bilgisi olan gönüllüler, 50-65 yaş arası kullanıcılara 1 saatlik online "telefonumu nasıl kullanırım" eğitimi veriyor. Platform bizim, içerik hazır.',
  null,  -- platform görevi, üyelik gerekmez
  'social',
  'easy',
  50,
  '1 saat',
  'social',
  'remote',
  'auto',
  false,
  true,
  '[]'::jsonb,
  '1 kişi daha dijital olarak bağımsız olur.',
  'Online',
  'Esnek',
  50,
  'active'
) on conflict (id) do nothing;

-- 2.2 FULL state (spots_left = 0)

insert into public.missions (
  id, title, description, ngo_id, category, difficulty,
  karma, duration, domain, style, verify_method, verify_code,
  active, steps, impact_statement, photo_url,
  location, date_label, spots_left, status, event_date
) values (
  'm-tema-temizlik-full',
  'Kilyos sahili temizlik',
  'TEMA sahil temizlik etkinliği — kapasite doldu',
  'tema',
  'nature',
  'medium',
  70,
  '3 saat',
  'nature',
  'outside',
  'code',
  'SAHIL2026',
  true,
  '[]'::jsonb,
  '30kg+ plastik atık doğadan uzaklaştırılır.',
  'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800',
  'Kilyos, İstanbul',
  '1 May Çarşamba 09:00',
  0,  -- ← FULL
  'active',
  (now() + interval '7 days')::timestamptz
) on conflict (id) do nothing;

insert into public.missions (
  id, title, description, ngo_id, category, difficulty,
  karma, duration, domain, style, verify_method, verify_code,
  active, steps, impact_statement,
  location, date_label, spots_left, status, event_date
) values (
  'm-tegv-kutuphane-full',
  'Okul kütüphanesi düzenleme',
  'TEGV — Fatih okulu kütüphanesi sınıflandırma',
  'tegv',
  'education',
  'easy',
  40,
  '4 saat',
  'education',
  'outside',
  'code',
  'KUTUP2026',
  true,
  '[]'::jsonb,
  'Bir okulun 2000+ kitabı çocukların erişimine kavuşur.',
  'Fatih, İstanbul',
  '3 May Cuma 10:00',
  0,  -- ← FULL
  'active',
  (now() + interval '9 days')::timestamptz
) on conflict (id) do nothing;

-- 2.3 EXPIRED state (event_date geçmiş)

insert into public.missions (
  id, title, description, ngo_id, category, difficulty,
  karma, duration, domain, style, verify_method, verify_code,
  active, steps, impact_statement,
  location, date_label, spots_left, status, event_date
) values (
  'm-losev-hastane-expired',
  'Hastane ziyareti — moral etkinliği',
  'LÖSEV — lösemili çocuklarla atölye (GEÇTİ)',
  'losev',
  'social',
  'easy',
  90,
  '2 saat',
  'social',
  'outside',
  'code',
  'LOSEV2026',
  true,
  '[]'::jsonb,
  '20+ çocuğa unutulmaz bir gün.',
  'Cebeci, Ankara',
  '15 Nis Salı 14:00',
  5,
  'active',
  (now() - interval '9 days')::timestamptz  -- ← 9 gün önce, EXPIRED
) on conflict (id) do nothing;

insert into public.missions (
  id, title, description, ngo_id, category, difficulty,
  karma, duration, domain, style, verify_method,
  active, steps, impact_statement,
  location, date_label, spots_left, status, event_date
) values (
  'm-haytap-barinak-expired',
  'Barınak ziyareti Nisan',
  'Haytap — Ümraniye barınağı temizlik (GEÇTİ)',
  'haytap',
  'animals',
  'medium',
  60,
  '3 saat',
  'social',
  'outside',
  'auto',
  true,
  '[]'::jsonb,
  '40+ barınak hayvanı temiz ortamda.',
  'Ümraniye, İstanbul',
  '20 Nis Pazar 10:00',
  3,
  'active',
  (now() - interval '4 days')::timestamptz  -- ← 4 gün önce, EXPIRED
) on conflict (id) do nothing;

-- 2.4 CANCELLED state (admin iptal etti)

insert into public.missions (
  id, title, description, ngo_id, category, difficulty,
  karma, duration, domain, style, verify_method, verify_code,
  active, steps, impact_statement,
  location, date_label, spots_left, status, event_date
) values (
  'm-tema-bozkir-cancelled',
  'Bozkır yürüyüşü ve tohum ekimi',
  'TEMA — Silivri bozkır etkinliği (İPTAL)',
  'tema',
  'nature',
  'medium',
  100,
  '5 saat',
  'nature',
  'outside',
  'qr',
  'BOZKIR2026',
  true,
  '[]'::jsonb,
  'Bozkır rehabilitasyon alanına tohum katkısı.',
  'Silivri, İstanbul',
  '5 May Pazar 09:00',
  25,
  'cancelled',  -- ← İPTAL
  (now() + interval '11 days')::timestamptz
) on conflict (id) do nothing;

-- 2.5 DRAFT state (admin henüz yayınlamadı — dashboard'da görünmemeli)

insert into public.missions (
  id, title, description, ngo_id, category, difficulty,
  karma, duration, domain, style, verify_method, verify_code,
  active, steps,
  location, date_label, spots_left, status, event_date
) values (
  'm-kodluyoruz-mentor-draft',
  'Yazılım mentoru — aylık taahhüt',
  'Kodluyoruz — 1 öğrenciye ayda 4 saat mentörlük',
  'kodluyoruz',
  'education',
  'hard',
  200,
  '4 saat/ay',
  'education',
  'remote',
  'auto',
  null,
  false,
  '[]'::jsonb,
  'Online',
  'Esnek',
  15,
  'draft',  -- ← DRAFT, yayında değil
  null
) on conflict (id) do nothing;

-- 2.6 Genel aktif missions (daha fazla dashboard çeşitliliği)

insert into public.missions (
  id, title, description, ngo_id, category, difficulty,
  karma, duration, domain, style, verify_method, verify_code,
  featured, active, steps, impact_statement, photo_url,
  location, date_label, spots_left, status, event_date
) values (
  'm-tema-kumbara',
  'Fidan için kumbara — çocuğuna 1 fidan',
  'TEMA — her 50TL bağışa 1 fidan',
  'tema',
  'nature',
  'easy',
  30,
  '5 dakika',
  'nature',
  'remote',
  'auto',
  null,
  false,
  true,
  '[]'::jsonb,
  'Çocuğun adına 1 fidan dikilir ve sertifika gelir.',
  'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800',
  'Online',
  'Esnek',
  999,
  'active',
  null
) on conflict (id) do nothing;

insert into public.missions (
  id, title, description, ngo_id, category, difficulty,
  karma, duration, domain, style, verify_method, verify_code,
  featured, active, steps, impact_statement, photo_url,
  location, date_label, spots_left, status, event_date
) values (
  'm-losev-kan',
  'Kan bağışı ve kayıt',
  'LÖSEV — Cebeci hastanesi kan bağışı',
  'losev',
  'health',
  'easy',
  120,
  '1 saat',
  'social',
  'outside',
  'code',
  'KAN2026',
  true,
  true,
  '[]'::jsonb,
  '3 kişinin hayatına dokunabilir.',
  'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800',
  'Cebeci, Ankara',
  '2 May Perşembe 10:00',
  30,
  'active',
  (now() + interval '8 days')::timestamptz
) on conflict (id) do nothing;

-- ============================================================
-- 3. Sanity check — counts
-- ============================================================

do $$
declare
  ngo_count int;
  mission_count int;
  fee_config_count int;
begin
  select count(*) into ngo_count from public.ngos;
  select count(*) into mission_count from public.missions;
  select count(*) into fee_config_count from public.ngos where membership_fee_config is not null;

  raise notice '[seed] NGOs: %', ngo_count;
  raise notice '[seed] Missions: %', mission_count;
  raise notice '[seed] NGOs with fee_config: %', fee_config_count;
end $$;

commit;
