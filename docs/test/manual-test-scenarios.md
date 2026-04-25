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
| Admin (Backoffice) | AD1–AD15 | 15 |
| Navigation + State | NV1–NV2 | 2 |
| **Cross-cutting** | XC1–XC11 | 11 |
| **Toplam** | | **67** |

**Faz dağılımı:**
- **Faz 1 (P0 critical):** A2, A3, O1, O2, D1, M1, M2, G3, NV1, AD1, AD14 (11 flow — admin login + RLS security)
- **Faz 2 (P1 secondary):** A1, A4, A5, A6, O3, O4, M3, M4, M5, M6, N1, N2, N3, B1, B2, B3, G1, G2, G4, R1, R2, P1, P2, P3, C1, C2, C3, C4, DN1, AD2–AD13 (38 flow)
- **Faz 3 (P2 edge):** AD15, NV2, XC1–XC11 (13 flow)

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

## Admin Backoffice Scenarios (AD1–AD15)

### AD1 — Admin login (email + password)

**Prerequisite:** Fixture `admin@tema.dev` / `TemaAdmin2026!` (5 STK admin fixture).
**Fixture:** ngo-admin-tema
**Route:** `/admin/login`

**Steps:**
1. `/admin/login` aç → form (email + şifre + KVKK + "Giriş Yap" butonu)
2. Geçerli email + geçerli şifre → "Giriş Yap" tap
3. → `/admin/tema` redirect (dashboard)

**Expected DB state:**
- `auth.users` tablosunda `admin@tema.dev` kaydı (email_confirmed_at dolu)
- `ngo_admin_users` tablosunda `(user_id=xxx, ngo_id='tema', role='admin')` var

**Expected UI:**
- Başarılı giriş sonrası admin sidebar görünür (NGO logo + navigation)
- Hata mesajı ("Email veya şifre yanlış") 400ms animate

**Edge cases:**
- Yanlış şifre → "Email veya şifre yanlış" toast
- Geçersiz email → "Email gerekli" label
- Super-admin olmayan admin başka STK'ya girmek → 403 "Bu STK için yetkin yok"
- Hiç yetki olmayan user → 401 "Yetkin yok"

---

### AD2 — Admin dashboard overview (metrics + activity)

**Prerequisite:** AD1 başarılı; tema STK'da ≥1 mission, ≥2 member, ≥1 pending verification
**Route:** `/admin/tema`

**Steps:**
1. Login sonrası dashboard açılır
2. 4 metric card görünür: Karma (placeholder 250), Yeni Üye (count), Doğrulama (pending_review count), Trend (%)
3. "Son Aktiviteler" section → recent 5 missions listed
4. Bottom CTA: "+ Yeni Görev" + "Doğrulama Kuyruğu (N)"

**Expected DB state:**
- `ngo_memberships` WHERE ngo_id='tema' sayısı metric'te görünür
- `user_missions` WHERE missions.ngo_id='tema' AND admin_review_status='pending_review' sayısı doğru

**Expected UI:**
- 4 metric card loading skeleton → 300ms içinde render
- Metric trending arrow (up: +N% yeşil, down: -N% kırmızı)
- Empty state (0 aktivite) → "Henüz aktivite yok" illustration

**Edge cases:**
- Zero metrics → "0 Yeni Üye" vb. görünür
- 10+ recent activities → "Daha fazla" expansion
- Network slow (3G) → lazy-load metric queries

---

### AD3 — Missions list + filters

**Prerequisite:** tema STK'da ≥3 mission (active/draft/archived mix)
**Route:** `/admin/tema/missions`

**Steps:**
1. Missions listesi table'da (title, domain, karma, status, created_at)
2. Status filter chip'ler: All | Active | Draft | Archived
3. "Active" tap → sadece active missions gösterilir
4. Her mission'da edit + delete action button
5. "+ Yeni Görev" CTA top-right

**Expected DB state:**
- Table'daki mission count = missions WHERE ngo_id='tema' count
- Filter active → missions WHERE status='active' only

