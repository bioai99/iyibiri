-- 018_mission_domain_expansion.sql
-- Q6 + Q7 + Q9 (ADR-011 paketi) — Karma kalibrasyonu schema değişikliği.
-- Tarih: 2026-04-24 — supabase-backend
--
-- Karar kuyruğu 2026-04-24 (Bahadır onayı):
--   Q6 ✅ — domain enum 4 → 10'a genişletildi
--   Q7 ✅ — Platform-controlled Karma formula (kod tarafında, lib/karma-formula.ts)
--   Q9 ✅ — Grandfather: mevcut missions.karma değerleri manuel, dokunulmaz
--
-- Bu migration sadece domain check constraint'i genişletir. Karma formülü
-- uygulaması kod tarafında (lib/karma-formula.ts). Migration retrograde karma
-- hesaplaması YAPMAZ (grandfather kararı).

begin;

-- ============================================================
-- 1. missions.domain check constraint genişletmesi (4 → 10)
-- ============================================================

-- Önce mevcut constraint'i kaldır (ismi 001_initial_schema'dan)
alter table public.missions
  drop constraint if exists missions_domain_check;

-- Yeni 10 domain ile yeniden ekle
alter table public.missions
  add constraint missions_domain_check
    check (domain in (
      'nature',     -- Doğa / çevre — fidan dikimi, sahil temizliği
      'education',  -- Eğitim — okuma atölyesi, ders verme
      'social',     -- Sosyal / topluluk — yaşlıya ziyaret, dijital okuryazarlık
      'health',     -- Sağlık — kan bağışı, sağlık taraması (multiplier 1.3×)
      'animals',    -- Hayvanlar — barınak, mama dağıtımı (multiplier 1.1×)
      'arts',       -- Sanat / kültür — müze atölyesi, gönüllü rehber (multiplier 0.9×)
      'sports',     -- Spor / aktif — maratonla bağış, yürüyüş (multiplier 0.9×)
      'advocacy',   -- Savunuculuk — dilekçe, imza kampanyası
      'economic',   -- Ekonomik / geçim — istihdam atölyesi, mentor
      'emergency'   -- Acil durum / afet — deprem, sel (multiplier 1.5×)
    ));

comment on column public.missions.domain is
  '10 domain taxonomy (ADR-011 — Karma kalibrasyonu). lib/karma-formula.ts her domain için multiplier tanımlar. STK admin görev oluştururken domain seçer, platform Karma önerir.';

-- ============================================================
-- 2. Mevcut seed missions — domain doğrulama (grandfather)
-- ============================================================
-- Migration 014 seed'teki 12 mission hepsi 4 eski domain'de.
-- Bazıları daha doğru yeni domain'e taşınabilir:

update public.missions set domain = 'health' where id = 'm-losev-kan';
update public.missions set domain = 'animals' where id = 'm-haytap-mama';
update public.missions set domain = 'animals' where id = 'm-haytap-barinak-expired';

-- Diğer missions (TEMA fidan=nature, TEGV okuma=education, vs.) zaten doğru.

-- NOT: missions.karma değerleri DEĞİŞMEDİ (grandfather kararı Q9).

-- ============================================================
-- Sanity check — domain dağılımı
-- ============================================================

do $$
declare
  domain_counts text;
begin
  select string_agg(format('%s=%s', domain, cnt), ', ') into domain_counts
    from (
      select domain, count(*) as cnt from public.missions
      group by domain order by domain
    ) t;
  raise notice '[domain distribution]: %', domain_counts;
end $$;

commit;
