# UX Brief — NGO Üyelik Parametric Form

**Tarih:** 2026-04-24
**Sahip (brief):** product-analyst
**Sonraki sahip:** ux-researcher → ui-designer → frontend-engineer + supabase-backend
**Master plan:** `docs/product/01-workstreams/2026-04-24-v1-improvement-master-plan.md` #20
**Priority:** P0 · **Effort:** XL (3-4 hafta toplam, **en büyük P0 işi**)
**Bağlı ADR:** ADR-005 (pilot 3 STK), ADR-007 (parametric fee schema), ADR-008 v2 (payment routing 3-modlu)
**Bağlı WS:** WS-02 (STK pilot onboarding), WS-03 (Membership payments)

## 1. Özet (1 paragraf)

`/dashboard/ngos/[id]/membership` sayfası şu anda parametrik bir form yapısına sahip (`membership_form_fields` jsonb); ama **her STK'nın farklı fee modelini** (TEMA age_tiered ₺256+aidat, HAYTAP aylık ₺30, LÖSEV donation_based) aynı UI üstünde + **payment routing'in 3 modunu** (embedded fonzip / marketplace iyzico / passthrough) tek bir akışa bağlamak gerekiyor. Bu brief **çok yönlü dinamik bir form + payment flow**'u çerçeveler. **V1'in en karmaşık UX çıktısı.**

## 2. Hedef kullanıcı + JTBD

- **Persona:** P1 + P2 — 18-40 yaş dijital yerli kullanıcı.
- **JTBD:** "Beğendiğim STK'ya (TEMA, TEGV, LÖSEV) 60 saniyede üye olmak istiyorum. Ne ödeyeceğimi, ne alacağımı, nereye para akacağını net anlamak istiyorum. 14 gün cayma hakkımı bilmek istiyorum. KVKK'ya onay verirken anlamlı bir açıklama okumak istiyorum."

## 3. Mevcut durum

**Kod:** `/dashboard/ngos/[id]/membership/page.tsx` + `membership-form-client.tsx` + success. Parametric form altyapısı var (`form_data` jsonb).
**Eksikler:**
- Fee model seçimi UI yok — tek "Gönder" butonu farz edilmiş.
- Payment flow yok — ödeme sayfası yok.
- KVKK İyiBiri genel onayı signup'ta var; STK'ya özel ikinci onay UI yok.
- 14 gün cayma hakkı mesajı yok.
- `ngos.membership_fee_config` (yeni ADR-007) UI'ya bağlanmamış.
- `ngos.payment_mode` (yeni ADR-008) routing logic yok.

## 4. Önerilen akış (delta)

### Giriş noktası: `/dashboard/ngos/[id]/membership`

**Adım 1 — Membership bilgilendirme**
```
┌──────────────────────────────────────┐
│ ← Geri        TEMA Vakfı Üyeliği   ⋯ │
├──────────────────────────────────────┤
│                                      │
│   [TEMA logo + cover]                │
│                                      │
│   TEMA üyesi olmak                   │
│   Türkiye'de erozyonla mücadeleye    │
│   katkı ver.                         │
│                                      │
│   Vergi indirimli ✓ (beyannamen     │
│   varsa — bilgi için tıkla)         │
│                                      │
│   Üyelik paketini seç:               │
│                                      │
│   ○ 0-13 yaş            ₺15/yıl     │
│   ○ 14-24 yaş           ₺15/yıl     │
│   ● Yetişkin (büyükşehir) ₺256/yıl  │
│   ○ Yetişkin (diğer)    ₺128/yıl    │
│                                      │
│   [Devam et →]                       │
│                                      │
└──────────────────────────────────────┘
```

**Kilit özellik:** `membership_fee_config.mode` = `age_tiered` ise yaş tier'ları + kullanıcının `profiles.age_range` auto-select. Diğer modlar için farklı render:

- `monthly` (HAYTAP ₺30): tek kart "Aylık ₺30" + "İstediğin zaman iptal et" mesajı.
- `donation_based` (LÖSEV): "Bağış miktarı belirle" + suggested_amounts [50, 100, 250].
- `annual`: tek yıllık tier.
- `one_time`: tek seferlik ödeme.

