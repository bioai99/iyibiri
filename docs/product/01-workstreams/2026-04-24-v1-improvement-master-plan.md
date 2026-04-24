# V1 Improvement Master Plan — Mevcut Ürün × Iyileştirme

**Durum:** scoping → ready-for-handoff
**Sahip:** product-analyst
**Açıldı:** 2026-04-24
**Vizyon:** atlas + 8 Accepted ADR + 12 strateji memosu + 3 Workstream sentezi
**İçerik:** İyiBiri'nin mevcut 38 sayfası + component envanteri × iyileştirme/değişiklik kararları, her biri için priority + effort + owner agent.

---

## 1. Yönetim Özeti

**İyiBiri V1'e sıfırdan geçmiyoruz — mevcut ürünün üstüne iyileştirme + hedefli değişiklikler yapıyoruz.** Page audit: 38 sayfa, %79 production, %8 beta, %11 prototype (mock). Atlas Bölüm 6-7: 15+ UI atom + 8 özel component + 13 migration × ayrı veri modeli. 8 Accepted ADR bu üstüne yeni mimari kuralları koyuyor. Bu master plan her sayfa + component + sistemik katman için **ne yapılacak** sorusunun net cevabını veriyor.

**Dört karar türü:**

| Tür | Anlam |
|---|---|
| **Keep** | Mevcut hali iyi, V1'de dokunulmaz. |
| **Improve** | Mevcut hali kabul edilebilir, küçük iyileştirmeler (UI, state, copy). |
| **Change** | Yapısal değişiklik gerekli — ADR'lere uygun refactor. |
| **Deprecate** | V1'de kaldır veya saklı bırak. |

**Üç öncelik:**
- **P0** = V1 lansmanı blocker (Ay 1-3).
- **P1** = V1 kapsamı, lansmanı etkiler ama sonradan iyileştirilebilir (Ay 2-4).
- **P2** = V1.1 (Ay 5-7).
- **P3** = V2+ (Yıl 2).

**Dört effort bandı:** S (≤3 gün), M (1 hafta), L (2-3 hafta), XL (1+ ay).

---

## 2. Sayfa Sayfa Karar Tablosu (38 sayfa)

### 2.A Landing + Auth (7 sayfa)

| # | Sayfa | Durum | Karar | Priority | Effort | Owner | Not |
|---|---|---|---|---|---|---|---|
| 1 | `/` Landing (71 KB) | 🟢 prod | **Keep** | — | — | — | Three.js + GSAP lansman kampanyası için yeterli. Landing-growth (Faz 3) Yıl 2'de iyileştirir. |
| 2 | `/app-start` Splash | 🟢 prod | **Keep** | — | — | — | Auth redirect çalışıyor. |
| 3 | `/auth/login` OAuth | 🟢 prod | **Improve** (minor) | P1 | S | auth-capacitor | Button copy + dark mode kontrol (ADR-004). |
| 4 | `/auth/signin` email | 🟡 beta | **Change** | P0 | M | auth-capacitor | "Şifremi unuttum" ölü link → gerçek akışa bağla (Eng brief mevcut). |
| 5 | `/auth/signup` | 🟢 prod | **Improve** | P1 | S | auth-capacitor | KVKK çifte onay hazırlık (ADR-008): İyiBiri genel + sonra STK özel (farklı akış). |
| 6 | `/auth/verify` OTP | 🟢 prod | **Keep** | — | — | — | Auto-submit + paste + countdown çalışıyor. |
| 7 | `/auth/callback` | 🟢 prod | **Keep** | — | — | — | OAuth return handler. |

### 2.B Onboarding (4 sayfa)

| # | Sayfa | Durum | Karar | Priority | Effort | Owner | Not |
|---|---|---|---|---|---|---|---|
| 8 | `/onboarding` redirect | 🟢 prod | **Keep** | — | — | — | Sadece redirect. |
| 9 | `/onboarding/welcome` 3-slide | 🟢 prod | **Improve** | P1 | S | frontend-engineer | Slide metinlerini ADR-001 NSM ile uyumlu hale getir ("Karma kazan, iyilik yap, fark yarat"). |
| 10 | `/onboarding/causes` | 🟡 localStorage | **Change** | P0 | M | frontend-engineer + supabase-backend | **Kritik fix:** localStorage → DB (`profiles.interests`) direkt kayıt. Dashboard fetch'te sync gecikmesi bitiyor. |
| 11 | `/onboarding/city` | 🟡 localStorage | **Change** | P0 | S | frontend-engineer + supabase-backend | Aynı — DB'ye doğrudan sync + ADR-003 (İstanbul pilot uyum). |

