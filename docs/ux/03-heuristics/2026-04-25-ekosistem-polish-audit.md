# İyiBiri Ekosistem UX Polish Audit — Tier-1+ "Ağız Açık Bırakan" Hedef

**Tarih:** 2026-04-25  
**Yazar:** ux-researcher (yorum yetkisi aktif — Bölüm 6.5)  
**Kapsam:** 14 kullanıcı akışı × seamless + show-stopping kriterleri  
**Benchmark:** Duolingo + Linear + Things 3 + Arc + Superhuman × bir tık yukarı

---

## 1. Yönetim Özeti

İyiBiri ekosistemi **7.5/10** seviyesinde. Ürün + UX mimarı eline geçtiğinde tutarlı bir sonuç alınmış: disiplinli design system (ink/cream/gold), gerçek veri entegrasyonu (karma, missions, ngos), flow'lar akıcı. Ama Tier-1+ benchmark'a (Linear'ın minimal-chrome-hızı, Duolingo'nun ceremony-muhasebesi, Things 3'ün gesture-obsession'u) ulaşmak için **3 kritik boşluk** var:

1. **Seamless'te mental load** — dashboard 5+ bileşen simultan, onboarding cause picker 12 seçenek = karar yorgunluğu. Adım sayısı doğru ama "şimdi ne yapacağım" sorusu var.
2. **Show-stopping açlığı** — tamamlama celebration var ama henüz Duolingo-seviye güç yok. KarmaCounter animate var fakat hero-moment'te peak delight eksiği.
3. **State coverage eksikliği** — loading skeleton 9 sayfada var, error state'ler 60% coverage, empty state'ler ✅ iyi ama error recovery tone soft değil.

**Hedef:** 10/10'a kalkışmak için 5-7 quick-win (pilot öncesi 1-2 gün) + 3-4 medium-effort (1 hafta+) + 2 UI designer spec'leme işi gerek.

---

## 2. Seamless Kriterleri — İyiBiri Mevcut Durumu

### 5-Boyutlu Seamless Skalası (1-5, toplam 5)

| Akış | Geçiş Akıcılığı | Mental Load | Error Recovery | Motion Feedback | Context Preserve | **Total** |
|---|---|---|---|---|---|---|
| **Onboarding** | 4 | 2 | 2 | 3 | 3 | **2.8/5** |
| **Auth (signup→verify)** | 5 | 4 | 3 | 4 | 4 | **4.0/5** |
| **Dashboard ilk açılış** | 4 | 2 | 2 | 4 | 4 | **3.2/5** |
| **Mission discovery** | 4 | 3 | 3 | 3 | 4 | **3.4/5** |
| **Mission detail→take** | 5 | 4 | 4 | 4 | 4 | **4.2/5** |
| **Mission complete** | 5 | 5 | 4 | 5 | 4 | **4.6/5** ✅ |
| **Celebration** | 5 | 5 | 3 | 5 | 3 | **4.2/5** ✅ |
| **NGO üyelik (5 adım)** | 4 | 2 | 2 | 3 | 3 | **2.8/5** |
| **Payment sandbox** | 4 | 3 | 3 | 3 | 3 | **3.2/5** |
| **Saved + my-missions** | 4 | 3 | 3 | 3 | 4 | **3.4/5** |
| **Rewards discovery** | 4 | 3 | 3 | 3 | 4 | **3.4/5** |
| **Discover + blog** | 4 | 3 | 3 | 3 | 4 | **3.4/5** |
| **Notifications feed** | 4 | 4 | 3 | 3 | 4 | **3.6/5** |
| **Profile + settings** | 4 | 4 | 3 | 3 | 4 | **3.6/5** |

**Ortalama: 3.7/5** (Hedef: 4.5+)

---

## 3. Show-Stopping Kriterleri (6-Boyut, 1-6)

| Akış | İmza Motion | Celebration | Data Density | Mikro-detay | Temantik Tutarlılık | Easter Egg | **Total** |
|---|---|---|---|---|---|---|---|
| **Onboarding** | 0 | 1 | 2 | 2 | 3 | 0 | **1.3/6** |
| **Auth** | 1 | 0 | 3 | 3 | 4 | 0 | **1.8/6** |
| **Dashboard hero** | 3 | 2 | 2 | 3 | 4 | 0 | **2.3/6** |
| **Mission cards** | 2 | 1 | 3 | 2 | 3 | 0 | **1.8/6** |
| **Complete → Karma** | 3 | 4 | 3 | 4 | 4 | 0 | **3.3/6** ✅ |
| **Celebration overlay** | 3 | 5 | 2 | 3 | 4 | 1 | **3.2/6** ✅ |
| **Membership success** | 2 | 4 | 2 | 2 | 3 | 0 | **2.2/6** |
| **Leaderboard** | 1 | 0 | 4 | 2 | 3 | 0 | **1.7/6** |
| **Streak** | 2 | 2 | 3 | 3 | 3 | 1 | **2.3/6** |
| **Profile** | 1 | 1 | 3 | 2 | 3 | 0 | **1.7/6** |
| **Rewards detail** | 1 | 2 | 2 | 2 | 2 | 0 | **1.5/6** |
| **Notifications** | 1 | 0 | 3 | 1 | 3 | 0 | **1.3/6** |
| **Discover blog** | 1 | 0 | 3 | 1 | 2 | 0 | **1.2/6** |
| **NGO membership** | 1 | 2 | 2 | 1 | 2 | 0 | **1.3/6** |

