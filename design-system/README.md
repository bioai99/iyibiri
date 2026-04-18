# İyiBiri Design System

> İyilik yapmak, Karma kazanmak, gerçek ödüller almak. Türk sivil toplum ekosistemi için bir PWA.

**İyiBiri**, Türkiye'deki sivil toplum kuruluşlarıyla (TEMA, ÇYDD, Haytap, Kızılay, Kodluyoruz) ortaklık kuran, kullanıcılara STK'lardan gerçek gönüllülük görevleri veren, tamamladıkları her göreve karşılık **Karma** puanı dağıtan ve biriken Karma'yı Sponsor Markalardan (Starbucks, Migros, Nike, Trendyol, Garanti BBVA) gerçek ödüllere dönüştüren bir mobil-öncelikli (PWA) üründür.

Dil: **Türkçe**. Ton: **sıcak, samimi, ikinci tekil şahıs ("sen")**.

---

## Kaynaklar

- **Codebase:** `iyibiri/` — Next.js 14 (App Router) + Tailwind + Supabase + Framer Motion + Lottie + lucide-react. Bu projenin iskeleti buradan çıkartıldı.
- **Ana ürün yüzeyleri:**
  - Pazarlama / Landing — `iyibiri/app/page.tsx`
  - Dashboard PWA — `iyibiri/app/dashboard/*`
  - Onboarding — `iyibiri/app/onboarding/*`
- **Token kaynağı:** `iyibiri/app/globals.css`, `iyibiri/tailwind.config.ts`
- **Mock/içerik tonu:** `iyibiri/lib/mock-data.ts`

> Not: Kullanıcı, app tarafını landing'den sonra geliştirmeye devam etti — bu yüzden **dashboard + onboarding** otorite kaynaktır. Landing stili varyasyondur, yeni tasarımlarda dashboard'daki görsel dili takip et.

---

## Index (bu klasörde ne var?)

- `colors_and_type.css` — renk, type, radius, shadow, spacing token'ları.
- `fonts/` — Google Fonts üzerinden yüklenen Inter + Plus Jakarta Sans (CDN; yerel kopya yoktur, bayrak).
- `assets/logos/` — İyiBiri logosu (SVG), STK ortak logoları, sponsor marka logoları.
- `assets/icons/` — Karma token SVG'si ve özel ikonlar.
- `ui_kits/app/` — Dashboard / PWA UI kiti (React/JSX).
- `preview/` — Design System tab'ındaki kartlar.
- `SKILL.md` — Claude Code veya başka bir agent ortamında skill olarak kullanılmak üzere.

---

## CONTENT FUNDAMENTALS

**Dil:** Tamamı Türkçe. İngilizce teknik terim kullanma ("onboarding" yerine gerekirse "Başlangıç"). İngilizce marka adları (Starbucks, Nike) olduğu gibi.

**Ton:** Samimi, cesaretlendirici, hafifçe esprili ama asla ciltilik. Ürün arkadaşın gibi konuşur, otorite gibi değil.

**Kişi:** Her zaman **"sen"** — asla "siz" veya "biz". Örnekler:
- ✅ "Bir görev seç, tamamla, Karma kazan."
- ✅ "Karşılık beklemiyorsan? Sorun değil."
- ❌ "Kullanıcılarımız görev tamamladıklarında..."

**Büyük harf:** Sadece marka terimleri ve seviye adları Büyük Harfle:
- **Karma** — puan birimi, her zaman büyük K.
- **İyiBiri** — marka adı.
- **İyilik Öncüleri** — STK ortakları (sabit terim).
- **Sponsor Markalar** — ödül ortakları (sabit terim).
- Seviye isimleri: **İyi Biri**, **Çok İyi Biri**, **Çoook İyi Biri**, **Gerçekten İyi Biri**, **İyiliğin Öncüsü** — Title Case.
- Görev başlıkları Title Case: "Sahil Temizliği Gönüllüsü".
- Gövde metinde gereksiz büyük harf kullanma.

