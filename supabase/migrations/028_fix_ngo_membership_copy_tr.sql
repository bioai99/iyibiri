-- Migration 028: Restore TR character integrity in NGO membership descriptions
-- Severity: P2 (BUG-031)
-- Fix: ASCII-only "gonullusu", "egitimde" etc. → proper "gönüllüsü", "eğitimde" etc.
-- Tarih: 2026-04-26 (Vol-14)

begin;

update public.ngos
set membership_description = 'Haytap gönüllüsü olarak sokak hayvanlarına yardım edebilirsin.'
where id = 'haytap';

update public.ngos
set membership_description = 'İBB Gönüllüleri programına katıl, İstanbul için fark yarat.'
where id = 'ibb';

update public.ngos
set membership_description = 'TEMA gönüllüsü ol, doğayı koru.'
where id = 'tema';

update public.ngos
set membership_description = 'Kızılay gönüllüsü olarak insani yardıma katkıda bulun.'
where id = 'kizilay';

update public.ngos
set membership_description = 'ÇYDD gönüllüsü olarak eğitimde fırsat eşitliğine destek ver.'
where id = 'cydd';

update public.ngos
set membership_description = 'Kodluyoruz mentoru ol, geleceği kodla.'
where id = 'kodluyoruz';

commit;
