# İyiBiri — Strateji ve Pazar Araştırması Klasörü

> **Sahibi:** `strategy-consultant` agent'ı (`.claude/agents/strategy-consultant.md`)
> **Amaç:** İyiBiri'nin pazar konumu, rekabet, gelir modeli, value proposition ve stratejik odak kararları için üretilen tüm analiz, memo ve kaynakların tek meskeni. Bu klasör canlıdır — her yeni araştırmada büyür, playbook her araştırma sonunda güncellenir.

## Nasıl okunur?

Önce **`00-playbook.md`** — agent'ın kendi metodolojisi, kaynak haritası, ve bugüne kadar öğrendiklerinin özet log'u. Bir memo'ya başlamadan önce bu dosya her zaman açılır.

Sonra ilgili alt klasör:

| Klasör | İçerik |
|---|---|
| `01-market/` | Pazar büyüklüğü (TAM/SAM/SOM), segmentasyon, pazar trendleri, makro bağlam. |
| `02-competitors/` | Her rakip için ayrı memo: ürün, konumlanma, fiyat, kullanıcı ölçüsü, güçlü/zayıf yan. |
| `03-revenue/` | Gelir modeli tasarımı, unit economics, fiyatlandırma senaryoları, sensitivity. |
| `04-value-prop/` | Kullanıcı/STK/Sponsor üç taraflı value proposition canvas'ları, JTBD, persona. |
| `05-focus/` | Stratejik odak kararları, önceliklendirme memo'ları, kill/keep kararları. |
| `06-memos/` | Konu kesişen (cross-cutting) stratejik memolar, yönetim özetleri, board-ready parçalar. |
| `99-sources/` | Kaynak log'u — her alıntı ve veri noktası için URL, erişim tarihi, özet. Citation tabanımız. |

## Dosya adlandırma

`YYYY-MM-DD-kisa-konu-slug.md` — örn. `2026-04-23-turkiye-stk-bagis-pazar-buyuklugu.md`.

## Memo şablonu

Her yeni memo şu iskeleti takip eder (playbook'ta detay):

```
# Başlık

**Tarih:** YYYY-MM-DD
**Yazar:** strategy-consultant
**Bağlam (1 cümle):** Bu memo neden yazıldı.

## Yönetim Özeti (Pyramid)
Tek paragraf cevap + 3 ana bulgu.

## Hipotezler
Araştırma başlarken test edilecek 2–4 hipotez.

## Kanıt ve Analiz
MECE bölümlerle, her iddia → kaynak referansı (`[01]`, `[02]`, `99-sources/index.md`'ye link).

## Sonuç ve Öneriler (So What?)
Ne yapmalıyız, neden, hangi risklerle.

## Açık Sorular / Sonraki Adımlar
Bilgi eksikleri + bir sonraki araştırma konusu.
```

## Kural

Strateji memoları **yorumdan önce kanıtı** verir. Her sayısal iddia kaynaklıdır — kaynaksız iddia hipoteze düşer, yorum olarak etiketlenir. Türkçe, "biz"/"sen" değil, **profesyonel üçüncü şahıs** tonu (board odasında okunabilir olmalı).
