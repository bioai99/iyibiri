# Görev Kategorizasyon ve Taxonomy — İlk Tur

**Tarih:** 2026-04-23
**Yazar:** strategy-consultant
**Bağlam:** İyiBiri üçlü gelir modeli (üyelik + bağış + gönüllülük) içinde gönüllülük tarafı tek boyutlu (`missions.domain` 4 değer) tasarlanmış. Atlas Bölüm 6 tailwind'de 6 domain renk gösteriyor (uyuşmazlık var), tailwind ile kod ayrışmış. Bu memo çok-boyutlu bir görev taxonomy'si öneriyor — ürün, sunum, ve sponsor pazarlaması üç alanda da kullanılabilir.

---

## Yönetim Özeti

**İyiBiri'nin görev taxonomy'si şu an tek boyutlu (domain); kullanıcının sorduğu "bana uygun olan ne?" sorusuna yetersiz cevap veriyor. Ayrıca DB şeması ile design tokens arasında uyuşmazlık var** — kod 4 domain tanımlıyor (nature/education/social/financial), tailwind 6 (+animals, +culture). Öneri: 7 boyutlu taxonomy (**Aktivite × Alan × Zaman × Lokasyon × Beceri × Doğrulama × Beneficiary**) + SDG mapping + formüllü Karma fiyatlandırma. Üç bulgu:

1. **Akademik standart: micro / episodic / ongoing** üçlü zaman taxonomy'si [S21]. İyiBiri'nin karma fiyatlandırması buna oturursa kullanıcı beklentisi de netleşir (mikro = 5 dk, 50 Karma).
2. **Benchmark VolunteerMatch: 56 cause × 30 kategori + skill tag.** Yarısından fazlasında beceri tag'ı var [S22]. İyiBiri'de skill dimension tamamen eksik.
3. **TR STK'ların iç kategorileri farklı:** TEMA saha/etkinlik/savunuculuk × yaş, Kızılay 9 alan (afet/kan/göç/sağlık/barınma/sosyal/ilkyardım/eğitim/gençlik), TEGV tek odak (çocuk eğitim) [S23]. İyiBiri çatı olarak bu farklılıkları absorbe etmeli.

**Öneri:** 7 boyutlu taxonomy + SDG mapping + Karma formülü. Schema migration ile DB'ye yansıt (product-analyst karar verir, ADR gerekli). Görev kataloğu 50+ örneğe çıkarıldı (bu memonun sonu).

---

## 1. Mevcut durum — İyiBiri taxonomy envanteri

| Özellik | Şu anki değer | Durum |
|---|---|---|
| `missions.domain` (DB enum) | nature, education, social, financial | 4 değer |
| Tailwind `colors.domain.*` | nature, education, social, financial, **animals, culture** | 6 değer |
| `missions.difficulty` | easy, medium, hard | Var ama tek eksende |
| `missions.style` | remote, outside, both | Yetersiz (hybrid net değil) |
| `missions.verify_method` | auto, code, photo, qr | Yeterli |
| `missions.duration` | text (serbest) | Standartsız |
| `missions.karma` | integer (manuel) | Formül yok |
| `missions.impact_statement` | text | İyi ama tek alan |
| `missions.participants`, `spots_left` | integer | Operasyonel, ok |
| Beceri (skill) | **YOK** | Eksik |
| Beneficiary (kim faydalanır) | **YOK** | Eksik |
| SDG mapping | **YOK** | Kurumsal raporlama için kritik |

**Ana uyuşmazlık:** DB 4 domain, tailwind 6. Kodda animals + culture renk var ama enum desteklemiyor. Migration'a giderken sorun büyür.

---

## 2. Önerilen Çok-Boyutlu Taxonomy (7 boyut)

### Boyut 1 — Aktivite Türü (ne yaparsın?)

Bu, kullanıcının ilk sorduğu sorudur. VolunteerMatch + akademik literatür + İyiBiri için pratik:

| Kod | Türkçe | Tanım | Örnek |
|---|---|---|---|
| `event` | Etkinlik katılımı | Organize bir etkinliğe fiziksel katılım | Maraton, festival standı, fidan dikim günü |
| `field_work` | Saha çalışması | Fiziksel emek gerektiren eylem | Sahil temizliği, barınak temizlik, ev tamiri |
| `teach` | Öğretme / mentorluk | Bilgi veya beceri aktarımı | Çocuğa ders, CV rehberliği, workshop |
| `creative` | Yaratıcı üretim | İçerik/tasarım/medya | Sosyal medya grafikleri, yazı, video |
| `research` | Bilişsel iş | Veri, çeviri, araştırma | Anket doldurma, metin çeviri, veri girişi |
| `advocacy` | Savunuculuk | Ses çıkarma, farkındalık | İmza kampanyası, paylaşım, protesto |
| `donate_item` | Eşya bağışı | Fiziksel eşya verme | Kan, kitap, kıyafet, gıda |
| `micro` | Mikro-aksiyon | ≤15 dk, evden | Anket, sosyal medya desteği, rating |
| `pro_bono` | Uzman gönüllülük | Mesleki beceri kullanımı | Logo tasarımı, hukuk danışma, kod |
| `learn` | Öz-gelişim | İyilik odaklı eğitim alımı | Webinar katılımı, sertifika programı |

**10 kategori** — yeterince geniş, çakışmasız, MECE.

### Boyut 2 — Alan / Domain (kime hizmet?)

Atlas'taki 6 domain'i genişletip **10 alana** çıkarıyorum. Kızılay'ın 9 alanı + TEMA + TEGV kapsar:

| Kod | Türkçe | Renk (tailwind) | Temsil STK örnek |
|---|---|---|---|
| `nature` | Doğa / Çevre | #10B981 emerald | TEMA |
| `education` | Eğitim | #3B82F6 blue | TEGV |
| `social` | Sosyal Yardım | #F43F5E rose | AÇEV, Sokak Hayvanları |
| `financial` | Finansal / Girişim | #F59E0B amber | KGK, Habitat |
| `animals` | Hayvanlar | #F97316 orange | Haytap, barınaklar |
| `culture` | Kültür / Sanat | #A855F7 purple | Müze gönüllüsü |
| `health` | Sağlık | #EF4444 red | LÖSEV, Kızılay Kan |
| `disaster` | Afet / Acil | #DC2626 red-dark | AKUT, AFAD gönüllü |
| `rights` | İnsan Hakları / Eşitlik | #7C3AED violet | TİHV, Kadın Dayanışma |
| `youth` | Gençlik | #06B6D4 cyan | TOG, ÇYDD |

**Mevcut 4 + eksik 6 yeni** = 10 toplam. DB migration için detaylar §7'de.

### Boyut 3 — Zaman / Bağlılık

Akademik üçlü taxonomy [S21] + İyiBiri operasyonel granülerlik:

| Kod | Türkçe | Süre | Karma taban |
|---|---|---|---|
| `micro` | Mikro | ≤15 dk | 50 |
| `short` | Kısa | 15 dk – 2 saat | 100 |
| `half_day` | Yarım gün | 2 – 6 saat | 200 |
| `full_day` | Tam gün | 6 – 10 saat | 400 |
| `multi_day` | Çok günlük | >1 gün | 800 |
| `recurring` | Düzenli | Haftalık/aylık | 300/hafta |
| `project` | Proje | Belirsiz uzun | 500-2000 |

### Boyut 4 — Lokasyon

| Kod | Türkçe | Tanım |
|---|---|---|
| `remote` | Uzaktan / evden | Online tamamlanır |
| `hybrid` | Karma | Online + fiziksel karışım |
| `on_site_fixed` | Belirli lokasyon | STK'nın kendi mekânı |
| `on_site_flexible` | Serbest sahada | Her yerde yapılabilir (temizlik gibi) |
| `field` | Saha | Belirli bölge (İstanbul - Şile sahili) |

Mevcut `style` (remote/outside/both) bunu tam karşılamıyor; `location_type` yeni enum gerekli.

### Boyut 5 — Beceri / Zorluk

VolunteerMatch'in ayırımından esinli, İyiBiri için 4 seviye:

| Kod | Türkçe | Gereklilik | Multiplier |
|---|---|---|---|
| `no_skill` | Herkes | Özel bilgi yok | 1.0× |
| `basic` | Temel | Genel okur-yazar + iletişim | 1.2× |
| `intermediate` | Orta | Alan ilgisi + temel deneyim | 1.5× |
| `expert` | Uzman | Mesleki sertifikasyon / yıllar deneyim | 2.0× |

Mevcut `difficulty` (easy/medium/hard) duplicat — yerine `skill_level` kullan veya `difficulty`'i skill'e emir ver.

### Boyut 6 — Doğrulama (mevcut, korunsun)

`verify_method`: auto / code / photo / qr — zaten DB'de. Değişmesin.

### Boyut 7 — Beneficiary (kim faydalanır?)

Aynı görev birden fazla grup için olabilir (array):

| Kod | Türkçe |
|---|---|
| `children` | Çocuklar |
| `youth` | Gençler |
| `adults` | Yetişkinler / aile |
| `elderly` | Yaşlılar |
| `patients` | Hastalar |
| `animals` | Hayvanlar |
| `environment` | Doğa / çevre |
| `refugees` | Mülteciler / dezavantajlı |
| `community` | Genel toplum |

---

## 3. Karma Fiyatlandırma Formülü

Manuel atama yerine deterministik formül:

```
Karma = Base × SkillMult × ImpactMult
```

| Faktör | Kaynak |
|---|---|
| **Base** | Zaman boyutu (Boyut 3) taban değeri |
| **SkillMult** | Beceri boyutu (Boyut 5) çarpanı |
| **ImpactMult** | 1.0 (genel), 1.3 (yüksek etki — afet, kritik), 1.5 (extreme — kan bağışı, life-saving) |

**Örnekler:**

| Görev | Zaman | Skill | Impact | Hesap | Karma |
|---|---|---|---|---|---|
| 10 dk anket | micro (50) | no_skill (1.0) | 1.0 | 50 × 1 × 1 | **50** |
| Sahil temizliği 3 saat | half_day (200) | no_skill (1.0) | 1.0 | 200 × 1 × 1 | **200** |
| Çocuğa matematik dersi (4 saat) | half_day (200) | intermediate (1.5) | 1.0 | 200 × 1.5 × 1 | **300** |
| STK'ya pro bono logo tasarımı | short (100) | expert (2.0) | 1.0 | 100 × 2 × 1 | **200** |
| Deprem sahada yardım | full_day (400) | basic (1.2) | 1.3 | 400 × 1.2 × 1.3 | **624** |
| Kan bağışı | short (100) | no_skill (1.0) | 1.5 | 100 × 1 × 1.5 | **150** |
| Haftalık TEGV ders + 3 ay | recurring (300/hafta × 12) | intermediate (1.5) | 1.0 | 300 × 1.5 × 12 | **5400 (toplam)** |

**Faydası:**
- STK adminler tek tek Karma değeri atayacak kararsızlık yaşamaz.
- Kullanıcı "neden bu 50 Karma, şu 200?" sorusunu formülden anlar.
- Kalibrasyon değişince (inflation, revision) tek yerden güncelleme.

---

## 4. SDG Mapping (kurumsal raporlama altın)

UN SDG 17 hedefe her görev 1-3 SDG mapping'ı olur. Sponsor marka + kurumsal müşteri için CSR raporlaması kritik [S24].

**İyiBiri domain → SDG öneri matrisi:**

| İyiBiri Domain | Öncelik SDG | Sekonder SDG |
|---|---|---|
| nature | 13 İklim, 15 Karasal Ekosistem | 6 Temiz Su, 14 Sudaki Yaşam |
| education | 4 Nitelikli Eğitim | 10 Eşitsizlikleri Azaltma |
| social | 1 Yoksulluğa Son, 2 Açlığa Son | 10 Eşitsizlikleri Azaltma |
| financial | 8 İnsana Yakışır İş | 1, 10 |
| animals | 15 Karasal Ekosistem | 14 |
| culture | 11 Sürdürülebilir Kentler | 16 Barış & Adalet |
| health | 3 Sağlık & Refah | — |
| disaster | 11 Sürdürülebilir Kentler, 13 İklim | 3 |
| rights | 5 Cinsiyet Eşitliği, 10 Eşitsizlik, 16 Barış | — |
| youth | 4, 8, 10 | — |