### 2.C Dashboard Ana (6 sayfa)

| # | Sayfa | Durum | Karar | Priority | Effort | Owner | Not |
|---|---|---|---|---|---|---|---|
| 12 | `/dashboard` ana | 🟢 prod | **Improve+Change** | P0 | L | ux-researcher → ui-designer → frontend-engineer | Hero + KarmaCounter + günlük görev + streak snapshot + leaderboard teaser. ADR-001 MAKE görünürlüğü. UX brief yazılacak (bu master plan sonrası). |
| 13 | `/dashboard/discover` | 🟡 beta | **Improve** | P1 | M | frontend-engineer | Blog + kategori filtresi ADR-007 taxonomy'ye uyumlu. |
| 14 | `/dashboard/missions` liste | 🟢 prod | **Improve** | P0 | M | frontend-engineer | Filter taxonomy (ADR-007): aktivite × alan × zaman × beceri. Mission card 4 chip. |
| 15 | `/dashboard/missions/[id]` detay | 🟢 prod | **Improve+Change** | P0 | L | ux-researcher → ui-designer → frontend-engineer | State machine 4 durum (pre/taken/check-in/completed) net geçiş. Karma formülü görünürlüğü. Impact statement vurgusu. UX brief yazılacak. |
| 16 | `/dashboard/missions/[id]/complete` | 🟢 prod | **Improve** | P1 | M | frontend-engineer + design-system-keeper | QR/kod doğrulama sonrası KarmaCounter animasyon + impact + streak update — polish. |
| 17 | `/dashboard/my-missions` | 🟢 prod | **Keep** | — | — | — | 2026-04-19'da gerçek veriye bağlandı. Ek iş yok. |

### 2.D Dashboard NGO / Üyelik (4 sayfa)

| # | Sayfa | Durum | Karar | Priority | Effort | Owner | Not |
|---|---|---|---|---|---|---|---|
| 18 | `/dashboard/ngos` liste | 🟢 prod | **Improve** | P1 | M | frontend-engineer | ADR-008 `tax_exempt` etiket + `payment_mode` badge (info). Search + filter genişlet. |
| 19 | `/dashboard/ngos/[id]` profil | 🟢 prod | **Change** | P0 | L | ux-researcher → ui-designer → frontend-engineer | ADR-007 `membership_fee_config` görünümü + tax_exempt etiket + dışa embed widget alanı. UX brief yazılacak. |
| 20 | `/dashboard/ngos/[id]/membership` form | 🟢 prod | **Change (major)** | P0 | XL | ux-researcher → ui-designer → frontend-engineer → supabase-backend | **En kritik:** ADR-007 parametric fee jsonb 5 modu için dinamik form (age_tiered / monthly / annual / one_time / donation_based) + ADR-008 payment routing (embedded/passthrough/marketplace) × her STK'ya göre farklı akış. KVKK çifte onay. 14 gün cayma hakkı UI. UX brief yazılacak. |
| 21 | `/membership/success` | 🟢 prod | **Improve** | P1 | S | frontend-engineer | Payment callback sonrası status sync + referral attribution kayıt (ADR-008 `referrals` tablosu). |

### 2.E Dashboard Blog (1 sayfa)

| # | Sayfa | Durum | Karar | Priority | Effort | Owner | Not |
|---|---|---|---|---|---|---|---|
| 22 | `/dashboard/posts/[id]` | 🟢 prod | **Keep** | — | — | — | Like + paylaş + CTA çalışıyor. |

### 2.F Dashboard Bağış (4 sayfa — MOCK)

