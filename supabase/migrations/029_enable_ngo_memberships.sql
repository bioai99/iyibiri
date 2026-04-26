-- Migration 029: Enable membership flag for seed NGOs
-- Severity: P1 (BUG-040)
-- Bug: ÇYDD üyelik sayfası "henüz hazır değil" — membership_enabled = false
-- Fix: scripts/seed-membership-config.js'in karşılığını SQL olarak DB'ye uygula.
-- Tarih: 2026-04-26 (Vol-16)

begin;

-- Haytap
update public.ngos
set
  membership_enabled = true,
  membership_form_fields = jsonb_build_array(
    jsonb_build_object('key', 'phone', 'label', 'Telefon', 'type', 'tel', 'required', true),
    jsonb_build_object('key', 'motivation', 'label', 'Neden gönüllü olmak istiyorsun?', 'type', 'textarea', 'required', false)
  )
where id = 'haytap';

-- İBB
update public.ngos
set
  membership_enabled = true,
  membership_form_fields = jsonb_build_array(
    jsonb_build_object('key', 'phone', 'label', 'Telefon', 'type', 'tel', 'required', true),
    jsonb_build_object(
      'key', 'experience',
      'label', 'Daha önce gönüllülük yaptın mı?',
      'type', 'select',
      'options', jsonb_build_array('Evet', 'Hayır', 'Kısmen'),
      'required', false
    )
  )
where id = 'ibb';

-- TEMA, Kızılay, ÇYDD, Kodluyoruz — minimal (sadece description + enabled)
update public.ngos
set membership_enabled = true
where id in ('tema', 'kizilay', 'cydd', 'kodluyoruz');

commit;

-- =====================================================
-- VERIFICATION (manual)
-- =====================================================
-- select id, name, membership_enabled, membership_description
-- from public.ngos
-- where id in ('haytap', 'ibb', 'tema', 'kizilay', 'cydd', 'kodluyoruz')
-- order by id;