**Örnek rapor:** Migros yıllık CSR raporu: "İyiBiri'de çalışanlarımız 2026 yılında 1240 görev tamamladı, SDG 2 (Açlığa Son) kapsamında 840, SDG 13 (İklim) kapsamında 180 eylem katkısı yaptık." → kurumsal sustainability raporu için tam veri.

---

## 5. Örnek Görev Kataloğu (50+ kaynak)

Taxonomy'i test etmek için her boyut kombinasyonundan gerçek görevler. STK adminler "görev nasıl yazılır" sorusuna bu katalog cevap verir.

### A. Doğa / Çevre (nature × çeşitli)

1. **Sahil temizliği** — field_work × nature × half_day × field × no_skill × photo × environment → 200 Karma
2. **Fidan dikimi** — event × nature × half_day × field × basic × qr × environment → 240 Karma
3. **Geri dönüşüm eğitimi dinle** — learn × nature × short × remote × no_skill × auto × community → 100 Karma
4. **Kompost nasıl yapılır video çek** — creative × nature × short × remote × basic × photo × community → 120 Karma
5. **Sıfır atık kampanya imzala** — micro × nature × micro × remote × no_skill × auto × environment → 50 Karma
6. **"Günün temiz parkı" fotoğraf yolla** — micro × nature × short × on_site_flexible × no_skill × photo × environment → 100 Karma
7. **TEMA bilgisayar tabanlı ağaç haritalama** — research × nature × short × remote × basic × auto × environment → 120 Karma
8. **Okul bahçesine sebze dikimi** — field_work × nature × half_day × on_site_fixed × no_skill × photo × children → 200 Karma

### B. Eğitim (education × çeşitli)

9. **Çocuğa bir saat kitap oku** — teach × education × short × on_site_fixed × no_skill × qr × children → 100 Karma
10. **TEGV haftalık matematik dersi (3 ay)** — recurring × education × recurring × on_site_fixed × intermediate × code × children → 5400 Karma (proje)
11. **Üniversite başvurusu rehberliği (online)** — pro_bono × education × short × remote × expert × auto × youth → 200 Karma
12. **İngilizce hikaye seslendir (podcast)** — creative × education × short × remote × basic × photo × children → 120 Karma
13. **Kadına okuma-yazma dersi** — teach × education × half_day × on_site_fixed × basic × code × adults → 240 Karma
14. **Bursuyla okuyan öğrenciye motivasyon mektubu** — creative × education × micro × remote × no_skill × auto × youth → 50 Karma

### C. Sosyal Yardım (social)

15. **Mahalle huzurevi ziyaret** — event × social × half_day × on_site_fixed × basic × qr × elderly → 240 Karma
16. **Gıda paketi hazırlama** — field_work × social × short × on_site_fixed × no_skill × photo × refugees → 100 Karma
17. **Sıcak yemek dağıtım** — field_work × social × half_day × on_site_flexible × basic × photo × community → 240 Karma
18. **Evsizler için battaniye topla** — donate_item × social × short × on_site_flexible × no_skill × photo × community → 100 Karma
19. **Suriye'de yetim çocuk kartpostalı** — creative × social × short × remote × no_skill × photo × children → 100 Karma
20. **Yaşlı komşuya alışveriş** — field_work × social × short × on_site_flexible × no_skill × photo × elderly → 100 Karma

### D. Finansal / Girişim (financial)

21. **Kadın girişimcisinin iş planını incele** — pro_bono × financial × short × remote × expert × auto × adults → 200 Karma
22. **Mali okur-yazarlık webinar'ı anlat** — teach × financial × half_day × remote × expert × code × community → 400 Karma
23. **Mikro-krediden faydalananların hikayesini derle** — research × financial × short × remote × intermediate × auto × refugees → 150 Karma

### E. Hayvanlar (animals)