| # | Sayfa | Durum | Karar | Priority | Effort | Owner | Not |
|---|---|---|---|---|---|---|---|
| 23 | `/dashboard/donations/[id]` kampanya | 🔴 mock | **Deprecate (V1)** | P0 | S | frontend-engineer | ADR-006: ComingSoonBanner hero variant ekle. V2 için saklı. |
| 24 | `/amount` | 🔴 mock | **Deprecate (V1)** | P0 | S | frontend-engineer | Aynı. |
| 25 | `/review` | 🔴 mock | **Deprecate (V1)** | P0 | S | frontend-engineer | Aynı. |
| 26 | `/thanks` | 🔴 mock | **Deprecate (V1)** | P0 | S | frontend-engineer | Aynı. |

### 2.G Dashboard Profil (4 sayfa)

| # | Sayfa | Durum | Karar | Priority | Effort | Owner | Not |
|---|---|---|---|---|---|---|---|
| 27 | `/dashboard/profile` | 🟢 prod | **Improve** | P1 | M | ux-researcher → frontend-engineer | Karma log (eksik), yıllık özet placeholder, vergi beyannamesi opsiyonel checkbox (Q20). |
| 28 | `/profile/edit` | 🟢 prod | **Improve** | P1 | S | frontend-engineer | Vergi beyannamesi checkbox + `profiles.tax_declaration: boolean` migration. |
| 29 | `/profile/badges` | 🟢 prod | **Keep** | — | — | — | 2026-04-19 yeni tema. |
| 30 | `/profile/interests` | 🟢 prod | **Keep** | — | — | — | 2026-04-19 fix. |

### 2.H Dashboard Ödül (2 sayfa)

| # | Sayfa | Durum | Karar | Priority | Effort | Owner | Not |
|---|---|---|---|---|---|---|---|
| 31 | `/dashboard/rewards` liste | 🟢 prod | **Improve** | P1 | S | frontend-engineer | Ödül kart UI polish. Karma filter. |
| 32 | `/dashboard/rewards/[id]` | 🟢 prod | **Improve** | P1 | S | frontend-engineer | Redeem akışı + paylaşım kartı (marka logo). |

### 2.I Dashboard Diğer (5 sayfa)

| # | Sayfa | Durum | Karar | Priority | Effort | Owner | Not |
|---|---|---|---|---|---|---|---|
| 33 | `/dashboard/saved` | 🟡 beta | **Improve** | P2 | S | frontend-engineer | Empty state + sort options. |
| 34 | `/dashboard/leaderboard` | 🟢 prod | **Improve** | P1 | M | frontend-engineer | Friends tab henüz fonksiyon yok — arkadaş sistemi ayrı iş (P3). |
| 35 | `/dashboard/notifications` | 🟢 prod | **Improve** | P1 | S | frontend-engineer | Read/unread state. Gerçek push bildirim (P3). |
| 36 | `/dashboard/streak` | 🟢 prod | **Keep** | — | — | — | 2026-04-19 gerçek veri. |
| (Yok) | `/dashboard/tiers` | 🟢 prod | **Keep** | — | — | — | Seviye listesi. |

### 2.J Admin (3 sayfa)

| # | Sayfa | Durum | Karar | Priority | Effort | Owner | Not |
|---|---|---|---|---|---|---|---|
| 37 | `/admin/login` | 🟢 prod | **Keep** | — | — | — | Basit çalışıyor (ADMIN_SECRET cookie). |
| 38 | `/admin/missions` | 🟢 prod | **Change (major)** | P0 | XL | ux-researcher → ui-designer → frontend-engineer | **Kritik:** STK admin UI V0 ekle (WS-02) — ADR-005 pilot 3 STK için fee config editor + görev oluşturma + üye listesi + parametric form alanları. Multi-tenant (ngo_admin role). |
| 39 | `/admin/missions/[id]/qr` | 🟢 prod | **Improve** | P1 | S | frontend-engineer | QR generator + batch print. |

---

## 3. Component Envanteri × Karar

### 3.A `components/ui/` atom'lar

