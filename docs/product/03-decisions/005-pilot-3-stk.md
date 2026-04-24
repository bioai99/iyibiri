# 005. İlk pilot 3 STK = TEMA + TEGV + LÖSEV

**Tarih:** 2026-04-24
**Durum:** **Accepted (2026-04-24)** ✅
**Önerici:** product-analyst

## Bağlam

V1 lansmanının tedarik tarafı STK'larla dolu olmalı. Önceki strateji memosu (`docs/strategy/04-value-prop/2026-04-23-oncelikli-stk-gonullu-toplama-analizi.md`) 8 öncelikli STK inceledi. Seçim kriterleri:

- **Friction açık olmalı** → İyiBiri'nin değer önerisi net.
- **Tanınmış marka** → kullanıcı trust + PR değeri.
- **Hand-sold mümkün** → ilk pilot için email/toplantı gerek.
- **Farklı domain** → İyiBiri ekosistem diversity.
- **V1 İstanbul pilot ile uyumlu** → İstanbul ofisli.

İncelenen 8 STK:
- TEMA (nature) — friction açık, tanıdık marka ★★★
- TEGV (education) — 6+ adımlı friction, ideal İyiBiri pre-screening ★★★
- LÖSEV (health) — friction + marka hassas ★★★
- Kızılay — gonulluol.org kendi platformu var, direkt rakip değil ama partnership müzakeresi uzun ★☆ (deferred)
- TOG — sadece üniversite gençliği, dar segment ★★ (Yıl 1 ikinci dalga)
- ÇYDD, AÇEV, Haytap — küçük ölçek veya daha az modern altyapı ★★ (2. dalga)

## Karar

**V1 pilot 3 STK olarak TEMA + TEGV + LÖSEV seçildi. İlk 6 ay için %0 platform komisyonu. Pilot paket 6 ay, sonunda değerlendirme + komisyon müzakeresi.**

Ek kararlar:
- **TOG + Haytap + ÇYDD Ay 6-9 2. dalga** — hand-sold devam.
- **Kızılay Yıl 1 sonunda** — deeplink/referral modeli ile.
- Her 3 STK için ayrı partnership contract (kapsam, veri paylaşımı, SLAs).

## Sonuçlar

**İyi:**
- 3 farklı domain (nature + education + health) → İyiBiri ekosistem çeşitliliği günden kanıtlanır.
- Her STK'nın friction'ı farklı → parametric sistem (admin tool, üyelik fee yapısı) baştan test edilir.
- TEGV pre-screening partnership özel değer — İyiBiri farkını hemen belli eder.
- %0 komisyon pilot → STK "kaybedecek bir şey yok" algısı, imza kolaylaşır.

**Kötü:**
- %0 komisyon 6 ay platform geliri yok bu koldan (ama sponsor marka kolu R1 zaten primary, bağışlı değil).
- Her STK'nın kendi iyzico sub-merchant onboarding'i paralel yürütülmeli → operasyonel karmaşıklık.
- Pilot paket dışı STK'lardan şikayet riski ("biz niye yok") → açık iletişim planı şart.

**Uygulama:**
- **Ay 1:** hand-sold contact — her 3 STK'ya brief + meeting. strategy-consultant (veya kullanıcı) ile partnership pitch hazırla (bkz. ayrı memo aday: `docs/strategy/04-value-prop/2026-04-XX-stk-partnership-pitch-paketi.md`).
- **Ay 2:** sözleşme imza + iyzico onboarding + admin tool kurulum.
- **Ay 3:** her STK 5-10 ilk görev yayınlar → toplam 30+ görev.
- **Ay 4-6:** lansman + ilk kullanıcı pilotu + iterasyon.
- **Ay 6 sonunda:** komisyon müzakeresi (öneri %8 platform) + 2. dalga STK kontak başlar.

**Bağlı kararlar:**
- ADR-003 (İstanbul pilot) ile uyum — 3 STK İstanbul ofisli.
- ADR-007 (parametric fee) TEMA ₺256 + HAYTAP aylık ₺30 gibi farklı modelleri destekler.
- Workstream 2 (STK pilot onboarding) bu kararın direkt implementasyonu.

**STK başına hand-off:**

| STK | Ana domain | Üyelik model | İyiBiri için özel değer |
|---|---|---|---|
| TEMA | nature | Yaş-tier (yetişkin ₺256 + aidat, 14-24 ₺15) | Saha görevleri, field_work, advocacy — 80+ il genişleme sonrası |
| TEGV | education | Donation-focused | Pre-screening partnership (6 soruluk test İyiBiri'de) |
| LÖSEV | health | Bağış-tabanlı + 15 günlük tanışma | ID-verified fast track, 24 saat süreç hızı |

## Referanslar

- Strateji: `docs/strategy/04-value-prop/2026-04-23-oncelikli-stk-gonullu-toplama-analizi.md`
- Strateji: `docs/strategy/06-memos/2026-04-23-stratejik-manzara-sentez.md` 90-günlük plan
- Kaynaklar: [S32] Kızılay, [S33] TEGV, [S35] LÖSEV

**İlgili sorular:** Q15 + Q23 + Q25 — hepsi bu ADR ile karşılanıyor. Proposed, kullanıcı onayı bekliyor.
