# UX Brief — STK Admin UI V1 (Min+ 10 Sayfa)

**Tarih:** 2026-04-24  
**Sahip (brief):** product-analyst  
**Sonraki sahip:** ux-researcher → ui-designer → frontend-engineer + supabase-backend + auth-capacitor  
**Master plan:** P0 #9  
**Workstream:** `docs/product/01-workstreams/2026-04-24-stk-backoffice-workstream.md`  
**Bağlı ADR:** ADR-010 (Accepted), ADR-007 (parametric ngo fee), ADR-008 (payment routing)  
**Durum:** ready for ux-researcher

---

## 1. Özet

STK backoffice — STK yetkililerinin kendi iş akışlarını (görev yayınlama, üye yönetimi, doğrulama, profil, üyelik ayarları, blog, rapor, ödeme) gerçekleştirmesi için kapsayıcı admin panel. 10 sayfalık scope; her sayfa **STK operasyon ekibi gündelik ihtiyacına odaklı, "ne kadar basit olabilir" felsefesi**. Kritik özellik: admin backoffice'teki değişiklikler (görev oluştur, üyeyi onayla) **anında** user app'te görünür — aynı RLS + DB.

---

## 2. Admin Persona — "Ayşe" (TEMA Saha Koordinatörü)

**Demografi & bağlam:**
- Ad: Ayşe Kan
- Yaş: 35
- STK deneyimi: 8 yıl (TEMA'da 5 yıl)
- Mevcut rol: Saha Koordinatörü + Üyelik Sorumlusu (dual)
- Dijital yetkinlik: Orta (Excel, Instagram, WhatsApp; web uygulamalar biraz yavaş)
- Cihaz: Laptop (ofis, %70) + telefon (sahada, %30)

**Ne zaman backoffice açar:**
- Pazartesi başında haftalık görev planlama
- Çarşamba-cuma arası doğrulama kuyruğu (gönüllü fotolarını approve/reject)
- Ay sonunda rapor çeker (sponsor/board'a gösterir)
- Acil: Bir görev iptal etmek, üyeyi bulup durumunu sormak

**Ayşe'nin JTBD (5 madde):**

1. **"Yeni fidan dikim etkinliğini 5 dakikada yayınlayıp 100+ gönüllüye ulaştırmak istiyorum."**
   - Bugün: Excel'de harita tutar, WhatsApp grupta "yarın fidan dikiş var" yazar, gönüllüler linki kendi bulur.
   - İyiBiri'de istediği: Başlık + tarih + yer + görseli upload et, "Yayınla" → anlık herkese görüntülenecek.
   - Acı: Şu an Excel + WhatsApp paralel tutma, özet oluşturma 30+ dakika.

2. **"Bu ayın üyelik yenileme durumunu görup eksik olanları aramak istiyorum."**
   - Bugün: CSV'yi elle açıp filtre yap, aç kapa kapa yapıyor, hata yapıyor.
   - İyiBiri'de istediği: Üye listesini açtığında "membership active/expired" görür, expired'ları çeker, arar.
   - Acı: Elle dosya yönetimi, eksik veri riski.

3. **"Gönüllüler görevini tamamlayıp fotoğraf gönderdiğinde hızlıca onaylayabilmek istiyorum."**
   - Bugün: Ayrı form linki takip ediyor, e-mailde onay geldiğinde admin paneline gidiyor, elle approve ediyor (Supabase dashboard — ürün değil, DB tool).
   - İyiBiri'de istediği: Pending list → fotoğraf miniatur + gönüllü adı → "Onayla / Reddet" → 30 saniye.
   - Acı: Şu an hız + workflow tutması zor.

4. **"STK'mızın hikayesini yazıp topluluğa anlatmak istiyorum — blog benzeri."**
   - Bugün: STK'nın WordPress sitesi var ama o "Ayşe" işi değil, CEO'nün teknik kişisi yönetiyor, 2 hafta beklemek gerekiyor.
   - İyiBiri'de istediği: Kendi admin panel'inde "Blog" sekmesi → markdown/rich text → "Yayınla" → anında app'te görünsün.
   - Acı: Hızlılık, empowerment.

5. **"Yıllık rapor için son 12 ayın verisi istiyorum — kaç görev, kaç karma, kaç üye artışı?"**
   - Bugün: Supabase dashboard'dan manuel sorgu, SQL yazamıyor, iş ekibine başvuruyor, 1-2 gün bekliyor.
   - İyiBiri'de istediği: "Rapor" sayfası → son 12 ay sparkline + sayılar + "Export CSV" → bitti.
   - Acı: Zamanlama, dependency.

**Ayşe'nin istemiyor:**
- 10-tıklık form (başlık + açıklama + 15 Alan = tolerans yok)
- "Nerede ne" sorusu soran UI (sezgisel, grid-based, minimal text)
- Hata mesajları satırbaşında (İngilizce, teknik jargon)
- "Yükle" sonrası 30 saniye beklemek

---

## 3. Test Data Senaryosu — 5 STK × Admin User Tarafından Tipik Bir Hafta

Workstream Bölüm 4'teki 5 STK; her biri için "Pazartesi 10:00 - Cuma 17:00" simülasyonu:

### STK 1: TEMA Vakfı (tema@dev)
- **Pazartesi 10:00** — Admin Ayşe login. `/admin/tema` dashboard açar. "Bu ay 45 karma dağıtıldı, 12 yeni üye, 3 doğrulama bekleyen" kartları görür.
- **Pazartesi 10:15** — "Yeni görev" → fidan dikim (başlık, açıklama, domain=çevre, karma=20 puan, tarih=Salı 14:00, kontenjan=50, görsel=fidan.jpg upload) → "Yayınla" → 3 saniye → saved.
- **Çarşamba 14:00** — `/admin/tema/verifications` → 3 pending foto → 2 approve (+ admin yorum "harika çalışma!"), 1 reject (+ "fotoğraf net değil, tekrar deneyin").
- **Cuma 16:00** — `/admin/tema/reports` → sparkline (son 12 ay görev sayısı), tablo (ay-ay, görev sayısı, karma dağılımı, yeni üye) → "CSV download" → rapor@tema.org.tr'ye bağlı.

**Ayşe'nin değerlendirmesi:** "5 dakika günlük check, 2 dakika doğrulama, haftasonu rapor çekti. İyi yavaşladı işler."

### STK 2: TEGV (tegv@dev)
- **Pazartesi 09:00** — Admin Gül login. Dashboard → "Bu ay 28 karma, 8 üye" görür.
- **Pazartesi 10:00** — Üye listesi açar, "membership status = expired" filtre → 5 kişi görür, arar, 3'ü yeniler (üyelik config'te %8 indirim visible, Gül onları e-posta linkine yönlendirir — embedded payment mode ile mobil ödeme direkt app içinde).
- **Salı 11:00** — Yeni görev: "Çocuk okuma desteği" (başlık, açıklama, tarih=Cumartesi, karma=15, kontenjan=30) → publish.
- **Perşembe 15:00** — Blog yazı yaz: "Eğitim Yolculuğunuz: 500 Çocuk, 1 Yıl" (markdown, cover image + text) → publish → app'te discover feed'de görünür.

**Gül'ün nilai:** "Blog özgürlük verdi, profesi dışında yazıyorum ama benim ayakkabilarımla."

### STK 3: LÖSEV (losev@dev)
- **Pazartesi 08:30** — Admin Nilüfer login. Üye listesi: "CSV export" → tüm üyeler (ad, email, şehir, tier, başlama tarihi) → drive'a kopyala → mailing list temizle.
- **Çarşamba 13:00** — Doğrulama: 4 pending → 3 approve, 1 reject. ("Saç bağışı kalitesini kontrol etmedim, yapılamadı" feedback)
- **Cuma 10:00** — Profil güncellemesi: Cover image + tagline değiştir → logo upload → web sitesi link update → saved.

**Nilüfer'in notu:** "Profil ve member export benim muhasebeci iş akışını kurtardı."

### STK 4: HAYTAP (haytap@dev)
- **Pazartesi 14:00** — Admin Can login. 2 gorev yayınlanmış, 1 draft → review → draft'ı yayınla.
- **Pazartesi 15:00** — Üyelik ayarları: Aylık ₺30 fee config check. "Bu ay kaç kişi üye oldu?" dashboard'dan görür (15 kişi) → Yay!
- **Cuma 11:00** — Ödeme bağlantıları: fonzip donation URL check. "Üye olmayıp bağış yapanlar? Rapor'da görünsün." (Rapor sayfasında "donation vs. membership" ayrımı — V1.1 feature, henüz yok, notlarda kalır)

### STK 5: Kodluyoruz (kodluyoruz@dev)
- **Pazartesi 16:00** — Admin Kerem login. Dashboard: "0 karma (ücretsiz model), 25 yeni gönüllü." Check.
- **Salı 10:00** — 3 yeni görev oluştur (online dijital okuryazarlık, kod kampı, mentor), ekibin feedback'ine gelmesini bekle.
- **Perşembe 09:00** — Doğrulama: 8 pending (mostly "Otomatik" — QR code scan) → bulk approve.

---

## 4. Sayfa-sayfa UX Brief (10 sayfa × JTBD + Outcome + Scope + Başarı + Benchmark + Varsayım)

### **Sayfa 1 — Dashboard overview**

**Rota:** `/admin/[ngoId]/`

**JTBD:** "STK operasyonumun haftalık durumunu 30 saniyede gör; acil aksiyon gerekirse bak."

**Veri şartı:**
- Bu ayın toplam karma dağıtıldı (missions tablosundan sum karma_awarded joined user_missions WHERE ngo_id = [ngoId] AND CURRENT_MONTH)
- Yeni üye sayısı (ngo_memberships tablosundan count WHERE ngo_id = [ngoId] AND created_at > NOW() - interval 30 days)
- Bekleyen doğrulama sayısı (user_missions tablosundan count WHERE admin_review_status = 'pending' AND ngo_id FROM missions WHERE admin_visible = true)
- Trend sparkline (son 12 ay görev sayısı, weekly agregat)
- Son 5 aktivite (görev publish, üye onay, blog post — timeline sırası)

**Must:**
- 4 kart (karma, üye, doğrulama, onboarding status) — her kart ana sayıya + micro-interaction (hover → arrow → link)
- Son 5 aktivite listesi (zaman sıralı) — "X görev yayınlandı", "Y gönüllü onaylandı", "Z blog yazısı oluşturuldu"
- Logo + STK adı (top-left header)
- "Yeni görev" + "Doğrulama kuyruğu" shortcut butonları (hero bölümüne)

**Should:**
- Haftalık karma dağılımı sparkline (trend) — simple bar chart, trend flashing
- Tier breakdown (membership: Free, Bronze, Silver, Gold pie) — opsiyonel, bir kartın altında collapsible
- "Bildirimler" badge (doğrulama bekleyen sayı — kırmızı çemberde)

**Won't V1:**
- Custom date range seçici (fixed = "bu ay")
- Dashboard widget customization
- Email digest scheduler
- Real-time pusher integration (haftalık usage uygun, polling yeterli)

**Başarı kriteri:**
- Admin <30 sn'de haftalık durumu anlar
- CTA butonları clickable ratio >70% (analytics)
- Dashboard load <2 sn

**Benchmark:**
- **Linear "Inbox"** — özet kartlar + quick actions (team insights top-level)
- **Airtable "Base dashboard"** — 4-cell grid, number summary, trend sparkline, related list
- **Notion "Database summary"** — simple aggregation, filterable context

**Varsayım:**
- Admin haftada 1-2x dashboard açar (planning + verification batch)
- 30 saniye bütçe = 4 kart max (5+ kart paralaksi, scroll gerek)
- Trend sparkline haftasal enough (daily detail V1.1)

---

### **Sayfa 2 — Görev yayınla / düzenle**

**Rota:** `/admin/[ngoId]/missions/new` + `/admin/[ngoId]/missions/[missionId]/edit`

**JTBD:** "Yeni görev oluşturup hemen yayınlayabileyim; draft kaydedip ertesi gün devam edebileyin."

**Veri şartı:**
- Form alanları: title (text), description (markdown), domain (enum: çevre, eğitim, sağlık, sosyal, hayvan, kültür), difficulty (enum: easy, medium, hard), duration (integer hours), event_date (datetime), event_location (text), karma_points (integer OR formula dropdown "auto"), access_level (enum: public, members_only), prep_checklist (textarea), image_url (file upload → Supabase Storage), status (enum: draft, published, cancelled)
- Verification method (enum: QR, code, photo, auto) — ADR henüz QR v1'de, photo, auto diğerleri
- Kontenjan (integer, opsiyonel)
- Eğitim materyali link (URL, opsiyonel)

**Must:**
- Başlık + açıklama (markdown editor, basit — **Sayfa taşma: Markdown preview toggle değil, side-by-side editor/preview optional**)
- Domain selector (dropdown, 6 seçenek)
- Karma puan (number input OR "Formül öner" dropdown → auto-calc [ADR-007 referans])
- Event tarih/saat (datetime picker)
- Yer (text field)
- Görev görseli upload (Supabase Storage, `ngo-assets` bucket → `missions/[missionId]/[filename]`)
- Draft/Published toggle (top-right, çok sabit) — published click → confirmation
- "Kaydet" + "Yayınla" dual button (CTA primary buton "Yayınla" save → publish atomik; "Taslak olarak kaydet" secondary)

**Should:**
- Gönüllülük sözleşmesi link (read-only, STK profil'de config'lenir)
- Kontenjan input
- Hazırlık checklist textarea
- Kategori multi-select (opsiyonel, metadata)

**Won't V1:**
- Advanced scheduler (yayınla → takvim seç; V1 = anında publish)
- Thumbnail crop editor (crop opsiyonudur, automatic fitting yeterli)
- AI title suggestion
- Recurring görev template

**Başarı kriteri:**
- Form tamamlama ortalama <5 dakika (first time) / <2 dakika (repeat)
- "Yayınla" → user app'te görülme latency <5 sn (real-time sync test)
- Error validation clarity (ör. "Başlık gerekli" sorununa cevap hızlı)

**Benchmark:**
- **Airtable form view** — inline editing, submit bottom (ama mobile scroll, taşıyor)
- **Notion "Database add"** — modal form, properties left panel, content wide, ön izleme sağ taraf
- **Stripe Dashboard "Create product"** — linear flow (basic → details → publish), next/back navigation

**Varsayım:**
- Admin görev oluşturmada 60% desktop (lazy can push görev), 40% mobile (urgent görev)
- Markdown yazma iş akışında copy-paste (değil, elle tip) — basit md syntax yeterli
- Görsel yükleme <5MB, auto-compress server
- Görev başına <15 dakika spend (değilse too complex = kötü design sinyali)

---

### **Sayfa 3 — Görevlerim listesi**

**Rota:** `/admin/[ngoId]/missions`

**JTBD:** "Açtığım tüm görevleri bir yerde görüp durumlarını (yayında, taslak, iptal) kontrol edeyim; toplu aksiyon yapabileyim."

**Veri şartı:**
- Datatable: [Görev adı] [Domain] [Karma] [Status] [Katılımcı sayısı] [Oluşturma tarihi] [Actions]
- Filtreler (left sidebar OR top bar): Status (draft, published, cancelled), Domain (multi-select), Date range (opsiyonel)
- Search box: title + description full-text
- Bulk action: select checkboxes → "Yayınla" / "Taslak dönüştür" / "İptal et" (batch)

**Must:**
- Datatable (responsive, mobile horizontal scroll acceptable)
- Status column + toggle icon (draft ↔ published, icon click = instant update)
- "Sil" action (soft-delete, status = archived; hard delete V2+)
- "Düzenle" link (→ Sayfa 2)
- Search box (title/description full-text)
- Status filter dropdown

**Should:**
- Domain filter
- Bulk select + batch publish/cancel
- "Export CSV" (adı, durum, tarih, katılımcı sayısı)
- Sort by (created, status, participant count)

**Won't V1:**
- Drag-to-reorder (rank görevler — admin için gerekli değil, user app'te feed order'ı sponsorship belirler)
- Tag/label system
- Commenting / inline collaboration
- Custom columns

**Başarı kriteri:**
- Admin 10 görevli listede 20 saniyede istediğini bulur
- Bulk action <3 tıkla
- Mobile scroll akıcı (horizontal scroll acceptable)

**Benchmark:**
- **Linear "Issues list"** — datatable, sidebar filter, bulk action, bulk status update
- **Airtable "Grid view"** — column visibility, sort, filter, inline edit
- **Notion "Database view"** — filter sidebar, sort, search

**Varsayım:**
- Admin aylık ortalama 5-10 görev oluşturur (list 3 ay geçmişi göstermesi yeterli)
- Bulk publish görev sık değil (ama hafta sonu batch import senaryosu var, destekle)
- Mobile'da horizontal scroll acceptable (tabl her sütunu sığdırmaz, normalize)

---

### **Sayfa 4 — Üye listesi**

**Rota:** `/admin/[ngoId]/members`

**JTBD:** "STK üyelerimi topluca görebilim; kim aktif, kim süresi dolmuş; export edebilim (muhasebeci için); araştırabılım (telefon, email)."

**Veri şartı:**
- Datatable: [Ad] [Email] [Şehir] [Tier (Free/Bronze/Silver/Gold)] [Üyelik başlama tarihi] [Üyelik süresi (ay)] [Status (active/expired)] [Actions]
- CSV export tüm sütunlar
- Filter: Status (active/expired/cancelled), Tier, City (opsiyonel)
- Search: name + email

**Must:**
- Datatable (responsive)
- Status column (active = green, expired = gray)
- "CSV export" button (KVKK-compliant: PII minimum — ad, email, tarih, tier; telefon/adres V1.1)
- Filter: Status
- Search (name + email)

**Should:**
- Tier filter
- City filter (opsiyonel agregat)
- "Ayrıntılar" modal (click satır → üyelik tarihi, renewal date, ödeme method, karma history)
- Sort by (üyelik tarihi, tier)

**Won't V1:**
- Üye ekle/sil (membership flow app'te, admin başlatmaz V1'de)
- Bulk messaging (V2 — SMS/email blast)
- Üye tier manuel değiştir (formula-based, admin değil)
- Custom field export

**Başarı kriteri:**
- Admin 100 üyeli listede filtre+search <1 dakika
- CSV export 10 saniye içinde download
- Mobile scroll akıcı

**Benchmark:**
- **HubSpot "Contacts list"** — datatable, sidebar filter, bulk action, export
- **Stripe "Customers"** — clean table, search, filter, export
- **Notion "Database"** — filter + sort + export

**Varsayım:**
- Admin aktif üye sayısı max 500 (pilot STK = 100-300 range; pagination lazy-load yeterli)
- CSV export aylık 1x maksimal (muhasebeci iş akışı; daha sık ise custom reporting V2)
- Üyeler doğrudan app'te join ediyor, admin bulk import V2

---

### **Sayfa 5 — Doğrulama kuyruğu (Verification queue)**

**Rota:** `/admin/[ngoId]/verifications`

**JTBD:** "Gönüllüler görevini tamamlayıp fotoğraf gönderdiğinde 30 saniye içinde onaylayabileyim; sağlamsa approve, değilse reject + yorum yapabılım."

**Veri şartı:**
- Pending user_missions: gönüllü ad, görev adı, tamamlanma tarihi, photo/code/QR submission
- Approval form: [Fotoğraf preview large] [Gönüllü adı] [Görev adı] [Tamamlanma tarihi] [Admin feedback textarea] [Onayla / Reddet buttons]
- Bulk action: select checkbox → "Tümünü onayla" (ama güvenlik gerek — confirmation)

**Must:**
- Queue card list (pending her submission = card): [Fotoğraf thumbnail] [Gönüllü adı] [Görev adı] [Tamamlanma tarihi] [Status badge = "Doğrulama Bekliyor"]
- Card click → detail modal: [Fotoğraf large] [Gönüllü ad/email] [Görev ad/açıklama] [Tamamlanma tarihi/proof metadata]
- Approve button (→ user_missions.admin_review_status = 'approved' + karma award → user app notification "Görevin onaylandı! +20 karma")
- Reject button + textarea ("Neden reddettin") (→ user_missions.admin_review_status = 'rejected' + admin_feedback visible user'a)
- Mark as pending state toggle

**Should:**
- Bulk select + "Tümünü onayla" (confirmation required: "X görevleri onayla?" → confirm → batch update)
- Sort by (submitted date, gönüllü adı)
- Filter: Status, Verification method (photo/code/QR), görev domain
- "Önceki onaylar" tab (approved + rejected history)

**Won't V1:**
- Photo zoom/rotate
- AI confidence score (photo quality check — manual only V1)
- Bulk reject with template message
- Scheduled approval (ör. "Pazartesi 10:00'de approve et")

**Başarı kriteri:**
- Pending görev ortalama approval time <2 dakika (from submission)
- 50 pending item için batch approve <5 dakika
- Error rate (yanlışlıkla reject) <3%

**Benchmark:**
- **Stripe "Disputes"** — queue list, detail modal, batch action
- **Shopify "Orders review"** — card list, quick action (approve/reject), bulk select
- **Asana "Approvals"** — task card queue, approve/reject inline

**Varsayım:**
- STK aylık ortalama 50-100 doğrulama pending (haftada 10-25 batch)
- Admin'in doğrulama süresi <1 dakika/item (basit visual check; complex senaryo = reject + gönüllü tekrar dene)
- Photo verification V1 (code/QR V1.1+ — complexity), auto-verification v2+
- Bulk approve "100 item" tuzağa düşmemek için confirmation

---

### **Sayfa 6 — Aylık rapor**

**Rota:** `/admin/[ngoId]/reports`

**JTBD:** "Yıllık rapor için son 12 ayın veri istiyorum — kaç görev, kaç karma dağıtıldı, kaç üye eklendi, trend nedir?"

**Veri şartı:**
- Son 12 ay agregat (monthly granularity):
  - Görev sayısı (published missions count/month)
  - Tamamlanan görev sayısı (approved user_missions count/month)
  - Toplam karma dağıtıldı (sum karma_awarded/month)
  - Yeni üye sayısı (new ngo_memberships/month)
  - Aylık trend sparkline (görev, karma, üye)

**Must:**
- 4 metric card (görev yayınlandı, görev tamamlandı, toplam karma, yeni üye)
- Aylar x metric tablo (12 satır, 4 sütun, csv export)
- Line chart (son 12 ay üç metrik: görev, karma, üye) — simple line graph (ApexCharts / Recharts)
- Tarih aralığı seçici (opsiyonel; V1 = last 12 months fixed)
- "CSV export" button

**Should:**
- Comparison (ay-önceki-ay % change)
- Pie chart (tier breakdown: kaç Free, kaç Bronze vs.)
- Cumulative karma line (month-end running total)
- Top 5 missions by participation

**Won't V1:**
- Cohort retention (V2 — advanced analytics)
- Funnel analysis
- Forecasting
- Custom date range export (V2 — ama fixed 12-month yeterli)

**Başarı kriteri:**
- Admin rapor <2 dakikada üretir + export
- CSV import Excel/Google Sheets zıp
- Grafik readable (max 12 line, legend clear)

**Benchmark:**
- **Google Analytics "Dashboard"** — 4-card summary, trend line, detailed table, date range
- **Mixpanel "Reports"** — metric card, trend chart, custom table, export
- **Stripe "Reports"** — summary card, line chart, detailed data table

**Varsayım:**
- Admin aylık 1x rapor (board/sponsor'a gösterir)
- 12-month fixed aralık yeterli (quarterly detail V1.1)
- CSV export muhasebeci/board için, email digest değil (pull-based)
- "Bu ayki hedef nedir" sorusu için baseline yok V1 (V2 goal setting)

---

### **Sayfa 7 — Blog yazı oluştur / düzenle**

**Rota:** `/admin/[ngoId]/blog/new` + `/admin/[ngoId]/blog/[postId]/edit` + `/admin/[ngoId]/blog` (list)

**JTBD:** "STK hikayemizi yazıp topluluğa anlatabileyim; markdownda yazsam draft kaydedilebilim, sonra publish; kendi bölüme sahip hissini verebilim."

**Veri şartı:**
- `posts` tablo per-STK (ngo_id filter)
- Alanlar: title, slug (auto-generated), content (markdown), cover_image_url (Supabase Storage), status (draft/published), created_at, updated_at, author_id (admin user)
- List page: datatable [Başlık] [Status] [Yayınlanma tarihi] [Düzenle/Sil]
- Detail page: title + cover upload + markdown editor + publish toggle

**Must:**
- Markdown editor (simple — # başlık, **bold**, *italic*, [link], list; preview toggle opsiyonel)
- Cover image upload (Supabase Storage `ngo-assets/blog/[postId]/cover`)
- Title input
- Draft/Published toggle (top-right)
- "Kaydet" button (auto-draft every keystroke backend; manual save button visible)
- Delete button (soft — status = deleted)

**Should:**
- Markdown preview toggle (side-by-side)
- Taslak otomatik kaydı (every 30 sn, local draft indicator "Taslaklı")
- Publish date picker (future post scheduling V1.1)
- Author bio / metadata (read-only, admin kişi otomatik)
- List page: filter (draft/published), search (title/content), sort

**Won't V1:**
- Rich text editor (markdown yeterli, wysiwyg V2)
- Image embedded markdown (cover only, link referans)
- Comment / collaboration
- Category / tags
- Email blast on publish

**Başarı kriteri:**
- Admin blog yazı <5 dakikada yaz (draft) + publish (total <10)
- Markdown preview clear (no rendering errors)
- Mobile writing acceptable (textarea responsive)

**Benchmark:**
- **Medium "Write"** — title, content editor, featured image, publish/schedule, draft auto-save
- **Ghost "Editor"** — markdown editor, preview, publish, feature image
- **Notion "Database with text"** — inline editor, formatting toolbar, quick publish

**Varsayım:**
- Admin blog yayını aylık 1-2 (not frequent content engine)
- Markdown okur yazarlığı var (tech-savvy admin)
- Yazı 500-2000 kelime (long-form, değil micro)
- Mobile writing sıra dışı (desktop primary, draft sonrası)
- HTML embed (iframe) blocked V1 (güvenlik; V2 sanitizer ile)

---

### **Sayfa 8 — STK profil (Logo, cover, tagline, iletişim)**

**Rota:** `/admin/[ngoId]/profile`

**JTBD:** "STK'mızın logo, cover, açıklama, iletişim bilgilerini güncelleyebilim; app'te ve web'te görünsün."

**Veri şartı:**
- `ngos` tablo alanları: name (read-only), logo_url, cover_url, tagline, description, email, phone, website, social_instagram, social_twitter, social_linkedin, tax_exempt boolean, tax_id text
- Image upload: Supabase Storage `ngo-assets/[ngoId]/profile/`

**Must:**
- Logo upload (current görünsün, replace button)
- Cover image upload (1200x400 suggestion, auto-fit)
- Tagline textarea (1 satır, max 100 char)
- Description textarea (max 500 char)
- Email, phone, website, sosyal link (4 field text input)
- "Kaydet" button
- Notification (kayıt başarı "Profil güncellendi" toast)

**Should:**
- Logo crop preview
- Cover focal point selector (opsiyonel, auto-fit yeterli)
- Tax exempt toggle + tax ID field (yasal, admin opsiyonudur)
- Instagram/Twitter/LinkedIn handle auto-validate (protocol strip @)

**Won't V1:**
- Video upload
- Multiple team member profiles
- Custom domain / white-label
- Theme color override

**Başarı kriteri:**
- Admin profil update <2 dakika
- Image upload <5 sn (async, local preview instant)
- Update app'te anında görülür (RLS + revalidate next rebase)

**Benchmark:**
- **Stripe "Business profile"** — logo + cover, description, contact, save
- **Notion "Team workspace settings"** — logo, name, description
- **Shopify "Store settings"** — logo, cover, contact, social

**Varsayım:**
- Profil güncelleme pilot şu an (Mayıs), sonra rare (ayda 1x)
- Logo/cover <5MB (auto-compress server)
- Sosyal link validation optional (invalid = just store as-is)
- Tax fields opsiyonel V1 (SaaS fee tier'da gerekli → Q kaydedildi)

---

### **Sayfa 9 — Üyelik ayarları (Membership config)**

**Rota:** `/admin/[ngoId]/membership-config`

**JTBD:** "Üyelik fee tier'larını tanımlamak, form alanlarını, yasal dokümanları yönetebilim; gönüllüler üye olurken görsün."

**Veri şartı:**
- `ngos.membership_fee_config` jsonb:
  ```json
  {
    "tiers": [
      { "name": "Temel", "amount": 50, "age_min": 18, "age_max": 28, "benefit": "Haftalık e-bülten" },
      { "name": "Standart", "amount": 120, "age_min": 29, "age_max": 45, "benefit": "Özel etkinlikler" },
      { "name": "Destek", "amount": 240, "age_min": 46, "benefit": "İlk kişi konfortu" }
    ]
  }
  ```
- `ngos.membership_form_fields` jsonb: [{ "label": "TC Kimlik", "required": true }, { "label": "Telefon", "required": true }, ...]
- `ngos.cooling_off_days` integer (default 14)
- `ngo_documents` tablo: kvkk_url, membership_agreement_url, volunteering_agreement_url (PDF files Supabase Storage)

**Must:**
- **Tier-based UI wizard** (raw JSON editor değil):
  - "Tier Ekle" button → modal [Ad] [Aylık ücret (₺)] [Yaş aralığı] [Açıklama] → Save tier
  - Tier list (card view): her tier [Ad] [Ücret] [Yaş aralığı] [Düzenle] [Sil] (soft-delete)
  - Cooling-off days slider (7-30, default 14)
  - Form fields: checkbox list (TC Kimlik, Telefon, Adres, Doğum tarihi) — check = required
- **Yasal dokümanlar:**
  - KVKK PDF upload (Supabase Storage `ngo-documents/[ngoId]/kvkk.pdf`)
  - Üyelik Sözleşmesi PDF upload
  - Gönüllülük Sözleşmesi PDF upload
  - Uploaded indicator + "Değiştir" link
- "Kaydet" button (all changes atomic)

**Should:**
- Tier düzenleme modal (pop-up, aynı [Ad] [Ücret] [Yaş] [Açıklama])
- Form field preview (membership flow'da nasıl görülecek)
- PDF preview button (yüklenmiş dosya görüntüle)
- Validation: ücret >0, yaş 0-120 range

**Won't V1:**
- Recurring tier (subscription interval = fixed monthly V1)
- Volume discount
- Bulk pricing
- Invoice branding / custom template
- Multi-currency

**Başarı kriteri:**
- Admin tier config <3 dakika
- PDF upload <10 sn
- Yeni form field <1 dakika add
- User app'te membership form tier'lar doğru render

**Benchmark:**
- **Stripe "Pricing"** — pricing tier card, create/edit/delete
- **Zapier "Plans"** — tier management UI, feature toggle, pricing display
- **Substack "Payments"** — membership tier, pricing, benefit description

**Varsayım:**
- Tier sayısı max 4 (orta STK = 2-3 tier)
- Yaş-tier ilişkisi (TEMA vakfı 35+ yaş hedef, TEGV çocuk odaklı = yaş filter gerekli)
- PDF sözleşme statik (template V2 — her STK kendi yazı veya İyiBiri template)
- Fee config pilot başında kez kurulur, sonra rare change

---

### **Sayfa 10 — Ödeme bağlantıları (Payment routing)**

**Rota:** `/admin/[ngoId]/payments`

**JTBD:** "Ödeme processor'umu (iyzico/PayTR/fonzip) bağlayabilim, STK'nın bağış/üyelik URLleri kendim update edebilim; read-only status görebilim."

**Veri şartı:**
- `ngos.payment_mode` enum (embedded, passthrough, marketplace) — read-only, platform team sets
- `ngos.payment_processor` enum (iyzico, paytr, fonzip, custom) — read-only
- `ngos.donation_url` text (STK self-serve, fonzip/custom case)
- `ngos.membership_url` text (self-serve)
- `ngos.payment_merchant_key_ref` (read-only, platform Vault tarafından set)

**Must:**
- Payment mode card (embedded/passthrough/marketplace) — read-only label + açıklama (1 paragraf)
- Payment processor badge (iyzico / PayTR / fonzip) — read-only
- Donation URL text field (opsiyonel, fonzip veya custom case):
  - Label: "Bağış linkini buraya yapıştır"
  - Input: URL
  - Placeholder: "https://baginiz.fonzip.com/..."
  - Save button
- Membership URL text field (aynı şekilde)
- Status card: "Ödeme altyapısı kuruldu ✅ (platform team, Mayıs X tarihinde onboarded)"
- Edit link: "Ödeme kurulumunu değiştirmek için [destek maili]"

**Should:**
- Payment mode explanation popup ("Neden Embedded?" → açıklama)
- Webhook status (read-only, "Entegrasyon doğru çalışıyor ✅")
- Transaction history link (future feature — şu an hidden)
- Bank account verification status (marketplace mode sonrası)

**Won't V1:**
- API key entry (platform only manages keys)
- Sub-merchant self-onboarding (marketplace mode — V2+)
- Multi-gateway fallover config
- Transaction fee display (STK'ya değişken fee, quarterly invoice)

**Başarı kriteri:**
- Admin URL girin + kaydet <1 dakika
- Kayıt webhook'ta verified (callback test)
- Read-only alanlar admin'i yanılmaz (no edit allowed)

**Benchmark:**
- **Stripe "Settings > Payment methods"** — processor selection, webhook status, test mode, live mode
- **Square "Settings > Payment"** — payment method, processor, status
- **Shopify "Settings > Payment providers"** — multiple gateways, status, config read-only

**Varsayım:**
- Ödeme config pilot kuruluşta platform team tarafından yapılır (admin V1'de sadece read + optional fonzip URL)
- Embedded mode default (çoğu STK'nın processor'u embed destekli)
- Marketplace mode opt-in (V2+ program)
- Admin ödeme trust'ı düşük (read-only = güvenli, complex config admin'den away)
- fonzip URL opsiyonel (TEMA, HAYTAP gibi mevcut customer'lar)

---

## 5. Opportunity Solution Tree (OST) — STK Backoffice Outcome

```
Outcome: 5 pilot STK haftada 1+ admin backoffice aktif kullanım (4 hafta pilot)
    ↓
Problem 1: STK'lar şu an görevleri mock data / Excel, doğrulamayı DB tool'unda yapıyor
    ├─ Opportunity 1.1: Admin panel CRUD (görev yayınla, doğrulama, üye listesi)
    │  ├─ Solution 1.1a: Minimal UI, walking skeleton (görev + doğrulama + dashboard)
    │  └─ Solution 1.1b: Full 10-sayfa scope (V1 Min+) ✅ SEÇILDI
    │
    └─ Opportunity 1.2: Auth riski (admin password global, başka STK erişebilir)
       ├─ Solution 1.2a: ngo_admin_users + RLS (V1 gerekli)
       └─ Solution 1.2b: Group-based permission (role editor/viewer — V1.1) ✅ SEÇILDI (1.2a)
    
Problem 2: STK'lar ödeme (membership + bağış) opsiyonu kendileri yapamıyor
    ├─ Opportunity 2.1: Payment UI self-serve (embedded mode)
    │  ├─ Solution 2.1a: STK processor API key → embedded iframe (embedded default) ✅ SEÇILDI
    │  └─ Solution 2.1b: İyiBiri aggregator (marketplace mode — V2 opt-in)
    │
    └─ Opportunity 2.2: Membership tier flexibility (yaş, fiyat, benefit)
       ├─ Solution 2.2a: UI wizard (tier card, add/edit/delete) ✅ SEÇILDI
       └─ Solution 2.2b: Raw JSON editor (power user, ama risk — V1 avoid)
    
Problem 3: STK'lar blog / hikaye anlatma kanalı yok
    ├─ Opportunity 3.1: Per-STK blog (markdown, publish)
    │  └─ Solution 3.1a: Admin panel blog CRUD (per-STK, published in app discover) ✅ SEÇILDI
    │
    └─ Opportunity 3.2: Content moderation
       └─ Solution 3.2a: STK self-publish, no approval (trust model) ✅ SEÇILDI
    
Problem 4: STK'lar yasal doküman upload'ı (KVKK, sözleşmeler) manual/email
    ├─ Opportunity 4.1: Document management (KVKK + membership + volunteering)
    │  └─ Solution 4.1a: PDF upload UI (Supabase Storage) ✅ SEÇILDI
    │
    └─ Opportunity 4.2: Version control / audit
       └─ Solution 4.2a: Upload timestamp + user log (V1 basic) ✅ SEÇILDI

Expected benefits (4 hafta pilot):
- 5/5 STK admin haftada en az 1 backoffice CRUD işlemi yapar
- Yayında görev sayısı %60+ backoffice'ten gelir (mock yerine)
- STK admin NPS ≥50
- Walking skeleton end-to-end test ✅ (görev yayınla → user app'te görün)
```

---

## 6. Cagan 4-Risk Framework (Her Sayfa Risk Kontrol)

| Sayfa | Value | Usability | Feasibility | Viability | Durum |
|---|---|---|---|---|---|
| **Dashboard** | ✅ Haftada check ihtiyacı | ✅ 4 kart, simple | ✅ View + aggregation | ✅ Data var | **Green** |
| **Görev yayınla** | ✅ Core feature, admin demand | ⚠️ 8 field form = complexity (but simple md editor yeterli) | ✅ Standard CRUD + file upload | ✅ Supabase Storage ready | **Yellow** |
| **Görev listesi** | ✅ Must-have, frequent use | ✅ Datatable standard | ✅ Simple filter + sort | ✅ Migration ready | **Green** |
| **Üye listesi** | ✅ CSV export for operations | ✅ Datatable, standard pattern | ✅ Simple query | ✅ Data structure ready | **Green** |
| **Doğrulama kuyruğu** | ✅ Bottleneck — approval latency | ⚠️ Photo preview large enough? QR scan UX? | ✅ user_missions query | ⚠️ Photo verification UX TBD (V1 = manual photo, V1.1 = AI confidence) | **Yellow** |
| **Rapor** | ✅ Monthly, sponsor needs | ✅ Simple table + chart | ✅ Agregation RPC mümkün | ✅ 12-month data ready | **Green** |
| **Blog** | ✅ STK empowerment | ✅ Markdown editor, familiar | ✅ posts table ready | ✅ Supabase Storage ready | **Green** |
| **Profil** | ✅ Self-presentation | ✅ Standard image + text | ✅ File upload + DB update | ✅ ngos tablo ready | **Green** |
| **Üyelik config** | ✅ ADR-007 core | ❌ jsonb wizard complexity — raw JSON = admin confusion (risk) → tier-card UI mitigates | ⚠️ jsonb validator RPC gerek | ✅ Migration 016 ready | **Yellow → Green (wizard mitigates)** |
| **Ödeme** | ✅ Starter SaaS revenue | ✅ Read-only mostly, self-serve optional | ✅ Embedded mode ready (iyzico adapter Faz 1) | ⚠️ Passthrough/Marketplace V2+ (scope reduced) | **Yellow → Green (Embedded only V1)** |

**Risk mitigation toplam:**
- Value risk: JTBD + admin persona derinleşme (ux-researcher audit)
- Usability risk: Tier wizard UI (raw JSON avoid), Datatable patterns (copy Linear/Airtable), Markdown editor validation
- Feasibility risk: RLS policies migration 021, Supabase Storage bucket, jsonb validator RPC
- Viability risk: Admin usage metrics (haftada 1+ CRUD), NPS survey (pilot 12. hafta)

---

## 7. Shape Up Appetite (Ryan Singer)

**Scope bölüntüsü appetite'a göre:**

### **Small batch 1 — Hafta 1 (2 iş günü, walking skeleton)**
- Auth middleware upgrade (ngo_admin_users check)
- Dashboard overview (4 kart layout)
- Görev listesi (datatable, filter)

**Deliverable:** Admin login → 3 sayfa görünsün, responsive check

### **Small batch 2 — Hafta 2 (2 iş günü, core CRUD)**
- Görev yayınla/düzenle (form + Supabase Storage image)
- Doğrulama kuyruğu (card list, approve/reject)

**Deliverable:** Walking skeleton test: admin görev yayınla → user app'te görünür ✅

### **Small batch 3 — Hafta 2.5 (1.5 iş günü, reporting)**
- Üye listesi (datatable + CSV export)
- Aylık rapor (metric card + table + chart)

**Deliverable:** Admin CSV export download, rapor readable

### **Small batch 4 — Hafta 3 (1.5 iş günü, content + config)**
- Blog CRUD (markdown editor + publish)
- STK profil (logo/cover + text fields)

**Deliverable:** Blog yayınla → app discover görünsün

### **Small batch 5 — Hafta 3.5 (1 iş günü, membership)**
- Üyelik config (tier-based wizard)
- Yasal doküman upload (PDF)

**Deliverable:** Tier card UI functional, PDF upload test

### **Small batch 6 — Hafta 4 (0.5 iş günü, payment)**
- Ödeme bağlantıları (read-only UI + optional fonzip URL)

**Deliverable:** Admin payment page açar, status görünür

### **Polish + QA — Hafta 4.5 (1 iş günü)**
- End-to-end test (5 STK × 3 flow)
- Accessibility pass
- Mobile responsive check
- Regression test

**Toplam:** ~2-2.5 hafta (1 FE full-time) veya 1.5 hafta (FE + BE paralel, auth + migration eş zamanlı)

---

## 8. LNO Framework — Prioritization (Shreyas Doshi)

| Sayfa | Effort | Impact | Type | Öncelik | Çalıştır |
|---|---|---|---|---|---|
| **Dashboard** | ~0.5d | Yüksek (haftalık check) | **Leverage** | P0 | S1 |
| **Görev yayınla** | ~2d | Yüksek (core need) | **Leverage** | P0 | S2 |
| **Görev listesi** | ~1d | Yüksek (frequent use) | **Leverage** | P0 | S1 |
| **Doğrulama kuyruğu** | ~1.5d | Yüksek (bottleneck fix) | **Leverage** | P0 | S2 |
| **Üye listesi** | ~0.5d | Orta (CSV export, operasyonel) | **Neutral** | P1 | S3 |
| **Rapor** | ~1d | Orta (monthly, sponsor) | **Neutral** | P1 | S3 |
| **Blog** | ~1.5d | Orta (STK empowerment, nice-to-have) | **Neutral** | P1 | S4 |
| **Profil** | ~0.5d | Düşük-Orta (one-time setup) | **Neutral** | P2 | S4 |
| **Üyelik config** | ~1.5d | Yüksek (ADR-007 gerek) | **Leverage** | P0 | S5 |
| **Ödeme** | ~0.5d | Düşük (read-only V1) | **Overhead** | P2 | S6 |

**Batch özeti:**
- **S1 (Leverage):** Dashboard + Görev listesi (quick wins, foundation)
- **S2 (Leverage):** Görev yayınla + Doğrulama (core value, user demand)
- **S3-4 (Neutral):** Üye + Rapor + Blog + Profil (support, mid-tier)
- **S5 (Leverage):** Üyelik config (ADR gerek, pilot critical)
- **S6 (Overhead):** Ödeme (read-only, minimal effort, deferred complexity)

---

## 9. Must / Should / Won't — Toplam Feature Matrix

### **MUST V1 (walking skeleton blocker)**
- ✅ Admin authentication (ngo_admin_users RLS)
- ✅ Dashboard 4-card summary
- ✅ Görev CRUD (create/edit/publish/cancel)
- ✅ Görev listesi datatable
- ✅ Doğrulama queue (photo approve/reject)
- ✅ Üyelik ayarları (tier config)
- ✅ Yasal doküman upload (KVKK + sözleşmeler)
- ✅ End-to-end test (admin → user app sync)
- ✅ RLS policies migration
- ✅ KVKK footer + compliance notice

### **SHOULD V1 (pilot nice-to-have)**
- ✅ Üye listesi + CSV export
- ✅ Aylık rapor (table + chart)
- ✅ Blog CRUD (markdown editor)
- ✅ STK profil (logo/cover/tagline)
- ✅ Doğrulama bulk actions (batch approve)
- ✅ Görev görsel upload
- ✅ Ödeme bağlantıları (read-only / optional fonzip)
- ✅ Markdown preview toggle
- ✅ Responsive mobile (tablet OK, mobile scroll OK)

### **WON'T V1 (deferred / V1.1+)**
- ❌ Multi-admin role management (Editor/Viewer roles — V1.1)
- ❌ Email digest / bulk messaging (V2)
- ❌ API key management (V2)
- ❌ Advanced analytics (cohort, funnel — V2)
- ❌ Custom branding / theme (V2)
- ❌ Recurring membership (marketplace mode — V2)
- ❌ AI confidence score (photo verification — V2)
- ❌ In-app chat / collaboration (V2)
- ❌ Webhook UI (platform only — V2)
- ❌ Admin dashboard mobile-native app (V2 — web responsive yeterli)

---

## 10. Başarı Kriteri (Ölçülebilir, Zaman-sınırlı)

### **Haftasal ölçüm (pilot week 1-4)**
1. **Adoption:** 5/5 STK admin'in haftada ≥1 login + CRUD işlemi (activity log tracked)
2. **Feature usage:** 
   - Görev yayınlama: haftada ≥2 görev/STK
   - Doğrulama: haftada ≥10 approval/STK
   - Blog: ilk yazı yayınlanan STK sayısı ≥3
3. **Latency:** Admin görev yayınla → user app'te görüntülenme <5 sn (real-time test)
4. **Error rate:** Login failure / CRUD error <2% (weekly metrics)

### **Pilot 4. hafta sonu (V1 lansman gate)**
1. ✅ Walking skeleton end-to-end test **PASS:** admin login → görev yayınla → user görür → tamamla → doğrulama → onay → user karma
2. ✅ RLS penetration test: Admin A başka STK (B) verisi göremiyor (security audit)
3. ✅ Mobile responsive (tablet/phone, horizontal scroll acceptable)
4. ✅ Accessibility WCAG AA baseline (button contrast, form label, keyboard nav)

### **Pilot 8. hafta**
1. **Feature adoption:** %60+ yayında görev backoffice'ten gelir (mock/seed değil, admin hand-created)
2. **Usage consistency:** Haftada 1+ login ortalaması ≥3/5 STK
3. **Pain point resolution:** Admin JTBD 5'ten min. 3 açıkça karşılandı (ux-researcher survey)

### **Pilot 12. hafta (Dönem-end)**
1. **NPS:** STK admin NPS ≥50 (or "recommend to peer STK" >60%)
2. **Retention:** 5/5 STK pilot'u devam etmek istiyor (qualification call)
3. **Data quality:** Backoffice'te oluşturulan record'lar (<2% error / incomplete)
4. **Performance:** App'te 10-mission feed open p95 <2 sn (include admin upload latency)

---

## 11. Bağımlılık + Risk

### **Teknik bağımlılıklar (blocker)**
- Migration 019 (ngo_admin_users table) ✅
- Migration 021 (admin RLS policies) — **⚠️ supabase-backend deliver sonrası block ends**
- Supabase Storage bucket `ngo-assets` + policies
- Image compression middleware (Supabase Storage OR sharp.js)
- jsonb validator RPC (membership fee config)
- Auth middleware upgrade (ADMIN_SECRET → user.id check)

### **Operasyonel bağımlılıklar (soft)**
- Seed fixtures (5 STK + mock data) — Dev environment
- Super-admin ENV setup (SUPER_ADMIN_EMAILS)
- Devtools entry ("Seed admin fixtures" button)
- Admin email confirmation (Supabase auth dev → skip, prod → enforce)

### **Yasal bağımlılıklar (external)**
- KVKK compliance review (CSV export PII minimization) — legal advisor checklist
- Üyelik sözleşmesi template (hukuk danışmanı draft)
- Gönüllülük sözleşmesi template
- Yasal doküman upload KVKK aydınlatması (footer banner)

### **Risk Matrix**

| Risk | Olasılık | Etki | Mitigation |
|---|---|---|---|
| RLS bypass (admin başka STK verisi görebilir) | Düşük | **Kritik** | Every query is_ngo_admin(user_id, ngo_id) guard + unit test coverage ≥90% |
| Görsel upload XSS/malware | Orta | Orta | MIME type whitelist (image/{jpeg,png,webp}), max 5MB, server antivirus, Supabase Storage isolation |
| CSV export PII leak | Orta | Kritik | KVKK footer notice, column minimization (ad/email/tarih only; no telefon/adres V1), role-based (admin only), audit log |
| Fee config jsonb corruption | Yüksek | Orta | UI wizard (raw JSON avoid), jsonb schema validation RPC, migration test (invalid config → default fallback) |
| Mobile form usability fail | Orta | Orta | Responsive test (tablet/phone), keyboard nav, touch-target ≥44px, beta test (1 STK) |
| Blog Markdown XSS | Düşük | Orta | Markdown sanitizer (DOMPurify / rehype-sanitize), link target="_blank", no HTML embed V1 |
| Super-admin ENV leak | Düşük | **Kritik** | Server-side ENV only (not in client bundle), Vercel/Supabase env isolation, weekly audit |
| Rate limit DoS (batch approval) | Düşük | Orta | API rate limit per user (10 req/sec), batch action confirmation UX |

---

## 12. Açık Karar (Q44-Q46 + Yeniler)

- **Q44 🟡:** Admin password reset flow — standard Supabase email reset mi, sadece super-admin reset mi?
  - **Proposal:** Pilot için super-admin reset (operasyon ekibi). V1.1'de self-serve Supabase password reset.
  - **Fallback assumption:** super-admin reset var, admin password valide olacağını varsaymıyoruz.

- **Q45 🟡:** Blog yazısında embed iframe (YouTube, etc.) izin verilecek mi?
  - **Proposal:** V1 = NO (güvenlik). Markdown link referanslar OK. V1.1 = sanitized iframe allow (rehype plugin).
  - **Fallback assumption:** Blog V1 = text + cover image (no video embed).

- **Q46 🟡:** Doğrulama kuyruğunda QR doğrulama — QR generator STK'da mı yoksa platform'da mı?
  - **Proposal:** QR generator platform (app'te admin mission completion checkout sırasında QR render). Admin doğrulama = QR scan sonucu verify. V1 = foto (manual), V1.1 = QR/code.
  - **Fallback assumption:** V1 foto doğrulama, QR V1.1.

---

## 13. Handoff

### **Downstream agent zinciri:**

1. **ux-researcher** (next)
   - Görev: Ayşe persona derinleştir (belki 2 kişi daha; TEGV, Kodluyoruz perspektifi)
   - Deliverable: 10 sayfa × Nielsen 10 heuristik audit matrix + admin usability heuristics (form complexity, error prevention, dialog clarity)
   - Artifact: `docs/ux/03-heuristics/2026-04-24-stk-admin-ui-heuristic-audit.md`
   - Timeline: 2-3 gün

2. **ui-designer** (S0 paralel)
   - Görev: Audit bulgularına göre 10 sayfa UI spec (wireframe + token × variant × state)
   - Admin layout (sidebar + top bar) + datatable pattern + form pattern + button state
   - Deliverable: Figma spec veya markdown wireframe
   - Artifact: `docs/ui/01-specs/2026-04-24-stk-admin-ui-spec.md`
   - Timeline: 3-4 gün

3. **supabase-backend** (S0-S1 paralel)
   - Görev: Migration 021 (admin RLS policies) + seed script (ngo-admin-fixtures.ts)
   - Deliverable: migration + idempotent seed + devtools button
   - Timeline: 2-3 gün

4. **auth-capacitor** (S1 paralel)
   - Görev: Middleware upgrade (ngo_admin_users check + error handling)
   - Deliverable: Updated middleware.ts + test
   - Timeline: 1 gün

5. **frontend-engineer** (S1-S4)
   - Görev: Component + page implementation (batches per timeline)
   - Deliverable: `/admin` routes + responsive UI
   - Timeline: ~10-12 iş günü (batches S1-S4)

6. **design-system-keeper** (paralel)
   - Görev: Admin-specific component patterns (datatable, form, bulk action) review
   - Deliverable: Token ihlal detection + design system recommendation
   - Timeline: ad-hoc (design-system-keeper async review)

### **Handoff log (bu dosyanın sonunda — boş, agent'lar dolduraçak)**

- 2026-04-24 HH:MM — **ux-researcher** [sonra dolacak] — **audit**: `[dosya]`
- 2026-04-24 HH:MM — **ui-designer** [sonra dolacak] — **UI spec**: `[dosya]`
- 2026-04-24 HH:MM — **supabase-backend** [sonra dolacak] — **migration 021 + seed**: `[dosya]`
- 2026-04-24 HH:MM — **auth-capacitor** [sonra dolacak] — **middleware**: `[dosya]`
- 2026-04-24 HH:MM — **frontend-engineer** [sonra dolacak] — **implementation**: `[dosya]`

---

## Handoff log

Bu UX brief'i alıp üreten agent'ların zinciri. Her agent kendi çıktısını açtığında satır ekler.

- 2026-04-24 23:45 — **ux-researcher** ✅ — **audit + Ayşe journey**: `docs/ux/03-heuristics/2026-04-24-stk-admin-audit.md` + `docs/ux/02-journeys/2026-04-24-stk-admin-ayse-journey.md`. 10 sayfa × 20 heuristik matrisi (K1-K8 kritik bulgu), 5 tier-1 admin benchmark pattern, Ayşe 10-step journey (dark moment + peak moment), 3 persona spektrumu, HEART metrics. Handoff: ui-designer (10 sayfa UI spec) + frontend-engineer (K1-K2 foundation).
- *(sonraki agent çıktı eklenecek)*

