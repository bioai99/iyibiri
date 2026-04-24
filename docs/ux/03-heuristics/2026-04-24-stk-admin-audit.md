# STK Admin UI — Heuristik Audit (V1 Min+ 10 Sayfa)

**Tarih:** 2026-04-24  
**Yazar:** ux-researcher  
**Upstream:** analyst brief `docs/product/02-briefs/ux/2026-04-24-stk-admin-ui-min-plus.md`  
**Scope:** 10 yeni sayfa (Dashboard / Görev CRUD / Görev Listesi / Doğrulama Kuyruğu / Üye Listesi / Rapor / Blog / Profil / Üyelik Ayarları / Ödeme)

---

## 1. Özet

Admin UI, user app'ten radikal farklı: **data-dense, efficiency-first, low-error tolerance**. STK saha koordinatörleri (Ayşe gibi) haftada 30 dakika check ediyor — her ekran sezgisel olmalı, 2-tıkla erişilir hedefine ulaşmalı. Benchmark: Linear Inbox (unread-centric), Airtable Grid (inline edit), Stripe Dashboard (card metrics), Shopify Admin (sidebar nav + save bar), Notion Database (filter + sort).

**Bağlam:** Admin backoffice'te yapılan her işlem (görev yayınla, üyelik düzenle, doğrulama onayla) anında user app'te görünür — RLS + aynı DB. **Kritik:** Hata toleransı çok düşük. Ayşe yanlış bir üyeyi sil/approve yapabilir, geri alma zor (soft delete + toast undo vardır ama).

---

## 2. Admin-özel Heuristik Çerçeve

Nielsen 10 + İyiBiri özel 6 + Admin-özel 4 = **20 heuristik**

### Nielsen 10 — Temel Usability
- **N1 — System status visibility** ✓
- **N2 — Match real world** ✓
- **N3 — User control & freedom** ✓
- **N4 — Consistency & standards** ✓
- **N5 — Error prevention** ✓
- **N6 — Recognition not recall** ✓
- **N7 — Flexibility & efficiency** ✓
- **N8 — Aesthetic & minimalist design** ✓
- **N9 — Error diagnosis & recovery** ✓
- **N10 — Help & documentation** ✓

### İyiBiri Özel 6 — Brand + İntegrasyon
- **I1 — Ton tutarlılığı** ("sen" dili, sıcak, samimi)
- **I2 — Karma görselliği** (KarmaCounter, "+150" format, gold, tabular-nums)
- **I3 — Impact statement** (her görevde etki mesajı)
- **I4 — Seviye isimleri** (Title Case: "İyi Biri", "Çok İyi Biri", vs.)
- **I5 — Bottom nav + safe area** (mobile, pb-safe)
- **I6 — Hero glow imzası** (gold shadow: `0 8px 32px rgba(232,194,104,0.35)`)

### Admin-özel 4 (YENI) — Operasyonel
- **A1 — Data density without overwhelm** — 50+ satır görünür ama visual hierarchy clear, scanning kolay
- **A2 — Destructive action safety** — publish/unpublish/reject/delete öncesi confirmation, undo toast 5sn
- **A3 — Bulk operation efficiency** — 10+ item aynı anda (görev publish, doğrulama onayla, üye export)
- **A4 — Context preservation** — Paging/filtering sonra geri döndüğünde state/sorgu saklanır (breadcrumb net)

---

## 3. 10 Sayfa × 20 Heuristik Matrisi

