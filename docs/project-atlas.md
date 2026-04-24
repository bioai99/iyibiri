# İyiBiri — Project Atlas

> **Amaç:** Tüm discovery agent'larının (strategy-consultant, product-analyst, ux-researcher, ui-designer) ortak hafızası. Her agent her işe başlamadan önce ilgili bölümleri **okur**. Ürün hakkında karar verirken "0'dan tasarım" değil, **var olan üstüne improvement** yaklaşımını zorlar.
>
> **Canlı dosya.** Üründe bir şey değiştiğinde güncel tutulur — güncelleme sorumluluğu değişikliği yapan agent'tadır. Güncellik denetimi ileride `qa-auditor`'da.

**Son güncelleme:** 2026-04-23

---

## 1. Kimlik ve pozisyon

**Ne:** İyiBiri, Türk sivil toplum ekosistemi için bir mobil-öncelikli (PWA + Capacitor iOS/Android) uygulama. STK'lardan gerçek gönüllülük görevleri → her tamamlamada **Karma** puanı → biriken Karma Sponsor Markalardan (Starbucks, Migros, Nike, Trendyol, Garanti BBVA gibi) gerçek ödüllere çevriliyor. Bunun yanında STK üyelik ve bağış akışı var.

**Kime:** Birincil, Türkiye'de 18–34 yaş, şehirli, dijital yerli, iyilik yapmak isteyen ama "nereden başlarım, güvenilir mi" sorusunun arkasında duraklayan kullanıcı.

**Ton:** Türkçe, "sen" dili, sıcak, samimi, kısık sesli espri kabul — otorite değil arkadaş. Marka tonu detayları `design-system/README.md`'de (ton bölümü hâlâ yetkili).

**Ticari domain:** `iyibiri.app` (www.iyibiri.app/app-start → Capacitor giriş noktası).

**Slogan (mevcut):** "Gönüllü ol, Karma biriktir, fark yarat." (`app/layout.tsx` metadata).

---

## 2. Teknoloji steki

Tam bağımlılıklar `package.json`'da. Kritik kısım:

| Katman | Teknoloji | Versiyon | Not |
|---|---|---|---|
| Framework | Next.js | 14.2.35 | App Router, RSC karışık |
| Runtime | React | 18 | — |
| DB/Auth/Storage | Supabase | SSR 0.10 + JS 2.103 | MCP server bağlı: `.mcp.json` |
| Mobile | Capacitor | 8.3 | iOS + Android |
| Native auth | @capgo/capacitor-social-login | 8.3.14 | Google + Apple |
| Styling | Tailwind | 3.4 | `tailwindcss-animate` + `tw-animate-css` |
| UI kit | shadcn + @base-ui/react | 4.1 / 1.3 | `components/ui/` |
| Motion | framer-motion | 12.38 | + `motion` + `gsap` 3.15 |
| 3D | three.js | 0.184 | Landing için |
| Animation | lottie-react | 2.4 | avatar/streak animasyonları |
| Utility | canvas-confetti, qrcode, html5-qrcode | — | görev QR + reward celebration |