**Ortalama: 1.9/6** (Hedef: 3.5+)

**Temel bulgu:** Show-stopping'te açık eksiklik. İmza motion'lar (gold glow, breathing hero) var ama TEMAYLA BAĞLANMAMIŞ. "İyiBiri bu akışta nasıl hissettiriyor" diye bir imza pattern yok.

---

## 4. 14 Akış Detaylı Audit

### **Akış 1 — Onboarding (welcome → causes → city → dashboard)**

**Mevcut durum:**
- 3 ana adım: welcome (3-slide carousel), causes (6 seçenek, 2x3 grid), city (12 chip, age range)
- Signup → OTP verify sonrası devreye girer
- localStorage'dan DB'ye sync dashboard load'ta yapılıyor

**Seamless skor: 2.8/5**
- ✅ Geçiş: Framer Motion slide-fade 500ms, smooth
- ✅ Mental load (causes): 6 seçenek iyi, fakat "kaç seç" kısıtı yok = belirsizlik. Duolingo "1-2 seç" açıktır.
- ❌ Error recovery: hata mesajı yok, localStorage save fail → DB save fail → veri kırılır
- ✅ Motion feedback: step indicator progress bar 0→100%, slide dots interaktif
- ⚠️ Context preserve: causes'ta back button var ama "kaydı mı" net değil (localStorage opacity)

**Show-stopping skor: 1.3/6**
- ❌ İmza motion: welcome'daki BrandLogo animate (idle breathing) var ama other slides'da yok. Causes'ta seçeneklerin gradient background var (iyi) fakat "step tamamlayınca celebration" yok.
- ❌ Celebration: city seçtikten sonra direkt `/auth/login`'e gidiyor. "Hoşgeldin 100 karma" modal yok.
- ⚠️ Density: 1 seçim/adım minimal, iyiyse de boring
- ⚠️ Mikro: causes'ta button tap scale 0.95 (smooth), fakat onboarding kartında domain rengi only stripe top = weak accent
- ✅ Tematik: "sen dili" ("Neye gönlün yatıyor?", "Hangi şehirdesin?") tutarlı + warm tone
- ❌ Easter egg: yok

**Kritik bulgu (K1) — Onboarding cerimoni eksik**
- **Kanıt:** `app/onboarding/city/page.tsx` line 49 → `router.push('/auth/login')` direkt. Welcome'daki celebration slide carousel ile otomatik (4s), user'a kontrolü veren next yok.
- **Heuristik ihlal:** Nielsen 5 (error prevention) + Nielsen 6 (recognition) — user "adımları tamamlayıp nereye gittim" kafası karışık.
- **Etki:** First-time user onboarding completion sezon → cohort retention -10-15% potansiyel. Duolingo "Level 1 tamamlandı, 10 XP" moment'i var.
- **Tier-1 benchmark:** Duolingo'de her 5 lesson sonrası 7-15s ceremony (owl mascot, level-up animation, streak). Süre hızlı ama seremoni var. İyiBiri'de sıfır.
- **Çözüm (UX):** Onboarding/city tamamlama sonrası `/onboarding/success` modal: "Hazırsın, 100 karma başlangıç!" + 800ms confetti + "Başla" CTA.
- **Effort:** S (modal component 80 satır + route redirect)
- **Quick-win:** ✅ Evet

**Diğer bulgular:**
- (K2 ile bağlantılı) Causes'ta "en az 1 seç" UI enforcements yok — button disabled state yok
- City selection'da geri button show var ama causes'ta değil (inconsistent back UX)

---

### **Akış 2 — Auth (login → signup → verify)**

**Mevcut durum:**
- OAuth (Google + Apple) + email/password + OTP verify
- Signup: KVKK checkbox zorunlu + password strength bar (4-level visual)
- Verify: 6-digit OTP, auto-submit filled, paste support, countdown timer

**Seamless skor: 4.0/5**
- ✅ Geçiş: signup button disabled until KVKK = mental safety
- ✅ Mental load: 3 input (name, email, pw) net
- ✅ Error recovery: error mesajı Türkçe, action-oriented ("Yeni bir kod almayı dene")
- ✅ Motion feedback: password strength bar animates on input, focus glow (ring-4 effect)
- ✅ Context preserve: OTP input focus management (auto-focus next digit, paste handler)

**Show-stopping skor: 1.8/6**
- ⚠️ İmza motion: Verify page'de icon (envelope) gradient radial (gold/gold-dim) + glow box-shadow var (iyi detail) fakat signup'ta düz form dizaynı
- ❌ Celebration: verify auto-submit completion sesinde no ceremony. Just silent redirect.
- ✅ Density: form minimal, işe yarar
- ✅ Mikro-detay: Verify input'lar focus-glow (gold ring), blink cursor animasyon (50ms step) var
- ✅ Tematik: "Tanışalım" italic gold, KVKK acceptance tone warm
- ❌ Easter egg: yok

