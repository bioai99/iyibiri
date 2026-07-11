-- ============================================================
-- Migration 060 — Vol-63: Make-A-Wish Türkiye (Bir Dilek Tut Derneği)
-- ============================================================
-- STK + 2 görev + 1 bağış kampanyası. Kurum bilgileri resmi kaynaklardan
-- (makeawishturkiye.org — Dilek Yolculuğu sayfası; kuruluş 2000, Carole
-- Hakko; 2009'dan beri Make-A-Wish International TR temsilcisi).
-- member/volunteer_count DEMO değerleridir — pilot öncesi kurumla doğrulanacak.
--
-- Vol-63 özelliği: missions.steps JSONB ilk kez canlı kullanılıyor —
-- {title, steps:[{icon,title,description}]} biçimi görev detayında
-- "Dilek Yolculuğu" timeline'ı olarak render edilir
-- (components/mission/mission-journey.tsx + lib/missions/steps.ts).
--
-- logo_url bilinçli NULL — public/bir-dilek-tut-logo.png repo'ya girince
-- 054 deseniyle update edilir (bkz. bu dosyanın sonundaki yorum).
-- Idempotent: tüm insert'ler on conflict do nothing.

-- ── 1. STK kaydı ──────────────────────────────────────────────

insert into public.ngos (
  id, name, short_name, tagline, description, category, color_accent,
  logo_url, cover_image_url, website, email, phone, social_instagram,
  member_count, volunteer_count, founded,
  membership_enabled, membership_description, membership_fee_config,
  payment_mode, payment_processor, donation_url, tax_exempt
) values (
  'bir-dilek-tut',
  'Make-A-Wish Türkiye — Bir Dilek Tut Derneği',
  'Bir Dilek Tut',
  'Bir dilek tut, gerçek olsun',
  '2000 yılında Carole Hakko öncülüğünde kurulan Bir Dilek Tut Derneği, 2009''dan bu yana Make-A-Wish International''ın Türkiye temsilcisi. 3-18 yaş arasında riskli hastalıklarla mücadele eden çocukların en büyük dileklerini gerçekleştirerek onlara umut, güç ve yaşama sevinci veriyor. Her dilek; başvuru, dilek keşfi, dilek yolculuğu ve dilek günü adımlarından oluşan özenli bir süreçle, gönüllülerin elleriyle gerçeğe dönüşüyor.',
  'Sağlık',
  'blue',
  null,
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&q=80',
  'makeawishturkiye.org',
  'mail@makeawish.org.tr',
  '0537 266 77 79',
  'makeawishturkiye',
  5000,
  300,
  2000,
  true,
  'Dilek gönüllüsü ol — bir çocuğun hayalinin gerçek olduğu güne tanıklık et.',
  null,
  'marketplace',
  'iyzico',
  'https://fonzip.com/birdilektut/bagis',
  false
) on conflict (id) do nothing;

-- ── 2. Görevler ───────────────────────────────────────────────

-- 2.1 Dilek Günü Gönüllüsü — etkinlik görevi (featured)
insert into public.missions (
  id, title, description, long_description, ngo_id, category, difficulty,
  karma, duration, domain, style, verify_method, verify_code, verify_hint,
  featured, active, steps, impact_statement, photo_url,
  location, date_label, spots_left, status, event_date
) values (
  'm-bdt-dilek-gunu',
  'Dilek Günü Gönüllüsü',
  'Bir dilek çocuğunun büyük gününde sahada ol: hazırlık, karşılama ve sürpriz anına destek ver.',
  'Dilek Günü, aylar süren bir yolculuğun kutlama anıdır: riskli hastalıkla mücadele eden bir çocuğun "imkânsız" dediği hayali o gün gerçek olur. Gönüllü olarak mekân hazırlığında, süslemede, karşılamada ve sürpriz anının kusursuz akmasında dernek ekibine omuz verirsin. Duygusal, unutulmaz ve tamamen çocuğun ritmine göre akan bir gün — görevin özü, o anın büyüsünü korumak.',
  'bir-dilek-tut',
  'health',
  'medium',
  120,
  '4 saat',
  'health',
  'outside',
  'photo',
  null,
  'Hazırlık anından bir kare paylaş (çocuğun yüzü görünmeden — mahremiyet önceliklidir).',
  true,
  true,
  '{"title":"Dilek Yolculuğu","steps":[{"icon":"star","title":"Başvuru","description":"Aile ya da doktor derneğe ulaşır; sağlık raporları incelenir, doktor onayıyla süreç başlar."},{"icon":"book","title":"Dilek Keşfi","description":"Gönüllüler çocuğu ziyaret eder; Dilek Kitabı ve Dilek Kutusu ile hayal dünyası keşfedilir."},{"icon":"gift","title":"Dilek Yolculuğu","description":"Bekleme döneminde küçük sürprizlerle umut hep sıcak tutulur."},{"icon":"party","title":"Dilek Günü","description":"Her şey hazır: çocuğa hiçbir şeyin imkânsız olmadığını gösteren o büyük an!"}]}'::jsonb,
  'Riskli hastalıkla mücadele eden bir çocuk, o gün hayalinin gerçek olduğunu görür — ve yaşama daha sıkı bağlanır.',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
  'İstanbul',
  null,
  6,
  'active',
  (now() + interval '14 days')::timestamptz
) on conflict (id) do nothing;

-- date_label'ı event_date ile tutarlı üret (TR ay adı)
update public.missions
set date_label = to_char(event_date, 'FMDD') || ' ' ||
  (array['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'])[extract(month from event_date)::int]
where id = 'm-bdt-dilek-gunu' and date_label is null;

-- 2.2 Dilek Kutusu Hazırla — esnek/uzaktan görev
insert into public.missions (
  id, title, description, long_description, ngo_id, category, difficulty,
  karma, duration, domain, style, verify_method, verify_code, verify_hint,
  featured, active, steps, impact_statement, photo_url,
  location, date_label, spots_left, status, event_date
) values (
  'm-bdt-dilek-kutusu',
  'Dilek Kutusu Hazırla',
  'Dileğini bekleyen bir çocuk için içinde küçük sürprizler olan bir Dilek Kutusu hazırla.',
  'Dilek gerçekleşene kadar geçen bekleme dönemi, çocuk için yolculuğun en zor kısmı olabilir. Dernek bu dönemi küçük sürprizlerle aydınlatıyor — sen de bir Dilek Kutusu hazırlayarak katkı verebilirsin. Boyama kitabı, küçük bir oyuncak, el yazısı bir moral notu... Kutunu derneğin gönüllü ağına ulaştırırsın; o da bekleyişteki bir dilek çocuğuna sürpriz olarak gider.',
  'bir-dilek-tut',
  'health',
  'easy',
  60,
  '2 saat',
  'health',
  'both',
  'photo',
  null,
  'Hazırladığın kutunun fotoğrafını paylaş.',
  false,
  true,
  '{"title":"Kutunun Yolculuğu","steps":[{"icon":"gift","title":"Kutunu hazırla","description":"Boyama kitabı, oyuncak, el yazısı bir not — kalbinden geçenleri kutuya koy."},{"icon":"heart","title":"Derneğe ulaştır","description":"Kutun, dilek gönüllüleri aracılığıyla bekleme dönemindeki bir çocuğa ulaşır."},{"icon":"sparkles","title":"Umut büyür","description":"Senin kutun, dilek gününe kadar süren bekleyişi bir sürprizle aydınlatır."}]}'::jsonb,
  'Bekleyiş de yolculuğun parçası — senin kutun, bir çocuğun yüzünde erken bir gülümseme olur.',
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
  'Türkiye geneli',
  'Esnek',
  20,
  'active',
  (now() + interval '21 days')::timestamptz
) on conflict (id) do nothing;

-- ── 3. Bağış kampanyası ───────────────────────────────────────

insert into public.campaigns (
  id, ngo_id, title, summary, description, cause, image_url,
  scenario_type, end_date, supporter_count, status, is_featured
) values (
  'camp-bdt-dilek-2026',
  'bir-dilek-tut',
  'Bir dilek tut, gerçek olsun',
  'Katkınla, riskli hastalıkla mücadele eden bir çocuğun en büyük dileği gerçeğe dönüşsün.',
  E'Bir dilek; uçağa ilk kez binmek, hayalindeki kahramanla tanışmak ya da kendi odasına kavuşmak olabilir.\n\nBir Dilek Tut Derneği, 2000''den bu yana 3-18 yaş arasındaki dilek çocuklarının hayallerini gerçekleştiriyor. Her dilek; başvuru, keşif, yolculuk ve dilek günü adımlarından geçen özenli bir süreçle, gönüllülerin elleriyle hayata geçiyor.\n\nBu kampanyaya yapacağın katkı; dilek keşfi ziyaretlerinin, bekleme dönemindeki sürprizlerin ve dilek günü organizasyonunun maliyetine doğrudan katılır. Dileğin büyüklüğü fark etmez — umudun büyüklüğü aynıdır.',
  'child',
  'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=1200&q=80',
  'specific_campaign',
  (now() + interval '4 months')::timestamptz,
  0,
  'active',
  true
) on conflict (id) do nothing;

-- Hedef tutar (055 kolonları)
update public.campaigns
set goal_amount = 250000.00
where id = 'camp-bdt-dilek-2026' and goal_amount is null;

-- ── 4. Logo ───────────────────────────────────────────────────
-- Asset repo'da: public/bir-dilek-tut-logo.svg (marka mavisi kayan yıldız
-- placeholder — resmi ortaklık sonrası kurumun logosuyla değiştirilir).
update public.ngos
set logo_url = '/bir-dilek-tut-logo.svg'
where id = 'bir-dilek-tut' and logo_url is null;
