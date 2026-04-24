# 002. Birincil ödeme sağlayıcı olarak iyzico kullan

**Tarih:** 2026-04-24
**Durum:** **Accepted (2026-04-24)** ✅ — scope revize (bkz. ADR-008): iyzico kendi gelir kollarımız + Marketplace mode primary payment provider.
**Önerici:** product-analyst

> **⚠️ Revizyon notu (2026-04-24, ADR-008 sonrası):**
> Bu ADR'nin scope'u **sadece İyiBiri'nin kendi gelir kollarına** (R1 sponsor aracılık, R2 premium subscription, R6 kurumsal dashboard) daraltıldı. STK üyelik + bağış ödemeleri varsayılan olarak **pass-through** modelinde STK'nın mevcut altyapısı üzerinden akar (ADR-008). iyzico Marketplace sub-merchant modeli sadece altyapısı olmayan STK'lar için **opt-in** olarak sunulur. Kararın temel tercihi (iyzico primary) aynı kalır, ama Marketplace kullanım alanı çok daha dar.

## Bağlam

İyiBiri üyelik (V1) + bağış (V2) + sponsor marka akışları ödeme altyapısı gerektiriyor. TR pazarında 3 aday: iyzico, PayTR, Craftgate. Strateji memosu (`docs/strategy/03-revenue/2026-04-23-bagis-ekosistemi-hukuki-operasyonel.md`) karşılaştırma yaptı:

| Kriter | iyzico | PayTR | Craftgate |
|---|---|---|---|
| Corporate komisyon | %2.99 + 0.25 TL | %1.99-2.99 | Custom |
| MCC 8398 (charity) desteği | Var | Var | Var |
| Recurring subscription | Orta (bazı kart sorun) | Sınırlı | Güçlü |
| Marketplace split (sub-merchant) | **Var (İyiPay)** | Sınırlı | Güçlü |
| Onboarding hızı | Orta (1-2 hafta) | Hızlı | Yavaş |
| API + dokümantasyon | İyi | Orta-İyi | Orta |

Ek kritik: **mevcut kodda Supabase MCP bağlı, auth hattı hazır, ödeme katmanı hiç başlamadı.** Seçim aynı zamanda hızlı onboarding + marketplace split (Workstream 3 "parametric STK fee" için kritik).

## Karar

**iyzico birincil ödeme sağlayıcı olarak seçildi. Craftgate Yıl 2 B2B kurumsal dashboard kolu (R6) için ikinci sağlayıcı olarak değerlendirilecek. PayTR backup — iyzico onboarding gecikirse.**

- İyzico Marketplace API kullanarak sub-merchant modeli: her STK kendi iyzico alt-hesabı → split payment otomatik.
- MCC 8398 onboarding (charity kategori) ilk 3 pilot STK için.
- Recurring billing iyzico subscription API + aylık otomatik deneme.

## Sonuçlar

**İyi:**
- Marketplace API ile parametric per-NGO split payment doğal uyar — ADR-007 (parametric fee schema) ile uyumlu.
- MCC 8398 destekli → charity interchange fee avantajı.
- TR pazar lider — dokümantasyon, SDK, destek olgun.

**Kötü:**
- Komisyon PayTR'dan %0.5-1 yüksek — volüm büyüdükçe hissedilir.
- Bazı bankalarda recurring subscription sorunu (rapor var) — ilk ay test şart.
- MCC 8398 onboarding 2-3 hafta rezerv gerektirir; STK pilot lansmanını etkileyebilir.

**Uygulama:**
- iyzico geliştirici hesabı açma + test mode → Workstream 3 ilk adım.
- Production onboarding STK'nın vergi numarası + banka hesabı + KVKK sözleşmesi ile paralel.
- Fallback: iyzico 3 hafta içinde onboarding tamamlamazsa PayTR'ya geç.

**Maliyet tahmini (her ₺100 üyelik):**
- iyzico: ₺3.24 (%2.99 + 0.25)
- İyiBiri platform: ₺8 (%8, önceki strateji önerimden)
- STK'ya gider: ₺88.76
- Patreon %13-14 global benchmark'a göre %3 ucuz.

**Bağlı kararlar:**
- Workstream 3 (Membership Payments + Parametric Fee) bu ADR'ye bağlı.
- Workstream 7 (V2 bağış yönlendirici) bu altyapıyı kullanmaya devam eder.
- Q10 (BDDK/KDV) + Q11 (makbuz veri akışı) hâlâ hukuki mütalaa bekliyor — bu ADR teknik seçim, hukuki çerçeve ayrı.

## Referanslar

- Strateji: `docs/strategy/03-revenue/2026-04-23-bagis-ekosistemi-hukuki-operasyonel.md` Bölüm 3
- Strateji: `docs/strategy/04-value-prop/2026-04-23-uyelik-akisi-kullanici-platform-stk.md` Bölüm 4
- Kaynak: [S11], [S28] iyzico pricing + MCC 8398

**İlgili soru:** Q2 — Proposed, kullanıcı onayı bekliyor.
