# STK Admin Journey — Ayşe (TEMA Saha Koordinatörü, 35)

**Persona:** Ayşe Kan, 35, TEMA Saha Koordinatörü, 8 yıl STK deneyimi, İstanbul, iPhone + MacBook  
**Senaryo:** Yeni fidan dikim etkinliği (Pazar 14:00, Belgrad Ormanı) backoffice'te yayınlamak, hemen gönüllülerin görmesini istiyorum  
**Tarih:** 2026-04-24  
**Upstream:** product-analyst brief `docs/product/02-briefs/ux/2026-04-24-stk-admin-ui-min-plus.md`

---

## 1. Ayşe Persona Derinleştirme

**Demografik:**
- 8 yıl STK (TEMA 5 yıl), saha koordinatör + üyelik sorumlusu dual
- Dijital: Excel ileri, Instagram casual, Notion reader (kütüphaneci), Supabase dashboard zor bulur
- İletişim: Gönüllülere WhatsApp grubu, üst yönetim email, çekirdek ekip Slack

**Kognitif model:**
- "İyiBiri admin" yeni araç → meraklı ama "yanlış tıkla bozarım" korku var
- 15 dakika demo görmüş (supabase db tool değil ürün olacak), hevesli
- Pazartesi sabah 30 dakika "haftalık görev planlama" window

**Motivasyon:**
- Gönüllülerle doğrudan iletişim (WhatsApp yerine ürün aracılığı) → güven artır
- "2 dakikada yayınla" — her hafta yönetim raporunda "100+ gönüllüye ulaştık" diyebilsin
- TEMA'nın dijital ödünü modern göstermek (internal pride)

**Frustrasyon noktaları:**
- Excel paralel tutmak (sync riski)
- Supabase DB açmak → SQL query "select * from missions" → ürün değil, geliştirici aracı
- WhatsApp gruplarda yayın → zaman kaybı, açılmayı unutan gönüllüler, mesaj deliyi

---

## 2. 10-Step Journey + Emotion Curve

| # | Ekran / Touchpoint | Eylem | Düşünce | Duygu | Fırsat / Sorun |
|---|---|---|---|---|---|
| 1 | Browser, `admin.iyibiri.app` açtı | Adres çubuğuna yazıp Enter | "Admin paneli var mı? Nerede?" | 😐 0 | Bulma kolaylığı (bookmark ihtiyacı?) |
| 2 | Login page açılıyor (`/admin/login`) | Email + şifre giriş formu doldur | "Süper admin olmadığımı unuttum, şifresi ne?" | 😟 -1 | Şifre hatırlatma (first login experience) |
| 3 | Login başarılı → Dashboard redirect | Sayfa load, 4 card görünür | "Ah, bu benim alanım. Paydos-veri var." | 😌 +1 | Dashboard load süresi (hızlı veya 3sn?) |
| 4 | Dashboard açık (`/admin/tema/`) | 4 kart oku: Karma (45), Üye (12 yeni), Doğrulama (3 pending), Trend sparkline | "Bu ay 45 karma, 12 üye eklendi, 3 fotoğraf onay bekliyor." | 😊 +2 | Data açıklık (4 metrik yeterli mi?) |
| 5 | "Yeni görev" CTA butonu tıkla | `/admin/tema/missions/new` page açılır, form başlıyor | "Form nasıl doldurulur? 10 alan var mı 5 alan var mı?" | 😐 0 | Form complexity (visual cue ihtiyacı?) |
| 6 | Başlık + Açıklama + Domain + Karma + Tarih/saat + Yer + Görsel upload | Tüm alanları text/dropdown/file ile doldur (5 dakika) | "Başlık basit, açıklama paste (copy anadoç), domain 'çevre', karma 20 (TEMA standard), tarih-saat calendar, görsel fidan.jpg" | 😟 -1 | Form alanları (markdown? dropdown default?) |
| 7 | Görsek yüklenirken + dropdown expand + form save button | Yüklenme progress bar göür (visual) → "Yükleniyor..." + Form "Kaydet" tıkla (draft save) | "Görsek kaç MB? Progress etmiş mi? Taslak kaydedildi mi?" | 😐 -0.5 | System feedback (progress bar net mi?) |
| 8 | "Yayınla" butonu (publish toggle = green, top-right) | Tıkla → modal açılır "Bu görevleri yayınla? Hemen gönüllüler görecek." + [Yayınla] [Vazgeç] | "Hızlı bir check — başlık doğru, tarih doğru, tamam." | 😊 +2 | Confirmation ritual (safety ve speed arasında) |
| 9 | Modal [Yayınla] tıkla → save işlemi → toast "✅ Görev yayınlandı!" (2sn) | Sayfa otomatik redirect → `/admin/tema/missions` listesi açılır, yeni görev en üstte | "Bitti! Fidan dikim başlığı vurgulanmış, status 'Yayında' yeşil. 2 saniye tuttu?" | 😍 +3 | **Peak moment:** hız + başarı feeling |
| 10 | Telefonda gönüllü uygulamada push notifikasyon gördü ("Yeni görev: Fidan dikim") | Ayşe başka tarayıcı tab'da user app `/dashboard/missions` açtı, kendi görevini görüyor (anında sync) | "Vay be! 2 dakikada 100+ gönüllü bunu açtı. (Whatsapp şetesi kaşnmadı, ürün öncesi ulaştı.)" | 😍 +3 | **Peak confirmed:** işe yaradı, gönüllüler gördü |