**Adım 2 — Parametric form (membership_form_fields jsonb)**
```
┌──────────────────────────────────────┐
│   Birkaç bilgi gerekiyor             │
│                                      │
│   [otomatik dolmuş]                  │
│   Ad Soyad: Zehra Demir              │
│   E-posta: zehra@...                 │
│                                      │
│   [STK özel alanlar]                 │
│   Mesleğin: [____________]           │
│   Neden TEMA? [____________]         │
│                                      │
│   [Devam et →]                       │
└──────────────────────────────────────┘
```

**Kilit özellik:** `ngos.membership_form_fields` jsonb'dan dinamik render. İyiBiri profilindeki bilgiler otomatik doldur. Sadece STK-özel alanlar kullanıcıdan istenir.

**Adım 3 — KVKK çifte onay + cayma hakkı**
```
┌──────────────────────────────────────┐
│   Son adım                           │
│                                      │
│   ☐ İyiBiri Gizlilik Politikası'nı  │
│     okudum, onaylıyorum.             │
│     [detay →]                        │
│                                      │
│   ☐ TEMA Aydınlatma Metni'ni         │
│     okudum, üyelik verimin paylaşıl- │
│     masına izin veriyorum.           │
│     [detay →]                        │
│                                      │
│   ℹ️ 14 gün cayma hakkın var         │
│     İlk 14 gün içinde iptal etseniz   │
│     tam para iadesi alırsınız.       │
│                                      │
│   [Ödemeye geç — ₺256]               │
└──────────────────────────────────────┘
```

**Kilit özellik:** İki ayrı checkbox. İkisi de onaylanmadan "Ödemeye geç" inactive. `form_data.kvkk_accepted_at` + `form_data.ngo_kvkk_accepted_at` timestamp olarak kayıt.

**Adım 4 — Payment (ADR-008 3-modlu)**

**Mod 1: Embedded (TEMA — fonzip)**
```
┌──────────────────────────────────────┐
│   Güvenli ödeme                      │
│                                      │
│   [iframe: fonzip ödeme formu]       │
│   [Kart numarası, CVV, son kul. tar] │
│                                      │
│   ℹ️ Ödeme TEMA'nın fonzip altyapısı │
│     üzerinden güvenli şekilde        │
│     işlenir. İyiBiri kart bilgini    │
│     saklamaz.                        │
│                                      │
│   [Öde]                              │
└──────────────────────────────────────┘
```

**Mod 2: Marketplace (TEGV, LÖSEV — iyzico)**
Aynı UI, iyzico Checkout Form iframe.

**Mod 3: Passthrough (ileride özel STK)**
"Ödeme için STK sayfasına yönlendiriliyorsun..." + Capacitor in-app browser modal.

**Adım 5 — Başarı**
`/membership/success` (mevcut) + referral attribution kayıt + Karma bonus animasyonu + "Hoş geldin" e-posta tetiği (STK processor).

## 5. Cognitive load

**Azalan:**
- Profil alanları otomatik doldurulur.
- Fee modeli her STK için tek akış.

**Yeni yük:**
- KVKK iki onay — ama net ikon + bağlantı ile yumuşak.
- Payment 3 mod arası fark kullanıcıya görünür değil (arka plan).

## 6. Başarı kriterleri

- **Tamamlama oranı ≥ %70** — formu başlatanların üye olma oranı.
- **Süre hedef ≤ 90 saniye** — 5 adım.
- **KVKK onay %100** — hiçbir üyelik onaysız oluşamaz.
- **Cayma hakkı UI görünürlüğü %100** — her üyelikte.
- **Payment success rate ≥ %95** — iyzico + fonzip ortalaması.

## 7. Kısıtlar

- Mobile-first (max-w-lg).
- Dark mode.
- iyzico Checkout Form iframe + PayTR + fonzip widget uyumu.
- `prefers-reduced-motion` respect.
- KVKK 14 gün cayma hakkı zorunlu (TR 6502).

## 8. UI ipuçları