| Component | Durum | Karar | Notlar |
|---|---|---|---|
| `badge.tsx` | 🟢 | Keep | Token uyumlu. |
| `brand-logo.tsx` | 🟢 | Keep | — |
| `button.tsx` | 🟢 | Improve (variant ekle) | "ghost" variant ekle; loading state polish. design-system-keeper. |
| `card.tsx` | 🟢 | Keep | — |
| `celebration-overlay.tsx` | 🟢 | Improve | Impact statement parametresi; Karma counter entegrasyon. |
| `coming-soon-banner.tsx` | 🟢 | Keep | **Yeni (2026-04-24), ADR-006.** |
| `domain-icon.tsx` | 🟡 | Change | Atlas 6-domain → 10-domain (ADR-007 taxonomy): +animals, +culture, +health, +disaster, +rights, +youth. design-system-keeper. |
| `empty-state.tsx` | 🟢 | Improve | WS-04 sistemik empty state için "EmptyStateLibrary" genişlet — 5-6 varyant. design-system-keeper + ui-designer. |
| `input.tsx` | 🟢 | Keep | — |
| `karma-counter.tsx` | 🟢 | Improve | Karma formülü tooltip gösterimi (ADR-007). |
| `label.tsx` | 🟢 | Keep | — |
| `mission-card.tsx` (ui) vs `mission-card.tsx` (components) | 🔴 | Change | **D4 (atlas Bölüm 10):** Duplicate var. Kanonik olanı seç (ui/ tercih) + diğeri retire. design-system-keeper. |
| `progress.tsx` | 🟢 | Keep | — |
| `qr-scanner.tsx` | 🟢 | Keep | — |
| `separator.tsx` | 🟢 | Keep | — |
| `skeleton.tsx` | 🟢 | Improve | WS-04 sistemik loading için "SkeletonKit" — kart/liste/hero varyantları. design-system-keeper. |
| `streak-flame.tsx` | 🟢 | Keep | — |
| `tier-badge.tsx` | 🟢 | Keep | — |
| `xp-bar.tsx` (ui) vs `xp-bar.tsx` (components) | 🟡 | Change | Duplicate kontrol — kanonik karar. design-system-keeper. |

### 3.B `components/` özel composition

| Component | Durum | Karar | Notlar |
|---|---|---|---|
| `auth-feedback.tsx` | 🟢 | Keep | — |
| `bottom-nav.tsx` | 🟢 | Improve | "Keşfet" tab'ı yerine "Ödüller" görünür yapma (P1 kullanım verisi sonra). |
| `logo.tsx` | 🟢 | Keep | — |
| `mission-card.tsx` | 🔴 | Deprecate | Duplicate — ui/mission-card tercih. |
| `onboarding-redirect.tsx` | 🟢 | Keep | — |
| `waitlist-form.tsx` | 🟡 | Deprecate (V1) | Landing'de hâlâ var, V1'de waitlist kaldırıldığında retire. |
| `xp-bar.tsx` | 🔴 | Deprecate | Duplicate — ui/xp-bar tercih. |

### 3.C `lib/` altyapı

| Modül | Karar | Not |
|---|---|---|
| `lib/auth/oauth-native.ts` | Improve | Native OAuth fix 2026-04-18 plan kontrolü. auth-capacitor. |
| `lib/supabase/{client,server,types}.ts` | Improve | Type dosyası her migration sonrası güncel tut (ADR-007 + ADR-008 değişimleri dahil). supabase-backend. |
| `lib/supabase/queries/` | Improve | Yeni WS'ler için query modülleri. supabase-backend. |
| `lib/theme.tsx` | Change | ADR-004: dark-only V1 — ThemeProvider default dark, light opt-in placeholder. design-system-keeper. |
| `lib/mock-data.ts` | Deprecate (kademeli) | Seed script'lere veri aktarım, mock-data dosyası sadece referans. supabase-backend. |
| `lib/utils.ts` | Keep | `cn` helper. |

---

## 4. Sistemik Boşluklar (Cross-cutting)

### 4.A Loading / Empty / Error State (WS-04 aday)

**Durum:** Atlas Bölüm 10 + audit'e göre **sistemik eksik**. Hiçbir sayfada `loading.tsx` yok. Empty state'ler yarı-uygulanmış. Error state'ler ad-hoc.

**Karar:** **Change (major), P0.**
**Effort:** XL (3-4 hafta tüm sayfalar için).
**Owner:** ui-designer (spec) → frontend-engineer + design-system-keeper (implementation).
**UX brief:** yazılacak (aşağıda).

### 4.B KVKK Çifte Onay (ADR-008)