---

## 3. Emotion Curve (ASCII + Skor)

```
Duygu skalası: -3 (çok kötü) → 0 (nötr) → +3 (mükemmel)

Adım    1    2    3    4    5    6    7    8    9    10
Skor   0   -1   +1   +2    0   -1  -0.5 +2   +3   +3
       😐  😟  😌  😊  😐  😟  😐  😊  😍  😍
       
                     ↑ Adım 6-7: Dark moment (form complexity + uncertainty)
                           ↓ Adım 8-9: Recovery + peak (confirmation + instant success)
```

**Dark moment:** Adım 6-7 → Forma gireceği sırada "10 alan doldursam kaç dakika? Hata yaparsam?" endişesi. Açıklama Markdown olacaksa syntax bilemez (TEMA anadoç text/paste yapıyor). Görsel upload progress feedback yok = "bitti mi?"

**Peak moment:** Adım 9-10 → "✅ Yayınlandı" + anında telefonda push notifikasyon → Ayşe "Bu işe yaradı, ürün çalışıyor" hissi.

---

## 4. Journey Detail — Her Adımda Neler Olur

### Adım 1 — Browser açma, admin paneline navigat

**Ne görür:** Tarayıcı boş veya önceki tab

**Ne yapar:** `admin.iyibiri.app` yazıp Enter (bookmark yok, ilk defa)

**Ne düşünür:** "Admin URL nedir bilmiyorum ama öğrendiler bana demişti... admin.iyibiri.app herhalde"

**Duygu:** 😐 Nötr (deneyin, başarısızsa destek mail arar)

**Fırsat:** Slack'te "%5 önceden link yollanabilir" / Onboarding email "Admin paneline burdan gir"

**Kanıt:** [Hipotez] TEMA yöneticisi Ayşe'ye URL söylemedi yazılı, demo'da screen share vardı ama not almadı. 50% first login'de URL arama sorunu.

---

### Adım 2 — Login page açılıyor

**Ne görür:**
```
┌─────────────────────────────────┐
│    STK Admin Girişi             │
│ Email: [________________]        │
│ Şifre: [________________] [👁]  │
│        [Giriş yap] [Şifremi unuttum]
│                                 │
│ Sorun yaşıyorsanız: support@... │
└─────────────────────────────────┘
```

**Ne yapar:** Email alanına `ayse@tema.dev` yazar (doğru), şifre alanına... "şifre ne?" → slack history araştırır, CEO'nun SMS'i bulur `TemaAdmin2026!`