**Expected UI:**
- Table header sticky (scroll'da kalmaz)
- Boş state (0 missions) → "+ Yeni Görev" CTA prominent

**Edge cases:**
- Very long mission title → truncate + tooltip
- Türkçe karakter başlık (Ağaç Dikme → "Ağaç" vb.)
- 50+ missions → pagination (10 per page)

---

### AD4 — Create mission (form + image upload + KVKK + publish)

**Prerequisite:** AD1 login
**Route:** `/admin/tema/missions/new`

**Steps:**
1. Form açılır: Başlık* | Açıklama* | Kategori* (select) | Karma Puanı | Tarih | Yer | Görsel (upload) | Status (Draft/Active radio)
2. Başlık + Açıklama + Kategori doldur
3. "Görev Görseli" upload area → image file seç (JPG/PNG < 5MB)
4. Upload → preview thumbnail gösterilir (16:9 aspect, cropped)
5. Status "Yayında" radio tap
6. Aşağı KVKK checkbox (opsiyonel field ama şu an placeholder)
7. "Yayınla" button tap (submit)
8. → `/admin/tema/missions` redirect (success toast: "Görev oluşturuldu")

**Expected DB state:**
- `missions` tablosuna yeni row: (id=uuid, ngo_id='tema', title=input, description, domain, karma_points, status='active', image_url=storage_path)
- `ngo_assets` bucket'ında file: `tema/missions/{random}.jpg`

**Expected UI:**
- Image upload: drag-drop + click input support
- Loading: "Yükleniyor..." state 0-3s
- Error: "Dosya çok büyük (max 5MB)" veya "JPG/PNG gerekli"
- Success: thumbnail preview + "Düzenle" link

**Edge cases:**
- No image upload → fallback placeholder (system decides)
- Oversized file (>5MB) → "Dosya çok büyük"
- Corrupted file → "Dosya hasarlı, tekrar dene"
- Draft → "Taslak Kaydet" submit button text
- Çok uzun başlık (200 char limit) → "100 / 100 karakter" counter
- Network kesik upload ortasında → retry queue (PWA)
- Malicious mime type (e.g., .exe as .jpg) → server-side validation reject

---

### AD5 — Edit existing mission

**Prerequisite:** tema STK'da 1 published mission var (id='m123')
**Route:** `/admin/tema/missions/[id]/edit` (veya mission list'ten edit button)

**Steps:**
1. Mission list'te "m123" row → edit icon tap
2. Form pre-fill (başlık, açıklama, vb. mevcut değerlerle)
3. Açıklama field'ını uzatma → text update
4. Görsel replace: delete old + new upload
5. Status: Active → Draft radio (depublish)
6. "Kaydet" tap → `/admin/tema/missions` redirect + toast "Görev güncellendi"

**Expected DB state:**
- missions.description update
- missions.image_url update (old file cleanup?)
- missions.status = 'draft'

**Expected UI:**
- Form state loading (pre-fill optimistic)
- Dirty tracking: "Kaydet" button disabled until change
- Image: old thumbnail + "Değiştir" option

**Edge cases:**
- Stale data (başka admin concurrent edit) → conflict resolution UI
- Photo removal (delete upload) → fallback placeholder
- 100+ character açıklama → textarea scroll, no hard limit

---

### AD6 — Verifications (proof submissions, approve/reject)

**Prerequisite:** ≥2 user_missions.status='pending_review' waiting for tema STK admin
**Route:** `/admin/tema/verifications`

**Steps:**
1. Verification queue açılır: pending submission'lar list'lenen (user, mission, proof_type, proof_url, submitted_at)
2. İlk verification row tap → detail modal/drawer
3. Modal: user avatar + name | mission title | proof (photo/QR code/auto-verified) + admin notes textarea
4. "Onayla" button tap → status='verified', toast, list refresh
5. İkinci submission: "Reddet" tap + required reject reason → status='rejected', reason saved, toast

**Expected DB state:**
- user_missions.admin_review_status: 'pending_review' → 'verified' or 'rejected'
- user_missions.admin_feedback (reject reason, optional for approve)
- Approved → karma_transactions INSERT (user karma +20) + profiles.karma_total trigger

**Expected UI:**
- Proof display: photo full-screen, QR code scan-able, auto-verified ✓ badge
- Approve/Reject button state: disabled while API call
- Empty state (0 pending) → "Tüm doğrulamalar tamamlandı ✓"
- Recent approvals list below pending

**Edge cases:**
- Photo broken URL → "Kanıt yüklenemedi, user'dan yeniden iste"
- Duplicate approval (network retry) → idempotent (no double karma)
- Reject without reason → toast "Neden gerekli"
- User deleted after submission → profile fallback (archived view)

---

### AD7 — Members list (membership management, status, tier)

**Prerequisite:** tema STK'da ≥5 ngo_memberships (mix: active, pending, expired)
**Route:** `/admin/tema/members`

**Steps:**
1. Members table açılır: user name | status (badge: pending/active/expired) | tier (free/basic/premium) | joined_at | expires_at | actions (view/cancel)
2. Filter: Status chip'leri (All | Pending | Active | Expired)
3. "Active" tap → only active memberships
4. Sort by joined_at (default DESC)
5. CSV export button "📥 CSV Dışa Aktar (N)" → download `tema-members-2026-04-26.csv`

**Expected DB state:**
- Members WHERE ngo_id='tema' list = table
- Filter: WHERE status='active' when chip selected
- CSV: columns (user_name, email, status, tier, joined_at, expires_at, …)

**Expected UI:**
- Status badge colors: pending=amber, active=green, expired=gray
- KVKK banner: "Bu veriler KVKK Madde 10 uyumludur…"
- Empty state: "Henüz üye yok"
- Member count header: "5 üye | Aktif üyelik yönetimi"

**Edge cases:**
- Member profile soft-deleted → name "(Silindi)"
- Email export PII concerns → warning dialog + KVKK link
- 1000+ members → paginate (50 per page)
- Tier = null → fallback "free"

---

### AD8 — Reports (impact metrics, export)

**Prerequisite:** tema STK'da 12+ aylık mission + member history
**Route:** `/admin/tema/reports`

**Steps:**
1. Reports page açılır
2. Monthly metrics grid: missions_count | completed_count | karma_distributed | new_members
3. Chart: 12-month trend line (missions over time)
4. Last month detail card (e.g., "Nisan 2026: 5 görev, 3 tamamlandı, 45 karma dağıtıldı")
5. "Export Report" button → PDF download (optional, V1 placeholder)

**Expected DB state:**
- missions WHERE ngo_id='tema' aggregated by month
- ngo_memberships WHERE ngo_id='tema' aggregated by month
- user_missions status='completed' karma sum per month

**Expected UI:**
- Chart responsive (mobile: 1-col, desktop: 2-col)
- Month selector carousel (← Nisan | Mayıs →)
- Loading skeleton 300ms
- Empty month (0 missions) → "Aktivite yok"

**Edge cases:**
- < 2 months data → chart ⚠️ "Yeterli veri yok"
- Karma transaction sum ≠ missions karma sum (bug riski) → reconcile
- Future month selected → show "0"

---

### AD9 — Blog post create/edit

**Prerequisite:** tema STK'da 0–2 blog posts
**Route:** `/admin/tema/blog/new`, `/admin/tema/blog/[postId]/edit`

**Steps (create):**
1. Blog new page açılır: Title | Content (markdown editor) | Cover Image | Category (select) | Published toggle
2. Title + markdown content doldur
3. Cover image upload (same 5MB, 16:9 aspect)
4. "Yayından kaldır" toggle (draft state)
5. "Yayınla" button tap → `/admin/tema/blog` list + toast

**Expected DB state:**
- posts INSERT: (id, ngo_id='tema', title, content, cover_image_url, category, published, created_at)

**Expected UI:**
- Markdown preview (right panel, real-time)
- Published toggle: green/gray label
- Empty posts list: "+ Yeni Yazı" CTA
- Post list: title | category badge | published status | edit action

**Edge cases:**
- Very long title (200+ char) → truncate list preview
- Markdown HTML injection (e.g., `<script>`) → sanitized on save + render
- Category null → fallback "(Kategorisiz)"

---

### AD10 — NGO profile edit (logo, cover, bio, social)

**Prerequisite:** tema NGO row exists
**Route:** `/admin/tema/profile`

**Steps:**
1. Profile form açılır: Logo (current or upload) | Cover Image | Bio (textarea) | Email | Phone | Social (Instagram/Twitter/LinkedIn handles)
2. Bio update (extend text)
3. Logo upload → thumbnail preview (square, 1:1)
4. Cover upload → preview (16:9)
5. Social fields doldur (@tema_org, etc.)
6. "Kaydet" button tap → toast "Profil güncellendi"

**Expected DB state:**
- ngos UPDATE: logo_url, cover_image_url, bio, email, phone, social_instagram, social_twitter, social_linkedin
- Storage: tema/logo/* + tema/cover/*

**Expected UI:**
- Logo preview square, 1:1 ratio
- Cover preview 16:9 aspect
- Social input placeholders (e.g., "@handle" for Instagram)
- Dirty form tracking

**Edge cases:**
- Remove logo (delete upload) → fallback NGO name text
- Remove cover → transparent/gradient fallback
- Email validation → "Geçerli email gerekli"
- Very long bio (500+ char) → textarea scroll allowed
- Social handle with @ → strip/cleanup

---

### AD11 — Membership config (tier setup, fee schema)

**Prerequisite:** tema NGO has membership_form_fields + tier configuration
**Route:** `/admin/tema/membership-config`

**Steps:**
1. Config page açılır: 3 tier panel (Free | Basic | Premium)
2. Each tier: monthly_fee | annual_fee | features_list (textarea)
3. Form fields section: checkbox list (select which custom fields members fill)
4. Required fields: checkbox (name, email always on, others optional)
5. Update one fee → "Kaydet" tap → toast

**Expected DB state:**
- ngos.membership_form_fields (jsonb) UPDATE
- ngos.membership_tiers (or similar parametric structure)

**Expected UI:**
- Tier cards: fee input + feature textarea
- Fee preview: "₺X/ay veya ₺Y/yıl"
- Form fields: drag-reorder (optional v1), toggle required
- Dirty tracking

**Edge cases:**
- Fee = 0 (free tier) → allowed
- Fee = negative → validation error "Pozitif sayı gerekli"
- Feature textarea 500+ char → scroll
- All tiers disabled → warning "En az 1 tier aktif olmalı"

---

### AD12 — Payments (transaction list, filter by method/date)

**Prerequisite:** tema STK'da ≥3 payment transactions (from ngo_memberships + donations)
**Route:** `/admin/tema/payments`

**Steps:**
1. Payments page: Ödeme ayarları form (Stripe/PayPal/Manual toggle) + transaction list below
2. Transaction list: user name | amount | currency | type (membership/donation) | date | status (completed/pending/failed)
3. Filter: by date range (date picker or month select) + type (all/membership/donation)
4. Select month → filter applied
5. Detail row tap → transaction detail (receipt, proof, notes)

**Expected DB state:**
- transactions WHERE ngo_id='tema' ordered by date DESC
- Filter WHERE created_at BETWEEN date_range AND type='membership'
- ngo_id isolation: user can't see other NGO's payments

**Expected UI:**
- Transaction list table, sticky header
- Amount formatting: "₺1.234,56" (Turkish locale)
- Currency: TL badge
- Status badge: green (completed), amber (pending), red (failed)
- Date format: "25 Nisan 2026"
- Empty state: "Henüz ödeme yok"

**Edge cases:**
- Amount = 0 (test payment?) → still shown
- Transaction without matching user (edge) → "Anonim" or archived user fallback
- Partial payment (incomplete) → pending badge + retry button
- 1000+ transactions → paginate + export option

---

### AD13 — Mission QR generate (existing mission, shareable code)

**Prerequisite:** tema STK'da published mission with verify_code
**Route:** `/admin/tema/missions/[id]` → "QR Oluştur" action → modal or `/admin/missions/[id]/qr`

**Steps:**
1. Mission detail (admin view) → "QR Oluştur" button
2. QR modal açılır: QR code generated (mission.id + verify_code embedded)
3. Static URL shown: "QR Kodu Paylaş: https://www.iyibiri.app/verify/XXXXXX"
4. "İndir" button → PNG download
5. "Kopyala" button → URL clipboard

**Expected DB state:**
- missions.verify_code already set (populated on mission create or separate action)

**Expected UI:**
- QR code SVG render (300×300px minimum)
- Verify code displayed (opsiyonel, human-readable reference)
- Download + copy buttons
- QR resolution: 300dpi export option

**Edge cases:**
- Mission without verify_code → "QR kodu henüz oluşturulmadı, support'a başvur"
- Regenerate QR (old code invalidated?) → warning dialog
- QR scan result → deep link to `/dashboard/missions/[id]/complete` (user flow'a bağlanır)

---

### AD14 — Cross-NGO data isolation (RLS test — NGO A admin NGO B data access block)

**Prerequisite:** 2 admins: admin@tema.dev (tema), admin@tegv.dev (tegv)
**Route:** /admin/{tema}/missions + /admin/{tegv}/missions

**Steps:**
1. Admin @tema login → /admin/tema/missions → tema's missions listed
2. Manually navigate to /admin/tegv/missions → 403 "Bu STK için yetkin yok" error
3. Logout, admin @tegv login → /admin/tegv/missions → tegv's missions listed
4. Navigate to /admin/tema/members → 403
5. Direct DB query test: tema admin token → Supabase RLS "missions WHERE ngo_id='tegv'" → empty result

**Expected DB state:**
- RLS policy: `is_ngo_admin(auth.uid(), ngo_id)` enforced on missions, user_missions, ngo_memberships, posts, ngo_documents
- Cross-org query returns 0 rows (RLS block)

**Expected UI:**
- 403 page: "Bu STK için yetkin yok."
- URL bar shows /admin/tegv/... (navigation attempted)
- No partial data leak (member names, payment amounts, etc.)

**Edge cases:**
- Tampered JWT token (ngo_id override in claims) → RLS still blocks (server-side check)
- Concurrent edit by different NGO admins → isolated (no race condition)
- Super-admin user (is_super_admin=true) → all NGO data visible (separate RLS policy)
- Revoked admin role (ngo_admin_users deleted) → immediate 403 on next request

---

### AD15 — Super-admin escalation (super_admin views all NGOs, devtools)

**Prerequisite:** Super-admin user (email in SUPER_ADMIN_EMAILS env var, e.g., admin@iyibiri.app)
**Route:** `/admin/devtools` (or super-admin dashboard variant)

**Steps:**
1. Super-admin login → /admin/login
2. Post-login → /admin → NGO selector: "Tüm STK'lar" option OR list of all 5 NGO's
3. Select tema → /admin/tema/missions (same as regular admin view)
4. Navigate to /admin/tegv/missions → allowed (no 403)
5. Switch back to tegv → /admin/tegv/dashboard metrics update
6. /admin/devtools accessible: DB seeding buttons, fixture creation, RLS policy toggle (dev-only)

**Expected DB state:**
- is_super_admin(auth.uid()) returns true
- RLS policy: `is_super_admin(auth.uid()) OR is_ngo_admin(auth.uid(), ngo_id)` enables super-admin bypass
- Seed fixture queries succeed (createUser, upsert admin link)

**Expected UI:**
- NGO picker shows "Tüm STK'lar" option
- Devtools page: "Seed NGO Admin Fixtures" button + clear button
- Seed output: "Created: 2, Existing: 3" stats
- Fixture cleanup also available

**Edge cases:**
- Super-admin email not in env → regular ngo_admin behavior (not escalated)
- Database migration 021 not applied → is_super_admin() returns false (backward compat)
- Devtools accessed by non-super-admin → 403
- Production env → devtools disabled (NODE_ENV check)

---

## Faz 3 — Edge & Polish (P2)

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

#### XC9 — RLS leak audit (admin backoffice)

**Test:** Admin data isolation enforcement — RLS policy'leri engelleme testleri.

**Scenarios:**
1. NGO A admin (@tema) → /admin/tema/missions (200 OK, tema missions)
2. NGO A admin → /admin/tema/verifications (200 OK, tema pending proofs)
3. NGO A admin → /admin/tegv/missions (403 RLS policy block)
4. NGO A admin → /admin/tegv/members (403 RLS policy block)
5. NGO A admin → /admin/tegv/payments (403 RLS policy block)
6. NGO A admin → direct Supabase query: `missions WHERE ngo_id='tegv'` → 0 rows (RLS enforces)
7. Super-admin (email in SUPER_ADMIN_EMAILS) → /admin/tema, /admin/tegv, /admin/losev all 200 OK
8. Super-admin → all RLS policies bypassed (is_super_admin() checks pass)

**Assertion:** RLS policies on mission, user_missions, ngo_memberships, posts, ngo_documents block non-authorized access — no data leakage.

**Detection method:**
- Network tab: /admin/tegv/* request → 403 + policy error message in response
- DB audit: audit_log (if enabled) records RLS policy rejections
- Cross-NGO data in production logs should be zero

#### XC10 — Image upload security (admin asset storage)

**Test:** ngo-assets bucket'ına yetkisiz upload + malicious file detection.

**Scenarios:**
1. Normal admin login → mission form → image upload (JPG 2MB) → 200 success, ngo-assets/tema/missions/*.jpg created
2. Upload oversized file (>5MB) → client validation "Dosya çok büyük (max 5MB)" → no upload attempt
3. Upload corrupted JPG (metadata only, 0 KB body) → server-side check → "Dosya hasarlı" error
4. Upload .exe disguised as .jpg → MIME type check → "Sadece JPG/PNG kabul edilir"
5. Upload from different NGO dir (forged path `/tegv/missions/*`) → RLS bucket policy blocks write
6. Concurrent upload race condition (same filename) → server overwrites (or UUID randomization prevents collision)
7. Authenticated user (non-admin) attempts upload → 403 RLS bucket policy

**Assertion:** Upload validation stack (client size, server MIME, RLS bucket policy) prevents:
- Oversized files reaching server
- Malicious executables in assets
- Cross-NGO file overwrites
- Unauthorized storage access

**Detection:** 
- Storage bucket ACL logs (Supabase Storage audit)
- HTTP response status codes (400 for bad file, 403 for RLS)
- Server logs for virus scan (if implemented)

#### XC11 — Payment data integrity (admin transactions list)

**Test:** Payment transaction isolation, currency consistency, ngo_id filter accuracy.

**Scenarios:**
1. Admin @tema login → /admin/tema/payments → transaction list shows ONLY ngo_id='tema' rows
2. Filter by date range (Apr 2026) → returns transactions WHERE ngo_id='tema' AND created_at BETWEEN Apr 1-30 (no other NGO's data)
3. Admin @tegv login → /admin/tegv/payments → shows ONLY tegv transactions (tema transactions NOT visible)
4. Transaction list: amount format "₺1.234,56" (Turkish decimal) consistent across rows
5. Currency field: all rows show "TRY" or "TL" (no mixed currencies unless explicitly multi-currency feature)
6. Type filter (membership vs donation) → only matching transactions
7. Direct DB query: select * from transactions WHERE ngo_id='tema' user_id=(other NGO member) → RLS blocks or returns empty
8. Sum of transaction amounts = sum of karma_transactions karma movements (integrity check)

**Assertion:** Payment data respects NGO isolation, currency consistency, and transaction ledger accuracy.

**Detection:**
- UI table rendered row-by-row matches DB query
- Filter predicates match WHERE clause construction
- No sum/total mismatches
- Currency conversion (if applicable) logged and auditable

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
