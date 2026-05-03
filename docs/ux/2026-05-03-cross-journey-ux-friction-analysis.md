# Cross-Journey UX Friction Analysis — Landing → Sponsors
**Tarih:** 2026-05-03  
**Yazar:** ux-researcher  
**Scope:** Tüm proje (landing → auth → onboarding → dashboard × 5 nav → mission detail → NGO detail → bağış × 3 step → admin → sponsor)  
**Hedef:** P0/P1 UX bulguları + cross-page tutarsızlıklar + friction noktaları + Sprint Vol-62 önerisi  
**Kanıt sınıfları:** [Kod], [Gözlem], [Hipotez]  

---

## 1. Yönetim Özeti

**Mevcut durumu:** İyiBiri tier-1 seviyesindedir; 38 user-facing sayfa × Nielsen 10 + İyiBiri özel audit tamamlandı (2026-04-25). **Kritik bulma:** Tur 1 (Vol-55: welcome celebration → Vol-60.1: NGO detail refactor) arasında **sistemik 3 kategori sorun** tespit edildi:

1. **Pattern dağınıklığı** — kalp/favorit/takip buttonları sayfa sayfa farklı (Mission Detail vs Rewards vs NGO). Bottom nav (Ana/Görevler/Bağış/Ödüller/Profil) hiyerarşi net ama Profile altında neler var muğlak.
2. **Onboarding drop-off riskleri** — 3-adım (welcome → causes → city) flow smooth ama KVKK tereddüsü (Adım 2.5) ve şehir seçimi (Adım 3) kapalı. Magic link vs forgot password journey eksik (2026-04-25 fix'i uygulandı).
3. **Tier journey momentum boşlukları** — Karma → Çiçeklenen → Çınar tier'ler definition'ı anlaşılmış ama tier-up motivasyon loop (profile → tiers → "hangi sırada top 10?") lineer değil. Leaderboard sayıcı animasyonu yok (tier-1+ gap).

**Çıktı yapısı:** 3 bölüm (A: P0/P1 bulgular sayfa sayfa, B: cross-page pattern drift, C: friction nokta). Max 400 sözcük hedef + actionable öneriler.

---

## A. P0/P1 UX Bulgular (Sayfa Sayfa)

### Landing → Auth → Onboarding
| Sayfa | P0/P1 Bulgu | Root | Severity | Fix |
|-------|------------|------|----------|-----|
| `/auth/signin` | "Şifremi unuttum" link ölü (gold, clickable görünüyor) | Nielsen 3 (Control) | P0 | ✅ 2026-04-25: link implement'lenmiş (`/auth/forgot-password`) |
| `/onboarding/causes` | KVKK yazılı form metni, sadece accept/decline (yumuşak geçiş yok) | User flow friction | P1 | Tooltip "neden bunu soruyoruz" ekle; radio → toggle geçişi |
| `/onboarding/city` | Şehir multi-select vs single-select belirsiz (UI); radius seçimi secondary | Information architecture | P1 | City filter: single-select clear, radius separate step / "Benim bölgemde" pre-fill (konum izin) |
| `/auth/verify` | OTP paste + auto-submit ✅; ama countdown timer keskin kesiliyor (0'dan 60'a atlama) | UX polish | P1 | Countdown 60-0 smooth count (increment per 100ms) |

### Dashboard — Ana Nav
| Sayfa | P0/P1 Bulgu | Root | Severity | Fix |
|-------|------------|------|----------|-----|
| `/dashboard` | "Günün Görevi" hero card focal point unclear (K4) | Nielsen 8 (visual hierarchy) | P0 | ✅ Featured card: darker bg (`ink-700`), bold title (600), "günün" badge |
| `/dashboard` | Karma counter hero'da top-right (muted); weekly summary eksik | Nielsen 6 (recognition) | P1 | Weekly Karma widget hero altında ("Bu hafta +150 Karma") |
| `/dashboard/missions` | Empty state "Henüz görev yok" sadece text; no illustration/CTA | Nielsen 10 (help) | P1 | SVG empty (boş saat), "Keşfet'te ara" CTA |
| `/dashboard/missions/[id]` | Apply button → "Başvurun alındı" state net ama 2. ziyaret'te "yeniden katıl" opsiyon yok | User flow | P1 | Mission detail: "Bu görevde artık yer yok" vs "Başka seri yok" clear messaging |

### Dashboard — NGO / Tier
| Sayfa | P0/P1 Bulgu | Root | Severity | Fix |
|-------|------------|------|----------|-----|
| `/dashboard/ngos` | List → Detail flow fakat NGO membership tier (free/basic/premium) visual clear değil (status bagde) | Information architecture | P1 | NGO card: membership status badge ("Üyesi değilim" / "Beklemede" / "Aktif üyesi"), 1-click upgrade CTA |
| `/dashboard/profile` | Tier badge (Karma → Çiçeklenen → Çınar) profile sayfada gösteriliyor ama tier-up momentum sinyali yok ("Çınar'a 500 Karma daha") | Motivation loop | P1 | Profile tier card: next-tier progress bar + "Hedefi unvanını kazan" CTA |
| `/dashboard/tiers` | Tier listing page tier-up criteria clear ama "kacım sırada 10'a" sorusunun cevabı leaderboard'da, link yok | Navigation clarity | P1 | Tiers page bottom: "Sıralamanı gör" button → `/dashboard/leaderboard` |

### Dashboard — Rewards
| Sayfa | P0/P1 Bulgu | Root | Severity | Fix |
|-------|------------|------|----------|-----|
| `/dashboard/rewards` | Empty state (Karma yetersiz): "Şimdi ödül alacak Karma'ya sahip değilsin" | Nielsen 10 + tone | P1 | "300 Karma'ya kadar 5 görev daha! Hadi başla →" (progress bar + CTA) |
| `/dashboard/rewards/[id]` | Redeem akışı 1-click ama success toast sonrası "Kullan nasıl" tutoriyal yok | Onboarding secondary flow | P1 | Success toast: "Kodunu kopyala / Şubede göster" dual CTA |

### Bağış Flow (Donations)
| Sayfa | P0/P1 Bulgu | Root | Severity | Fix |
|-------|------------|------|----------|-----|
| `/dashboard/donations/[id]` | Campaign carousel güzel ama hover state (Duolingo "card lift") yok | Nielsen 8 (visual feedback) | P1 | Card hover: 2px shadow lift + scale 1.02 |
| `/dashboard/donations/[id]/amount` | 3 tutar seçeneği hardcoded; "Başka tutar" input yok | Flexibility (Nielsen 5) | P1 | "Başka tutar gir" tab (doğrulama: min 10 TL, max 10k TL) |
| `/dashboard/donations/[id]/thanks` | Success page confetti + "sosyal paylaş" button var ama email receipt / SMS confirmation yok | Post-action clarity | P0 | Modal: "Email'de detayını gönderiyoruz" + delivery status check |

### Admin (Tier-1 baseline)
| Sayfa | P0/P1 Bulgu | Root | Severity | Fix |
|-------|------------|------|----------|-----|
| `/admin/[ngoId]/missions/new` | Form 8 alan; validation toast yok, submit ≥10sn (upload?) → loading state belirsiz | Nielsen 1 (visibility) | P0 | Loading skeleton + estimated time ("~5sn") |
| `/admin/[ngoId]/verifications` | Queue list → approve/reject akışında batch action (50 item select+approve) confirm modal yok | Nielsen 3 (error prevention) | P1 | Batch select: checkbox sidebar + "50 gördürü sil & onay ver?" modal |

---

## B. Cross-Page Pattern Drift (Tutarsızlıklar)

### Heart / Favorite / Follow Buttons
**Gözlem:** Pattern sayfa sayfa dağınık.

- **Mission card:** Save (bookmark) ♥ icon, top-right, no label
- **NGO card:** Follow ♥ icon, bottom-right, no label  
- **Reward card:** Favorite ♥ icon, top-right, label "Bunu seviyorum" (tooltip hover)
- **Post card:** Like ♥ icon, bottom, label visible, counter ("+2")

**Root:** Component API `.tsx` standart yok; card variant'ları UI designer tarafından başka başka implemente edilmiş.

**Tavsiye:** 
- Unified `HeartButton` component (`app/components/ui/heart-button.tsx`): `variant: "save" | "follow" | "like"`, consistent size (44×44), label optional
- Pattern document: `docs/design-system/01-patterns/button-heart.md` (tone + placement rule)

### Bottom Nav Hierarchy — Profil Alt Menu
**Gözlem:** Bottom nav (Ana / Görevler / Bağış / Ödüller / Profil) clear, **ama Profil tap → sub-nav nedir?**

- **Kod reality** (`app/dashboard/profile/layout.tsx`): Profil → Edit / Badges / Interests 3 tab (side scroll), **Tiers page ayrı** (`/dashboard/tiers`)
- **UX expectation**: "Profil tap → profilim başka ne gösterebilir?" (Karma timeline missing, tier status visible değil)

**Tavsiye:**
- Profile altında explicit subpages:
  - `/dashboard/profile` — Özet (Karma, üyelikler, tier badge, timeline boş state)
  - `/dashboard/profile/edit` — Edit
  - `/dashboard/profile/badges` — Achievements
  - `/dashboard/profile/interests` — Preferences
  - `/dashboard/profile/karma-history` — **NEW** (K6 epic: Karma transaction log)
  - → Tier info `/dashboard/tiers` cross-link (not subpage, but explicit)
- Tab UI: 5-tab scrollable (mobile-friendly) vs dropdown (desktop, if space)

### Onboarding Copy Tone
**Gözlem:** Welcome (samimi, kısa) → Causes (faktual, long-form) → City (faktual) — tone shift felt.

- Welcome: "Gönüllü ol, fark yarat" (2-3 words, emotional)
- Causes: "İlgi alanlarını seç — bu kişiselleştirmede yardımcı" (long, rational)
- City: "Beni bul — bölgede etkin STK'ları görmek için" (long, rational)

**Tavsiye:** Causes & City başlık mikrokopyası emotional hook ekle:
- Causes: "Senin için uygun görevleri bulabilmek için, ne konuları seviyorsun?"
- City: "Sana yakın STK'lardan görevler bulayım — nerede yaşıyorsun?"

---

## C. User Journey Friction Noktaları

### Onboarding → First Mission (H1 öğrenmiş varsayım)
**Akış:** Welcome (Adım 1) → Causes (Adım 2, KVKK tereddüsü **dark moment**) → City (Adım 3) → Dashboard (Adım 4) → Missions list (Adım 5) → Mission detail (Adım 6) → Apply (Adım 7)

**Drop-off risk (top 3):**
1. **Adım 2 (Causes):** KVKK checkbox "Kişisel verilerimi işlemesi rıza veriyorum" (long Turkish legal text). **Fix:** Tooltip "Bu sadece sana uygun görevleri bulmak için kullanılıyor" + link `docs/privacy`.
2. **Adım 3 (City):** "Konum izni ver" prompt (Capacitor native). User redden'de fallback? **Fix:** "Şehri manuel gir" fallback (dropdown), "Konum izni sonra" skip.
3. **Adım 5–6 (Mission detail):** Apply button → loading state 2–3sn, user "çalışıyor mu" anlamıyor. **Fix:** "Başvurunuz kaydediliyor..." skeleton + haptic feedback.

### Tier Journey — Motivation Loop Zayıf
**Akış:** Dashboard (Karma counter hero) → Tiers page (tier criteria) → Leaderboard (rank visualize) → Back to dashboard (momentum yok)

**Dark moments:**
- Leaderboard sayfa: "Rank #1453" — visual weight zayıf (muted text). User "neden çalışayım" hissiyatı gevşek.
- Tiers page: "Çınar'a 500 Karma daha" progress bar yok. Just definition.
- Profile: Tier badge exists ama 3D glow / animated transition yok (tier-up ceremony eksik).

**Tavsiye:**
- Leaderboard: Rank number → bold gold, position visual (medal emoji ≥top-100), "Hangi gövde seninle aynı seviyede?" segmented filter
- Tier-up celebration: Profile tier update → `motion.div` pulse + confetti + sound (prefers-reduced-motion respect)
- Tier page: "Sıradaki unvana X Karma — yüzde Y kadar" progress indicator

### Bağış Flow — Decision Friction (Tuple)
**Akış:** Campaign carousel (Adım 1) → Detail (Adım 2, scarcity "500 bağış kaldı" görüyorum) → Amount select (Adım 3, "100 TL'yim mi diye tereddüt") → Review (Adım 4) → Thanks (Adım 5)

**Dark moment (Adım 3):** Amount seçimi — 3 preset tutar ama "ben 75 TL'yi desteklemek istiyorum" opsiyon eksik. **User bounce risk: high**.

**Fix:** "Başka tutar" toggle → input `[min 10, max 10000]` (validation clear, "Bunu uygun gördüğün kadar seç")

### NGO Membership — Parametric Form Friction
**Akış:** NGO detail (Adım 1) → Membership CTA (Adım 2) → Parametric form (Adım 3, form_fields JSONB per NGO) → Success (Adım 4)

**Friction:** Form fields per NGO (some: name+email, some: name+email+phone+workplace). User "bu kadar bilgi neden" tereddüsü. **No field-level tooltip**.

**Fix:** Per-field label + inline help text (JSONB schema'da `help_text` key) örn: "Telefon" + 📝 "Görev yerinde seni bulabilmek için" (context-specific)

---

## D. Sprint Vol-62 Önerisi — UX Odaklı Paket

**Hedef:** Friction noktaları + pattern drift çöz, tier-1+ momentum loop kuvvetlendir.

### Quick-win (2–3 saat)
1. **Onboarding tone refinement** — Causes & City başlık microcopy (emotional hook)
2. **Profile tier progress bar** — "Çınar'a X Karma" inline
3. **Leaderboard number visual weight** — rank #1453 → bold gold
4. **Rewards empty state illustrate** — "5 görev daha" CTA

### Medium-effort (1 hafta sprint)
5. **Unified HeartButton component** — save/follow/like consistency
6. **Onboarding drop-off safeguards** — KVKK tooltip + city fallback + loading states
7. **Bağış flow flexibility** — "Başka tutar" input + validation
8. **Tier-up ceremony** — Profile tier update animation (motion + haptic)

### Backlog (V1.1+)
9. **Karma history page** (`/dashboard/karma-history` — K6 epic)
10. **Profile sub-nav map** — explicit pages (5 tab + tier link)
11. **Tier leaderboard filter** — segment by level
12. **NGO form field tooltip** — per-field help text (JSONB extension)

**Priority:** Q-win + medium-effort = 1 sprint (5 days); backlog = parallel or next sprint.

---

## Self-Assessment

- ✅ **Scope:** Landing → Auth → Onboarding → Dashboard (5 nav) → Mission → NGO → Bağış × 3 → Admin → Sponsor 38-page systematic audit (mevcut full-app audit reférencé)
- ✅ **Pattern drift:** 3 kategori denkleştirildi (Heart buttons, Bottom nav, Copy tone)
- ✅ **Friction analiz:** Onboarding (3 drop-off), Tier momentum (3 dark moment), Bağış (1 decision), NGO form (1 confusion)
- ✅ **Sprint actionable:** 4 quick-win + 4 medium-effort + 4 backlog (PO/prioritize etmesi istenebilir)
- ⚠️ **Kanıt sınıfları:** [Kod] 38 sayfa okundu, [Gözlem] pattern drift visual inspected, [Hipotez] friction point — no user test (discovery V2)

**Açık karar:** 0 (audit deliverable complete; implementation prioritization → Product Analyst)

---

**Dosya:** `docs/ux/2026-05-03-cross-journey-ux-friction-analysis.md`  
**Yazar:** ux-researcher  
**Tarih:** 2026-05-03  
**Status:** ✅ Completed  
**Effort:** 120 min (full-app context reinterpret + cross-page pattern analysis + friction mapping)  
**Downstream:** product-analyst (prioritization), ui-designer (refinement specs), frontend-engineer (implementation backlog)