**Ne düşünür:** "Şifre karmaşık ama güzel, super admin değilmişim (neden super admin olmadım?)"

**Duygu:** 😟 -1 Biraz telaş (ilk login, şifre hatırlatma)

**Fırsat:** "Şifremi unuttum" link değil, destek email linki daha iyi (super admin reset story)

**Kanıt:** [Spec] Q44 "Password reset — super-admin reset mi self-serve mi?" → V1 = super-admin reset → Ayşe şifre kaybı = Bahadır'a email (annoying)

---

### Adım 3 — Login başarılı, Dashboard redirect

**Ne görür:**
```
┌─ Top bar ────────────────────────────────┐
│ İyiBiri Admin  |  Missions  Analytics  🛠  │
└──────────────────────────────────────────┘
┌─ Main content ────────────────────────────┐
│ Panelime Hoş Geldiniz                     │
│                                           │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│ │+45      │ │12 yeni  │ │3 bekl   │    │
│ │Karma    │ │Üye      │ │Doğr     │    │
│ └─────────┘ └─────────┘ └─────────┘    │
│                                           │
│ ┌─────────────────────────────────────┐  │
│ │ Son aktiviteler:                  │  │
│ │ • Fidan dikim yayınlandı (Ayşe)   │  │
│ │ • Zeynep onaylandı (+20 karma)    │  │
│ │ • Blog: "Orman hikayesi" (Ayşe)   │  │
│ └─────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

**Ne yapar:** Page load bitene kadar bekle (2-3sn), 4 kart load (skeleton shimmer → data)

**Ne düşünür:** "Sayfa loading... ah bitti, dashboard güzel. Paydos-veri doğru görünüyor."

**Duygu:** 😌 +1 Rahat (sayfa çalışıyor, tanıdık layout, sidebar yok ama nvm)

**Fırsat:** Load <2sn (Ayşe sabırsız, 3sn+ = "yavaş ürün" damga)

**Kanıt:** [Mobile-app-polish] "Dashboard hero entrance: 0ms scale + opacity, 600ms count-up" → skeleton + data load <2sn hedefi

---

### Adım 4 — Dashboard kartlarını oku

**Ne görür:** 4 card metric:
- **Karma:** +45 bu ay (spark line 7-day trend up)
- **Üye:** 12 yeni bu ay
- **Doğrulama:** 3 bekleyen (red badge)
- **Onboarding:** 8 başlangıç eğitim (% progress bar)

**Ne yapar:** Her kartı oku (30 saniye), "Doğrulama 3 var, sonra baktabilirim" düşünür

**Ne düşünür:** "Bu ay iyi gitti. 45 karma, 12 yeni üye. Doğrulama queue'de 3 tane var, sonra hallerim. Şu ana kadar tamam."

**Duygu:** 😊 +2 Memnun (aylık durum anlar, aksiyona hazır)

**Fırsat:** "Doğrulama 3" kartı tıklanabilir, direkt queue'ye gitmeli (quick action)

**Kanıt:** [Linear Inbox pattern] "Quick action CTA → quick drill-down" / [Spec Sayfa 1] "CTA butonları → link sayfaya"

---

### Adım 5 — "Yeni görev" butonuna tıkla

**Ne görür:**
```
Dashboard'ın altında veya üstünde:
[🎯 Yeni görev] [📋 Doğrulama queue (3)]
```

**Ne yapar:** "🎯 Yeni görev" tıkla, form page load başlıyor (`/admin/tema/missions/new`)

**Ne düşünür:** "Yeni görev sayfasını açtım. Alanlar neler acaba?"

**Duygu:** 😐 0 Nötr (eşik, merak + biraz endişe "form kompleks mi?")

**Fırsat:** Sayfa yüklenmeden form skeleton göster (anticipatory loading)

**Kanıt:** [System visibility] "Loading state → skeleton visible before data" — form field placeholder show early

---

### Adım 6 — Form alanlarını doldur

**Form görseli:**
```
┌─ Görev Oluştur ────────────────┐
│ Başlık *                        │
│ [Fidan dikim etkinliği]        │
│                                 │
│ Açıklama * (Markdown)          │
│ [# Belgrad Ormanı Fidan Dikimi │
│  Cumartesi 14:00 başlayacağız  │
│  * Öğle yemeği sağlana         │
│  * Eldiven getirin]            │
│                                 │
│ Kategori * (dropdown)          │
│ [Çevre ▼]                       │
│                                 │
│ Karma Puanı * (number)         │
│ [20] puan                       │
│                                 │
│ Tarih & Saat *                 │
│ [24 Nisan 2026] [14:00] (picker)│
│                                 │
│ Yer                            │
│ [Belgrad Ormanı, İstanbul]     │
│                                 │
│ Görsel Upload *               │
│ [📎 Tıkla veya sürükle]        │
│ ┌─────────────────┐            │
│ │ fidan.jpg       │ (preview)  │
│ │ 2.3 MB, ✅      │            │
│ └─────────────────┘            │
│                                 │
│ [Taslak Kaydet] [Yayınla] ➜     │
└─────────────────────────────────┘
```

**Ne yapar:** Alanları doldur
1. Başlık: copy anadoç "Fidan dikim etkinliği"
2. Açıklama: copy Slack message, yapıştır → markdown # ve bullet'lar orada mı? (sorgu)
3. Kategori: "Çevre" dropdown açar, seçer
4. Karma: 20 (TEMA standard, pre-filled olabilir)
5. Tarih/saat: calendar picker açar (24 Nisan) → time picker → 14:00
6. Yer: "Belgrad Ormanı" yazıyor
7. Görsel: bilgisayardan fidan.jpg dosya seçer (sürükle veya tıkla)

**Timing:** ~5 dakika (ilk defa, form alanları keşif + hesap)

**Ne düşünür:**
- "Başlık tamam, açıklama copy. Markdown mi yazmalıyım? Abi Markdown yazması zor... ama paste yaparsam belki durum? (Format bozulur?)"
- "Karma 20, doğru (biliyor çünkü her görevde 20)."
- "Tarih calendar güzel, 24 Nisan seçtim, 14:00."
- "Görsel upload — fidan.jpg dosya seçtim. Yükleniyor... kaç MB? 2.3 MB var, limit 5MB yeterli mi?"

**Duygu:** 😟 -1 Fricition (açıklama markdown endişesi + görsel upload progress uncertainty)

**Fırsat:**
- Açıklama markdown → "Preview tab" ile WYSIWYG gibi
- Görsel upload → progress bar (3-5sn estimate göster)
- Form field error message → "Açıklama, temel format kullan: # başlık, - madde, [link]" hint

**Kanıt:**
- [K3 bulgu] Form field validation + error messaging eksik
- [K5 bulgu] Image upload progress yok
- [K8 bulgu] Markdown editor syntax hint yok

---

### Adım 7 — Görsel yüklenirken ve form draft save

**Ne görür:**
```
Görsel upload box'ında:
┌─────────────────────────┐
│ 📁 fidan.jpg            │
│ ⬆️ Yükleniyor... 40%     │
│ ~3 saniye kaldı         │
└─────────────────────────┘