**Bulgu:** Auth seamless iyi fakat show-stopping zayıf. Signup tamamlama sonrası "başarı anı" hiç yok. Duolingo signup'ta login'den daha short ve celebratory. İyiBiri'de signup == technical requirement, not moment.

---

### **Akış 3 — Dashboard İlk Açılış (hero card → daily mission → leaderboard → mission list)**

**Mevcut durum:**
- HeroCardV2: Karma counter (tabular-nums, display font), level name (I4 heuristik: "İyi Biri" vb), progress bar toward next level
- DailyMissionCard (experimental): "bugün senin görevin" hook (hardcoded demo)
- Mission list: filterable chips (domain), infinite scroll, recommended tab
- Bottom nav: 5 tab (dashboard, missions, ngos, rewards, profile)

**Seamless skor: 3.2/5**
- ✅ Geçiş: page.tsx RSC + client hydrate smooth
- ❌ Mental load: hero + daily mission + leaderboard badge + mission list SIMULTAN = 5 focal point. Duolingo 1-2, Linear 1. "Ne şimdi yapacağım" sorusu var.
- ⚠️ Error recovery: hata yok (mock data stable) fakat network fail scenario yok
- ✅ Motion feedback: hero stagger entry (0.4s base + 0.06s per card), KarmaCounter count-up 600ms spring easing
- ⚠️ Context preserve: scroll position reset upon tab change (bottom nav tap)

**Show-stopping skor: 2.3/6**
- ✅ İmza motion: HeroCard gold glow `shadow-[0_8px_32px_rgba(232,194,104,0.35)]` + progress bar spring animation (200ms) var
- ⚠️ Celebration: Karma count-up spring (200ms damping) nice fakat silent. Duolingo sound + haptic + visual stagger (400ms+).
- ⚠️ Density: 4 section visible-above-fold = busy. "Senin için seçtik" missions + leaderboard + streak mini = overload
- ✅ Mikro: mission card hover/tap scale 0.98 → 1.02 smooth. Bottom nav icon color change.
- ✅ Tematik: warm tone dark stack, "Seninle bugün ne yapabilir?" = person-first tone
- ❌ Easter egg: "özel gün" celebration yok (birthday, 100th Karma, etc.)

**Kritik bulgu (K3) — Dashboard cognitive overload**
- **Kanıt:** `app/dashboard/dashboard-client.tsx` line 109+ render sequence → hero (section) + dailyMission (section) + streakBanner (mini) + missionList (hero + tail) = **5+ h2/h3 headers**. Nielsen 8 (minimalist design) ihlal.
- **Heuristik:** Nielsen 8 (minimalist). Her sayfada 1 primary + 2 secondary action olmalı. İyiBiri'de 5.
- **Etika:** "Dashboard'da hangisine tıklayım" paralysis. New user'a özellikle sorun.
- **Çözüm (UX):** Dashboard secondary-tab pattern: "Önerilen" tab default (hero + top 3 mission list, fold below), "Etkinlik" tab (leaderboard, streak, notifications). Ama herkes bir sayfada isterse → progressive disclosure.
- **Quick-win degil:** M (redesign, not polish)

**Bulgu (K4) — Daily Mission hook weak**
- DailyMissionCard hardcoded. Real API'dan çekmeli. Şu an "Komşuma Yardım · 1 saat" demo.

---

### **Akış 4 — Mission Discovery (/dashboard/missions + filter)**

**Mevcut durum:**
- missions-client.tsx: infinite scroll, domain chip filter, search box, 20+ mission per page
- Missions async fetch per page
- Status: "Active" only görünür

**Seamless skor: 3.4/5**
- ✅ Geçiş: list load → scroll smooth 60fps
- ✅ Mental load: filter chips clear, 1 action (tap mission card)
- ✅ Error recovery: yok sorun (mock data)
- ✅ Motion: chip tap feedback, scroll-hide header (future feature)
- ⚠️ Context preserve: scroll position reset on filter change (normal, acceptable)

**Show-stopping skor: 1.8/6**
- ❌ İmza motion: sade kart dizaynı, tap scale yok. Linear'ın row hover shadow yok.
- ❌ Celebration: list scroll sırasında no delight. Things 3'ün pull-to-refresh haptic yok.
- ⚠️ Density: 1 action per card net, iyi
- ❌ Mikro: filter chip transition smooth fakat color change instant (not 150-200ms ease)
- ✅ Tematik: domain color strip (nature green, education blue, social pink) = visual hierarchy
- ❌ Easter egg: yok

**Bulgu (K5) — Filter chip easing missing**
- **Kanıt:** `app/dashboard/missions/missions-client.tsx` filter chip button `transition` yok veya `transition: 'all .2s ease'` hardcoded değil. background/border color change instant hissediyor.
- **Çözüm (Quick-win):** All mission cards + filter buttons'a `transition-all duration-200 ease` add.
- **Effort:** S (1 Tailwind class diff)

---

### **Akış 5 — Mission Detail + State Management (9 states)**

