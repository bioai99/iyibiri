# 01 — Workstream Listesi

Her büyük iş kümesi kendi dosyasında. Başlangıçta boş — strateji + kullanıcı kararına göre ilk workstream'ler açılır.

**Dosya:** `YYYY-MM-DD-slug.md`

**Aday başlangıç workstream'leri** (yeniden sıralanacak, kullanıcı onayı ile):

| Öncelik | Slug | Kısa tanım | Tetikleyen |
|---|---|---|---|
| P0 | `north-star-and-kpis` | NSM + destek metrikler + measurement plan | Q1 cevabı gelince |
| P0 | `payments-selection` | Ödeme sağlayıcı seçim + entegrasyon kapsamı | Q2 cevabı gelince |
| P1 | `donation-flow-real` | Bağış akışı mock → gerçek (Q3 cevabına bağlı) | Q2 + Q3 |
| P1 | `loading-empty-error` | Tüm sayfalar için loading.tsx + empty state + error state kapsamı | audit bulgusu |
| P2 | `forgot-password` | Şifremi unuttum akışı (audit'te ölü link) | audit bulgusu |
| P2 | `ngo-onboarding-flow` | STK'ların İyiBiri'ye katılım süreci + admin tools | strateji kararı |
| P2 | `karma-economy-calibration` | Karma kazanım/harcama oranları kalibrasyonu + simülasyon | strateji kararı |
| P3 | `referral-growth-loop` | Arkadaş davet + topluluk sıralaması etkisi | growth strateji |
| P3 | `csr-dashboard-b2b` | Kurumsal CSR B2B dashboard (gelir kolu hipotezi) | revenue memo |

Önce gelen kararlara göre açılır. Bir workstream açıldığında buraya bağlı link düşer.