24. **Barınak gezi** — event × animals × half_day × on_site_fixed × no_skill × qr × animals → 200 Karma
25. **Sokak kedi maması dağıtım (mahalle)** — field_work × animals × short × on_site_flexible × no_skill × photo × animals → 100 Karma
26. **Kayıp hayvan duyurusu paylaş** — advocacy × animals × micro × remote × no_skill × auto × animals → 50 Karma
27. **Kedi-köpek aşısı kampanyası stand gönüllüsü** — event × animals × half_day × on_site_fixed × basic × qr × animals → 240 Karma
28. **Barınak için battaniye/mama topla** — donate_item × animals × short × on_site_flexible × no_skill × photo × animals → 100 Karma

### F. Kültür / Sanat (culture)

29. **Müze rehber gönüllüsü (hafta sonu)** — teach × culture × half_day × on_site_fixed × intermediate × qr × community → 300 Karma
30. **Sinema festivali bilet satış standı** — event × culture × half_day × on_site_fixed × basic × qr × community → 240 Karma
31. **Sanat atölyesi çocuklara resim** — teach × culture × short × on_site_fixed × basic × code × children → 120 Karma

### G. Sağlık (health)

32. **Kan bağışı (Kızılay)** — donate_item × health × short × on_site_fixed × no_skill × qr × patients → 150 Karma
33. **İlk yardım kursu (TR Kızılay) — 8 saat** — learn × health × full_day × on_site_fixed × basic × code × community → 480 Karma
34. **Hastane ziyaret — çocuk hasta moral** — event × health × half_day × on_site_fixed × basic × qr × patients → 240 Karma
35. **Zihinsel sağlık kampanya destek paylaşımı** — advocacy × health × micro × remote × no_skill × auto × community → 50 Karma

### H. Afet / Acil (disaster)

36. **AKUT saha destek (deprem)** — field_work × disaster × full_day × field × basic × code × community → 624 Karma (1.3× impact)
37. **Afet sonrası gıda paketi hazırla** — field_work × disaster × half_day × on_site_fixed × no_skill × photo × community → 260 Karma (1.3×)
38. **Psiko-sosyal destek webinar katıl** — learn × disaster × short × remote × no_skill × auto × community → 100 Karma
39. **Afet bölgesine battaniye topla** — donate_item × disaster × short × on_site_flexible × no_skill × photo × community → 130 Karma (1.3×)

### I. İnsan Hakları / Eşitlik (rights)

40. **Kadın hakları kampanya imzala** — advocacy × rights × micro × remote × no_skill × auto × adults → 50 Karma
41. **LGBTİ+ destek hattı gönüllüsü** — pro_bono × rights × recurring × remote × intermediate × code × youth → 4500 Karma (recurring proje)
42. **Engelli erişim denetimi (yerel)** — research × rights × short × field × basic × photo × community → 120 Karma
43. **Farkındalık kampanyası grafiği tasarla** — creative × rights × short × remote × intermediate × photo × community → 150 Karma

### J. Gençlik (youth)

44. **Lise öğrencisine CV rehberliği** — pro_bono × youth × short × remote × intermediate × code × youth → 150 Karma
45. **TOG dayanışma saati (haftalık)** — recurring × youth × recurring × on_site_fixed × basic × code × youth → 3600 Karma (yıl proje)
46. **Gençlik festivali gönüllü stand** — event × youth × half_day × on_site_fixed × basic × qr × youth → 240 Karma
47. **Kodlama kursu çocuk mentoru (aylık)** — recurring × youth × recurring × remote × expert × code × children → 7200 Karma (yıl proje)

### K. Mikro (her domain — işe başlangıç)

48. **İyilik anketine katıl (2 dk)** — micro × genel × micro × remote × no_skill × auto × community → 50 Karma
49. **Arkadaşını davet et + kayıt olsun** — micro × genel × micro × remote × no_skill × auto × community → 100 Karma (referral bonus)
50. **STK'nın sosyal medya postunu paylaş** — micro × genel × micro × remote × no_skill × auto × community → 50 Karma
51. **Günlük "iyi bir şey" ipucu oku** — learn × genel × micro × remote × no_skill × auto × community → 50 Karma (streak kaldıracı)

**Katalog gelişimi:** Her yeni STK ortak geldiğinde 5-10 görev taxonomy'e göre eklenecek. Admin paneli bu taxonomy'i form-field olarak destekler.

---

## 6. STK Ortaklık × Taxonomy Uyumu

