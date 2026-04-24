# İyiBiri — Ürün Analizi Klasörü

> **Sahibi:** `product-analyst` agent'ı (`.claude/agents/product-analyst.md`)
> **Amaç:** Strategy-consultant'ın ürettiği vizyonu alıp, yapılabilir iş parçalarına bölmek, her parçanın içinde hangi fonksiyonların olacağını netleştirmek, UX ve mühendislik brief'leri yazmak, kritik kararları kuyruğa atıp kullanıcıya sormak, ve tamamlanan işi kendi kontrolünden geçirmek.

## Yapı

| Klasör | İçerik |
|---|---|
| `00-playbook.md` | Agent'ın beyni — metodoloji, her iş öncesi kontrol listesi, öğrendiklerinin log'u. |
| `_journal.md` | Per-run operasyonel log. Her iş sonunda bir giriş, en üste. |
| `01-workstreams/` | Büyük iş kümeleri (örn. "Auth & Onboarding", "Payments", "Karma Economy"). Her workstream kendi markdown dosyasında. |
| `02-briefs/ux/` | UX design brief'leri — tasarım takımına/agent'ına devir. |
| `02-briefs/eng/` | Mühendislik brief'leri (PRD tarzı) — kodlama agent'larına devir. |
| `03-decisions/` | ADR — Architecture/Product Decision Records. Kabul edilmiş kararlar burada kalır. |
| `04-questions/open.md` | **Sana sorulmayı bekleyen açık kararlar.** Kritik olanlar bloklayıcıdır. |
| `04-questions/resolved.md` | Cevap verilmiş soruların arşivi. |
| `05-reviews/` | Self-audit raporları. Her deliverable kendi kontrolünden geçtikten sonra bir review dosyası bırakılır. |

## Dosya adlandırma
- Workstream: `YYYY-MM-DD-kisa-slug.md` (ilk yazıldığı gün)
- UX brief: `YYYY-MM-DD-feature-slug.md`
- Eng brief: `YYYY-MM-DD-feature-slug.md`
- ADR: `NNN-kisa-slug.md` (sıralı numara)
- Review: `YYYY-MM-DD-review-slug.md`

## Workstream şablonu (short)

Her workstream markdown dosyası şu başlıkları içerir:

```markdown
# [Workstream adı]

**Durum:** discovery | scoping | ready-for-design | in-build | shipped
**Vizyon kaynağı:** docs/strategy/[...].md
**Son güncelleme:** YYYY-MM-DD

## 1. Kapsam (in / out)
Ne dahil, ne dışarı. MECE listele.

## 2. Fonksiyonlar
Bu workstream içinde kullanıcıya/operasyona ne fonksiyon verir — madde madde.

## 3. Kullanıcı değeri (JTBD)
Hangi kullanıcı, hangi bağlamda, hangi işi halletmek istiyor.

## 4. Başarı kriterleri
Ölçülebilir: metrik + hedef aralık.

## 5. Bağımlılıklar
Ne olmadan başlayamaz, ne olmadan bitmez.

## 6. Riskler
Ne yanlış gidebilir, ne olursa iptal ederiz.

## 7. Açık kararlar
`04-questions/open.md`'ye link.

## 8. Öneri sırası
Hangi feature önce, hangi sonra. Walking skeleton (Patton) olan olan var mı?

## 9. Teslim planı
UX brief tarihi, eng brief tarihi, ilk demo tarihi.
```

## Akış

1. **Input:** Strategy memosu, kullanıcı isteği, veya audit bulgusu.
2. **Workstream çıkar** (veya var olanı güncelle) → `01-workstreams/`.
3. **Açık kararları listele** → `04-questions/open.md`. Kritik olanlar için kullanıcıya acil dön.
4. **Feature scope** için gerekirse brainstorming skill'i → 3–5 alternatif → en güçlü(ler)i workstream'e ekle.
5. **UX brief yaz** → `02-briefs/ux/`.
6. **Eng brief yaz** (gerekirse UX brief tamam olduktan sonra) → `02-briefs/eng/`.
7. **Önemli bir karar verdiysen ADR aç** → `03-decisions/`.
8. **Self-audit** → `05-reviews/`. Kendi çıktını checklist'ten geçir.
9. **Journal + dashboard güncelle.**

## Kural

Agent hiçbir deliverable'ı "hazır" ilan etmez **kendi self-audit'ini yapmadan**. Self-audit başarısızsa deliverable `draft` etiketli kalır, `05-reviews/` altına ne düzeltilecek yazılır.
