# 008. STK payment routing — 3-modlu hibrit (Embedded primary + Passthrough fallback + Marketplace opt-in)

**Tarih:** 2026-04-24 (v2 — kullanıcı UX sorusu sonrası tam revizyon)
**Durum:** **Accepted (2026-04-24)** ✅ — Yol F çerçevesinde onaylandı. Marketplace mode fonzip-dışı STK için default.
**Önerici:** product-analyst
**Revize eder:** ADR-002 (iyzico scope), ADR-007 (parametric fee uygulama)

> **Versiyon geçmişi:**
> - v1 (2026-04-24, önce): Passthrough default + Marketplace opt-in (2 mod).
> - v2 (2026-04-24, bu): 3-mod hibrit — **Embedded** eklendi. Kullanıcı geri bildirimi: "direkt dışarı atarsak tek app değer önerisi zayıflar, mobil deneyim bozulur."

## Bağlam

**Karşı karşıya kaldığımız iki gerçek:**

1. **Her STK'nın zaten mevcut ödeme altyapısı var** (araştırma 2026-04-24): TEMA kendi site + fonzip, HAYTAP fonzip, Kızılay kendi olgun sistem, LÖSEV kendi, TEGV kendi. Hepsi processor sözleşmesi + makbuz + muhasebe + BDDK/KVKK uyumluluğuyla çalışıyor. Yerinden etmek partnership'i öldürür.
2. **İyiBiri'nin değer önerisi "tek app, tüm STK'lar"** — kullanıcıyı dışarı atan deneyim bu vaadi zayıflatır. Mobile'da full redirect session kaybeder, geri dönüşte sepet/context kaybı olur.

Bu iki gereksinim **çelişmiyor** — doğru mimari üçünü birden karşılıyor:
- STK'nın processor'ı arka planda çalışsın.
- Kullanıcı İyiBiri'den çıkmasın.
- İyiBiri kart bilgisi görmesin (PCI kapsamı dışında).

## Teknik doğrulama (2026-04-24 araştırma)

**iyzico Checkout Form:**
- iframe modu var: `&iframe=true` postfix paymentPageUrl'e eklenir.
- Pop-up, responsive, iframe, redirect — 4 mod destekli.
- **PCI DSS SAQ A scope** — iframe ile kart bilgisi iyzico'da, İyiBiri hiç görmez. Compliance karmaşıklığı minimum.
- Merchant API key ile initialize — STK'nın merchant kimliği kullanılır.

**PayTR iframe API:**
- Server-side API → iframe_token → iframe HTML tag embed.
- Callback URL ile payment sonucu İyiBiri'ye döner.
- Mobile compatible.

**fonzip:**
- "Bağış Sayfanızı Web Sitenizde Kullanmak" dokümanı — embed destekli (help.fonzip.com/tr/articles/6343848). İyiBiri içinden fonzip widget çağrısı mümkün.

## Karar

**3 payment_mode destekli:**

`ngos.payment_mode enum ('embedded', 'passthrough', 'marketplace')` — varsayılan **embedded**.

### Mod 1 — Embedded (primary, default)

