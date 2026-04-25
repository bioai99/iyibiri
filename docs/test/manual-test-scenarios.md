# İyiBiri Manual Test Scenarios

> **Sahibi:** test-engineer agent
> **Konum:** `docs/test/manual-test-scenarios.md`
> **Son güncelleme:** 2026-04-26
> **Bağlantılı:** `.claude/agents/test-engineer.md`, `docs/test/_playbook.md`

---

## Özet

| Kategori | Flow ID Aralığı | Sayı |
|----------|-----------------|------|
| Auth | A1–A6 | 6 |
| Onboarding | O1–O4 | 4 |
| Dashboard | D1 | 1 |
| Mission | M1–M6 | 6 |
| NGO | N1–N3 | 3 |
| Browse | B1–B3 | 3 |
| Gamification | G1–G4 | 4 |
| Rewards | R1–R2 | 2 |
| Profile | P1–P3 | 3 |
| Content | C1–C4 | 4 |
| Donation | DN1 | 1 |
| Admin | AD1–AD3 | 3 |
| Navigation + State | NV1–NV2 | 2 |
| **Cross-cutting** | XC1–XC8 | 8 |
| **Toplam** | | **50** |

**Faz dağılımı:**
- **Faz 1 (P0 critical):** A2, A3, O1, O2, D1, M1, M2, G3, NV1 (9 flow)
- **Faz 2 (P1 secondary):** A1, A4, A5, A6, O3, O4, M3, M4, M5, M6, N1, N2, N3, B1, B2, B3, G1, G2, G4, R1, R2, P1, P2, P3, C1, C2, C3, C4, DN1 (29 flow)
- **Faz 3 (P2 edge):** AD1, AD2, AD3, NV2, XC1–XC8 (12 flow)

---

## Kritik Akışlar — Faz 1 (P0)

### A2 — Signup yeni kullanıcı

**Prerequisite:** DB reset, hiçbir kullanıcı yok.
**Fixture:** N/A (yeni hesap oluşturulur)
**Route:** `/auth/signup`

**Steps:**
1. `/auth/signup` aç → form görünür (email, şifre, KVKK checkbox)
2. Geçerli email + 8+ karakter şifre + KVKK işaretle → "Kayıt ol" tap
3. → `/auth/verify` redirect (email gönderildi)
4. Test inbox'tan 6-haneli OTP al (Supabase magic link veya OTP)
5. OTP gir → "Doğrula" tap
6. → `/onboarding/welcome` redirect

**Expected DB state:**
- `auth.users` tablosunda yeni kayıt (`email_confirmed_at` doldu)
- `profiles` tablosunda satır var, `onboarding_completed=false`, `karma=0`

**Expected UI:**
- Hatasız submit, loading state 200-1500ms
- KVKK işaretli değilse submit disable
- Şifre strength meter gold renkte gösterim

**Edge cases:**
- Aynı email tekrar → "Bu email zaten kayıtlı"
- Şifre <8 karakter → submit disable + label "En az 8 karakter"
- KVKK işaretsiz → submit disable
- OTP yanlış → "Kod hatalı, tekrar dene"
- OTP süresi dolmuş → "Yeni kod gönder" tap → yeni 6 hane

---

### A3 — Verify OTP

**Prerequisite:** A2 step 3 tamamlandı.
**Route:** `/auth/verify`

