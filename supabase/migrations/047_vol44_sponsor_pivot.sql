-- Vol-44 Migration 047: Sponsor pivot — Patagonia/Eczacıbaşı → 5 tanınır TR markası.
--
-- Bağlam (Bahadır kararı, 2026-05-02):
--   "Sponsor markalar test fixture olduğu için Türkiye kullanıcısına en
--   tanıdık 5 marka olsun: Starbucks, Migros, Trendyol, Nike, Garanti BBVA.
--   Patagonia ve Eczacıbaşı çıkarılsın. Logo'ları Clearbit'te %100 var
--   (büyük marka domain'leri), içerikleri sosyal sorumluluk temalı."
--
-- Bu migration:
--   1. Eski 2 sponsor post'u (patagonia + eczacibasi) sil
--   2. 5 marka için sponsors row'u upsert et (logo_url Clearbit + brand_color
--      + description + website)
--   3. 5 yeni CSR temalı post insert et (article/update/story/tip karışım)
--
-- NOT: Patagonia ve Eczacıbaşı sponsor satırları silinmez (rewards.brand
--      backfill'inden gelmiş olabilir, FK ihlali riski). is_active=false
--      ile pasive bırakılır — dashboard'da görünmez.

begin;

-- ─────────────────────────────────────────────────────────────────
-- 1. Eski 2 sponsor post'u temizle
-- ─────────────────────────────────────────────────────────────────

delete from public.posts
where author_type = 'sponsor'
  and sponsor_id in ('patagonia', 'eczacibasi');

-- Eski sponsorları pasive et (silmek FK riski, is_active=false yeterli)
update public.sponsors
set is_active = false
where id in ('patagonia', 'eczacibasi');

-- ─────────────────────────────────────────────────────────────────
-- 2. 5 yeni sponsor — logo_url + brand_color + description + website
-- ─────────────────────────────────────────────────────────────────

insert into public.sponsors (
  id, name, short_name, brand_color, logo_url, cover_url,
  description, website, is_active
) values
  (
    'starbucks',
    'Starbucks',
    'Starbucks',
    '#006241',
    'https://logo.clearbit.com/starbucks.com.tr',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&q=80',
    'Kahve toplulukları, sürdürülebilirlik ve gönüllülük programlarıyla yerel etki.',
    'https://www.starbucks.com.tr',
    true
  ),
  (
    'migros',
    'Migros',
    'Migros',
    '#FE6601',
    'https://logo.clearbit.com/migros.com.tr',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80',
    'Türkiye''nin en büyük perakende zincirlerinden biri. Geri dönüşüm, gıda bankacılığı ve çiftçi destek programlarıyla.',
    'https://www.migros.com.tr',
    true
  ),
  (
    'trendyol',
    'Trendyol',
    'Trendyol',
    '#F27A1A',
    'https://logo.clearbit.com/trendyol.com',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=80',
    'Türkiye''nin lider e-ticaret platformu. Kadın girişimcilerin online büyümesini destekleyen Trendyol Akademi ve esnaf programlarıyla.',
    'https://www.trendyol.com',
    true
  ),
  (
    'nike',
    'Nike',
    'Nike',
    '#111111',
    'https://logo.clearbit.com/nike.com',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900&q=80',
    'Made to Play programıyla çocukları sporla buluşturan, sürdürülebilirlik için Move to Zero hedefi koyan global marka.',
    'https://www.nike.com',
    true
  ),
  (
    'garanti-bbva',
    'Garanti BBVA',
    'Garanti BBVA',
    '#00B4E6',
    'https://logo.clearbit.com/garantibbva.com.tr',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80',
    'Net Sıfır 2030 hedefi, sürdürülebilir finansman ve toplumsal yatırım programlarıyla Türkiye''nin önde gelen bankalarından.',
    'https://www.garantibbva.com.tr',
    true
  )
on conflict (id) do update set
  name = excluded.name,
  short_name = excluded.short_name,
  brand_color = excluded.brand_color,
  logo_url = excluded.logo_url,
  cover_url = excluded.cover_url,
  description = excluded.description,
  website = excluded.website,
  is_active = true;

-- ─────────────────────────────────────────────────────────────────
-- 3. 5 yeni sponsor postu — CSR temalı
-- ─────────────────────────────────────────────────────────────────

insert into public.posts (
  id, ngo_id, author_type, sponsor_id,
  title, summary, content,
  cover_image_url, category, read_time, published, created_at
) values
  -- Starbucks: Tekrar kullanılabilir bardak indirimi
  (
    gen_random_uuid(),
    null,
    'sponsor',
    'starbucks',
    'Mavi bardakla %25 indirim sürdü',
    'Tekrar kullanılabilir bardağını getir, içeceğinden %25 indirim kazan. Bu yıl 1,2 milyon tek kullanımlık bardak doğaya gitmedi.',
    E'Starbucks Türkiye''de bir yıldır sürdürdüğümüz "Mavi Bardak" kampanyasıyla, kendi bardağıyla içecek alan müşterilerimize %25 indirim sunuyoruz. Yalnızca bu yıl 1,2 milyon tek kullanımlık bardağın çöpe gitmesi engellendi.\n\nProgramı Türkiye genelindeki tüm 567 mağazaya yaydık. Hedefimiz 2027''ye kadar tek kullanımlık bardak kullanımını yarıya indirmek. Mavi bardağın olmasa bile mağaza içinde porselen kupada içmek de %5 indirimle ödüllendiriliyor.',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&q=80',
    'update',
    3,
    true,
    now() - interval '1 day'
  ),
  -- Migros: Süt kapağı geri dönüşümü
  (
    gen_random_uuid(),
    null,
    'sponsor',
    'migros',
    'Süt kapakları yine fidan oldu',
    'Müşterilerimizin yıl boyunca getirdiği 8,4 milyon süt kapağı geri dönüştü, Bursa''da 2.300 fidan toprakla buluştu.',
    E'2018''den beri Çevre Vakfı işbirliğiyle yürüttüğümüz "Kapağını Getir, Fidan Olsun" projesinde bu yıl rekor kırdık: 8,4 milyon süt kapağı 1.700 mağazadaki kutularda toplandı.\n\nGeri dönüşüm geliriyle Bursa Mustafakemalpaşa''da 2.300 fidan dikildi. Proje başladığından beri toplam fidan sayısı 28.000''i geçti. 2027 hedefimiz: tüm Migros mağazalarında plastik atık kutularıyla bu modeli pet şişe ve şeker ambalajına da yaymak.',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80',
    'story',
    4,
    true,
    now() - interval '2 days'
  ),
  -- Trendyol: Esnaf desteği
  (
    gen_random_uuid(),
    null,
    'sponsor',
    'trendyol',
    'Anadolu''nun esnafı dijitalde büyüyor',
    'Trendyol Akademi''den ücretsiz e-ticaret eğitimi alan 47.000 esnaf, geçen yıl Trendyol''da toplam 6,2 milyar TL satış yaptı.',
    E'Türkiye''nin 81 ilinde Trendyol Akademi ile küçük ölçekli üretici ve esnafa ücretsiz e-ticaret, dijital pazarlama ve müşteri hizmetleri eğitimi veriyoruz. Bu yıl 47.000 yeni esnaf programı tamamladı; satıcı sayımız 350.000''i geçti.\n\nKadın girişimcilere özel "Kadın Eli" programıyla başvuranların %62''si ilk yılında satış yaptı. Yerel üretim ve coğrafi işaretli ürünleri öne çıkaran "Memleketten" sayfasıyla 14.000 yöresel ürün yeni alıcılarla buluştu.',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=80',
    'article',
    5,
    true,
    now() - interval '3 days'
  ),
  -- Nike: Çocuk sporu
  (
    gen_random_uuid(),
    null,
    'sponsor',
    'nike',
    'Sahaya çıkan kız çocuğu sayısı 2 katına çıktı',
    'Nike Made to Play programıyla 24 ilde 4.800 kız çocuğu atletizm, basketbol ve futbol kulüplerinde ücretsiz spor yapıyor.',
    E'Made to Play programı kapsamında Türkiye Spor için Çocuk Vakfı ile birlikte 24 ilde kız çocuklarının spora erişimini hedefliyoruz. Bu yıl programa katılan kız sayısı geçen yıla göre iki katına çıkarak 4.800''e ulaştı.\n\nProgram boyunca her çocuğa ayakkabı, eşofman, spor çantası ve haftalık antrenman desteği sağlanıyor. Antrenörler de Nike akademisinde sertifikalı eğitimden geçiyor. 2030 hedefimiz: 50.000 çocuğa ulaşmak ve programın sürekli kalması için her ile yerel antrenör yetiştirmek.',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900&q=80',
    'story',
    4,
    true,
    now() - interval '4 days'
  ),
  -- Garanti BBVA: Yeşil finans
  (
    gen_random_uuid(),
    null,
    'sponsor',
    'garanti-bbva',
    'Net Sıfır 2030: kömür finansmanı durduruldu',
    'Bu yıl 47 milyar TL''lik yenilenebilir enerji finansmanı sağladık, kömüre kredi vermiyoruz.',
    E'Garanti BBVA olarak Net Sıfır 2030 hedefimiz doğrultusunda kömüre yeni kredi vermiyoruz; mevcut kömür kredilerinin payı portföyümüzde %3''ün altına indi. Bu yıl yalnızca yenilenebilir enerji projelerine 47 milyar TL finansman sağladık.\n\n"Yeşil Bireysel Kredi" ile elektrikli araç, ısı pompası ve güneş paneli yatırımları için indirimli kredi sunuyoruz; bu yıl 38.000 hane bu krediyle ısıtma sistemini yeniledi. Sürdürülebilirlik raporumuzu garantibbva.com.tr/surdurulebilirlik adresinden indirebilirsiniz.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80',
    'tip',
    5,
    true,
    now() - interval '5 days'
  );

commit;

-- DOĞRULAMA:
--   select id, name, logo_url, is_active from public.sponsors order by name;
--   -- Beklenen: 5 yeni marka aktif (Garanti BBVA, Migros, Nike, Starbucks,
--   --           Trendyol), patagonia + eczacibasi inactive
--
--   select s.name, p.title, p.category from public.posts p
--     join public.sponsors s on s.id = p.sponsor_id
--     where p.author_type = 'sponsor'
--     order by p.created_at desc;
--   -- Beklenen: 5 satır (Starbucks, Migros, Trendyol, Nike, Garanti BBVA)