**Durum:** Mevcut signup'ta İyiBiri KVKK onayı var; STK membership formunda **STK özel onay eksik.**

**Karar:** **Change, P0.**
**Effort:** M.
**Owner:** auth-capacitor (legal + logic) → frontend-engineer (UI).

### 4.C 14 Gün Cayma Hakkı UI (TR 6502)

**Durum:** Yok.
**Karar:** **Change, P0** — üyelik akışında şart.
**Effort:** M.
**Owner:** frontend-engineer + auth-capacitor.

### 4.D Karma Log / Geçmiş (HANDOFF eksik)

**Durum:** Profil'de Karma toplamı var, geçmiş yok.
**Karar:** **Improve, P1.**
**Effort:** M.
**Owner:** frontend-engineer + supabase-backend (query).

### 4.E Vergi Beyannamesi Opsiyonel Tag (Q20)

**Durum:** Yok.
**Karar:** **Add, P2** — profil settings.
**Effort:** S.
**Owner:** frontend-engineer + supabase-backend (migration `profiles.tax_declaration boolean`).

### 4.F Şifremi Unuttum Akışı (audit eksik)

**Durum:** `/auth/signin` ölü link.
**Karar:** **Change, P0.**
**Effort:** M.
**Owner:** auth-capacitor.

### 4.G STK Admin Multi-tenant Role

**Durum:** `middleware.ts` sadece ADMIN_SECRET cookie tanır; STK admin rolü yok.
**Karar:** **Change (major), P0** — WS-02 kapsamı.
**Effort:** L.
**Owner:** auth-capacitor + supabase-backend + frontend-engineer.

### 4.H Push Bildirim (Capacitor)

**Durum:** Yok. `manifest.json` var ama push entegrasyonu yok.
**Karar:** **Add, P2** — V1 sonrası.
**Effort:** L.
**Owner:** auth-capacitor / mobile-capacitor (Faz 3 agent kurulunca).

### 4.I Paylaşım Kartı (HANDOFF eksik)

**Durum:** "Paylaş" butonları var, kart template yok.
**Karar:** **Add, P2** — V1 sonrası growth.
**Effort:** M.
**Owner:** ui-designer → frontend-engineer.

### 4.J Design System Reconciliation

**Durum:** Atlas Bölüm 10: `design-system/README.md` eski palet + font; tailwind.config.ts "Premium × Warm" + Fraunces.
**Karar:** **Change, P0** — tutarlılık.
**Effort:** S (dokümantasyon).
**Owner:** design-system-keeper.

### 4.K Görev Taxonomy Schema Expansion (ADR-007, WS-05 aday)

**Durum:** `missions.domain` enum 4 değer; yeni taxonomy 7-boyutlu (10 aktivite × 10 alan × 7 zaman × 5 lokasyon × 4 skill × 4 verify × 9 beneficiary).
**Karar:** **Change (major), P1.**
**Effort:** L.
**Owner:** supabase-backend (migration) + frontend-engineer (UI mapping).

### 4.L Arkadaş Sistemi

**Durum:** Leaderboard'da "Arkadaşlar" tab var, akış yok.
**Karar:** **Add, P3** — V2 kapsamı.
**Effort:** XL.
**Owner:** Yeni workstream Yıl 2.

---

## 5. Priority Matrisi (P0 odak)

### P0 — V1 Lansman Blocker (Ay 1-3)

| # | Başlık | Brief türü | Owner zinciri |
|---|---|---|---|
| 1 | Dashboard ana v2 (MAKE görünürlük + hero + günlük görev) | UX brief | ux-researcher → ui-designer → frontend-engineer |
| 2 | NGO membership parametric flow (ADR-007 + ADR-008) | UX brief (en büyük) | ux-researcher → ui-designer → frontend-engineer + supabase-backend |
| 3 | Mission detail state machine net geçiş | UX brief | ux-researcher → ui-designer → frontend-engineer |
| 4 | Sistemik loading/empty/error state library | UX brief | ui-designer → design-system-keeper + frontend-engineer |
| 5 | Bağış 4 mock sayfa → ComingSoonBanner (ADR-006) | Eng brief | frontend-engineer |
| 6 | Onboarding causes + city localStorage → DB sync | Eng brief | frontend-engineer + supabase-backend |
| 7 | Şifremi unuttum akışı | Eng brief | auth-capacitor |
| 8 | KVKK çifte onay + 14 gün cayma UI | UX + Eng brief | auth-capacitor + frontend-engineer |
| 9 | STK admin UI V0 — **Min+ scope (10 sayfa, 2026-04-24 onaylandı)** | UX + Eng brief | ux-researcher → ui-designer → frontend-engineer + supabase-backend + auth-capacitor |
| 10 | Design system reconciliation (atlas vs README vs kod) | Eng brief | design-system-keeper |