Mevcut aday STK'ların kendi alanlarının İyiBiri taxonomy'sine uyumu:

| STK | Ana Domain | Aktivite tipleri | Hedef beneficiary |
|---|---|---|---|
| TEMA | nature | field_work, event, advocacy, learn | environment, community |
| TEGV | education | teach, event, recurring | children, youth |
| Kızılay | health, disaster, social | donate_item, field_work, event, learn | patients, refugees, community |
| LÖSEV | health | donate_item, advocacy, event | patients (children), community |
| Haytap | animals | field_work, advocacy, donate_item | animals |
| ÇYDD | education, youth, rights | teach, advocacy, recurring | children, youth, adults (kadın eğitim) |
| TOG | youth, social | recurring, event, teach | youth, community |
| AÇEV | education (anne-çocuk) | teach, recurring | children, adults |
| AKUT | disaster | field_work, learn, recurring | community |
| WWF TR | nature, animals | advocacy, event, donate_item | environment, animals |

Her STK 2-3 domain etiketleyebilir; her görev tek domain'e bağlanır.

---

## 7. Schema Önerisi (Supabase migration)

Bu çalışma supabase-backend (Faz 2) ve product-analyst'e devir için — **bu memo direkt schema yazmıyor**, öneri veriyor. Karar ADR gerektirir.

**Migration taslağı (conceptual):**

```sql
-- 009_mission_taxonomy_expansion.sql (öneri)

-- Yeni ENUM'lar
create type activity_type as enum (
  'event', 'field_work', 'teach', 'creative', 'research',
  'advocacy', 'donate_item', 'micro', 'pro_bono', 'learn'
);

create type duration_category as enum (
  'micro', 'short', 'half_day', 'full_day', 'multi_day',
  'recurring', 'project'
);

create type location_type as enum (
  'remote', 'hybrid', 'on_site_fixed', 'on_site_flexible', 'field'
);

create type skill_level as enum (
  'no_skill', 'basic', 'intermediate', 'expert'
);

-- Domain expansion (existing enum → yeni domain'lere genişletme)
-- Not: Postgres enum genişletme dikkat gerektirir; yeni bir `mission_domains`
-- tablosuna taşımak daha dayanıklı. Tasarım kararı ADR'de.

-- Missions tablosuna yeni kolonlar
alter table public.missions add column activity_type activity_type;
alter table public.missions add column duration_category duration_category;
alter table public.missions add column location_type location_type;
alter table public.missions add column skill_level skill_level;
alter table public.missions add column beneficiary text[]; -- array
alter table public.missions add column sdg_goals integer[]; -- 1-17
alter table public.missions add column impact_multiplier numeric(3,1) default 1.0;

-- Karma otomatik hesap için function (trigger)
create or replace function calculate_karma()
returns trigger as $$
declare
  base integer;
  skill_mult numeric;
begin
  base := case new.duration_category
    when 'micro' then 50
    when 'short' then 100
    when 'half_day' then 200
    when 'full_day' then 400
    when 'multi_day' then 800
    when 'recurring' then 300
    when 'project' then 500
    else 100
  end;

  skill_mult := case new.skill_level
    when 'no_skill' then 1.0
    when 'basic' then 1.2
    when 'intermediate' then 1.5
    when 'expert' then 2.0
    else 1.0
  end;

  new.karma := floor(base * skill_mult * coalesce(new.impact_multiplier, 1.0));
  return new;
end;
$$ language plpgsql;

create trigger calc_karma_on_insert
  before insert or update of duration_category, skill_level, impact_multiplier
  on public.missions
  for each row execute procedure calculate_karma();
```

**Geriye dönük uyumluluk:** Mevcut missions için `domain` + `difficulty` kolonları korunur; yeni kolonlar nullable. Aşamalı migration: önce ekle → STK admin yeni field'lara tamamla → sonunda eski alanlar deprecate.

**Ürün tarafı dikkat:** UI spec yenisi gerekli — görev kartı 4 chip gösterecek: [Aktivite] [Alan] [Süre] [Skill]. Beneficiary ve SDG opsiyonel detay.

---

## 8. Sunum ve Pazarlama Tarafı için Taxonomy