- Hero STK kartı — mevcut `/dashboard/ngos/[id]` profil stili.
- Tier seçim: radio list + price tabular-nums font-display.
- Form alanları: `components/ui/input.tsx` + `label.tsx`.
- KVKK checkbox: büyük tap target (accessibility).
- Payment iframe: responsive, min-height 600px, fallback mesaj.

## 9. Test önerileri

- **Usability test** — 5 kullanıcı TEMA age_tiered akışından geçer, süre + friction ölç.
- **5-second test** her adım — "Bu adım ne istiyor?"
- **Edge case test:**
  - Tier seçimi kullanıcının yaşıyla uyuşmuyorsa uyarı.
  - KVKK onaylanmadan Ödeme butonu.
  - Network kesintisi payment iframe durumu.
  - Success page referral attribution tetiklendiği mi?

## 10. Açık sorular

- Profil yaş bilgisi boşsa fee tier seçimi nasıl? (yaş input'u zorunlu mu?)
- Donation_based mode için "teşekkür" mesajı tone — "üye oldun" mu "bağış yaptın" mı?
- Auto-renew kararı — Q16 önerim "off" ama kullanıcı test verisiyle doğrula.

## 11. Bağımlılık

- `009_parametric_ngo_fee.sql` migration apply (supabase-backend).
- `010_payment_routing.sql` migration apply (supabase-backend).
- `ngos.membership_fee_config` seed doldurulmuş (3 pilot STK için zaten yapıldı).
- iyzico Checkout Form SDK entegrasyonu (frontend-engineer + supabase-backend).
- Fonzip embed dokümantasyonu okunup implement (frontend-engineer).
- KVKK aydınlatma metinleri hazır (auth-capacitor + hukuki mütalaa Q10).

## 12. Handoff

- **UX researcher:** user journey + heuristik audit her 5 adım için + edge case senaryoları (1.5 hafta).
- **UI designer:** UI spec — 5 adım × variant × state × motion (1 hafta).
- **supabase-backend:** query + webhook handler (1 hafta).
- **frontend-engineer:** implement + iframe entegrasyon + state management (2 hafta).
- **auth-capacitor:** KVKK metinleri + consent kayıt (0.5 hafta).
- **Visual QA:** ui-designer + product-analyst self-audit.

**Toplam:** 3-4 hafta paralel iş. V1'in en büyük P0 deliverable.

## Handoff log

Bu brief'i alıp üreten agent'ların zinciri. Protokol: `.claude/skills/agent-communication-protocol/SKILL.md` Katman A.

- 2026-04-24 06:45 — **ux-researcher** ✅ — **heuristik audit**: `docs/ux/03-heuristics/2026-04-24-ngo-membership-parametric-heuristik-audit.md`. 3 mode (TEMA age_tiered, HAYTAP monthly, LÖSEV donation) × 3 app benchmark (Stripe/Revolut/Monzo). Kritik 3 bulgu: progress bar yok, KVKK enforcement, impact statement. *(retroactive)*
- 2026-04-24 07:10 — **ui-designer** ✅ — **spec**: `docs/ui/01-specs/2026-04-24-ngo-uyelik-parametric-ui-spec.md`. 15 bölüm, 5 adımlı flow, 3 mode variant, payment embed 3 mode, success celebration. *(retroactive)*
- 2026-04-24 07:30 — **frontend-engineer** ✅ — **component scaffold**: `components/membership/step-progress-bar.tsx` + `tier-card.tsx` + `kvkk-checkbox.tsx` + `payment-embed.tsx` + `success-celebration.tsx` + `index.ts` barrel. *(retroactive)*
- 2026-04-24 08:00 — **frontend-engineer + supabase-backend** ✅ — **full-stack integration**: `lib/supabase/types.ts` + `lib/membership/fee-config.ts` + `lib/membership/actions.ts` + `app/dashboard/ngos/[id]/membership/` flow page + migration 012 karma_transactions type. 28/28 unit test pass. *(retroactive)*
- 2026-04-24 08:30 — **frontend-engineer + supabase-backend** ✅ — **sandbox + celebration + webhook**: `/payments/sandbox/` dev simulator + `/membership/success/` celebration-client + `/api/payments/webhook/[processor]/` iskelet. Akış end-to-end clickable. *(retroactive)*