> **P0 #9 Min+ Scope detayı** (karar kuyruğu Q17 — Bahadır 2026-04-24):
>
> **10 sayfa:**
> 1. Dashboard overview · 2. Görev yayınla/düzenle + görsel upload · 3. Görevlerim listesi + status toggle · 4. Üye listesi + CSV export · 5. Doğrulama kuyruğu (photo/code/QR approve/reject + admin_feedback) · 6. Aylık rapor · 7. Blog yazma (per-STK posts, `ngo_id` filter, published toggle) · 8. STK profil (logo + cover + tagline + description + iletişim) · 9. Üyelik ayarları (fee config jsonb editör + membership_form_fields + cooling_off_days + **yasal dokümanlar: KVKK + Üyelik Sözleşmesi + Gönüllülük Sözleşmesi PDF upload, migration 016**) · 10. Ödeme bağlantıları (fonzip URL self-serve text fields + iyzico/PayTR read-only status)
>
> **Ödeme onboarding ayrımı:**
> - ✅ **STK self-serve:** fonzip URL (donation_url/membership_url), fee config tier'ları, membership_form_fields jsonb
> - 🔒 **Platform manuel (pilot 3-5 STK için op ekibi):** iyzico Marketplace sub-merchant onboarding (2-4 saat/STK + iyzico 3-7 iş günü onay) + PayTR merchant onboarding + Supabase Vault key storage + payment_mode/processor DB fill
>
> **Effort:** ~10 gün FE + 4.5 gün BE ≈ 2-2.5 hafta (1 FE) veya 1.5 hafta (FE+BE paralel).
>
> **Sonraki adım:** ADR-010 yaz (analist), UX brief yaz (ux-researcher), sonra UI spec + component scaffold.
| 11 | `009_parametric_ngo_fee.sql` apply | Eng brief | supabase-backend |
| 12 | `010_payment_routing.sql` apply | Eng brief | supabase-backend |

### P1 — V1 Kapsamı (Ay 2-4)

| # | Başlık | Effort | Owner |
|---|---|---|---|
| 1 | Signup KVKK hazırlık | S | auth-capacitor |
| 2 | Onboarding welcome copy | S | frontend-engineer |
| 3 | `/dashboard/discover` blog + kategori | M | frontend-engineer |
| 4 | `/dashboard/missions` taxonomy filter | M | frontend-engineer |
| 5 | `/dashboard/missions/[id]/complete` polish | M | frontend-engineer + design-system-keeper |
| 6 | `/dashboard/ngos` tax_exempt etiket + search | M | frontend-engineer |
| 7 | `/dashboard/ngos/[id]/membership/success` referral attribution | S | frontend-engineer + supabase-backend |
| 8 | `/dashboard/profile` Karma log + yıllık özet | M | frontend-engineer + supabase-backend |
| 9 | `/dashboard/rewards/[id]` polish | S | frontend-engineer |
| 10 | `/dashboard/leaderboard` friends tab placeholder | M | frontend-engineer |
| 11 | `/dashboard/notifications` read/unread | S | frontend-engineer |
| 12 | `components/ui/button.tsx` ghost variant | S | design-system-keeper |
| 13 | `components/ui/domain-icon.tsx` 10-domain | S | design-system-keeper |
| 14 | Mission card canonical (duplicate resolve) | S | design-system-keeper |

### P2 — V1.1 (Ay 5-7)

- Vergi beyannamesi opsiyonel checkbox + migration
- Paylaşım kartı template
- `/dashboard/saved` polish
- Görev taxonomy schema expansion (ADR-007, WS-05)
- Bottom nav yeniden düzenleme (usage data sonrası)