Bu memo üç farklı kitleye farklı versiyonlarda anlatılmalı:

### (a) Kullanıcıya (ürün içi)
- **Basit:** 10 aktivite simgesi (icon), 10 domain rengi. Kullanıcı "ne yapmak istiyorum" × "hangi alan" iki eksende keşfeder.
- **İlk ekran:** "Ne yapmak istiyorsun? Etkinlik / Öğretme / Mikro..."
- **İkinci ekran:** "Hangi alanda?" Domain filtreleri.

### (b) Sponsor Marka / Kurumsal
- **Rapor tarafı:** SDG mapping öne çıkar. "Çalışanlarımız SDG 2 (Açlığa Son) için 840 eylem yaptı."
- **CSR dili:** Activity type, beneficiary, impact multiplier enterprise raporda görünür.

### (c) STK Ortak
- **Operasyonel:** Görev kart oluştururken form taxonomy'i destekler. Formüllü Karma otomatik.
- **Analytics:** Hangi aktivite/domain en çok gönüllü çekiyor — STK admin görür.

### (d) Yatırımcı / Board
- **Pazarlama dili:** "Tek bir 'bağış' değil, **10 farklı gönüllü yolu × 10 alan × 7 zaman dilimi = 700+ farklı eylem türü.** Kategoriyi yeni tanımlıyoruz."
- **Başka hiçbir platform böyle multi-dimensional değil.**

---

## 9. Sonuç ve Öneriler

1. **7-boyutlu taxonomy** benimsensin: Aktivite × Alan × Zaman × Lokasyon × Skill × Doğrulama × Beneficiary. Her boyut bağımsız ve ürün/raporlama iki tarafı birden besler.
2. **Mevcut uyuşmazlıklar giderilecek:** DB domain 4 → 10'a çıkar; duration text → enum; skill field ekle; beneficiary array; SDG mapping.
3. **Karma formülü deterministik olsun** — manuel atama kaotu. Base × Skill × Impact = Karma.
4. **SDG mapping kurumsal müşteri için altın** — R1.b görünürlük ve R6 kurumsal dashboard için olmazsa olmaz.
5. **50+ görev kataloğu ile taxonomy canlı test edilsin** — ilk STK onboarding'de bu kataloğun 10'u seçilir.
6. **Sunumda "10 × 10 × 7 = 700+ eylem türü" anlatımı** kategoriyi genişletiyor, yatırımcıya "pazar boyutu" algısı veriyor.
7. **Schema migration ADR gerektirir** — product-analyst karar kuyruğuna yeni soru olarak eklenecek.

---

## 10. Açık Sorular / Sonraki Adımlar

- **Q6 🟡 (yeni):** `missions.domain` postgres enum 4 → 10 nasıl migrate edilir? (enum expansion vs lookup table kararı)
- **Q7 🟡 (yeni):** Karma formülündeki Impact multiplier (1.3× afet, 1.5× kan) STK adminin mi ürünün mü takdiri?
- **Q8 🟢 (yeni):** SDG mapping mission oluşturmada zorunlu mu, opsiyonel mi?
- **Q9 🟢 (yeni):** Geriye dönük: şu an `missions.karma` manuel atanmış — formüle otomatik geçişte geçmiş değerler yeniden hesaplanmalı mı?

**Product-analyst'e devir:** Bu memo + Q6-Q9 soruları.
**Supabase-backend (Faz 2):** Migration taslağı + trigger.
**UI-designer:** Yeni görev kartı spec (4 chip: activity/domain/time/skill).
**Content-tr-voice (Faz 4):** Her aktivite tipinin Türkçe ton kılavuzu (10 aktivite × "sen" dili mikrokopy).

## Referanslar (yeni)

- [S21] Episodic & Skills-Based Volunteer Research — PMC systematic review, ScienceDirect
- [S22] VolunteerMatch / Idealist — 100k+ opportunities, 56 cause, 30 kategori + skill tag
- [S23] TEMA + Kızılay + TEGV gönüllü kategorileri (kurumsal siteler)
- [S24] UN SDG — Volunteering for the SDGs + 17 goals mapping

Detay: `docs/strategy/99-sources/index.md`.