**Nasıl çalışır:**
- Kullanıcı `/dashboard/ngos/[id]/membership` veya `/dashboard/ngos/[id]/donate` sayfasında.
- Form alanları (isim, email, miktar, tier) İyiBiri UI'ında.
- "Öde" butonuna basınca:
  1. İyiBiri backend, STK'nın processor'ına (iyzico/PayTR/fonzip) API çağrısı yapar — STK'nın merchant_key'i ile.
  2. Processor token döner.
  3. İyiBiri iframe/widget token ile embedded olarak render eder.
  4. Kullanıcı kart bilgisini **iframe içinde** (processor'da) girer. **İyiBiri kart bilgisini görmez.**
  5. Ödeme tamamlanınca callback URL → İyiBiri webhook → `ngo_memberships.status = active` + Karma bonus.
  6. Makbuz STK'nın processor'ı tarafından doğrudan bağışçıya e-posta.
- Kullanıcı İyiBiri UI'ından **hiç çıkmaz.**

**Gereken STK tarafı:**
- Mevcut processor hesabı (iyzico/PayTR/fonzip).
- Processor'ın merchant API key'i İyiBiri'ye verilir (partnership sözleşmesinin bir parçası).
- Callback URL (İyiBiri webhook endpoint'i) STK processor'ına kaydedilir.
- **Sözleşme değişikliği, yeni onboarding yok** — processor'la mevcut anlaşma korunur.

**İyiBiri tarafı:**
- Merchant API key güvenli saklama (Supabase Vault veya env).
- Processor adapter (iyzico SDK, PayTR iframe, fonzip widget) — her processor için uyumlu katman.
- iframe/widget render logic.
- Webhook endpoint (her processor callback formatı farklı).

**PCI DSS:**
- Kart bilgisi iframe içinde processor'da → İyiBiri SAQ A kapsamı (en hafif).
- İyiBiri'nin kendi PCI sertifikasyonu gerekmiyor.

**Hangi STK'lar için:**
- TEMA (fonzip veya kendi iyzico)
- TEGV (kendi processor — API key onboarding)
- LÖSEV (kendi)
- HAYTAP (fonzip embed)
- Çoğu orta-büyük STK.

### Mod 2 — Passthrough (fallback)

**Nasıl çalışır:**
- STK'nın processor'ı embed desteklemiyorsa (Kızılay gibi özel sistem, 3D Secure kısıtı).
- Kullanıcı "Üye ol" butonuna basınca STK'nın URL'sine gider.
- Mobile'da **Capacitor In-App Browser** (modal overlay) — tam redirect değil, üstüne gelen pencere. "App'ten çıkmadım" hissi daha güçlü.
- Return URL/webhook ile attribution.

**Hangi STK'lar için:**
- Kızılay (`bagis.kizilay.org.tr` özel sistem, embed mümkün olmayabilir).
- Çok büyük / legacy sistemleri olanlar.

**Trade-off:** UX ikincil seviye ama operasyonel sıfır değişiklik.

### Mod 3 — Marketplace (fonzip-dışı default) — GÜNCELLEME 2026-04-24

**Önceki tanım "opt-in için küçük STK" yetersizdi. Doğru tanım:** Fonzip veya benzer bir SaaS'a zaten bağlı OLMAYAN tüm STK'lar için **default mod.**

**Nasıl çalışır:**
- İyiBiri iyzico Marketplace **aggregator/platform** olarak konumlanır (fonzip'in yerine).
- STK İyiBiri altında **sub-merchant** olur: iyzico API ile onboarding (TCKN + IBAN + adres + telefon + vergi no + MCC 8398 charity kategori).
- Ödeme: kullanıcı → iyzico → split payment → İyiBiri platform fee (ayarlanabilir, varsayılan %0) + STK bakiyesine.
- Makbuz STK'nın iyzico hesabından direkt bağışçıya.
- İyiBiri aylık SaaS fee + referral fee STK'dan ayrı faturalar.

**Hukuki durum (2026-04-24 araştırma):**
- TR Law No. 6493 — **aggregator/integrator/wallet lisans gerektirmiyor.** İyiBiri'nin BDDK payment institution lisansı şart değil.
- iyzico lisanslı kuruluş; İyiBiri onun üstünde aggregator katmanı — TR'de yaygın model.
- KVKK multi-tenant data processing: standart çerçeve, aydınlatma şart.
- KDV: normal B2B SaaS (İyiBiri SaaS fee + iyzico komisyon — ayrı faturalar).

**iyzico sub-merchant tipleri:**
- PERSONAL
- PRIVATE_COMPANY
- LIMITED_OR_JOINT_STOCK_COMPANY (çoğu STK bu kategoride)

**Hangi STK'lar için (güncel segmentasyon):**

| Segment | Varsayılan mod | Açıklama |
|---|---|---|
| Fonzip müşterisi büyük STK | Embedded (Mod 1, fonzip widget) | Pilot TEMA, AÇEV, Haytap, AKUT, WWF — zorlama yok |
| Kızılay benzeri özel altyapılı | Passthrough (Mod 2) | Embed desteklemeyen büyük sistemler |
| **Fonzip'te olmayan STK** | **Marketplace (Mod 3) — DEFAULT** | TEGV, LÖSEV, yeni STK'lar — İyiBiri ilk altyapı |
| Fonzip'ten İyiBiri'ye geçmek isteyen | Marketplace (Mod 3) + migration | İsteğe bağlı Yıl 2+ agresif pitch |

**Ücret karşılaştırma (₺100 bağışta):**

| Akış | Fee dağılımı | STK efektif fee |
|---|---|---|
| Fonzip yolu | fonzip %1.5 + iyzico %2.99+0.25 | **%4.74** |
| İyiBiri Marketplace (%0 platform) | iyzico %2.99+0.25 | **%3.24** (fonzip'ten %1.5 ucuz) |
| İyiBiri Marketplace (%1 platform) | İyiBiri %1 + iyzico %2.99+0.25 | **%4.24** (fonzip'ten %0.5 ucuz) |

Her iki senaryoda da İyiBiri, STK için fonzip'ten ucuz + kullanıcı hacmi sunar.

## Karşılaştırma Tablosu

| Boyut | Embedded | Passthrough | Marketplace |
|---|---|---|---|
| **Kullanıcı UX** | ★★★★★ (İyiBiri içinde) | ★★★ (modal overlay veya redirect) | ★★★★ (İyiBiri native) |
| **STK operasyon değişikliği** | Minimal (API key paylaşımı) | Sıfır | Yüksek (sub-merchant onboarding) |
| **İyiBiri teknik karmaşıklık** | Orta (processor adapter × 3-5) | Düşük (deep link + webhook) | Yüksek (Marketplace setup) |
| **PCI DSS scope** | SAQ A (iframe) | Processor kapsamı (İyiBiri'de değil) | SAQ A (iyzico Marketplace) |
| **Makbuz** | STK processor direkt | STK processor direkt | iyzico split + STK |
| **Recurring billing** | Processor capacity'sine bağlı | STK URL'inde | iyzico Marketplace subscription |
| **Partnership kabul olasılığı** | Yüksek (STK'ya saygılı) | En yüksek (0 değişiklik) | Düşük (yeni onboarding) |
| **Default öneri** | **Evet (primary)** | Fallback | Opt-in |

## Gelir Modeli (her 3 modda aynı)

İyiBiri geliri transaction başı komisyon değil, STK ile ayrı ticari ilişki:

- **Starter tier:** ₺0/ay + %5 referral success fee (pilot 3 STK ilk 6 ay).
- **Growth tier:** ₺2.000/ay + %3 referral.
- **Premium tier:** ₺5.000/ay sabit (büyük, 1000+ üye).

STK aylık ay sonu İyiBiri'ye fatura öder. İyiBiri kullanıcıdan komisyon kesmiyor — STK'nın processor fee'sinin üstüne ek yük koymuyor.

## Schema

```sql
-- 010_payment_routing.sql

create type payment_mode as enum ('embedded', 'passthrough', 'marketplace');
create type payment_processor as enum ('iyzico', 'paytr', 'fonzip', 'custom', 'none');

alter table public.ngos
  add column payment_mode payment_mode default 'embedded',
  add column payment_processor payment_processor default 'iyzico',
  add column payment_merchant_key_ref text, -- Supabase Vault reference, actual key outside DB
  add column donation_url text,
  add column membership_url text,
  add column referral_webhook_url text,
  add column embed_config jsonb;
  -- embed_config örneği: { "widget_type": "checkout_form", "style_overrides": {...} }

-- referrals tablosu attribution için
create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  ngo_id text references public.ngos not null,
  referral_type text not null check (referral_type in ('membership', 'donation')),
  amount_try numeric(10,2),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'failed', 'cancelled')),
  external_transaction_id text,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);
alter table public.referrals enable row level security;
create policy "Users view own referrals" on public.referrals for select using (auth.uid() = user_id);
```

## Sonuçlar

**İyi:**
- **UX pürüzsüz** — kullanıcı tek app hissiyatında kalır. İyiBiri'nin "platform" vaadi korunur.
- **STK operasyonu değişmez** — processor anlaşmaları, makbuz, muhasebe aynı.
- **PCI SAQ A scope** — İyiBiri compliance yükü minimum.
- **Hukuki risk düşük** — İyiBiri parayı hiç görmez, kart bilgisi iframe içinde. "Teknik barındırma" kategorisinde (muhtemelen), hukuki mütalaa ile kesinleştirilir.
- **3 mod esnekliği** — STK'nın capability'sine göre uyum.

**Kötü:**
- Her processor için ayrı adapter gerekir (iyzico, PayTR, fonzip ayrı entegrasyon) — ilk entegrasyon yatırımı.
- Merchant API key güvenliği kritik — Supabase Vault + IP whitelist + rotate prosedürü.
- Webhook reliability — her processor farklı, retry logic.
- Mobile Capacitor'da iframe performance — test şart.
- Bazı processor'lar recurring'i iframe'de desteklemeyebilir — mod fallback.

**Uygulama öncelik:**

**Faz 1 (pilot 3 STK, Ay 1-2):**
- fonzip embed entegrasyonu (TEMA + HAYTAP için) — tek adapter iki STK'yı karşılar.
- İyzico Checkout Form (TEGV + LÖSEV ve diğerleri için) — en yaygın.
- PCI SAQ A dokümantasyonu + sözleşme şablonu.
- `/dashboard/ngos/[id]/membership` + `/dashboard/ngos/[id]/donate` sayfa yeniden tasarım (embed için).

**Faz 2 (Ay 3-4):**
- PayTR adapter (alternatif STK'lar için).
- Webhook reliability hardening.
- Mobile Capacitor WebView iframe test + optimizasyon.
- Passthrough fallback UI (In-App Browser).

**Faz 3 (Ay 6+):**
- Marketplace modu — küçük STK onboarding akışı.
- Custom/legacy processor adapter (Kızılay gibi özel sistemler için).

## Bağlı kararlar

- **ADR-002 (iyzico):** scope ikinci kez revize. Şimdi:
  - İyiBiri kendi gelir kolları (R1/R2/R6) için iyzico.
  - Embedded modda iyzico adapter (çoğu STK için).
  - Marketplace mode için iyzico Marketplace (opt-in).
- **ADR-007 (parametric fee):** hala geçerli. Embedded modda UI fee config'i gösteriyor, ödeme processor token'ı ile amount parametrik. Passthrough'da bilgi amaçlı. Marketplace'de tahsilat.
- **ADR-006 (V2 bağış yönlendirici):** Embedded mode bu ADR'yi de güçlendiriyor — bağış V2 embedded olabilir, dar "yönlendirici" tanımından daha iyi UX.

## Açık sorular (revize)

- **Q28 🔴** Payment routing — 3-modlu hibrit (Embedded primary + Passthrough fallback + Marketplace opt-in). **Bu ADR-008 v2 çözümü.**
- **Q29 🟡** SaaS fee tier (3 modda aynı) — önerim geçerli.
- **Q30 🟡** Attribution — webhook primary, manuel CSV fallback.
- **Q31 🔴 (yeni):** Embedded modda STK processor API key paylaşımı — sözleşme ile şart, güvenlik çerçevesi (Supabase Vault + audit) ADR gerektirir mi? → Workstream 3 kapsamında kurulur.
- **Q32 🟡 (yeni):** Capacitor mobile'da iframe recurring subscription davranışı — bazı processor'lar iframe'de recurring izin vermeyebilir. Pilot test sonucu karar.

## Referanslar

- **iyzico Checkout Form iframe:** [docs.iyzico.com/en/payment-methods/direct-charge/checkoutform/cf-implementation](https://docs.iyzico.com/en/payment-methods/direct-charge/checkoutform/cf-implementation)
- **PayTR iframe API:** [dev.paytr.com/en/iframe-api](https://dev.paytr.com/en/iframe-api)
- **PCI DSS SAQ A iframe:** [pci-proxy.com/blog-posts/iframes-an-saq-a-eligible-way-to-collect-credit-card-details](https://www.pci-proxy.com/blog-posts/iframes-an-saq-a-eligible-way-to-collect-credit-card-details)
- **fonzip embed:** help.fonzip.com/tr/articles/6343848 (access blocked, kullanıcı doğrulasın)
- Araştırma: TEMA + fonzip çift kanal, HAYTAP fonzip, Kızılay kendi, LÖSEV kendi, TEGV kendi (2026-04-24)

**Kritiklik:** Bu ADR tüm WS-02 ve WS-03 mimarisini belirler. Onay geldikten sonra Faz 2 agent'ları bu 3-modlu yapıya göre implement eder.