### P3 — V2+ (Yıl 2)

- Arkadaş sistemi
- Push bildirim altyapısı
- Bağış akışı yeniden aktivasyon (V2 yönlendirici model ADR-006)
- Fonzip migration tool (Q35)
- Multi-NGO bundle (Q18)

---

## 6. Effort Özet

| Priority | İş sayısı | Toplam effort tahmin |
|---|---|---|
| P0 | 12 iş | ~14-16 hafta paralel (2-3 aylık V1 lansman) |
| P1 | 14 iş | ~8-10 hafta paralel (V1 ikinci dalga) |
| P2 | 5 iş | ~4-5 hafta (V1.1 tahta) |
| P3 | 5 iş | Yıl 2 roadmap |

**V1 lansman = P0 + P0/P1 karışım ~3 ay.** Orta senaryo hesap: 4 Faz 2 agent + 2 discovery (UX + UI) + kullanıcı koordinasyon.

---

## 7. Aktarım Planı — Sonraki Adımlar

### Hemen (bu turun çıktısı)

- **4 UX brief** yazılıyor (bu plan ile paralel):
  1. `02-briefs/ux/2026-04-24-dashboard-ana-v2.md` — Dashboard hero + MAKE
  2. `02-briefs/ux/2026-04-24-ngo-membership-parametric.md` — Üyelik form dinamik
  3. `02-briefs/ux/2026-04-24-mission-detail-state-clarity.md` — 4-state geçiş
  4. `02-briefs/ux/2026-04-24-loading-empty-error-sistemik.md` — State library

- **3 Eng brief** yazılıyor (bu plan ile paralel):
  1. `02-briefs/eng/2026-04-24-ws01-make-view-kpi.md` — Supabase view + dashboard kartı
  2. `02-briefs/eng/2026-04-24-bagis-coming-soon-entegrasyon.md` — Banner ekleme
  3. `02-briefs/eng/2026-04-24-sifre-sifirlama-akisi.md` — Auth reset flow

### Sonra (UX researcher + Faz 2 agent'ları çağrılınca)

- UX researcher her UX brief'i derinleştirir — heuristik audit + user journey + visual wireframe.
- UI designer UX brief'lerinden UI spec yapar (token kullanım + variant × state).
- frontend-engineer + supabase-backend + auth-capacitor + design-system-keeper — kod taraflarına implement.
- product-analyst haftada bir improvement plan güncel tutar (progress + değişen priority).

### Aktarım kuralı

1. **Brief dosyası yazılır → ilgili agent çağrılır.**
2. Agent **önce atlas + ADR'leri** okur, sonra brief'i.
3. Agent implementation sonrası `docs/eng/_journal.md` (dev için) veya kendi journal'ında güncelleme.
4. Sonuç review: ui-designer visual QA + product-analyst self-audit.

---

## 8. Açık Sorular / Risk

- **Faz 2 agent kapasitesi — kim çağırıyor?** Kullanıcı manuel çağırıyor; otomatik orchestration yok. Kullanıcının rolü kritik: "frontend-engineer'ı çağır, X işini yap" gibi.
- **Paralel çalışma çatışması — git branch?** Şu an tek branch (main). 2 agent aynı dosyaya dokunursa sorun. İleride worktree disiplin.
- **Brief yazımı vs implementation hızı** — dev her zaman brief'ten hızlı; UX researcher ile pacing.
- **Pilot 3 STK onay zamanlama** — TEMA pitch gönderme vs dev ilerleme koordinasyonu.

---

## 9. Kapanış Özet

**Bu master plan V1'in "ne değişecek, ne kalacak" sorusunun tek yerden cevabıdır.** 38 sayfa + 15 component × Keep/Improve/Change/Deprecate + 11 sistemik boşluk × priority + effort + owner. Her P0 başlık için brief yazılıyor.

İyiBiri artık **keşif → karar → plan → brief → implementation** zincirinin tam ortasında. Analist zinciri bağladı; Faz 2 agent'ları çağrıldığında kod hızlı çıkacak.

**Sonraki kontrol noktası:** Ay 1 sonunda (Mayıs 2026) plan güncellemesi. P0 ilerleme + P1 önceliklendirme revize.