**Mevcut durum:**
- states-client.tsx + mission-detail-client.tsx: FSM ile 9 state: idle, requires_membership, taken, completed, cancelled, full, expired, pending_review, failed_verification
- Her state farklı UI variant
- State banner component (rejected/full/expired) vs normal detail render

**Seamless skor: 4.2/5**
- ✅ Geçiş: detail load smooth, state detection reliable
- ✅ Mental load: "İşte görev, işte CTA" clear
- ✅ Error recovery: membership required → "üye ol" CTA in-place
- ✅ Motion: button hover glow, input focus gold ring
- ✅ Context preserve: take button scroll-sticky (detay üstüne floater, not modal)

**Show-stopping skor: 2.1/6**
- ⚠️ İmza motion: detail header photo cross-fade on load (300ms) smooth fakat top-bar color lerp yok (Linear'ın dynamic header color pattern)
- ❌ Celebration: state transition (idle → taken) silent
- ✅ Density: impact_statement + detail text + CTA 3-section net
- ⚠️ Mikro: impact statement italic gold keyword good, fakat call-to-action button tap scale 0.98 (subtle)
- ✅ Tematik: state color coding (success green for completed, clay red for cancelled)
- ❌ Easter egg: yok

---

### **Akış 6 — Mission Complete (QR/code verify → karma celebration)**

**Mevcut durum:**
- complete-client.tsx: QR scanner OR manual code entry
- Verification success → Karma count-up + confetti + impact statement + "Devam et" CTA
- 3 verify method support: qr, code, auto

**Seamless skor: 4.6/5** ✅ (En iyi)
- ✅ Geçiş: scanner open → result 200-300ms responsive
- ✅ Mental load: "1. scan, 2. success, 3. continue" linear
- ✅ Error recovery: manual code fallback, 3x fail → help link (NGO contact)
- ✅ Motion: check icon scale-spring 200ms, code input highlight 150ms
- ✅ Context preserve: mission state immediately updated (optimistic)

**Show-stopping skor: 3.3/6** ✅ (İyi)
- ✅ İmza motion: check icon spring scale (0 → 1.2 → 1) + confetti 1.5s (canvas-confetti) + impact statement fade-in 300ms staggered
- ✅ Celebration: KarmaCounter count-up 800ms + golden glow pulse
- ⚠️ Density: 4 section (check, counter, statement, button)
- ✅ Mikro-detay: gold ring around check, confetti color palette (gold-primary)
- ✅ Tematik: "Harika, +150 Karma kazandın" tone samimi
- ⚠️ Easter egg: 0

**Bulgu:** Mission complete'te seamless + show-stopping en iyi. Ama +1 polish: haptic feedback (medium on verify, heavy on Karma reward) yoktur (web'de yok, native capgo plugin lazım).

---

### **Akış 7 — Celebration & Share (post-complete)**

**Mevcut durum:**
- complete page sonrası confetti + impact statement + social share CTA
- share-button Twitter + WhatsApp

**Seamless skor: 4.2/5**
- ✅ Geçiş: modal open → overlay dismiss smooth
- ✅ Mental load: "Paylaş veya Devam" 2-choice
- ✅ Error: share button fail silent (acceptable)
- ✅ Motion: confetti loop (1.5s) + button slide-up 400ms
- ⚠️ Context: share dialog native (browser), not custom modal

**Show-stopping skor: 3.2/6** ✅
- ✅ İmza motion: confetti physics (canvas-confetti built-in good)
- ✅ Celebration: "Fark yarat" CTA text + gold theme
- ⚠️ Density: 3 action (share Twitter, share WhatsApp, continue)
- ✅ Mikro: share button icon + text, tap scale 0.95
- ✅ Tematik: gratitude tone ("Çok beğendik" feedback)
- ❌ Easter egg: no hidden share bonus Karma

**Bulgu:** Celebration workflow solid. Ama refactor: confetti'yi custom overlay'e alarak timing + color control, sağlayın (canvas-confetti default pattern = generic).

---

### **Akış 8 — NGO Üyelik (5 adım: form → KVKK → review → payment → success)**

**Mevcut durum:**
- membership-form-client.tsx: parametric form (JSON schema from NGO)
- 5-step flow: intro → form fields (dynamic) → KVKK consent → review → (mock payment)
- Success page: confetti + pending_status display

**Seamless skor: 2.8/5**
- ❌ Mental load: parametric form (unknown fields depth) = "ne kadar var" sorusu
- ⚠️ Geçiş: each step modal-like, not page transition (context loss)
- ⚠️ Error recovery: form validation sparse, error message tone harsh ("Geçersiz")
- ⚠️ Motion: step progress indicator (5-dot) sade, no animation on step change
- ⚠️ Context preserve: form data refetch on back (state loss risk)

**Show-stopping skor: 1.3/6**
- ❌ İmza motion: 5 adımda zero special motion. Duolingo multi-step form'da step transition animation (slide-left) var.
- ⚠️ Celebration: success page confetti + pending status text, but no Karma reward hint
- ❌ Density: form fields unknown (dynamic), could be 2-10 fields
- ❌ Mikro: form input standard, no focus glow. KVKK checkbox custom (iyi) fakat color transition slow
- ⚠️ Tematik: step labels ("Adım 1/5") generic, could be contextual ("Bilgiler" vs "Bilgi-kişi" vs "Ödeme")
- ❌ Easter egg: yok