**Runtime notu:** `capacitor.config.ts` `webDir: 'out'` diyor — yani mobile build `next export` ile statik. Dashboard'ın SSR özelliklerinin hangi kısmı static build'de çalışır, **open question** (QR verification gibi server action'lar mobile'da web URL'sine döner: `server.url: https://www.iyibiri.app/app-start`).

---

## 3. Ana rotalar ve sayfa haritası

38 sayfa. Durum etiketleri `docs/page-audit.md`'den (otorite kaynak; atlasta özet).

### Public & Auth
- `/` Landing (🟢 prod, Three.js + GSAP, 71 KB `page.tsx`)
- `/app-start` Splash + auth redirect (🟢 prod)
- `/auth/login` Google + Apple OAuth (🟢 prod)
- `/auth/signin` Email/password signin (🟡 beta — "Şifremi unuttum" ölü link)
- `/auth/signup` Email signup + KVKK + password strength (🟢 prod)
- `/auth/verify` OTP verify (🟢 prod)
- `/auth/callback/route.ts` OAuth callback handler
- `/api/auth/set-session/route.ts` Session set endpoint

### Onboarding
- `/onboarding` Redirect
- `/onboarding/welcome` 3-slide carousel (🟢 prod)
- `/onboarding/causes` İlgi alanı seçimi (🟡 localStorage)
- `/onboarding/city` Şehir + yarıçap (🟡 localStorage)
- ~~`/onboarding/quiz`~~ (kaldırıldı 2026-04-19)

### Dashboard — Ana
- `/dashboard` Ana ekran (🟢 prod)
- `/dashboard/discover` Blog + kategoriler + sponsorlar (🟡 beta)
- `/dashboard/missions` Görev listesi + filter (🟢 prod)
- `/dashboard/missions/[id]` Görev detayı + katıl (🟢 prod)
- `/dashboard/missions/[id]/complete` QR/kod doğrulama + karma (🟢 prod)
- `/dashboard/my-missions` Aktif/tamamlanan (🟢 prod, 2026-04-19 gerçek veri)

### Dashboard — İyilik Öncüleri (NGO)
- `/dashboard/ngos` Liste + search (🟢 prod)
- `/dashboard/ngos/[id]` NGO profili + üyelik (🟢 prod)
- `/dashboard/ngos/[id]/membership` Parametrik form + KVKK (🟢 prod)
- `/dashboard/ngos/[id]/membership/success` Konfeti + pending/active (🟢 prod)

### Dashboard — Blog
- `/dashboard/posts/[id]` Post detayı + like + CTA (🟢 prod)

### Dashboard — Bağış (**TAMAMEN MOCK — 4 sayfa**)
- `/dashboard/donations/[id]` Kampanya detayı (🔴 mock)
- `/dashboard/donations/[id]/amount` Tutar seç (🔴 mock)
- `/dashboard/donations/[id]/review` Özet (🔴 mock)
- `/dashboard/donations/[id]/thanks` Teşekkürler (🔴 mock)

### Dashboard — Profil
- `/dashboard/profile` Profil (🟢 prod)
- `/dashboard/profile/edit` Düzenle (🟢 prod)
- `/dashboard/profile/badges` Rozet (🟢 prod, 2026-04-19 yeni tema)
- `/dashboard/profile/interests` İlgi alanı (🟢 prod, 2026-04-19 fix)

### Dashboard — Ödüller
- `/dashboard/rewards` Liste
- `/dashboard/rewards/[id]` Detay + redeem

### Dashboard — Diğer
- `/dashboard/saved` Kayıtlı görevler (🟡 beta)
- `/dashboard/leaderboard` Top 20 + kullanıcı rank (🟢 prod)
- `/dashboard/notifications` Aktivite feed (🟢 prod)
- `/dashboard/streak` Haftalık dots + milestone (🟢 prod)
- `/dashboard/tiers` Seviye listesi

### Admin
- `/admin/login` Cookie-based basit login (🟢 prod)
- `/admin/missions` Görev listesi (🟢 prod, UI 5/10)
- `/admin/missions/[id]/qr` QR generator (🟢 prod)

### Deprecated
- ~~`/tesekkurler`~~ kaldırıldı.

---

## 4. Veri modeli (Supabase)

8 migration var. Tablolar ve amaçları:

| Tablo | Amaç | RLS |
|---|---|---|
| `profiles` | Auth user extend; karma_total, level, streak, current_streak, longest_streak, interests[], city, search_radius, age_range, avatar_type enum (cat/dog/fox/robot/party). `auth.users`'tan trigger ile oluşuyor. | Kullanıcı kendi kaydını görür/günceller. |
| `ngos` | STK verileri (id **text**). membership_enabled, membership_form_fields (jsonb), tier akışı. | Herkes görebilir. |
| `missions` | Görev (id **text**). ngo FK, domain enum (nature/education/social/financial), difficulty enum (easy/medium/hard), verify_method enum (auto/code/photo/qr), karma, spots_left, impact_statement. | Active=true olanları herkes görebilir. |
| `rewards` | Marka ödülleri (id **text**), karma_required. | Active=true olanları herkes görebilir. |
| `user_missions` | Kullanıcı × görev ilişkisi. status enum (taken/completed). `unique(user_id, mission_id)`. | Kullanıcı kendininkini CRUD. |
| `karma_transactions` | Karma kazanım/harcama log. type enum (mission_complete/reward_redemption). **Trigger** otomatik `profiles.karma_total`'ı günceller. | Kullanıcı kendisinin transaction'larını görür + insert edebilir. |
| `reward_redemptions` | Ödül talep. status enum (pending/completed). | Kullanıcı kendisininkini görür + insert eder. |
| `user_saved_missions` | Kaydedilenler. | Kullanıcı kendisininkini CRUD. |
| `user_ngo_subscriptions` | NGO takip (fan). | Kullanıcı kendi subs'ı. |
| `ngo_memberships` | NGO resmi üyelik. status enum (pending/active/rejected/expired/cancelled), tier enum (free/basic/premium), form_data jsonb, expires_at. | Kullanıcı kendi membership'i. |
| `posts` | Blog — ngo_id FK, category enum (article/update/story/tip), read_time, published. | Yayınlanmışı herkes görür. |
| `post_likes` | Like tablo. | Kullanıcı kendi like'ları. |
| `waitlist` | E-posta toplama (landing'den gelen). | Insert public. |
| `support_requests` | Destek formu. | Insert public. |

**Kritik detay:** `profiles.id` UUID (auth.users ile bağlı), ama `ngos.id`, `missions.id`, `rewards.id`, `posts.ngo_id` **TEXT**. Kod bunu kullanıyor. Yeni tablo açarken aynı pattern'i bozma.

**Karma ekonomisi hâlâ mock:** `lib/mock-data.ts` içinde; kazanım oranları (50–300 görev, üyelik bonusu, onboarding 100) design-system HANDOFF.md'de demo olarak geçiyor. **Ürün kararı bekliyor** (Q1 NSM ile birlikte).

**Tarih-saat:** `timestamptz` kullanılır. Client `tr-TR` locale.

---

## 5. Auth akışı

**Middleware (`middleware.ts`):**
- `/admin/*` → cookie `iyibiri_admin` karşı `ADMIN_SECRET` env. Yoksa `/admin/login`'e redirect.
- `/dashboard/*` → Supabase user yoksa `/auth/login`.
- `/auth/*` (callback hariç) → user varsa `/dashboard`.

**OAuth:** Web için `@supabase/ssr` + cookies. Mobile için `@capgo/capacitor-social-login` + `lib/auth/oauth-native.ts`. İki yolun kod ayrımı var; native tarafta 2026-04-18 fix planı uygulanmış (`docs/superpowers/plans/2026-04-18-native-oauth-fix.md`).

**Email/Password:** Supabase native, 6-digit OTP verify. KVKK checkbox + password strength signup'ta zorunlu.

**Admin:** Tamamen Supabase'ten bağımsız, cookie-based. Tek sır: `ADMIN_SECRET` env. Upgrade adayı.

**Bilinen boşluk:** "Şifremi unuttum" akışı yok (signin'de ölü link).

---

## 6. Design system (GERÇEK — kod-tarafı)

> **Uyarı:** `design-system/README.md` eski palet (amber #F4B942 + navy #1B3A5C + impact #2D9E5A) diyor. **Kod bu değil.** Aşağısı tailwind.config.ts + globals.css'in gerçeği — tema "Premium × Warm" olarak evrilmiş. Yeni tasarım/kod kararı alırken **aşağıdaki değerleri** kullan.

### Renk sistemi (ana paleti)

**Ink (koyu tonlar) — text ve dark surface:**
- `ink` default: `#1A1612` (en koyu)
- `ink-900` `#24201B`, `ink-800` `#2E2923`, `ink-700` `#36302A`, `ink-600` `#3F3830`
- `ink-500` `#574E42`, `ink-400` `#7A6F5E`, `ink-300` `#A89E8A`
- `ink-200` `#CEC5B2`, `ink-100` `#E6DEC9`

**Cream:** `#F4EEDF` — ana light-mode bg.

**Gold (primary, Karma/CTA):**
- `gold` default: `#E8C268`
- `gold-dim` `#B58F3D`
- `primary-light` `#FDE68A` (legacy alias)
- `primary-foreground` `#24201B`

**Clay (secondary accent, uyarı):** `#C8553D`.
**Success (impact, positive):** `#6B8E4E`.
**Danger:** `#EF4444`.

**Domain renkleri (mission kategorileri):**
- nature: `#10B981`, education: `#3B82F6`, social: `#F43F5E`
- financial: `#F59E0B`, animals: `#F97316`, culture: `#A855F7`

**Legacy aliases (korunuyor, CSS-var backed):**
- primary default = gold default
- trust (HSL 214 52% 23% ≈ navy) — eski README'nin navy'si; burada yaşıyor
- impact (HSL 145 57% 40%) — eski yeşil; yaşıyor

### Tipografi (GERÇEK)

- **Display:** `Fraunces` (Google Font, serif, italic support) → `--font-display` → `font-display` utility.
- **Sans:** `Plus Jakarta Sans` → `--font-sans` → default body.

**README Inter diyor — yanlış. Kod Fraunces + Jakarta.** UI/UX agent'ları Fraunces'ı display için kullanır.

### Border radius (cömert, yumuşak)

```
sm: 10px   md: 12px   lg: 16px   xl: 20px   2xl: 24px   3xl: 32px   pill: full
```

Varsayılan radius `1rem` (16px). Çerçeve ≥ 16, hero 24–32.

### Spacing scale (CSS var)

```
--space-1: 4   2: 8   3: 12   4: 16   5: 20   6: 24   7: 32   8: 40   9: 48   10: 64
```

### Mode

- **Light mode:** Landing, auth, onboarding. Cream bg `#F4EEDF`, ink foreground.
- **Dark mode (`.dark` class):** Dashboard. Koyu kahve-siyah bg, cream foreground. Dashboard layout şu anda `ThemeProvider initial="light"` — ama CSS-var'lar dark için set, yani `.dark` sınıfının ne zaman açıldığı `lib/theme.tsx`'te incelenmeli (open question — UI designer'ın ilk audit'i).

### Motion

**Framer Motion defaults (HANDOFF'a göre, kodda yaygın kullanım):**
- Spring: `{type:'spring', stiffness:400, damping:30}`
- Tap: `whileTap={{scale: 0.93–0.97}}`
- Entry: `initial={{opacity:0, y:16}} animate={{opacity:1, y:0}}`, stagger `i*0.05`

**CSS animasyonlar (globals.css):**
- `animate-fade-in` (150ms), `slide-up` (300ms), `bounce-sm` (400ms), `pulse-slow` (3s infinite)
- Marquee (landing), `mockup-*` (hero mockup staggered)
- **Tümü `@media (prefers-reduced-motion: reduce)` ile devre dışı bırakılmış.** Erişilebilirlik disiplini var.

### Arkaplan ve gölge

- Cream light / ink-800 dark. Desen yok, grain yok.
- Gölge sistemi: hero glow `shadow-[0_8px_32px_rgba(251,146,60,0.35)]` turuncu (gold tonlu) — İyiBiri imza gölge.
- Normal kart: `shadow-md` (0 4px 24px rgba(0,0,0,0.08)).

### Mobile özel utility

- `.pb-safe` / `.pt-safe` / `.safe-area-inset` — `env(safe-area-inset-*)`.
- `.scrollbar-hide` — webkit + firefox.
- `html { overflow-x: hidden }`, `body { overscroll-behavior: none }` — yatay kaydırma ve bounce yasak.
- `button, a, [role=button]` → `-webkit-tap-highlight-color: transparent`, `user-select: none`.

### Metadata & tema rengi

- Theme color: `#E8C268` (gold) — mobile browser chrome.
- Apple web app capable, `black-translucent` status bar.
- `lang="tr"`, locale `tr_TR`.
- OG: `/og-image.png` (1200×630).

---

## 7. Component envanteri

### `components/ui/` (design system atomları)

`badge`, `brand-logo`, `button`, `card`, `celebration-overlay`, `domain-icon`, `empty-state`, `input`, `karma-counter`, `label`, `mission-card`, `progress`, `qr-scanner`, `separator`, `skeleton`, `streak-flame`, `tier-badge`, `xp-bar`. Ayrıca `ds/` alt klasörü (yeni tema parçaları).

### `components/` (özel)

`auth-feedback`, `bottom-nav`, `logo`, ~~`mission-card`~~ (2026-04-24 retire — deprecated shim re-export eden `components/ui/mission-card`'a; kanonik karar D4), `onboarding-redirect`, `waitlist-form`, ~~`xp-bar`~~ (2026-04-24 retire — deprecated shim; `components/ui/xp-bar` kanonik).

**`components/dashboard/`** (2026-04-24 yeni) — ana dashboard composition component'leri:
- `hero-card-v2.tsx` — gold glow breathing + KarmaCounter count-up + seviye progress + streak chip + empty state variant. UX audit + UI spec dashboard-ana-v2 implementasyonu.
- `daily-mission-card.tsx` — featured "günün görevi" (Things 3 focal point + Duolingo daily goal pattern).

### `lib/`

- `auth/oauth-native.ts` — Capacitor OAuth wrapper.
- `supabase/client.ts`, `server.ts`, `types.ts`, `queries/` — SSR hattı + tipler.
- `theme.tsx` — ThemeProvider (dark/light state — davranışı UI designer'ın okuması lazım).
- `mock-data.ts` — içerik tonu örnekleri + karma oranları (demo).
- `utils.ts` — `cn` helper (tailwind-merge).

**Kanonik karar:** Yeni UI component → `components/ui/` altına. `components/` altı özel composition içindir.

---

## 8. Mobile (Capacitor)

```
appId: com.iyibiri.app   |   scheme: iyibiri   |   server.url: https://www.iyibiri.app/app-start
webDir: out              |   cleartext: false  |   iOS contentInset: never
```

**Anlamı:**
- App, üretimde web URL'sinden yüklenir (yarı-hybrid). Geliştirme sırasında local build için `server.url` kaldırılmalı.
- `contentInset: never` → iOS WebView tam ekran; safe-area JS/CSS tarafında ele alınır (`pb-safe`, `pt-safe`).
- Android `allowMixedContent: false` → HTTPS zorunlu.

**Native auth:** `@capgo/capacitor-social-login` → Google + Apple. `lib/auth/oauth-native.ts` Supabase session'a bridge.

**PWA:** `manifest.json` var, Apple touch icon, favicon. Push bildirim **yok** (open question — Capacitor Push eklentisi gerekir).

**Build:** `next build` → `out/` (ama package.json'da `export` script yok; webDir `out` olduğundan Capacitor için `next export` veya eşdeğeri bir step eklenmeli — **open question**).

---

## 9. Aktif planlar (superpowers klasörü)

`docs/superpowers/plans/` altında 19 plan. İlgili agent'lar kendi işine başlarken buradan taramalı.

Özet liste:
- `2026-04-17` serisi: content-discovery, core-ui-improvements, db-seed (01), design-system (02), auth-profile (03), dashboard-missions (04), verification (05), rewards (06), backoffice (07), ui-redesign, rewards-redesign.
- `2026-04-18`: appv2-phase2, appv2-pixel-faithful, design-system-phase1, native-oauth-fix, onboarding-visual-upgrade.
- `2026-04-19`: onboarding-redesign, stk-membership.
- `2026-04-20`: dashboard-redesign.

Spec'ler (daha resmi): `docs/superpowers/specs/`.

**Not:** Bu planlar tek-kişi çalışma notları tonunda, zaman zaman overlapping. Yeni workstream çıkarırken (product-analyst'in işi) bunlardan "hâlâ geçerli olan" + "kapanmış olan" ayrımı gerek. Bu audit açık.

---

## 10. Bilinen teknik borç ve mock alanlar

`docs/page-audit.md` otorite kaynak; atlasta özet:

**Sistemik:**
- Hiçbir sayfada `loading.tsx` yok.
- 4 sayfalık bağış akışı tamamen mock; ödeme sağlayıcı seçilmemiş (Q2 açık karar).
- "Şifremi unuttum" akışı yok (signin'de ölü link).

**Tasarım uyuşmazlığı:**
- ~~`design-system/README.md` eski palet + font~~ → **2026-04-24 güncellendi:** README üstüne **OUTDATED banner** eklendi, atlas Bölüm 6'ya yönlendiriyor. Tam güncelleme/retire ileriki tur. design-system-keeper sorumluluğunda.

**Mock data:**
- `lib/mock-data.ts` — karma oranları, örnek görevler, rozet kuralları. Prod'a taşırken karma ekonomisi kararı alınmalı.

**Eksik state'ler:**
- Boş state'ler: ilk kullanıcı, bildirim yok, arkadaş yok — tasarım yok (HANDOFF'a göre).
- Error state'ler: ağ yok, ödeme reddedildi, görev dolu, konum kapalı — tasarım yok.
- Görev iptal akışı: UX yok.
- Arkadaş sistemi: leaderboard'da tab var ama akış yok.
- Karma detay log (profil'de): yok.
- Paylaşım kartı template'i: yok.
- Push bildirim altyapısı ve copy: yok.

**Açık sorular (kritik karar kuyruğundan — `docs/product/04-questions/open.md`):**
- Q1 🔴 North-star metrik
- Q2 🔴 Ödeme sağlayıcı
- Q3 🟡 Bağış V1 mi post-launch mı
- Q4 🟡 Pilot şehir
- Q5 🟢 Light mode

---

## 11. Konvansiyonlar

**Dil:** Her şey Türkçe, "sen" dili. Marka isimleri (Starbucks, Migros) orijinal. İngilizce teknik terim sadece kodda (variable adı vs.).

**Dosya adlandırma:**
- Route page: Next.js App Router convention (`page.tsx`, `layout.tsx`).
- Component: kebab-case `.tsx`. Özel composition component'ler `components/`, atom'lar `components/ui/`.
- Migration: `NNN_konu.sql` (3 haneli sıralı).
- Seed script: `scripts/seed-*.js|ts`.
- Plan: `docs/superpowers/plans/YYYY-MM-DD-konu.md`.
- Agent memo: `docs/[agent]/[bölüm]/YYYY-MM-DD-konu.md`.

**Commit mesajı (öneri — henüz zorunlu değil):**
- Agent prefix: `[strategy]`, `[analyst]`, `[ux]`, `[ui]`, `[fe]`, `[be]`, `[mobile]`, `[payments]`, `[admin]`, `[content]`, `[qa]`.
- Kısa başlık + gerekirse body.

**Git hijyeni:** Tek ana branch. Küçük, sık commit önerilir. Kod-dokunan agent'lar gelecekte worktree'de koşabilir (monitoring mimarisi).

**i18n:** TR-only şu an. Gelecekte EN eklenirse `next-intl` veya benzeri katman; `lang="tr"` layout'ta sabit.

**Mobile-first:** `max-w-lg mx-auto` (≈512px) dashboard container; landing `max-w-6xl mx-auto`. Bottom-nav fixed + safe-area. Padding-x 16 mobile, 24 landing.

**Accessibility:**
- `prefers-reduced-motion` sayılır (zaten kodda).
- Kontrast: cream (F4EEDF) × ink (1A1612) yüksek; gold (E8C268) × ink-800 dikkatli kontrol — UI designer'ın a11y audit'i.
- WCAG AA hedef.

**Test:** Şu an yok. `release-manager` (Faz 4) kurulunca lint + build + migration dry-run ritüeli.

---

## 12. Agent yazma sınırları (kim nereye dokunur)

Çakışmayı önlemek için:

| Alan | Yazabilen agent'lar | Notlar |
|---|---|---|
| `docs/strategy/**` | strategy-consultant | Tek sahip. |
| `docs/product/**` + `docs/agents-dashboard.md` (append) | product-analyst | `agents-dashboard.md`'ye her agent **append** yapar. |
| `docs/ux/**` | ux-researcher | Tek sahip. |
| `docs/ui/**` | ui-designer | Tek sahip. |
| `docs/project-atlas.md` | tümü (Edit) | Gerçekle ayrışma bulunca güncellenir. |
| `docs/page-audit.md` | qa-auditor (Faz 4) | Canlı tutmak rolü. Şimdilik analist okuyup, değişikliğe ihtiyaç duyduğunda işaretler. |
| `docs/superpowers/**` | okumak serbest, yazmak yasak | Eski planların arşivi. |
| `app/`, `components/`, `lib/`, `public/`, `middleware.ts` | frontend-engineer (varsayılan), ilgili uzman (auth-capacitor, payments-integrator, admin-tools, landing-growth) | Faz 2+ kurulacak. |
| `components/ui/` + `design-system/` | design-system-keeper (Faz 2) | Tek sahip. |
| `supabase/migrations/`, `lib/supabase/`, `scripts/seed-*` | supabase-backend (Faz 2) | Tek sahip. |
| `android/`, `ios/`, `capacitor.config.ts` | mobile-capacitor (Faz 3) | Tek sahip. |

Discovery agent'ları (strategy/product/ux/ui) kod dosyalarını **okur, yazmaz**. Eylem çıkarken brief'i kodlama agent'ına devreder.

---

## 13. Her agent için "atlas'ta nereye bakmalısın?" (hızlı rehber)

**strategy-consultant:**
- Bölüm 1 (kimlik, pozisyon), 10 (teknik borç / açık kararlar), 11 (konvansiyonlar).

**product-analyst:**
- Bölüm 3 (rota), 4 (veri modeli), 7 (component), 9 (aktif planlar), 10 (borç), 12 (sınırlar).

**ux-researcher:**
- Bölüm 1 (kimlik, hedef kullanıcı), 3 (rota — kullanıcı akışları), 6 (design-system ton), 10 (eksik state'ler, a11y), 11 (a11y / i18n konvansiyonu).

**ui-designer:**
- Bölüm 6 (design system gerçek), 7 (component envanteri), 10 (tasarım uyuşmazlığı uyarısı), 11 (a11y), 8 (mobile safe area).

**frontend-engineer:**
- Bölüm 2 (stek), 3 (rota), 7 (component envanteri), 11 (konvansiyon), 12 (sınır).

Dar, odaklı okumak şart — atlas tamamı her seferinde baştan sona okunmasın.

---

## 14. Bakım kuralı

Bir agent üründe bir değişiklik yaptığında (örn. bir sayfa durumu mock'tan prod'a geçti, bir component eklendi, bir renk değişti), **işi bitirmeden önce** atlas'ın ilgili bölümünü Edit eder. Değişiklik oktavından büyükse (örn. yeni bir gelir kolu, yeni bir ana sayfa), atlas'a yeni bir alt-bölüm açılabilir.

Güncellik denetimi ileride `qa-auditor`'ın haftalık rutininde.

Son söz: Atlas "gerçeğin" aynasıdır; süsleme değil. Yalan yazmayın, eskidi olanı işaretleyin.