**Steps:**
1. 6-haneli input görünür (her karakter ayrı kutuya)
2. OTP otomatik paste support (clipboard'dan 6 haneli sayı)
3. Tüm kutular dolduğunda otomatik submit
4. Countdown timer görünür ("60 saniye sonra yeniden gönder")
5. "Yeniden gönder" disable iken counter say
6. Counter 0'da enable, tap → yeni OTP

**Expected DB state:**
- `auth.users.email_confirmed_at` güncellenir

**Edge cases:**
- 5 yanlış deneme → rate limit ("Çok fazla deneme, 5 dakika bekle")
- Network kesik iken OTP gir → loading sonsuz → timeout error
- Bir kutuya 2 hane paste → split mi tek kutu mu

---

### O1 — Onboarding welcome

**Prerequisite:** A3 başarılı VEYA `profiles.onboarding_completed=false` user login.
**Route:** `/onboarding/welcome`

**Steps:**
1. Welcome animasyonu (butterfly + Fraunces tagline)
2. "Başla" CTA tap
3. → `/onboarding/causes`

**Expected UI:**
- 1.4s ceremony stagger (butterfly + text)
- `useReducedMotion` aktif ise stagger yok, instant render

---

### O2 — Onboarding causes + city + age

**Prerequisite:** O1 tamamlandı.
**Routes:** `/onboarding/causes` → `/onboarding/city` → `/onboarding/age`

**Steps (causes):**
1. 6 cause chip görünür (nature, education, social, financial, animals, culture)
2. En az 1 chip seç → "Devam" enable
3. Tap → `/onboarding/city`

**Steps (city):**
1. TR şehir search/picker
2. Şehir seç → "Devam" tap → `/onboarding/age`

**Steps (age):**
1. Doğum yılı picker (1940-2010)
2. Seç → "Bitir" tap → `/dashboard`

**Expected DB state:**
- `profiles.interests = ['nature', 'social']` (seçilenler)
- `profiles.city = 'İstanbul'`
- `profiles.birth_year = 1990`
- `profiles.onboarding_completed = true`

**Edge cases:**
- Hiçbir cause seçmeden devam → button disable
- Şehir search'te Türkçe karakter (`İstanbul` vs `istanbul`) — locale bug riski
- Geri tuşu → bir önceki step (state korundu mu)

---

### D1 — Dashboard ilk render

**Prerequisite:** O2 tamamlandı veya `user-fresh` fixture login.
**Route:** `/dashboard`

**Steps:**
1. Page load → loading skeleton görünür (theme-aware)
2. ~500ms içinde data gelir → hero karma kart + carousel + grid render
3. Hero kart: "0 Karma" + butterfly (120px) + "İyi Biri" tier + progress bar (%0/500) + "→ İyi Yürekli"
4. Streak chip görünmez (streak=0)
5. Empty CTA görünür ("İlk görevini tamamla →") gold inline link
6. Carousel ("BUGÜN SENİN İÇİN") 3 mission kartı, scroll-snap çalışır, dot indicator scroll'a senkron
7. Tabs ("Senin için" active / "Katıldıkların") "Senin için seçtik" h2 yanında
8. Grid altta 2-5 mission kartı, ambient breath shadow

**Expected DB state:**
- Pull `missions` table → 8+ active mission
- Reco scoring sonrası top 5: hero(3) + grid(2) split
- Diversity rule: ardışık 2 kart aynı domain değil

**Expected UI:**
- Light + dark her ikisinde page bg/card bg/elevated bg net farklı (3-katman)
- Karma rakamı `c.gold` (light: bronz, dark: parlak gold)
- Progress bar `c.ink600` track + `c.gold` fill + inset glow
- Butterfly arkasında subtle radial halo

**Edge cases:**
- 0 mission durumu → carousel render olmamalı, grid empty state preset
- Network slow 3G → skeleton 2-3 saniye görünür ama loading state stable
- Tema toggle ortada → instant switch, hiçbir orphan dark color
- Reduced motion → carousel auto-rotate yok, ambient breath yok

---

### M1 — Mission detail görüntüleme

**Prerequisite:** D1 başarılı, en az 1 mission var.
**Route:** `/dashboard/missions/[id]`

**Steps:**
1. Carousel'dan veya grid'den bir kart tap
2. → Mission detail aç
3. Hero photo (3/2 ratio) görünür, üst soft gradient
4. Image altında solid panel: kategori chip + h1 başlık (28px serif)
5. NGO satırı (logo + isim + "Takip et" outline button)
6. NGO üyesi badge (varsa)
7. 4 meta kartı 2×2: Tarih, Süre, Konum, Kontenjan
8. "BU GÖREVİN ETKİSİ" başlık + impact statement italic + body description
9. CTA "Bu göreve katıl" (gold) bottom sticky, safe-area saygılı
10. Bottom nav görünmez veya overlay (sticky CTA üstte)

**Expected DB state:**
- `missions.status = 'active'` veya `'featured'`
- `user_missions` tablosunda kullanıcının bu mission için kaydı YOK

**Expected UI:**
- Light + dark parity (özellikle "BU GÖREVİN ETKİSİ" gold accent her ikisinde okunur)
- Hero üstte sol-üst back button + sağ-üst share + favorite icon (frosted glass)
- Kategori chip dolu (`mission.category ?? mission.domain`, ikisi de yoksa render etme)
- "TARIH: Esnek" yerine "Sen seç"
- "KONTENJAN: 999 yer" yerine "Sınırsız"
- Bottom safe-area: `paddingBottom: calc(120px + env(safe-area-inset-bottom))`

**Edge cases:**
- `mission.photo_url` null → fallback gradient + emoji
- Çok uzun başlık (60+ karakter) → wrap düzgün, ellipsis yok
- `mission.impact_statement` null → "BU GÖREVİN ETKİSİ" başlık görünmesin
- Üye-only mission + kullanıcı üye değil → "Önce STK üyesi ol" CTA

---

### M2 — Mission take + applied state

**Prerequisite:** M1 görüntülendi, kullanıcı katılmamış.
**Route:** `/dashboard/missions/[id]` → state machine

**Steps:**
1. "Bu göreve katıl" tap
2. Optimistic UI: button "Başvuruluyor..." spinner (200ms)
3. Backend POST → 200 OK
4. Page state değişir → "Başvurun alındı" status card
5. NGO 24 saat içinde yanıtlayacak mesajı
6. "SIRADA NE VAR" timeline:
   - Step 1 (gold) — NGO onayı
   - Step 2 (outline) — Hazırlık SMS'i
   - Step 3 (outline) — Görev günü check-in
7. Bottom: "Katılımı iptal et" outline button (default state)

**Expected DB state:**
- `user_missions` tablosunda yeni satır: `(user_id, mission_id, status='taken', taken_at=now())`
- `missions.spots_taken` artar (eğer trigger varsa)

**Expected UI:**
- Status card: bg `c.ink800` (theme-aware), title `c.cream` (light=koyu, dark=açık), subtitle `c.ink300`
- Timeline step daireleri: 32px + 1.5px border + `c.ink300` rakam
- "Katılımı iptal et" button hover'da `c.danger` border + text

**Edge cases:**
- Aynı butona 5 kere hızlı tap → idempotent, tek satır insert
- Network kesik → optimistic state revert, "Tekrar dene" toast
- Already taken → button disable, applied state direkt
- 500 error → toast "Bir şeyler ters gitti, tekrar dene"

---

### G3 — Karma kazanma + leaderboard güncellemesi

**Prerequisite:** M2 başarılı + mission completed (manual trigger veya QR scan).
**Routes:** `/dashboard/missions/[id]/complete`, `/dashboard`, `/dashboard/leaderboard`

**Steps:**
1. Mission complete trigger (QR veya admin verify)
2. Celebration sayfası: konfeti + karma count-up animation (0 → karma_amount, 0.8s)
3. "Devam" tap → `/dashboard`
4. Hero karma kart: yeni karma değeri görünür
5. Streak chip görünür (streak=1)
6. Empty CTA kalkar (karma > 0)
7. `/dashboard/leaderboard` → kullanıcı sıralamada görünür

**Expected DB state:**
- `user_missions.status = 'completed'`, `completed_at = now()`
- `karma_transactions` tablosunda yeni satır: `(user_id, amount=+70, reason='mission_completion', mission_id=xxx)`
- `profiles.karma` artar
- `profiles.current_streak` = 1

**Expected UI:**
- Count-up animation reduced-motion'da instant
- Konfeti reduced-motion'da yok
- Leaderboard refresh delay max 5 saniye (RLS view)

**Edge cases:**
- Tier sınırı geçildi mi (örn. 480 → 550 = "İyi Yürekli" tier-up) → tier dot indicator advance + butterfly tier upgrade
- Streak 7. gün → milestone glow (gold pulse)
- Cross-screen consistency: dashboard karma = profile karma = leaderboard karma (3 ekranda aynı sayı)

---

### NV1 — Bottom nav + tab geçiş

**Prerequisite:** Dashboard yüklü.
**Routes:** All bottom nav routes

**Steps:**
1. Bottom nav: Anasayfa / Keşfet / Görevler / Ödüller / Profil
2. Her tab'a tıkla → ilgili route, active tab gold underline
3. Geri-ileri tarayıcı butonu → tab state korunur
4. Refresh ortada → tab state localStorage'dan restore

**Edge cases:**
- Capacitor native back gesture (Android) → previous tab veya app exit
- Notification deep link → ilgili tab'a direkt
- Service worker eski versiyon → "yeni sürüm var" banner

---

## Faz 2 — Secondary Flows (P1)

### A1 — Email/şifre login

**Route:** `/auth/signin`

**Steps:** Login form → submit → dashboard. Edge: yanlış şifre, "Şifremi unuttum" link aktif (A4).

### A4 — Şifremi unuttum

**Route:** `/auth/forgot-password`
**Steps:** Email gir → reset link gönder → email kontrol → reset URL → yeni şifre form → login.

### A5 — Şifre reset

**Route:** `/auth/reset-password?token=xxx`
**Steps:** Token validate → yeni şifre + confirm → submit → login.

### A6 — OAuth login (Google + Apple)

**Route:** `/auth/login`
**Steps:** Google/Apple button → provider redirect → callback → onboarding (yeni) veya dashboard (mevcut).

### O3 — Welcome celebration modal (post-onboarding)

**Route:** `/onboarding/city` (success modal)
**Steps:** City seç → modal açılır: orbital butterfly + KarmaCounterPro 0→100 + "İlk görevini gör" CTA.

### O4 — Onboarding skip / geri dönüş

**Steps:** Welcome → "Atla" link (varsa) → city skip → age skip → dashboard partial profile state.

### M3 — Mission abandon (taken state'den)

**Route:** `/dashboard/missions/[id]` (applied state)
**Steps:** "Katılımı iptal et" tap → confirm dialog → onaylanırsa `user_missions.status='cancelled'`.

### M4 — Mission complete via QR

**Route:** `/dashboard/missions/[id]/complete`
**Steps:** Camera permission → QR scan → token validate → karma kazan.

### M5 — Mission verify (admin tarafı)

**Route:** Admin paneli — mission verification list
**Steps:** Admin verify → user'a karma + notification.

### M6 — Mission state machine — tüm geçişler

**States:** `recommended → taken → checked_in → completed | cancelled | no_show`
**Test:** Her geçişin trigger'ını ve DB state'ini doğrula.

### N1 — NGO profil görüntüleme

**Route:** `/dashboard/ngos/[id]`
**Steps:** Profile load → cover + logo + name + description + missions list + members count.

### N2 — NGO membership flow

**Route:** `/dashboard/ngos/[id]/membership`
**Steps:** "Gönüllü ol" → 5-step form (ad/soyad → telefon → KVKK → ödeme placeholder → onay) → success.

### N3 — NGO membership success

**Route:** `/dashboard/ngos/[id]/membership/success`
**Steps:** Success modal → konfeti → "Üye oldun" → dashboard.

### B1 — Missions list + filter

**Route:** `/dashboard/missions`
**Steps:** Filter chip seç → list filter, search → debounce 300ms → results.

### B2 — Discover (kategori bazlı)

**Route:** `/dashboard/discover`
**Steps:** Kategori grid → bir kategoriye tap → list filtered.

### B3 — NGO list

**Route:** `/dashboard/ngos`
**Steps:** Search + filter + list scroll + lazy load.

### G1 — Tier progression

**Route:** `/dashboard/tiers`
**Steps:** 5 tier görünümü, mevcut tier highlighted, ilerleme görünür.

### G2 — Streak page

**Route:** `/dashboard/streak`
**Steps:** Streak takvim görünümü, milestone dotları, longest streak.

### G4 — Badges

**Route:** `/dashboard/profile/badges`
**Steps:** Badge collection grid, locked vs unlocked, hover descriptions.

### R1 — Rewards list

**Route:** `/dashboard/rewards`
**Steps:** Grid 2-col, karma yetersiz olanlar opacity-50, "yeterince karma yok" badge.

### R2 — Reward detail + redeem

**Route:** `/dashboard/rewards/[id]`
**Steps:** Detail → "Kullan" tap → karma düşer → kullanıldı state.

### P1 — Profile view

**Route:** `/dashboard/profile`
**Steps:** Avatar + name + tier + karma + streak + sections.

### P2 — Profile edit

**Route:** `/dashboard/profile/edit`
**Steps:** Form → değişiklik → kaydet → profile güncellenir.

### P3 — Interests edit

**Route:** `/dashboard/profile/interests`
**Steps:** Cause chip toggle → kaydet → reco engine refresh.

### C1 — Saved missions

**Route:** `/dashboard/saved`
**Steps:** Bookmark'ladığın mission'lar grid → tap → detail.

### C2 — My missions tabs

**Route:** `/dashboard/my-missions`
**Steps:** Aktif | Tamamlanan tab → her tab'da liste.

### C3 — Notifications

**Route:** `/dashboard/notifications`
**Steps:** Notification list → tap → ilgili sayfaya deep link.

### C4 — Blog post detail

**Route:** `/dashboard/posts/[id]`
**Steps:** Cover + title + body markdown render + author + tarih.

### DN1 — Donation flow (mock)

**Route:** `/dashboard/donations/*`
**Steps:** Coming-soon banner şu an, V1.1'de payment provider entegrasyonu.

---

## Faz 3 — Edge & Polish (P2)

### AD1 — Admin login

**Route:** `/admin/login`
**Steps:** STK admin email/şifre → admin dashboard.

### AD2 — Admin dashboard + missions

**Route:** `/admin/[ngoId]/dashboard`, `/admin/[ngoId]/missions`
**Steps:** Metrics + missions list + new mission form + verifications.

### AD3 — Admin QR

**Route:** `/admin/[ngoId]/missions/[id]/qr`
**Steps:** QR generate → static URL → user scan.

### NV2 — Deep linking

**Steps:** Push notification veya URL paste → ilgili sayfaya direkt + auth gate çalışır.

---

### Cross-cutting concerns (XC1-XC8)

#### XC1 — Theme parity (Light + Dark)

**Test:** Her sayfada theme toggle + screenshot karşılaştırma. Orphan dark color tarama (light mode'da görünmeyen text).

**Pattern dikkat:** "Başvurun alındı" benzeri component'lerde hardcoded `c.ink900` text → light'ta okunmaz.

#### XC2 — Motion (reduced motion)

**Test:** OS-level `prefers-reduced-motion: reduce` aktif iken tüm animasyon'lar:
- Carousel auto-rotate yok
- Ambient breath yok
- Glow breathing yok
- Stagger yok (instant render)
- Count-up instant
- Konfeti yok

#### XC3 — Safe-area (iOS notch + bottom)

**Test:** iPhone 14 Pro emulator. Top `env(safe-area-inset-top)` + bottom nav `env(safe-area-inset-bottom)`. Sticky CTA + bottom nav çakışma kontrolü.

#### XC4 — Native interaction (Capacitor)

**Test (iOS + Android emulator):**
- Haptic on mission complete (heavy)
- Haptic on mission take (medium)
- Native share API
- Camera permission (QR scan)
- Push notification permission flow
- Native back gesture (Android)

#### XC5 — Empty states

**Test:** Her empty state'i tetikle (DB'yi manipule et veya filter):
- No missions
- No saved
- No completed
- No notifications
- No followed NGOs
- Search no results
- Reward karma yetersiz
- Leaderboard boş

Her empty state: SVG illustration + empatik TR copy + redemption path CTA.

#### XC6 — Optimistic UI

**Test:** Slow 3G ile mission take, save bookmark, NGO membership apply, reward redeem.
- Buton tap → 0ms içinde optimistic update
- Backend response gelene kadar disable
- Error → revert + toast

#### XC7 — Idempotency

**Test:** Aynı butona 5 kere hızlı tap (Playwright `page.click` × 5):
- Mission take → 1 satır insert
- Bookmark save → 1 satır insert (toggle ise net state)
- Membership apply → 1 başvuru
- Reward redeem → 1 kullanım, karma 1 kez düşer

#### XC8 — Error states

**Test:** Her error scenario:
- 500 server error → "Bir şeyler ters gitti" + Tekrar dene
- 401 unauthorized → login'e redirect
- 403 forbidden → "Bu işlem için yetkin yok"
- 404 not found → empty state veya "Sayfa bulunamadı"
- Network kesik → offline banner + retry queue (PWA)
- Timeout (15s+) → "Yanıt gelmedi, tekrar dene"

---

## TR-spesifik kontroller (her faz son pass'inde)

| # | Kontrol | Test |
|---|---------|------|
| TR1 | `İstanbul.toLowerCase()` bug'ı | Search'te `İstanbul` ve `istanbul` ikisi de aynı sonuç döndürmeli |
| TR2 | Uzun isim header taşması | "Bahadırcanoğlu Ayyıldızoğullarından" → header tek satır ellipsis veya wrap |
| TR3 | `ç/ğ/ı/ö/ş/ü` URL encode | NGO slug'larında Türkçe karakter → percent-encode + decode round-trip |
| TR4 | Number format | `1.234,56 TL` (point thousand, comma decimal) — karma + para tutarlı |
| TR5 | Date format | "25 Nisan 2026 Cumartesi" full / "25 Nis" kısa — context'e göre tutarlı |
| TR6 | Currency placement | `100 TL` standardı tüm ekranlarda |
| TR7 | Plural agreement | `1 görev / 2 görev / 0 görev` — TR'de hep tekil, ama "görevler" liste başlığı |

---

## PWA-spesifik kontroller (Faz 3)

| # | Kontrol | Test |
|---|---------|------|
| PWA1 | Install prompt | `beforeinstallprompt` yakalanır, custom UI gösterilir, reddedilirse 7 gün sessiz |
| PWA2 | Offline queue | Network kesik → mission take queue'ya, online'da flush |
| PWA3 | SW cache invalidation | Yeni deploy → "Yeni sürüm var" prompt + reload |
| PWA4 | Push permission | İlk anlamlı action sonrası ister (onboarding bitiminde değil) |
| PWA5 | Splash screen | Capacitor light/dark splash icon |
| PWA6 | Manifest icons | 192/512 maskable, add-to-home çalışır |

---

## Kullanım

Bu dosya test-engineer agent'ının kataloğu. Faz koşusu planı yazılırken:
1. Agent ilgili faz'ın flow ID'lerini bu listeden seçer
2. Her flow için step'leri Playwright spec'e çevirir
3. Expected DB state + UI state'i assertion olarak kullanır
4. Edge case'leri ekstra spec olarak ekler
5. Faz raporunda flow ID'leri referansla geçti/kaldı işaretler

Yeni flow eklemek istersen aynı format: ID + Prerequisite + Route + Steps (numbered) + Expected DB state + Expected UI + Edge cases.
