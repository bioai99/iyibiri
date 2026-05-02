-- Vol-52 Migration 051: Free vs paid membership ayrımı.
--
-- Bağlam (Bahadır kararı, 2026-05-02):
--   "Tüm üyeliklerin paralı olması sıkıntı. 2-3 tanesi paralı, kalanı
--   ücretsiz gönüllü üyelik olsun."
--
-- Demo veri kararı:
--   PARALI (3): TEMA (annual 240), Kızılay (3-tier monthly), Haytap (3-tier monthly)
--   ÜCRETSİZ (5): ÇYDD, Kodluyoruz, İBB, LÖSEV, TEGV
--
-- Ücretsiz üyelik için fee_config'i NULL bırakıyoruz — frontend
-- LegacyFallback'i "Ücretsiz Üye Ol" akışına yönlendiriyor (Vol-52 kod fix).
-- LÖSEV ve TEGV zaten config'liydi (manuel set), siliyoruz.

begin;

-- ─────────────────────────────────────────────────────────────────
-- 1. Haytap paralı tier (Vol-51'de set edildi, doğrula)
-- ─────────────────────────────────────────────────────────────────
update public.ngos
set membership_fee_config = '{
  "mode": "monthly",
  "currency": "TRY",
  "tiers": [
    {"id":"basic","name":"Temel Üye","amount":25,"period":"monthly","display_order":1,"impact_statement":"Aylık 25₺ ile düzenli destek"},
    {"id":"standard","name":"Standart Üye","amount":50,"period":"monthly","display_order":2,"impact_statement":"Aylık 50₺ ile daha geniş etki","recommended":true},
    {"id":"supporter","name":"Destekçi Üye","amount":100,"period":"monthly","display_order":3,"impact_statement":"Aylık 100₺ ile büyük fark"}
  ],
  "cooling_off_days": 14,
  "auto_renew_default": true
}'::jsonb
where id = 'haytap';

-- ─────────────────────────────────────────────────────────────────
-- 2. ÜCRETSİZ üyelik — fee_config NULL'a çevir
-- ─────────────────────────────────────────────────────────────────
-- ÇYDD, Kodluyoruz, İBB → Vol-51'de set edilmiş 3-tier'i kaldır
-- LÖSEV, TEGV → eski manuel config'i kaldır
update public.ngos
set membership_fee_config = null
where id in ('cydd', 'kodluyoruz', 'ibb', 'losev', 'tegv');

commit;

-- DOĞRULAMA:
--   select id, name, membership_fee_config is not null as has_paid_config
--   from public.ngos
--   where category != 'sponsor' or category is null
--   order by name;
--
--   Beklenen:
--     - PARALI (has_paid_config=true): TEMA, Kızılay, Haytap
--     - ÜCRETSİZ (has_paid_config=false): ÇYDD, Kodluyoruz, İBB, LÖSEV, TEGV