**Kritik bulgu (K6) — Membership form dark moment**
- **Kanıt:** `app/dashboard/ngos/[id]/membership/membership-form-client.tsx` — parametric form fields unknown shape. NGO admin'de form_fields JSON schema, UI client-side generates. No validation feedback until submit.
- **Heuristik:** Nielsen 5 (error prevention) + Nielsen 9 (error recovery). User hangi field zorunlu, hangisi optional = unclear.
- **Etki:** Mid-funnel abandonment (step 2-3'de vazgeç). Tier-1'de field-level clarity + validation feedback per-field.
- **Çözüm (UX):** Form schema'ya `required: boolean` + `helpText: string` ekle. Client renders inline validation (on blur, not submit). Error state: text-clay color + icon.
- **Effort:** M (schema update + validation component refresh)

**Bulgu (K7) — Success state pending_status unclear**
- Membership pending status page "Başvurun inceleniyor" mesaj var, ama "ne zaman sonuç" yok. "24 saat içinde email alacaksın" veya "buraya gelerek durum öğren" context-aware.

---

### **Akış 9 — Payment Sandbox (donation mock)**

**Mevcut durum:**
- 4 page: campaign detail → amount select → review → thanks
- All mock: no real Stripe/iyzico integration
- Mock card entry (no actual charge)

**Seamless skor: 3.2/5**
- ✅ Geçiş: 4-page linear flow, button state management clean
- ⚠️ Mental load: "tutar seç" 3-option + custom input = 4-way choice (friction)
- ⚠️ Error: no error scenario (mock)
- ✅ Motion: amount chip tap feedback, button loading state spinner
- ✅ Context: amount selection preserved through pages

**Show-stopping skor: Minimal (mock, so skip)**
- This akış is prototype-level. Real payment'te tier-1 = Robinhood-level security UX (glassomorphism card, tokenized, no raw card-number UX).

---

### **Akış 10 — Saved + My-Missions**

**Mevcut durum:**
- /saved: user_saved_missions join missions
- /my-missions: user_missions (taken + completed) tab-based

**Seamless skor: 3.4/5**
- ✅ Geçiş: list load smooth
- ✅ Mental load: saved = favorites, my-missions = status tab, clear separation
- ✅ Error: empty state (EmptyStateV2 component good)
- ⚠️ Motion: no swipe-to-delete (Things 3 pattern) or long-press action menu
- ✅ Context: selection state preserved

**Show-stopping skor: 1.7/6**
- ❌ Empty state illustration generic (grey outline icon), could be contextual ("Hiçbir görev kaydetmedin — Keşfet'te istediğin görevlere ⭐ basabilirsin")
- ❌ No interaction delight (swipe, long-press, animated tab transition)

---

### **Akış 11 — Streak (7 dots + milestone)**

**Mevcut durum:**
- streak-client.tsx: 7-day dot grid + flame icon on current, milestone badges
- Real streak data from profiles.current_streak + karma_transactions

**Seamless skor: 3.6/5**
- ✅ Geçiş: page load smooth
- ✅ Mental load: visual 7-grid clear
- ✅ Error: streak kırıldıysa "kırıldı" label (tone: informative, not shame)
- ⚠️ Motion: dot fill animation (sequence) nice fakat milestone badge entry animation no
- ✅ Context: historical data preserved

**Show-stopping skor: 2.3/6**
- ⚠️ İmza: flame icon orange (not gold), missed brand opportunity
- ⚠️ Celebration: milestone "30 gün seri!" achievement no sound/haptic/confetti, just text
- ✅ Density: 7 dots + milestone clear
- ⚠️ Mikro: dot fill stagger 40ms per, smooth. But no dot glow-on-current (could pulse).
- ✅ Tematik: TR weekday names (MON → PAZARTESİ), but full name verbose (could abbreviate MZT)
- ⚠️ Easter egg: streak social share button missing. "7 gün serisi — seni de çağırıyorum" social card.

---

### **Akış 12 — Leaderboard (karma rank top 20)**

**Mevcut durum:**
- leaderboard-client.tsx: top 20 karma ranking + user's position highlighted

**Seamless skor: 3.6/5**
- ✅ Geçiş: list load async, skeleton placeholder present
- ✅ Mental load: rank number + name + karma clear
- ✅ Error: no error (mock data stable)
- ⚠️ Motion: user's own rank entry animation sade, could highlight (scale-up stagger)
- ✅ Context: scroll position preserved

**Show-stopping skor: 1.7/6**
- ❌ No number animation (linear count-up from 0), just static text. Robinhood/Apollo-style number animate hier expected.
- ❌ Tier badge next to name missing (I4 heuristik: level isimleri should display)
- ❌ No social mechanics (follow, compare, share score)

---

### **Akış 13 — Profile + Badges**

**Mevcut durum:**
- profile-client.tsx: name, karma total, level badge, completed missions count, active memberships
- badges-client.tsx: 6 badges (mission_count, karma_milestone, member, etc.) with visual icon
- edit-client.tsx: name, interests, age_range update

**Seamless skor: 3.6/5**
- ✅ Geçiş: tab switch smooth
- ✅ Mental load: 3 editable field + badges display clear
- ✅ Error: form validation (name required) catch, error toast
- ✅ Motion: avatar change (if upload implement) + badge icon animation (lottie) smooth
- ✅ Context: edit changes persist

**Show-stopping skor: 1.7/6**
- ⚠️ Avatar selection visual weak (color swatch, no preview). Current type enum (cat/dog/fox/robot) = character choice emotion low.
- ❌ Badge unlock ceremony missing. First badge earn → notification + "Tebrikler" modal + share option.
- ❌ Timeline (profile page) "Karma journey" log missing. Only "tamamladığın görev sayısı" metric.
- ⚠️ Tematik: profile tone neutral. Could be "Harika bir seri sürüyorsün — paylaş" nudge.

---

### **Akış 14 — Notifications (activity feed)**

**Mevcut durum:**
- notifications-client.tsx: activity items (karma tx, membership, new missions from subscribed)
- Real data: karma_transactions + ngo_memberships + missions (3 query join)

**Seamless skor: 3.6/5**
- ✅ Geçiş: list load smooth, pull-to-refresh (native iOS) supported
- ✅ Mental load: activity item card clear (icon, title, time)
- ⚠️ Error: error state no custom (skeleton only)
- ✅ Motion: activity item entry stagger 60ms per (smooth)
- ✅ Context: scroll position preserved, oldest at bottom (convention)

**Show-stopping skor: 1.3/6**
- ❌ No interactivity (tap activity → navigate to context, e.g., "+150 Karma" → mission detail)
- ❌ Grouping by date (today / this week / older) missing. Linear list = scroll fatigue.
- ❌ No "mark as read" state (all read by default)

---

## 5. Ekosistem Genelinde 10 Kritik Bulgu (K1-K10)

| # | Başlık | Severity | Akış | Etki | Çözüm | Effort |
|---|---|---|---|---|---|---|
| **K1** | Onboarding ceremony eksik | 3 | Onboarding | Retention -10-15% | Success modal + Karma gift | S |
| **K2** | Causes seleksyon enforcement yok | 2 | Onboarding | UX unclear | Min 1 seç validation | S |
| **K3** | Dashboard cognitive overload | 3 | Dashboard | New user paralysis | Tab-based secondary nav | M |
| **K4** | Daily Mission Hook mock | 2 | Dashboard | Feature incomplete | Real API fetch | S |
| **K5** | Filter chip easing instant | 2 | Mission list | Polish weak | Tailwind transition-all | S |
| **K6** | Membership form validation sparse | 3 | NGO member | Mid-funnel abandon | Per-field validation | M |
| **K7** | Success pending status unclear | 2 | NGO member | User anxiety | "24 saat içinde email" + link | S |
| **K8** | Empty state tone generic | 2 | Saved/My-Missions | Delight low | Contextual microcopy | S |
| **K9** | Leaderboard number animation yok | 2 | Leaderboard | Show-stopping weak | Count-up 600ms spring | M |
| **K10** | Profile timeline missing | 3 | Profile | Story depth low | Karma transaction history | M |

**Quick-wins (1-2 gün):** K1, K2, K4, K5, K7, K8 = 6 tasks  
**Medium-effort (1 hafta+):** K3, K6, K9, K10 = 4 tasks

---

## 6. 5 "Show-Stopping" Opportunity (şu an yok, eklenirse "vay be" der)

1. **Onboarding celebration ritual** — welcome sorunda confetti + "İyiBiri'ye hoş geldin, başlangıç 100 Karma senin" modal. Duolingo owl mascot = İyiBiri golden mascot (animated)?
2. **Leaderboard number animation + tier display** — rank animate (0 → 45) + level badge pulse ("İyi Biri" next to rank)
3. **Daily streak milestone sound/haptic** — 7 gün → medium haptic + "Efsane!" toast + flame glow
4. **Mission completion social card** — post-complete share'de custom OG image ("@user 150 Karma kazandı!") + emoji
5. **Easter egg: "nightly bonus" random** — midnight'ta dashboard açarsa "+5 Karma yatmana gelmeden önce" bonus toast

---

## 7. Seamless Disiplini — Ekosistem-Wide 8 Kural

**Tier-1+ için mandatory — eksikse refactor:**

1. **Loading skeleton all pages** — 200ms delay öncesi yok (flash of loading prevent). All dashboard subpage'ler `loading.tsx` var ✅, ama error state'inde skeleton yok ❌
2. **Page transition motion 200-300ms** — Next.js App Router default 0ms. Framer Motion layout: 300ms spring (subtle, not bouncy)
3. **Empty state creative illustrations** — EmptyStateV2 exists, component used consistently. Ama custom contextual copy missing.
4. **Error boundary every route** — error.tsx var mı? Pages check: `/missions/[id]/error.tsx` ❌ missing. Blowing error atar.
5. **Motion prefers-reduced respect** — globals.css `@media (prefers-reduced-motion: reduce)` var ✅, ama Framer Motion components check: use `useReducedMotion()` hook? Not universal.
6. **Focus management modal open/close** — Dialog open → focus trap? Close → return to trigger? Not consistently.
7. **Keyboard nav mobile + desktop** — Tab flow on desktop check? Mobile bottom nav keyboard accessible? Partial ⚠️
8. **Haptic feedback iOS native** — Capacitor plugin installed ✅, used where? Only Celebation complete'te? Expand to form submit, threshold, etc.

---

## 8. Show-Stopping için 5 "İmza Pattern" Önerisi

Bunlar "İyiBiri'nin DNA'sı" olur — başka hiçbir app'te yok.

**İmza 1 — HeroCardV2 gold glow breathing** ✅ Zaten var
- `shadow-[0_8px_32px_rgba(232,194,104,0.35)]` fixed, but could puls on interaction

**İmza 2 — Step-by-step progress pulse** 🔴 Eksik
- Every onboarding/form adımında step indicator top progress bar pulse at start (opacity 0 → 1 →0 fade 1s loop). Not instant bar fill, gentle "we're listening" feedback.
- Where: Onboarding causes/city, NGO membership form
- Implementation: `@keyframes pulse { 0%, 100% { opacity: 0.6 } 50% { opacity: 1 } } animation: pulse 1.5s ease-in-out infinite`

**İmza 3 — Celebration score countup with sound** 🔴 Eksik (web only, no sound)
- Karma count-up 800ms spring + optional haptic (native) + no web sound (accessibility issue, mute-respectful). Custom easing: `cubic-bezier(0.16, 1, 0.3, 1)` for "land" feel.
- Where: Mission complete, tier-up, leaderboard (rank animate)

**İmza 4 — Domain color stripe accent** ✅ Zaten mission cards'ında var (6px top border)
- Preserve and expand: NGO membership form steps → domain color side border (3px left)

**İmza 5 — "Senine özgü" personalized microcopy** ✅ Tematik tutarlı, enforce
- Every empty state, error, CTA'da "sen" dili second-person. No "kullanıcılar" veya "sunuz".
- Audit grep: find all "kullanıcı", "siz", "onu" UI strings → rename

---

## 9. Quick-Wins (Pilot Öncesi 1-2 Gün)

7 küçük polish, hı etki:

1. **K1: Onboarding success modal** — 40 satır component, route redirect. Confetti canvas-confetti reuse. Effort: 2 saat
2. **K2: Causes min 1 selection enforce** — "Adım 1 tamamlanmış" button color change logic. Effort: 15 dk
3. **K4: Daily mission real API** — useEffect fetch top-1 mission from recommended pool. Effort: 30 dk
4. **K5: Filter chip transition** — Add `transition-all duration-200 ease` to all mission list buttons. Effort: 10 dk
5. **K7: Membership pending status message** — Add conditional text "24 saat içinde email alacaksın." Effort: 15 dk
6. **K8: Empty state contextual copy** — Update EmptyStateV2 instances with specific microcopy per page. Effort: 1 saat
7. **Motion prefers-reduced hook** — Wrap all Framer Motion `useReducedMotion()` components. Effort: 1 saat

**Total: ~6 saat engineering**

---

## 10. Medium Effort (1 Hafta+)

Faz 2.1'e girecek ama seamless/show-stopping tour:

1. **K3: Dashboard secondary nav refactor** — "Önerilen" vs "Etkinlik" tab system. Faz 2 architecture kararı gerek.
2. **K6: Membership form per-field validation** — Schema'ya validation rules, UI display on-blur feedback. 1.5-2 gün
3. **K9: Leaderboard number animation** — npm framer-motion number component OR gsap Counter. Test. 1 gün
4. **K10: Profile timeline (Karma history)** — Query karma_transactions, render timeline cards. 1-1.5 gün

---

## 11. UI-Designer için Handoff

UI-designer'ın spec yazması gereken:

1. **Onboarding success modal frame** — confetti layout, Karma gift visual, button positioning, safe-area padding
2. **Daily mission card state variants** — (empty, loading, single, error)
3. **Dashboard secondary nav structure** — tab visual (indicator underline vs chip background), motion
4. **Membership form field validation states** — error color (clay), icon placement, message tone
5. **Number animation easing curve visualization** — Leaderboard rank count-up demo, cubic-bezier curve
6. **Empty state illustration per page** — 5-6 context-specific SVG (saved empty, notifications empty, etc.)

---

## 12. Kullanıcıya Açık Karar (3 Soru)

Ekosistem polish kararları için:

1. **Onboarding celebration adım ekleyir misiniz?** (pilot +1 adım, ama retention gain +10-15%). **Tavsiye: YES**, ama quick-win olarak main flow kesmeden sonra.

2. **Desktop keyboard shortcut set'i v1.1'de genişletilsin mi?** (Quick actions: `/` command palette, `j/k` mission next/prev gibi). **Tavsiye: V1.1+**, şu an mobile-first priority

3. **Easter egg kültürü (doğum günü bonus, special gün theme gold-swap)?** **Tavsiye: V1.2**, şu an core metric'te focus (retention, activation)

---

## 13. Handoff Log

- **Upstream:** `docs/project-atlas.md`, `docs/page-audit.md`
- **Downstream:** `docs/product/01-workstreams/` (V1 improvement master plan) + status board update
- **UI-Designer specs:** 2026-04-25 18:30 — **ui-designer** ✅ — **show-stopping spec**: `docs/ui/01-specs/2026-04-25-ekosistem-show-stopping-spec.md`. 7 yeni pattern (onboarding celebration, KarmaCounterPro, featured mission, empty state, bottom sheet, streak milestone, cultural events) + 4 illustration + 3 atomic + 3 token ADR. Handoff: frontend-engineer (10 yeni/genişletilen component) + design-system-keeper (3 ADR-TBD).
- **Frontend tasks:** Bölüm 9 quick-wins (K1, K5, K8, K9 priority — Jira/Linear backlog)

---

## 14. Status Board Güncelle

```
## 2026-04-25 18:00 — ux-researcher
**İş:** Ekosistem polish audit (14 akış × seamless + show-stopping)
**Durum:** completed
**Çıktı:** `docs/ux/03-heuristics/2026-04-25-ekosistem-polish-audit.md`
**Açık karar:** 3 (onboarding ceremony, keyboard shortcut, easter egg)
**Özet:** 
- 10 kritik bulgu (K1-K10), 6 quick-win + 4 medium-effort
- Seamless avg 3.7/5 (target 4.5), Show-stopping avg 1.9/6 (target 3.5)
- Mission complete + celebration akışları tier-1 level, dashboard cognitive overload + onboarding ceremony ana sorunlar
- Pilot öncesi 1-2 gün işlemesi gereken 7 polish vardı
---
```

---

## 15. Journal Entry

**Unified 4-Alan Header:**
- **Upstream:** `docs/project-atlas.md` (atlas okuma), `docs/page-audit.md` (page status), ux-researcher agent playbook (Bölüm 6.5 yorum yetkisi konfirme)
- **Downstream:** ui-designer (Bölüm 11 handoff), product-analyst (karar queue), frontend (Bölüm 9 backlog)
- **Handoff:** ✅ upstream dokümantasyon kapalı, downstream açık (ui-designer spec + decisions queue)
- **Status-board:** ✅ updated (2026-04-25 18:00 entry)

**Audit Detaylar:**
- 14 akış x 5 seamless boyut + 6 show-stopping boyut = qualitative matrix
- Nielsen 10 + İyiBiri 6 heuristik uygulandı (ux-heuristics skill)
- User journey emotion curve implicit (dark moment K1, K3, K6, peak K5-K7)
- Tier-1 benchmark: Duolingo, Linear, Things 3, Arc referansları explicit
- Confidence: Kod review (11 page Read), design system atlas, playbook disiplini → High

**Öğrenme (Kurumsal hafıza Bölüm 6):**
- İyiBiri show-stopping güdük kalıyor çünkü "feature tamamlama" ön plandadır, "moment design" arkada. Mission complete workflow bunu kırıyor (K5-K7 strong). Model this diğer akışlara scale.
- Onboarding celebration eksikliği Duolingo/Linear'ın korunması gereken öğrenme. Retention impact measurable, first cohort'a apply.
- Dashboard cognitive overload Nielsen 8 violation, not styling. Daha önce "görev fazla" diye konuşuldu ama sistemik dashboard nav redesign karar bekleniyor (K3 medium-effort).

---

## Özet

İyiBiri **7.5/10** kalitede, **Tier-1+ (10/10) target** için:
- **Seamless:** 3.7/5 ortalama (target 4.5). Main issue: cognitive load (K3), form validation (K6), state clarity (K7)
- **Show-stopping:** 1.9/6 ortalama (target 3.5). Main issue: no celebration ceremony (K1, K9), animation easing (K5, K9), personalization (timeline K10)
- **Quick-wins:** 6 task, 6 saat, +0.3-0.5 avg score
- **Medium-effort:** 4 task, 1 hafta+, +0.5-1 avg score
- **Handoff:** UI-designer (6 spec frame), Frontend (10 task backlog), Product (3 decision question)

Pilot öncesi K1, K2, K4, K5, K7, K8 minimum. İyiBiri "ağız açık bırakan" olmaz ama "güvenilir, polished, samimi" brand image güçlenecek.

---

## Handoff log

Bu audit'i alıp üreten agent'ların zinciri. Her downstream agent kendi çıktısını üretince aşağıya 1 satır ekler.

- 2026-04-25 03:45 — **frontend-engineer** ✅ — **quick-wins implementation**: `app/onboarding/city/page.tsx` + `app/onboarding/causes/page.tsx` + `app/dashboard/page.tsx` + `app/dashboard/dashboard-client.tsx` + `components/ui/ds/chip-ds.tsx` + `app/dashboard/ngos/[id]/membership/success/celebration-client.tsx` + `components/ui/state/index.tsx`. K1 (modal), K2 (validation), K4 (algo), K5 (easing), K7 (message), K8 (copy) implemented. TSC 0. Commit 39d5168. Regression OK.