**Mikrokopyası — tipik kalıplar:**
- Eylem düğmeleri: kısa, emir kipi. "Katıl", "Başlayalım", "Göreve Başla", "Kullan", "Tümü →".
- Form ipuçları: "e-posta adresin", "Adın Soyadın", "Spam yok. İstediğin zaman çıkabilirsin."
- Boş durumlar: sebep + çıkış yolu. "Bu kategoride görev bulunamadı" (şikayet değil, bilgi).
- Karma bildirimleri: her zaman `+` ile. "+150 Karma", "+250 Karma".
- Sayılar: Türkçe yerel format — binlik `.` (1.200, 12.340), onluk `,`.
- Sıralı adımlar: "01 Görev Seç · 02 Tamamla & Doğrula · 03 Karma Kazan · 04 Ödül Al".

**Etki anlatımı (signature voice):** Her görevin somut bir `impactStatement`'ı olur:
- "Bu görevle bir kıyı şeridi temizlenir; deniz canlıları nefes alır."
- "Bu görevle bir çocuğun okuma becerisi gelişir; geleceği şekillenir."
- "Bu görevle barınaktaki bir can bugün aç kalmaz."

Cümle yapısı: **"Bu görevle [etki]; [sonuç/his]."** İki parçalı, ikinci parçası duygusal.