| Heuristik | Dashboard | Görev Oluştur | Görev Listesi | Doğrulama | Üye Listesi | Rapor | Blog | Profil | Üyelik Config | Ödeme |
|---|---|---|---|---|---|---|---|---|---|---|
| **N1 Visibility** | ✅ 4 card metric, loading skeleton | ✅ Form status, saving indicator | ✅ Count badge, filter applied | ⚠️ Pending count, approval modal feedback | ✅ Export button feedback | ✅ Chart load state | ✅ Save toast | ✅ Upload progress | ⚠️ Tier add/remove UI feedback | ✅ Read-only badge |
| **N2 Real-world** | ✅ "Karma", "Üye", "Doğrulama" STK lang | ✅ "Yayınla", "Taslak" admin vocab | ✅ "Yayında", "Taslak", "İptal" status | ✅ "Onayla", "Reddet" clear action | ✅ "Aktif", "Süresi Dolmuş" membership | ✅ Metric names (karma, üye, görev) | ✅ Markdown editor familiar | ✅ Logo, cover, "İletişim" labels | ⚠️ "Tier", "Yaş aralığı" jargon yoğun | ✅ "Processor", "Mode" read-only |
| **N3 Control & Freedom** | ✅ "← Geri" implicit (sidebar) | ✅ "Taslak olarak kaydet" option | ✅ Soft delete (status=archived) | ✅ "Reddet" + "Geri" pending list | ✅ Table → detail → back chain | ✅ Chart date selector | ✅ Publish/draft toggle, delete soft | ✅ "Değiştir" link (not locked) | ✅ Tier edit/delete, save/cancel | ✅ Read-only (no delete freedom) |
| **N4 Consistency** | ✅ Token (gold button, cream bg, ink text) | ✅ CTA = gold "Yayınla", secondary "Taslak" | ✅ Button style, filter bar consistent | ✅ Card style = missions, approve modal = consistent | ✅ Table header, filter row, export button consistent | ✅ Metric card, chart, table consistent | ✅ Editor toolbar, publish toggle, delete consistent | ✅ Form field pattern (label, input, error) | ✅ Tier card style, fee input pattern | ✅ Badge (processor), link style |
| **N5 Error Prevention** | ✅ Required field validation | ⚠️ Image upload validation > 5MB? | ✅ Bulk action > confirmation | ⚠️ Reject textarea optional (spammy?) | ✅ Search clear button visible | ✅ Date range validation | ✅ Title required, markdown validate | ✅ Logo/cover upload MIME check | ⚠️ Fee >0 validation, age range check | ✅ No edit allowed (prevented) |
| **N6 Recognition not Recall** | ✅ Quick action buttons (Görev + Doğrulama CTA) | ✅ Domain enum dropdown | ✅ Status pill visible (Published, Draft) | ✅ Gönüllü card design, approve/reject side-by-side | ✅ Filter chipset visible | ✅ Legend on chart | ✅ Markdown preview toggle | ✅ Logo preview, cover thumbnail | ✅ Tier card list, fee amount visible | ✅ Mode/processor text visible |
| **N7 Flexibility & Efficiency** | ✅ 30sn view + 2 CTA | ⚠️ Form 8 field = 3-5 min (power user shortcut yok) | ✅ Search + filter + bulk action | ✅ Batch approve "Tümünü onayla" button | ✅ CSV export button | ✅ Fixed 12-month (V1 only) | ✅ Markdown syntax guide? (missing) | ✅ 2 field edits (logo + tagline fast) | ⚠️ Tier wizard slow (raw JSON faster?) | ✅ No edit needed (read-only) |
| **N8 Aesthetic & Minimalist** | ✅ 4 card clean, no decoration | ⚠️ 8 field long (must/should clarity?) | ✅ Datatable clean, filter not overwhelming | ⚠️ Photo card + info + action dense | ✅ Table compact, responsive scroll | ✅ 3 line chart clean | ✅ Cover hero + title + editor clean | ✅ 2 image upload, 4 text field minimal | ⚠️ Tier list + fee input + form field = visual clutter risk | ✅ 2 section read-only, minimal |
| **N9 Error Diagnosis** | ✅ Empty state "Hiç görev yok" + action | ⚠️ Form error messages inline? (missing spec) | ✅ No results "Görev bulunamadı" | ⚠️ Reject feedback required? (missing) | ✅ Empty state "Hiç üye yok" | ✅ No data state | ⚠️ Markdown validation error message? | ✅ Upload error toast | ⚠️ Fee validation error message? | ✅ Read-only info badge |
| **N10 Help & Documentation** | ⚠️ Metric definition tooltip? | ⚠️ Markdown syntax guide link? | ✅ Search placeholder "Adı veya açıklaması" | ⚠️ QR code sonrası "nasıl kullanır" guide? | ✅ Export info "Ad, email, tarih, tier" | ⚠️ Chart axis label | ⚠️ Markdown tip tooltip? | ✅ Logo size suggestion "1200x400" | ⚠️ Fee formula explanation? | ✅ "Mode nedir?" link → explanation |
| **I1 Ton** | ✅ "STK'nız'ın bu ayı" (sen) | ✅ "Yeni görev yayınla" (sen implicit) | ✅ "Açtığınız" (sen) | ✅ "Gönüllünün fotosu" (sen) | ✅ "Üyeleriniz" (sen) | ✅ "Aylık İstatistik" (neutral ok) | ✅ "Blog yazısı yayınla" (sen) | ✅ "STK'nız'ın profili" (sen) | ✅ "Üyelik seviyeleriniz" (sen) | ✅ "Bağış altyapısı" (neutral ok) |
| **I2 Karma Visibility** | ✅ Card "Bu ay +XXX karma dağıtıldı" + number big + gold | ❌ (Görev kur, karma UI yok admin tarafında) | ❌ (Listede karma column yok) | ✅ Approve card "Gönüllü +20 karma kazanacak" badge | ❌ (Üye listede karma stat yok) | ✅ Rapor "Toplam karma dağıtıldı" metric | ❌ (Blog yok karma) | ❌ (Profil yok karma) | ❌ (Config yok karma) | ❌ (Ödeme yok karma) |
| **I3 Impact Statement** | ⚠️ Card açıklama varsa iyi ("45 kişi bu ay katıldı") | ✅ Form textarea "Bu görev ne değiştirir?" opsiyonel | ❌ (Impact list view'de yok) | ✅ Approval "Gönüllü bu ekiyle çalışacak" context | ❌ (Üyeler list yok) | ❌ (Rapor yok impact story) | ⚠️ Blog cover image = impact visual (text yok) | ❌ (Profil hikaye yok) | ❌ (Config yok) | ❌ (Ödeme yok) |
| **I4 Seviye Isimleri** | ✅ Üyelik tier card "Temel" / "Standart" / "Destek" Title Case | ❌ (Görev oluşturda seviye yok) | ❌ (Listede tier yok) | ❌ (Doğrulama tier yok) | ✅ Üye listede tier column "Temel", "Standart" Title Case | ❌ (Rapor tier breakdown opsiyonel V1) | ❌ (Blog tier yok) | ❌ (Profil tier yok) | ✅ Üyelik "Temel (₺50)" Title Case tier name | ❌ (Ödeme tier yok) |
| **I5 Bottom Nav + Safe Area** | ⚠️ Desktop admin = sidebar, mobile sidebar collapsible? (spec yok) | ⚠️ Form pb-safe? (mobile form scroll check) | ✅ Datatable responsive, scroll ok | ✅ Queue responsive, safe area check | ✅ Table scroll safe | ⚠️ Chart mobile safe area? | ✅ Editor mobile pb-safe check | ✅ Form mobile safe area | ✅ Tier list mobile scroll safe | ✅ Read-only mobile safe |
| **I6 Hero Glow** | ✅ Dashboard hero (metric card) subtle gold shadow | ❌ (Form no hero glow) | ❌ (List no hero) | ✅ Approval modal card gold-tinted? | ❌ (Table no glow) | ⚠️ Chart legend gold accent? | ✅ Blog cover hero glow likely | ✅ Logo hero glow likely | ⚠️ Tier card glow subtle (admin context) | ❌ (Read-only no glow) |
| **A1 Data Density** | ✅ 4 card clear spacing, no overwhelming | ✅ Form labels clear, field group spacing | ⚠️ Datatable 50+ mission = horizontal scroll (ok?) | ⚠️ 50 pending = card list auto-scroll, pagination? | ⚠️ 100 member table = lazy load / pagination? | ✅ 12-month table readable | ❌ (Blog list minimal, N/A) | ✅ Form 6 field readable | ⚠️ Tier list + form field = dense | ✅ Read-only 2 section sparse |
| **A2 Destructive Safety** | ⚠️ Dashboard CTA no delete | ✅ Form "Yayınla" publish modal confirm | ✅ List "Sil" soft delete, confirmation + toast undo | ✅ Reject button modal? (spec says textarea field — confirm?) | ⚠️ Export no destroy | ❌ (Chart no delete) | ✅ "Sil" soft delete confirm | ✅ "Değiştir" = replace (no destroy) | ✅ Tier "Sil" button confirm | ❌ (Read-only no destroy) |
| **A3 Bulk Operations** | ❌ (Dashboard no bulk) | ❌ (Single form) | ✅ Checkbox multi-select, "Toplu yayınla" button | ✅ "Tümünü onayla" checkbox + button | ✅ CSV export = all users | ❌ (Chart no bulk) | ❌ (Single editor) | ❌ (Single form) | ❌ (Tier single add/edit) | ❌ (Read-only no bulk) |
| **A4 Context Preservation** | ⚠️ Back button sidebar = context ok? | ✅ Back to list → form state (draft local) | ✅ Filter/sort preserve after detail view | ⚠️ Approval list page after modal close = filter kept? | ⚠️ Table pagination + filter state after row detail | ✅ Chart date range state persist | ⚠️ Blog list filter state after editor close | ✅ Back to profile list form state | ⚠️ Tier list + form state after edit modal | ✅ Read-only no paging (N/A) |

---

## 4. Tier-1 Admin Benchmark — 5 Pattern

### 1. **Linear Inbox** — Smart list + quick actions
- **Pattern:** Unread count + filter + bulk mark-read + keyboard nav
- **İyiBiri adapte:** Doğrulama kuyruğu "pending count" top badge, bulk "Tümünü onayla" button, keyboard J/K navigate (future)
- **Örnek:** Linear issue inbox = 30 issue + unread 5 → Doğrulama kuyruğu = 25 pending + bulk approve

### 2. **Airtable Grid** — Datatable with inline edit + filter bar
- **Pattern:** Column-based table, filter/sort sidebar, inline edit (single cell), CSV export
- **İyiBiri adapte:** Görev listesi + Üye listesi datatable = column visible, top filter bar (status, domain), CSV export
- **Örnek:** Airtable Grid = [Mission] [Status] [Karma] [Created] → Görev listesi = aynı şema

### 3. **Stripe Dashboard** — Card metrics + trend sparkline
- **Pattern:** 4 kart (metric + number), sparkline trend, drilldown link
- **İyiBiri adapte:** Dashboard 4 kart (Karma, Üye, Doğrulama, Onboarding) + sparkline haftasal trend
- **Örnek:** Stripe "Revenue" card = number + sparkline → Dashboard "Karma" card = +150 + 7-day trend

### 4. **Shopify Admin** — Sidebar nav + top bar + sticky save button
- **Pattern:** Left sidebar (section nav), top bar (breadcrumb + user menu), bottom sticky save (mobile-friendly)
- **İyiBiri adapte:** Admin layout = sidebar ("Görevler", "Doğrulama", "Üyeler", vs.), top bar (STK name + logout), form "Kaydet" sticky bottom
- **Örnek:** Shopify "/admin/products/new" = sidebar + top bar + sticky "Save product" → Görev form = sidebar + save sticky

### 5. **Notion Database** — Filter + group + view switching
- **Pattern:** Left sidebar filter (multi-select), group by (optional), sort, saved views
- **İyiBiri adapte:** Görev listesi "Status filter" + "Domain group" opsiyonel, Doğrulama "approved/rejected" tab
- **Örnek:** Notion Database = filter "Status: Active", group "By Category" → Görev listesi = filter "Published", sort "Created desc"

---

## 5. Kritik Bulgular — K1 → K8

### **K1 — Admin sidebar + breadcrumb (Context hazırlığı)**

**Sayfa:** Layout  
**Kodu:**
```tsx
// app/admin/layout.tsx (mevcut)
<nav className="bg-stone-900 text-white px-6 py-4">
  <span>İyiBiri Admin</span>
  <div className="flex items-center gap-5">
    <a href="/admin/missions">Misyonlar</a>
    <a href="/admin/analytics">Analytics</a>
    <a href="/admin/devtools">🛠 Devtools</a>
  </div>
</nav>
```

**Ihlal:** ✅ Top bar var ama ❌ **sidebar eksik — user app dashboard'a benziyor (inconsistent)**. Admin context (ngo_id = TEMA, user = admin@tema.dev) gizli. Breadcrumb yok.

**Severity:** 4 (launch blocker — admin kişi hangi STK'da olduğunu bilemez)

**Kanıt:** [Kod] `/app/admin/layout.tsx` hardcoded nav — STK-specific sidebar yok. [Workstream Bölüm 5] "Admin layout (STK seçim + 10 sayfa nav) + top bar (breadcrumb + admin profile + logout)" — **eksik**

**Nielsen ref:** N3 (user control), N4 (consistency — user app'te sidebar var, admin'de yok), A4 (context preservation)

**Öneri:** Admin layout upgrade:
```
Sidebar (left, 220px fixed):
  - Logo + "STK Seçimi: TEMA" (dropdown future V1.1)
  - 10 sayfa nav: Dashboard / Görevler / Doğrulama / Üyeler / Rapor / Blog / Profil / Üyelik / Ödeme / (Ayarlar V1.1)
  - Bottom: Admin name + logout link

Top bar:
  - Breadcrumb: Dashboard > Görevler > "Yeni görev oluştur" (context path)
  - Right: Admin name avatar + settings

Bottom sticky (form pages):
  - Save button (form context'te sticky)
```

**Beklenen etki:** Admin her zaman "ben nerede, hangi STK" sorusunun cevabını görür.

---

### **K2 — Destructive action confirm pattern (Safety)**

**Sayfa:** Görev listesi (unpublish/cancel), Doğrulama (reject)  
**Kodu:**
```tsx
// Spec: "Sil" action yok ama "İptal" (status=cancelled) var
// Hiçbir confirmation modal spec'lenmemiş
```

**Ihlal:** ✅ Spec'te soft delete var ama ❌ **confirmation modal / undo toast yok — V1 blocker**

**Severity:** 3 (high — Ayşe yanlışlıkla görevini iptal edip geri alamaz)

**Kanıt:** [Spec] Bölüm 4 Sayfa 3 "Sil" sadece soft delete bahsi (no confirm). [Workstream Bölüm 2] "Her admin yazma işlemi anında user app'te yansır" — **hata maliyeti = canlı etki**

**Nielsen ref:** N5 (error prevention), N9 (error recovery — undo yok)

**Öneri:**
```
Paylaş:
1. Görev "İptal et" tıkla → modal "Bu görev yayını durdurulsun. Gönüllüler göremez. Geri alabilirsin." + [İptal et] [Vazgeç]
2. İptal → toast "Görev iptal edildi" + "[← Geri al]" link (5sn)
3. Reject feedback textarea zorunlu: "Neden reddettin? (admin → gönüllüye görünür)"
4. Soft delete = status=archived (hard delete never, V2 purge policy)
```

**Beklenen etki:** Admin <1% yanlış aksiyon, hata düzeltme <10sn.

---

### **K3 — Form field validation + error messaging (Error prevention)**

**Sayfa:** Görev oluştur, Üyelik tier wizard, Blog yazı  
**Kodu:** Spec'te error message format yok

**Ihlal:** ❌ **Inline field validation / error message tonlaması spec'lenmemiş**

**Severity:** 2 (minor — usability friction)

**Kanıt:** [Spec] Bölüm 4 Sayfa 2 "Must" alanlar (başlık, açıklama, domain, karma, tarih, yer, görsek) ama "required field" visual indicator yok. [Login page] Türkçe error mesajı var "Giriş başarısız." — good tone, admin form'da tekrar edilmeli

**Nielsen ref:** N5 (error prevention), N9 (error diagnosis)

**Öneri:**
```
1. Required field = red * (asterisk) + hint "Gerekli"
2. Real-time validation (on blur):
   - Başlık boş → "Başlık yazmalısın" (inline, red text)
   - Domain select → auto-set placeholder "Kategori seç"
   - Karma number → "0 ile 100 arasında" help text
   - Görsel upload > 5MB → "Görsek en fazla 5MB olmalı" inline toast
3. Form submit disabled (red) until valid
4. Error color = clay (#C8553D), not red
```

**Beklenen etki:** Admin form tamamlama <1% error, first-time success >95%.

---

### **K4 — Datatable mobile responsiveness (Flexibility)**

**Sayfa:** Görev listesi, Üye listesi  
**Kodu:** Spec'te responsive "acceptable" ama mobile test strategy yok

**Ihlal:** ⚠️ **10+ column datatable tablet/phone'da kaç column görünür? (spec muğlak)**

**Severity:** 2 (minor — pilot STK'lar çoğu desktop use, mobile sahada açar mı?)

**Kanıt:** [Spec] Bölüm 4 Sayfa 3 "responsive, mobile horizontal scroll acceptable" — ama Görev listesi 7 column ([Ad] [Domain] [Karma] [Status] [Katılımcı] [Tarih] [Actions]), Üye listesi 8 column. 320px phone'da kaç sığar?

**Nielsen ref:** N7 (flexibility — mobile use case), A1 (data density)

**Öneri:**
```
1. Görev listesi:
   - Desktop (>768px): 7 column full visible
   - Tablet (640-768px): [Ad] [Status] [Actions] fixed, horizontal scroll [Domain] [Karma] [Katılımcı]
   - Phone (<640px): [Ad] [Status] [Actions] + swipe card (detail inline)

2. Üye listesi:
   - Desktop: 8 column
   - Mobile: [Ad] [Tier] [Status] [Actions] + swipe detail

3. Sticky first column (Ad) + horizontal scroll body (Shopify pattern)
```

**Beklenen etki:** Admin tablet/phone açtığında <3sn kaydırma ile istediği data'ya erişir.

---

### **K5 — Image upload async + progress (System visibility)**

**Sayfa:** Görev görseli, Blog cover, STK logo/cover  
**Kodu:** Form file input spec'te, Supabase Storage var ama progress yok

**Ihlal:** ❌ **Upload progress indicator missing — Ayşe 30sn bekler, bitti mi bitmedi mi?**

**Severity:** 2 (minor — pero UX friction)

**Kanıt:** [Spec] Bölüm 4 Sayfa 2 "görsel upload (Supabase Storage)" ama progress spec yok. [Workstream] "Görsel yükleme <5MB, auto-compress server" — compress süresi?

**Nielsen ref:** N1 (system status visibility — upload durumu net değil)

**Öneri:**
```
1. File input + preview thumbnail (instant)
2. Upload start → progress bar (0-100%, 3-5sn süre estimate)
3. Upload done → "✅ Görsek yüklendi" toast, button disabled → re-enable
4. Error → clay color error message "Görsek yüklenmedi (5MB limit)" + retry button
5. Multiple image upload (V1 opsiyonel, single ok)
```

**Beklenen etki:** Admin upload durumunu anında görür, 30sn beklemez.

---

### **K6 — Batch action confirmation UX (Error prevention + A3)**

**Sayfa:** Görev listesi (bulk publish), Doğrulama (bulk approve)  
**Kodu:** Spec'te "select checkbox → bulk action" ama confirmation yok

**Ihlal:** ❌ **Bulk approve 50 item → confirmation modal yok, one-click destroy riski**

**Severity:** 3 (high — admin "Tümünü onayla" tıkla, 50 gönüllü anında karma kazanır)

**Kanıt:** [Spec] Bölüm 4 Sayfa 5 "Tümünü onayla (ama güvenlik gerek — confirmation)" — spec yazıyor ama UI spec'te modal yok

**Nielsen ref:** N5 (error prevention), A2 (destructive action safety)

**Öneri:**
```
1. Checkbox select 50 item
2. "Tümünü onayla" button → modal açılır:
   "Bu 50 görevleri onayla? Her gönüllü +20 karma kazanacak.
    Ekranı kapatırsan işlem devam edecek.
    [Onayla] [Vazgeç]"
3. Onay tıkla → background job (loading bar footer'da)
4. Completion toast "50 görev onaylandı ✅"
```

**Beklenen etki:** Admin bulk action yanlış tıklama hatası <1%.

---

### **K7 — CSV export column minimization (KVKK + A1)**

**Sayfa:** Üye listesi, Rapor  
**Kodu:** Spec'te "CSV export tüm sütunlar" ama PII minimization yok

**Ihlal:** ⚠️ **CSV export = [Ad] [Email] [Telefon?] [Adres?] [Tier] [Tarih] — KVKK risk. Spec Bölüm 3 "PII minimum — ad/email/tarih/tier; telefon/adres V1.1" ama export UI confirm yok**

**Severity:** 2 (minor — legal compliance, not UX pero importante)

**Kanıt:** [Spec] Bölüm 4 Sayfa 4 "CSV export KVKK-compliant: PII minimum — ad, email, tarih, tier; telefon/adres V1.1". [Workstream] "Admin CSV export'unda PII minimization" — ama UI'de warning yok

**Nielsen ref:** N10 (help & documentation), A1 (data density — export'da ne sütun visible?)

**Öneri:**
```
1. CSV "Export" button → modal:
   "CSV export: Ad, Email, Tarih, Tier (KVKK uyumlu)
    Telefon/Adres V1.1'de eklenir.
    [Excel'e indir] [Vazgeç]"
2. Footer banner (admin tüm sayfalarda) "KVKK Aydınlatması: Bu yönetici panelinde PII işleme yapılır. Detay: [link footer]"
```

**Beklenen etki:** Admin KVKK awareness artır, CSV'de PII exposure 0.

---

### **K8 — Markdown editor UX (Flexibility & efficiency)**

**Sayfa:** Blog yazı  
**Kodu:** Spec'te "markdown editor, basit — # başlık, **bold**, *italic*, [link], list" ama UI toolbar yok

**Ihlal:** ❌ **Markdown syntax dışarıda yok, hint yok, admin "nasıl yazarım?" sorusu**

**Severity:** 1 (cosmetic — ama nice-to-have accessibility)

**Kanıt:** [Spec] Bölüm 4 Sayfa 7 "Markdown editor (simple — wysiwyg V2)" ama syntax guide button yok. [Persona Ayşe] "Excel + Instagram → SaaS uygulama"  — markdown illiterate olabilir

**Nielsen ref:** N7 (flexibility — power user vs. new user), N10 (help & documentation)

**Öneri:**
```
1. Editor textarea + right side preview toggle
2. Toolbar buttons: [# Title] [** Bold] [* Italic] [^ Code] [[Link] [- List] [> Quote]
3. "Markdown yardım" link → popover:
   "# Başlık
    ** Kalın metin **
    [Bağlantı](url)
    - Liste öğesi"
4. Auto-save toast "Taslaklı" (every 30sn local draft)
```

**Beklenen etki:** Admin markdown bilmezse toolbar klik, preview → ögrendikleri pattern.

---

## 6. Admin-özel Accessibility (WCAG AA + Keyboard-first)

### Kontrast
- Dashboard card header: `ink-900` (#24201B) × `cream` (#F4EEDF) → **15:1 ✅ AA pass**
- Button "Yayınla" (gold): `gold` (#E8C268) × `ink-900` background → **~8:1 ✅ AA pass**
- Form label (secondary text): `ink-400` (#7A6F5E) × `cream` bg → **4.5:1 ✅ AA edge** (büyük text ok)

### Keyboard Navigation
- **Admin data-dense** → Tab sırası: Sidebar → Content. Form → fields sıra.
- **Datatable:** Tab → first cell → arrow keys opsiyonel (linear scroll ok V1)
- **Bulk action:** Checkbox Tab-able, "Tümünü onayla" button Tab-able, Enter = submit
- **Modal (reject/confirm):** Esc = close, Enter = primary button, Tab = cycle buttons

### Touch Target
- **Datatable action icons** (edit, delete): 44×44px padding
- **Filter chip X close button:** 32×32px = 44px padding zone
- **Checkbox:** 20×20px element + 12px padding = 44×44 touch zone
- **Form input:** min-h-11 (44px) ~ Tailwind standard ✅

### Screen Reader
- Datatable header: `<thead>` + `scope="col"` on `<th>`
- Bulk checkbox: `aria-label="Select all"`
- Modal: `role="dialog"` + `aria-modal="true"` + `aria-labelledby="modal-title"`
- Form error: `aria-invalid="true"` + `aria-describedby="error-id"`

### Reduced Motion
- Admin form save, modal enter: Framer Motion + `useReducedMotion()` hook
- Datatable row hover: subtle bg color change (no transform)
- Sparkline chart: static (no animation) V1

---

## 7. Ayşe Persona Derinleştirme — 3 STK Spektrumu

### Engaged Admin (Ayşe — TEMA)
- **Haftalık pattern:** Pzt 30min plan + Çar 15min doğrulama + Cum 20min rapor = **65 min/hafta**
- **STK size:** Büyük (100+ üye), 10+ görev/ay
- **Dijital yetkinlik:** Orta (Excel, WhatsApp, Notion reader)
- **Pain:** Hız + workflow — "30 dakikada pazartesi işlerini bitirmek istiyorum"
- **Admin backoffice use:** Tüm 10 sayfa aktif (görev, doğrulama, rapor)

### Hesitant Admin (Gül — TEGV)
- **Haftalık pattern:** Pzt 30min + acil checkin (doğrulama) = **45 min/hafta**
- **STK size:** Orta (50 üye), 3-5 görev/ay
- **Dijital yetkinlik:** Düşük (email, WhatsApp, web uygulamalar yavaş)
- **Pain:** "Yanlış tıkla bozarım" korku
- **Admin backoffice use:** Dashboard + Görev listesi + Doğrulama (advanced sayfalar skip)

### Busy Admin (Can — HAYTAP)
- **Haftalık pattern:** Pzt hızlı check (5 min) + acil doğrulama (10 min, sporadic) = **15 min/hafta**
- **STK size:** Küçük (30 üye), 2 görev/ay
- **Dijital yetkinlik:** Orta (CRM user, desktop only)
- **Pain:** Zaman — "5 dakikada bitir"
- **Admin backoffice use:** Dashboard + Doğrulama kuyruğu (sadece bu 2)

**Design implication:** Mobile-optional (desktop-first admin scenario ✅). Hesitant admin için "Geri" butonu, undo toast **zorunlu**. Busy admin için quick-access shortcut (Doğrulama) **must**.

---

## 8. Success Metrics (HEART Framework)

| Metrik | Tanım | Target | Ölçüm |
|---|---|---|---|
| **Happiness** | Admin NPS (STK admin anket, "İyiBiri admin'i başka STK'ya tavsiye eder misin?") | ≥50 | Pilot 8. hafta anket |
| **Engagement** | Haftalık active admin login + CRUD aksiyon | ≥4/5 STK haftada 1+ | Activity log, week-over-week |
| **Adoption** | "First gorev publish" completion rate (yeni admin onboard'dan ilk publish'e) | ≥90% (5/5 STK) | onboarding funnel |
| **Retention** | 4-hafta admin login repeat | ≥80% (4/5 STK haftada 1+ login keep) | cohort retention |
| **Task success** | Görev yayınla → user app'te görülme latency | <5 sn (real-time test) | sync performance test |

**HEART drill:**
- **H:** Admin "rahatsız" mu, "hoşlandı" mı? Doğrulama kuyruğu hızlı mı? NPS sorması.
- **E:** Her hafta admin login sayısı (Pzt yüksek, Cuma-Pzr düşük beklendi)
- **A:** 5 STK × admin onboard → first publish (en düşük drop oranı hangi adım?)
- **R:** Pilot hafta 4 sonu login sayısı = hafta 1'den <20% drop (başarı)
- **TS:** Admin görev yayınla → fetch → user app görünür = <5sn measure (CDN + RLS geç?)

---

## 9. Öncelik Matrisi (K1-K8 × LNO)

| K# | Bulgu | Severity | Çalışılacak Batch | Type | İmpakt |
|---|---|---|---|---|---|
| K1 | Admin sidebar + breadcrumb | 4 | S1 (Foundation) | Leverage | Admin context net (blocker) |
| K2 | Destructive action confirm + undo | 3 | S1-S2 | Leverage | Error prevention, trust |
| K3 | Form field validation + error message | 2 | S2 | Leverage | Usability, form success >95% |
| K4 | Datatable mobile responsive | 2 | S3-S4 | Neutral | Mobile use case (nice) |
| K5 | Image upload progress | 2 | S2-S3 | Neutral | System feedback (UX) |
| K6 | Batch action confirmation | 3 | S2 | Leverage | Error prevention, bulk ops |
| K7 | CSV export PII minimization | 2 | S3 | Neutral | KVKK compliance (legal) |
| K8 | Markdown editor toolbar + help | 1 | S4 | Neutral | Nice-to-have (syntax hint) |

**Delivery order:**
- **S1:** K1 (sidebar), K2 (confirm), K6 (bulk confirm) — foundation + safety
- **S2:** K3 (validation), K5 (progress) — form polish
- **S3-4:** K4 (mobile), K7 (PII), K8 (markdown help)

---

## 10. Açık Karar (UX Perspective)

1. **Form "Taslak otomatik kaydet" pattern:**
   - Varsayım: Admin form yarı yolda bırakabilir, sonra devam etmek isteyebilir
   - Önerilen:** Taslak otomatik 30sn, toast "Taslaklı" — local draft durumu visible
   - Test: 2 admin form + close → reload → draft load (funnel metric)

2. **Admin mobile-first mi desktop-first mi:**
   - Varsayım: STK admin %70 desktop (ofis), %30 mobile (sahada doğrulama)
   - Önerilen: Desktop-first design, responsive tablet/phone (scroll acceptable)
   - Test: Pilot haftada cihaz breakdown (analytics event)

3. **Doğrulama kuyruğu "otomatik refresh" gerek mi:**
   - Varsayım: Admin 1 kere açar, 2 dakika 10 item onayla, kapatır (polling yok)
   - Önerilen: V1 = no real-time, manual refresh button. V1.1 = polling 30sn
   - Test: Pilot doğrulama modal open time distribution

---

## 11. Handoff Log

Bu audit'i alan agent'ların zinciri:

- 2026-04-24 HH:MM — **ui-designer** ✅ — **UI spec**: `docs/ui/01-specs/2026-04-24-stk-admin-ui-spec.md`. 10 sayfa wireframe (Sayfa 1-10 detaylı), 20 component handoff, token (atlas-compliant), motion spec (Bölüm 10+11: spring 400/30, stagger 40-80ms, useReducedMotion), a11y (WCAG AA), responsive (desktop/tablet/mobile). K1-K8 çözümü net. Handoff: frontend-engineer S1-S4 batch.

---

## Kaynaklar

**[Kod]** `/app/admin/layout.tsx`, `/app/admin/missions/page.tsx`, `/app/admin/login/page.tsx` — mevcut admin implementation  
**[Kaynak]** `docs/product/02-briefs/ux/2026-04-24-stk-admin-ui-min-plus.md` — upstream UX brief  
**[Kaynak]** `docs/product/01-workstreams/2026-04-24-stk-backoffice-workstream.md` — master workstream  
**[Hipotez]** Admin haftada 30min use (Ayşe persona schedule assumption)  
**[Hipotez]** Desktop-first, mobile responsive (Pilot STK'lar >70% office)  
**[Gözlem]** Mevcut admin layout minimal (top bar only), sidebar eksik → K1 blocker

---

**Son söz:** STK admin panel İyiBiri operasyon'unun kalp atışı. Hata toleransı çok düşük (yanlış doğrulama = canlı etki). K1-K2-K6 (context + safety + confirmation) **must**, diğerleri (K3-K8) **should**. UI designer bu 8 bulguyu 10 sayfa UI spec'e integre etmeli. Frontend K1-K2 öncesi sidebar/confirm modal implement etmeli.