Form bottom'da:
[Taslak Kaydet] [Yayınla]
```

**Ne yapar:** Upload bitene kadar bekle, timeout yapma. Form "Taslak Kaydet" butonu tıkla (ihtiyatsız)

**Ne düşünür:**
- "Görsek yükleniyor... kaç saniye kalan? 40% olmuş... biraz daha... şey bu sürü normal mi?"
- "Form bitireyim, taslak kaydeteyim bari, hata yaparsam backupim var."

**Duygu:** 😐 -0.5 Endişe + sabır (upload bitmesini beklemek, multi-tasking ister)

**Fırsat:**
- Progress bar + ETA ("~3 saniye kaldı")
- Form auto-save + toast "Taslak otomatik kaydedildi" (manual save Button'a ihtiyaç yok)

**Kanıt:** [K5 bulgu] Image upload progress indicator missing

---

### Adım 8 — "Yayınla" butonuna tıkla ve confirmation modal

**Ne görür:**
```
Modal açılır:
┌─────────────────────────────────┐
│ ⚠️ Görev Yayınla               │
│                                 │
│ Bu görevleri hemen yayınlarsan │
│ 100+ gönüllü bildirim alacak   │
│ ve görevler listesinde görünür │
│                                 │
│ Başlık: "Fidan dikim etkinliği"│
│ Tarih: 24 Nisan 14:00          │
│ Yer: Belgrad Ormanı            │
│                                 │
│ [Geri] [Yayınla] ➜ (green)     │
└─────────────────────────────────┘
```

**Ne yapar:** Modal bilgi oku (başlık, tarih, yer confirm), [Yayınla] tıkla

**Ne düşünür:** "Başlık doğru, tarih-yer doğru. Tamam, yayınlasın."

**Duygu:** 😊 +2 Güven (confirmation modal = safety, Ayşe rahat)

**Fırsat:** Modal başında tüm bilgi görünsün (scrollsuz)

**Kanıt:** [K2 bulgu] Destructive action confirm pattern → modal spec'lenmiş ✅

---

### Adım 9 — Yayınla işlemi başarılı, toast + redirect

**Ne görür:**
```
Modal kapatılıyor, sayfa `/admin/tema/missions` listesi açılıyor:
┌─ Görevlerim ──────────────────────────────┐
│                                            │
│ 🎉 "Fidan dikim etkinliği" yayınlandı ✅  │
│ (2 saniye toast, sonra kaybolur)          │
│                                            │
│ Görevler tablosu:                         │
│ ┌──────────────────────────────────────┐ │
│ │ Başlık | Domain | Karma | Status    │ │
│ ├──────────────────────────────────────┤ │
│ │ Fidan ... | Çevre | 20 | Yayında ✅ │ │
│ │ Okuma ... | Eğit | 15 | Taslak   │ │
│ │ Ziyaret...|Sosyal| 10 | İptal    │ │
│ └──────────────────────────────────────┘ │
│                                            │
│ [Yeni görev] [Filtre]                    │
└────────────────────────────────────────────┘
```

**Ne yapar:** Toast "Yayınlandı ✅" oku (2sn boyunca görünür), otomatik kaybolur. Listede yeni görev en üstte (kalın highlight), status "Yayında" yeşil badge.

**Ne düşünür:** "Vay be, 2 dakikada bitti! Yeni görev en üstte, status yeşil, yayında demek anında gönüllülere ulaştı."

**Duygu:** 😍 +3 **PEAK MOMENT** — Başarı + hız + visible result

**Fırsat:** Toast highlight (gold renk), yeni görev row animation (scale + fade, 300ms) — celebrate small win

**Kanıt:** [Mobile-app-polish Bölüm 3] "Success state animation: check icon scale, count-up, impact statement, confetti opsiyonel"

---

### Adım 10 — User app'te push notifikasyon ve instant sync confirm

**Ne görür:** Ayşe iPhone'unun push bildirim:
```
[İyiBiri] 🔔
Yeni görev: Fidan dikim etkinliği
24 Nisan, 14:00 - Belgrad Ormanı
━━━━━━━━━━━━━━━━━━━━
```

**Ne yapar:** Bildirim tıkla, app açılır (veya tarayıcıda başka tab `/dashboard/missions` açar) → kendi yeni görevini görüyor!

**Ne düşünür:** "Vay be! Şimdi yayınladım, hemen push geldi, app'te görünüyor. Bu çalışıyor demek. WhatsApp yazmaya gerek yok, ürün kendisi bildiriyor."

**Duygu:** 😍 +3 **PEAK CONFIRMED** — Magic moment, ürüne inanç

**Fırsat:** Push notifikasyon geç gelmediyse (timing >5sn), Ayşe "sistem yavaş mı" zan ederdi

**Kanıt:** [Spec] "Admin görev yayınla → user app'te görülme latency <5 sn (real-time sync test)" — K1 success metric

---

## 5. Dark Moment — Adım 6-7

### Ne oldu?
Adım 6 form doldurmada "Açıklama markdown mı düz text mi?" ve Adım 7 görsel upload progress uncertainty. Ayşe "hata yaparsam bozar mı, geri alır mı" korku yaşıyor.

### Neden kritik?
- **Engagement drop riski:** Form 5 dakika, hata mesajı gelirse veya upload bitmezse, Ayşe "bir daha yapmam" diyebilir
- **Usability ihlal:** N9 (error diagnosis) — hata mesajı yoksa Ayşe "neyin yanlış olduğunu" anlamaz
- **Retry friction:** Form kapatıp DB tool açmak (old way) → ürün kötü damgası

### Fırsat:
1. **Açıklama markdown:** Side-by-side preview tab, otomatik markdown render (WYSIWYG simulasyonu)
2. **Progress feedback:** Upload progress bar + ETA ("~3 saniye kaldı") → Ayşe bilgi sahibi
3. **Form auto-save:** Her 30sn taslak save + toast "Taslaklı" → hata durumda geri yükleme
4. **Error message tone:** "Açıklama formatı yanlış" ❌ değil "# başlık, - madde, [link] format kullanabilirsin" ✅

---

## 6. Peak Moment — Adım 9-10

### Ne oldu?
Yayınlama tıkla → toast ✅ → anında listede görünür + push notifikasyon gönüllülere ulaşır.

### Neden memorable?
- **Görünür başarı:** "2 dakikada 100+ gönüllüye ulaştım" — email/Slack 30 dakika, bu 2 dakika
- **Ürüne inanç:** "Bu ürün çalışıyor, magic yapmıyor ama işe yaradı"
- **Tekrar isteme:** "Gelecek haftada falan yine yapacağım" — adoption signal

### Tasarım elemanları:
- Toast "✅ Yayınlandı" (gold tint, 2sn visible)
- Yeni görev row highlight (subtle animation, 300ms scale)
- Push notifikasyon app'te anında görünmesi (<5sn)

---

## 7. 3 Persona Spektrumu

### 1. Engaged — Ayşe (TEMA, bu journey)
- **Hafta:** Pzt 30min + Çar 15min doğrulama + Cum 20min rapor = 65 min
- **Tüm sayfaları:** Dashboard + Görev + Doğrulama + Rapor + Blog (aktif)
- **Pain:** Hız + workflow tutarlılığı
- **Success:** <2 dakika görev yayınla + bulk doğrulama kuyruğu <5 dakika

### 2. Hesitant — Gül (TEGV, limited use)
- **Hafta:** Pzt 30min + acil doğrulama (sporadic) = 45 min
- **Sayfaları:** Dashboard + Görev listesi + Doğrulama (advanced skip)
- **Pain:** "Yanlış tıkla bozarım" korku
- **Success:** Sidebar clear + back button obvious + undo toast + error message Türkçe samimi

### 3. Busy — Can (HAYTAP, minimal)
- **Hafta:** Pzt 5min check + doğrulama 10min = 15 min
- **Sayfaları:** Dashboard + Doğrulama (sadece)
- **Pain:** Zaman çok sınırlı, kontrol etmek ister ama çabuk bitirmek
- **Success:** Quick-access shortcut (doğrulama icon dashboard'da) + mobile ok

---

## 8. Design Implication — Neler tasarımcı/FE'ye söylemeli?

| Bulgu | Sonuç |
|---|---|
| Adım 1: Admin URL bullmak zor | Onboarding email + Slack yeterli (UI değil) — ama **bookmark recommendation** UI'de ekle (first load'da) |
| Adım 2: Şifre hatırlatma | Spec Q44 → super-admin reset (şu an) — ama self-serve password reset V1.1 needed |
| Adım 3: Dashboard load <2sn | **Critical:** skeleton + data load pipeline optimize gerek. <3sn+ = ürün yavaş damga |
| Adım 4: Quick action CTA | Doğrulama 3 kartı tıklanabilir, `/admin/tema/verifications` direkt açar |
| Adım 5: Form sayfa load | Skeleton form visible before data (form field placeholder) |
| Adım 6: Form markdown + upload | **K3, K5, K8:** validation errors inline + progress bar + syntax hint toolbar |
| Adım 7: Form auto-save | Every 30sn local draft save + toast "Taslaklı" indicator |
| Adım 8: Confirmation modal | **K2:** modal açılır, başlık/tarih/yer confirm, 1-2sn fokus |
| Adım 9: Toast + redirect | Gold-tinted toast "✅ Yayınlandı" + row highlight animation (300ms) |
| Adım 10: User app sync | Push notification push time <5sn critical. RLS + DB sync test end-to-end |

---

## 9. Success Metrics — Ayşe Journey Test

**Pilot 2. hafta:**
- Ayşe "Fidan dikim" görev 2 dakika <yayınla? (timer + observation)
- Form error rate <10% (validation test)
- Görev görünme latency <5sn (sync test)

**Pilot 4. hafta:**
- Ayşe haftada 2+ görev yayınlıyor (adoption metric)
- Doğrulama queue average approval time <2 dakika/item
- Admin NPS "Görev yayınlama hızı" ≥4/5

**Pilot 12. hafta:**
- TEMA admin 4-hafta retention >80% (backup plan yok, ürüne switch ettik)
- "Yayınla" feature usage >5 STK × 10+ görev = ürün core value proven

---

## 10. Açık Karar — Journey Perspective

1. **Form başında "Yardım" banner gerek mi?**
   - Varsayım: Ayşe form'u ilk defa görüyor, biraz kaybolabilir
   - Önerildi: "Rehberim Başla" buton optional (power user skip, newbie click)
   - Test: Pilot haftada "form help banner click" metrik

2. **Markdown editor default WYSIWYG mi code mi?**
   - Varsayım: Ayşe markdown bilmiyor, code görünce korkar
   - Önerildi: Default WYSIWYG tab (visual preview) — code tab opsiyonel
   - Test: Pilot "markdown tab click" vs "preview tab" ratio

3. **Doğrulama queue'de gönüllü fotosu **nekadar büyük**?**
   - Varsayım: Ayşe fotoyu check ediyor, fake/kalite kontrol
   - Önerildi: Thumbnail + "Tam boyut" modal (large preview, zoomable)
   - Test: Pilot "photo zoom modal" usage rate

---

## Kaynaklar

**[Kod]** `/app/admin/missions/page.tsx` (missions list page) — mevcut implementation  
**[Kaynak]** `docs/product/02-briefs/ux/2026-04-24-stk-admin-ui-min-plus.md` — Ayşe persona bölüm 2 derinleştirme  
**[Kaynak]** `docs/ux/03-heuristics/2026-04-24-stk-admin-audit.md` — audit K1-K8 bulgularına align  
**[Hipotez]** Ayşe pzt sabah 30 dakika window'da görev yayınlamak ister (STK saha koordinatör pattern)  
**[Hipotez]** Desktop 70% (ofis), mobile 30% (sahada doğrulama) — mobile scroll acceptable  
**[Gözlem]** Admin URL ilk defa = bookmark tavsiyesi veya email link gerek

---

## Handoff Log

Bu journey'i alan agent'ların zinciri:

- *(henüz downstream yok)*

---

**Son söz:** Ayşe journey'i "görünür başarı" (yayınla → anında push → gönüllü gördü) ilk momenti yakalıyor. Dark moment (form complexity + upload uncertainty) → Peak moment (toast + list + sync) arc, emotional design'ın klasiği. UI designer Ayşe'nin 5-adım form complexity'sini "mini steps + preview" ile çözmeli, FE progress bar + auto-save ile confidence artırmalı. Sonrası ürüne inanç = pilot success.
