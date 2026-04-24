---
name: design-system-audit
description: Design system (token + component + kullanım) tutarlılık audit'i için kılavuz. Tailwind token envanteri, component inventory, hardcoded değer tespiti, duplicate component tespiti, unused token tespiti, radius/shadow/spacing disiplini. İyiBiri'ye özgü: atlas Bölüm 6 "gerçek" palette vs eski `design-system/README.md` vs kod kullanım üçgenini netleştirmek.
---

# Design System Audit

DS sağlığını ölçmek: tokens var, componentler var, ama **tutarlı kullanılıyor mu?** Bu skill'in tek amacı, "kâğıt üstünde sistem, gerçekte chaos" senaryosunu engellemek.

## 1. Audit seviyeleri

| Seviye | İsim | Ne ölçülür |
|---|---|---|
| L1 | Token envanteri | Tüm token'lar listelenmiş mi, birbirine mantıklı mı? |
| L2 | Token kullanımı | Proje kodunda token mı yoksa hardcoded değer mi? |
| L3 | Component envanteri | Kanonik component'ler tek yerde mi, duplicate var mı? |
| L4 | Component kullanımı | Ürün kodu ui/ altındakini mi kullanıyor, ad hoc jsx mı? |
| L5 | Cross-source reconciliation | README vs kod vs atlas arasında ayrışma var mı? |

Çoğu audit L1+L2 (token) ya da L3+L4 (component) odaklı — L5 özel (bizim durumumuza uygun).

## 2. Yöntemler

### L1 — Token envanteri

Oku: `tailwind.config.ts`, `app/globals.css`, varsa `design-system/tokens.*`.

Çıkar:
- Tüm color key'leri + değer.
- Border radius.
- Spacing scale.
- Shadow library.
- Font family + weight + size scale.
- Animation keyframes.

Rapor tablo halinde. Atlas Bölüm 6 ile karşılaştır — farklıysa işaretle.

### L2 — Token kullanımı (grep tabanlı)

**Hardcoded renk araştır:**
```
Grep pattern: #[0-9A-Fa-f]{3,6}  veya  rgb(...)  veya  hsl(...)
Dosyalar: app/, components/
```

Sonuçları filtrele:
- `tailwind.config.ts` içinde olanlar OK (token tanımı).
- `components/**`, `app/**` içinde olanlar → ihlal.
- İstisna: inline SVG `fill="#..."`, keyframe `to { background: ... }` — dikkatli yorumla.

**Hardcoded spacing araştır:**
```
Grep: style="padding: [0-9]+px"  |  className="p-\[[0-9]+px\]"
```

Tailwind utility dışı arbitrary değer varsa işaretle.

**Shadow hardcoded:**
```
Grep: shadow-\[.*\]
```

Arbitrary shadow token'a taşınabilir mi?

### L3 — Component envanteri

Oku: `components/ui/**`, `components/**`.

Tablo:
- Component adı
- Kategori (atom / molecule / organism)
- Dosya path
- Props yüzeyi (kısa)
- Duplicate var mı? (ör. İyiBiri'de `components/ui/mission-card.tsx` vs `components/mission-card.tsx`)

### L4 — Component kullanımı

**Ad hoc jsx araştır:**
```
Grep: <div className=".*rounded.*bg-.*shadow"  (kart benzeri inline)
```

Eğer `Card` component'i varsa, inline kart yazımı ihlal.

Her component için kullanım sayısı (Grep ile import sayılabilir).
- Az kullanılan → retire adayı mı?
- Çok kullanılan, ama variant inline override'lı → variant sistem eksiği.

### L5 — Cross-source reconciliation (İyiBiri'ye özel)

3 kaynak karşılaştır:
1. `design-system/README.md` (eski doküman)
2. `tailwind.config.ts` + `globals.css` (gerçek kod)
3. `docs/project-atlas.md` Bölüm 6 (agent'ların referansı)

Ayrışma tablosu:
| Özellik | README diyor | Kod diyor | Atlas diyor | Sonuç |
|---|---|---|---|---|
| Primary gold | #F4B942 | #E8C268 | #E8C268 | README eskimiş → güncelle veya retire |
| Body font | Inter | Plus Jakarta Sans | Plus Jakarta Sans | README yanlış |
| Impact green | #2D9E5A | `--impact` HSL 145 57% 40% (≈ #2B9B5A) | Legacy alias tutulmuş | Rapor — kullanımda mı? |

## 3. Çıktı formatı

```markdown
# [Audit konusu] — Design System Audit

**Tarih / Scope (tüm DS / belirli bir alan)**

## 1. Envanter
[L1 tablosu]

## 2. Kullanım
[L2 tablo + Grep sonuçları]

## 3. Component durumu
[L3, L4]

## 4. Cross-source
[L5 ayrışma tablosu]

## 5. İhlaller ve şiddet
| # | İhlal | Dosya / path | Şiddet 1–4 | Öneri |

## 6. Öneri (kısa)
- [ ] [aksiyon 1] — Sahip: [frontend-engineer / design-system-keeper]
- [ ] [aksiyon 2] — ADR gerekiyor (`docs/product/03-decisions/`)

## 7. Takip
ADR açılıyor mu? Fix'ten sonra yeniden audit tarihi?
```

## 4. İyiBiri için ilk audit iş listesi (sıradaki)

1. **Cross-source reconciliation** — atlas vs README vs kod (L5). En acil, çünkü agent'lar hangi kaynağa güvenecek sorusu açık.
2. **Hardcoded color grep** — `grep "#[0-9A-Fa-f]{6}"` app + components. Şu an tahminimiz düşük ama ölçelim.
3. **Mission card duplicate** — iki dosyada var, kanonik hangi karar.
4. **Radius sistem** — sm/md/lg/xl/2xl/3xl kullanım dengeli mi?
5. **Component kullanım sayısı** — her ui/ component import edilme sayısı. Az kullanılan retire adayı.

## 5. Anti-pattern

- **"Tüm component'ler kötü, yeniden yaz"** — Sıfırdan yazmak audit değil. Audit neyi tut/neyi düzelt ayrımıdır.
- **Mikro-şeyle büyük hava atmak** — 3px spacing farkı ≠ 4. şiddet. Şiddet kullanıcıya etkiyle ölçülür.
- **Her ayrışma = fix** — Bazı legacy alias'lar geriye dönük uyumluluk için korunur. Kaldırmadan önce kullanım tara.
- **Audit'i README'ye kör bağlamak** — README eskimiş olabilir; atlas + kod otorite.

## 6. Kontrol listesi

- [ ] Kaynak kodu (atlas değil) doğrulandı mı?
- [ ] L1 envanter eksiksiz mi?
- [ ] L2 Grep sonuçları okundu mu, false positive ayıklandı mı?
- [ ] L3 duplicate arama yapıldı mı?
- [ ] L4 kullanım sayısı sample'landı mı?
- [ ] L5 (varsa) ayrışma tablosu yazıldı mı?
- [ ] Her ihlal şiddet skoru + öneri içeriyor mu?
- [ ] ADR gerektiren değişiklikler işaretli mi?