**Emoji:** Kısıtlı ve seçici. Sadece:
- Avatar seçenekleri: 🐱 🐕 🦊 🤖 🥳 (onboarding'de maskot).
- Seviye rozetleri: 🌱 ⭐ 🌟 🏆 (TierBadge'de).
- Star rating: ★ (review yıldızı).
- Flame: 🔥 (streak).
- Nadir metin vurgusu: ♾️, ☕.
UI kromunda (butonlar, nav, form) **emoji kullanma**. Lucide ikonları tercih et.

**Unicode süsler:** Landing'de "✦" (sparkle) ve "→" (ok) görünür — onboarding tag/hero'larında "◎ ★ ❋ ✦" tipi minimalist glyph'ler geometrik işaret olarak kullanıldı.

---

## VISUAL FOUNDATIONS

### Renkler
- **Primary — Altın** (`#F4B942`): Karma, seviye göstergeleri, CTA butonlar, progress bar. Sıcak bir sarı-turuncu geçişli — tek başına da gradient'te de (amber-400 → orange-500) kullanılır.
- **Trust — Lacivert** (`#1B3A5C`): STK kurumsal güven rengi. Hero tipografisi, footer, header pill'leri, NGO logosu altlığı. Ağır otorite rengi.
- **Impact — Yeşil** (`#2D9E5A`): Tamamlandı, doğrulandı, "Kolay" zorluk. Sadece olumlu geri bildirim.
- **Cream bg** (`#FAFAF5`): Arkaplan. Saf beyaz değil — soğuk değil, sıcak bir krem.
- **Domain renkleri** her mission kategorisi için sabit: Doğa → emerald, Eğitim → blue, Sosyal → rose, Finansal → amber, Hayvanlar → orange, Kültür → purple.

### Type
- **Display: Plus Jakarta Sans** (700/800) — başlıklar, sayılar, hero. Geometrik ama yuvarlak; sıcak hissi korur.
- **Body: Inter** (400/500/600) — metin, form, mikrokopyası.
- Hero'larda **-0.02em letter-spacing**, gövde düz.
- Sayı göstergesi için `tabular-nums` + `font-display font-black`. Karma sayıları 40–80px hero boyutlarında görünür.

### Arkaplan / sayfa atmosferi
- Tek renk cream bg. Dekoratif arkaplan imajı yok, desen yok, grain yok.
- Kategorilere özel unsplash fotoğrafları kartların üstüne **full-bleed + siyah gradient overlay** ile uygulanır (mission card, domain hero).
- Full-bleed dekoratif foto şeritleri (landing'de 220px yüksekliğinde, flex oranlarıyla bölünmüş dört fotoğraf) nadiren kullanılır.

### Gradients
- Ana brand gradient: **Amber-400 → Orange-500** (45°) — hero kartlar, dashboard hero, primary butonlar için sıcak glow.
- Domain gradient'leri: `from-{domain}-500 to-{domain}-400` (nature=emerald-to-teal, education=blue-to-indigo, social=rose-to-pink, financial=amber-to-orange). Mission card'ın üst "band"inde.
- Foto üstünde: `bg-gradient-to-t from-black/75 via-black/30 to-black/10` (koruma gradient'i).
- Mavi-mor aurora benzeri gradient YOK. Ürün dışı.

### Köşe yuvarlaklığı (radii)
Cömert, yumuşak. Varsayılan çerçeve ≥ 16px, hero kartlar 24–32px.
- Form input: **12px** (rounded-xl)
- Küçük pill / chip: **full** (rounded-full)
- Kart: **24px** (rounded-3xl)
- Hero kart / bottom sheet: **32px** (rounded-[2rem])
- Buton: **12px** (rounded-xl) — landing; **8px** (rounded-lg) — base button varyantı.
- Avatar ring: tam yuvarlak + 4px primary ring.

### Gölge sistemi (warm shadows)
Keskin, siyah renkli gölge yok. Kahverengi-altın tonlu, yayılmış:
- `shadow-sm` = `0 2px 12px rgba(0,0,0,0.07)` — küçük kartlar.
- `shadow-md` = `0 4px 24px rgba(0,0,0,0.08)` — mission card default.
- `shadow-lg` = `0 12px 40px rgba(0,0,0,0.13)` — hover mission card.
- **Hero glow** = `0 8px 32px rgba(251,146,60,0.35)` — altın parıltılı, dashboard hero'larda. Bu imza gölge.
- Inner shadow kullanılmaz.

### Kart anatomisi
Kartlar **border + shadow + beyaz surface** — ya ring-1 ile subtle border ya da hairline stone-100.
- Mission card: üstte gradient band + altta beyaz body, toplam rounded-3xl.
- Reward card: sol tarafta dikey gradient çubuk + dashed divider + sağda action alanı (kupon formu).
- Stats card: beyaz zemin, sol üstte renkli ikon pill'i, büyük sayı altında küçük label.

### Hareket (motion)
Framer Motion + spring-based. Her etkileşim küçük tepki verir ama dikkat dağıtmaz.
- **Spring defaults:** `{ type: 'spring', stiffness: 400, damping: 30 }` — liste item'ları, tap response.
- **Tap feedback:** `whileTap={{ scale: 0.93 → 0.97 }}` — butonlar & kartlar. Kartlar daha az sıkılır, butonlar daha çok.
- **Entry:** `initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}` + staggered delay (i * 0.05).
- **Counter animation:** Karma sayıları KarmaCounter'da `animate(from, to, { duration: 0.8, ease: [0.16, 1, 0.3, 1] })` + scale pulse.
- **Avatar/streak:** Lottie döngüsü + `scale: [1, 1.2, 1], rotate: [-3, 3, -3]` streak flame'de.
- **Mockup sahnelerinde:** slideInUp staggered (0.5s ease-out, 0.3s gecikmeli).
- `prefers-reduced-motion` saygılı — tüm mockup animasyonları kapanır.

### Hover / press durumları
- **Hover:** shadow bir tık derinleşir (`shadow-md → shadow-lg`), opacity koyulaşır (`bg-primary/90`), **scale: 1.02–1.05** ve `grayscale-0` (marquee'de). Hafif `-translate-y-1` reward brand kartlarında.
- **Press:** `scale(0.93–0.97)` spring ile (whileTap).
- **Focus-visible:** `ring-2 ring-ring` + `ring-offset`. Amber halo.

### Transparans / blur
- Sticky header: `bg-white/90 backdrop-blur border-b border-gray-100`.
- Hero içindeki progress kapsülleri: `bg-white/20` üzerine `bg-white/10` track. Saydam cam hissi.
- Image overlay'leri: `bg-[#1B3A5C]/20` üstünde `group-hover:bg-[#1B3A5C]/10` — temasta aydınlanma.
- NGO kart'larda küçük logo pill'i: `bg-white/90 backdrop-blur-sm` foto üstünde.
- Bottom sheet: solid beyaz (şeffaf değil) + arkada `bg-black/40` scrim.

### Border sistemi
- Default hairline: `border-gray-100` veya `border-stone-100` — 1px, çok yumuşak.
- Focus: `border-primary` (amber) + ring.
- Dashed: sadece reward kupon card'ının orta ayırıcısında (`border-dashed border-stone-200`).

### Layout kuralları
- **Mobile-first.** Dashboard sayfalarında ana içerik `max-w-lg mx-auto` (480–520px). Landing'de `max-w-6xl mx-auto`.
- Bottom nav fixed + safe-area inset (`pb-safe`), h-16. 5 item.
- Padding-x mobile: 16px (px-4), desktop landing: 24px (px-6).
- Dikey ritim: kartlar arası 12–16px, section arası 24–32px (mobile) / 96px (landing).
- Header'lar sticky + sayfa üstünde padding-top 48px (pt-12) status bar alanı için.

### Fotoğraf dili
- Unsplash + Türkçe bağlam: topluluk, doğa, gönüllülük sahneleri.
- Renk tonu: sıcak, güneşli, doğal. B&W veya cool-tone kullanılmaz.
- Grain efekti yok. Overlay ile koyulaştırılır (kontrast + okunabilirlik).
- Kare/dikey portre kullanımı: testimonial avatar (40x40 ring-2 ring-amber-100).

---

## ICONOGRAPHY

- **Birincil ikon seti: Lucide React** (`lucide-react`). Tüm app'te tutarlı. Varsayılan strokeWidth 2, aktif durumda 2.5.
- Örnek kullanımlar: `Home, ListChecks, Heart, Gift, User` (bottom nav); `Leaf, BookOpen, Heart, Coins` (domain); `Flame, Sparkles, CheckCircle2, Clock, ChevronRight, Lock, Trophy, LogOut, Pencil` (UI).
- **Özel SVG'ler (brand ikonları):**
  - `iyibiri-logo.svg` — kafa + gövde + kalp + verified rozet ikonu. Gradient doldurulmuş.
  - `karma-token.svg` — altın sikke + kalp + boomerang oku. "İyilik geri döner" metaforu.
- **Kategori ikonları:** Lucide ile karşılanır. `DomainIcon` bileşeni her domain için renkli pill + ikon render eder.
- **Emoji:** Sadece seviye rozetleri (🌱⭐🌟🏆), avatar opsiyonları (🐱🐕🦊🤖🥳), streak flame (🔥), star rating (★). UI krom'da yok.
- **Lottie animasyonları:** `iyibiri/public/animations/{cat,dog,fox,robot,party}.json` — dashboard hero maskotu. Kullanıcı seçilebilir. (Bu projeye kopyalanmadı — yer kapladığı için; animation dosyaları gerekirse codebase'den çekilmeli.)
- **CDN alternatif:** `lucide-react` veya `https://unpkg.com/lucide-static@latest/icons/*.svg` — bu projeye çekmedik; design system dosyalarında lucide isimleriyle referans verildi.

**Kural:** Yeni ikon gerektiğinde **önce Lucide'a bak**. Yoksa aynı stroke-ağırlığı (1.8–2.2px), yuvarlatılmış uçlu SVG çiz. Heroicons/Feather karışımından kaçın.

---

## Nasıl kullanılır?

Tasarım yaparken:
1. `colors_and_type.css` import et (veya token'ları kopyala).
2. `assets/logos/iyibiri-logo.svg` + gerekli STK logoları referans ver.
3. Type: Plus Jakarta Sans (display) + Inter (body) Google Fonts ile yükle.
4. Mission card, hero card, reward card patern'leri için `ui_kits/app/` içine bak.
5. Her yeni text'i Türkçe, 2. tekil şahıs ve sıcak tonla yaz.

Claude Code ile kullanım için: `SKILL.md` bkz.
