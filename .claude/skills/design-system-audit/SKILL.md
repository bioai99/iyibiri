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

---

## 7. Atomic Design Taxonomy — Brad Frost Framework

Kaynaklar: [Atomic Design Chapter 2](https://atomicdesign.bradfrost.com/chapter-2/) · [DesignSystems.com](https://www.designsystems.com/brad-frosts-atomic-design-build-systems-not-pages/)

Atomic Design component hierarchy için düşünme çerçevesi sağlar. İyiBiri'nin `components/` inventory'sinde atomic level'i explicit yapmadan (atom vs molecule vs organism) chaos riski vardır — her yeni component "nereye gitsin" sorusunu tekrar açar.

### 7.1. Seviye tanımı

| Seviye | Tanım | Örnek (İyiBiri) |
|---|---|---|
| **Atom** | Child component **yok**. Tek amaçlı, bölünemeyen UI parça. | `Button`, `Input`, `Label`, `IconDS`, `KarmaDotToken` |
| **Molecule** | 2–3 atom birleşimi, ortak işlev. | `FormField` (Label + Input + Error), `SearchBar` (Input + Button), `ChipDS` |
| **Organism** | 3+ molecule/atom, self-contained section. | `HeroCard`, `MissionCard`, `DailyMissionCard`, `MembershipFlow` |
| **Template** | Layout + organisms; data-less iskelet. | `DashboardLayout`, `AdminLayout` |
| **Page** | Template + gerçek data + route state. | `/dashboard/page.tsx`, `/admin/analytics/page.tsx` |

### 7.2. Klasifikasyon egzersizi

Audit sırasında her component için tek cümle classify:

```
Component: mission-card
Level: organism
Children: KarmaChip (mol) + Badge (atom) + Button (atom) + Photo (atom)
File: components/ui/mission-card.tsx
Canonical: ✅ (duplicate yok)
```

### 7.3. Klasör konvansiyonu seçimi

**Option A** — strict atomic folders:
```
components/ui/atoms/
components/ui/molecules/
components/ui/organisms/
components/ui/templates/
```

**Option B (İyiBiri mevcut)** — flat folder + level metadata:
```
components/ui/{name}.tsx    // atom + molecule karışık
components/{organism}.tsx   // organism + template
```

**Seçim:** Option B (mevcut) — migration effort yüksek; ama her component'in file header'ına **level comment** ekle:
```tsx
// Level: organism — 4 child (badge, button, photo, karma-chip)
```

### 7.4. Promote/demote karar ağacı

Bir atom büyüdü mü (içine başka component aldı mı) → **molecule'a promote**. Bir molecule'un child'ları reuse edilmiyor mu → **atom'a demote** (inline her yerde yazılabilir).

- **Promote:** child sayısı 2+ olunca + child'lar ayrıca reusable.
- **Demote:** 6 ay kullanım <3 dosya + child'lar başka yerde yok.

### 7.5. Anti-pattern

- **Herkes organism yapıyor.** Her component hem içerik hem stil içeriyor → molecule seviyesinde kalması gerekenler organism etiketleniyor. Kriter: self-contained section mi, yoksa "içinde çalıştığı bağlam" olmadan anlamsız mı?
- **Atom içine molecule gömme.** Button içine SearchForm koyma. Atomic hierarchy tek yönlüdür.
- **Template'e business logic.** Template sadece layout; data fetching + karar layer page'de.

---

## 8. Token Governance Decision Tree — Nathan Curtis Framework

Kaynaklar: [Nathan Curtis — Naming Tokens in Design Systems](https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676) · [Design Systems Collective](https://www.designsystemscollective.com/design-tokens-in-practice-from-figma-variables-to-production-code-fd40aeccd6f5)

Token governance = "yeni renk/spacing/shadow gereksinimi geldiğinde ne yaparsın?" kararını disiplin altına almak. Ad-hoc ekleme → 6 ay sonra fragmented palette + "color-blue-500 neden var" sorusu.

### 8.1. Karar ağacı — yeni token ihtiyacı

```
Yeni UI ihtiyacı geldi
    │
    ▼
Mevcut token + variant kombinasyonuyla karşılanır mı?
    │
    ├─ EVET → REDDET. Mevcut kullan. Dokumantasyon ekle.
    │
    └─ HAYIR
        │
        ▼
    Primitive değil, semantic token eklenebilir mi? (mevcut primitive'e alias)
        │
        ├─ EVET → ALIAS ekle (örn. color-primary → alias color-gold)
        │
        └─ HAYIR
            │
            ▼
        Primitive token gerçekten eksik (yeni değer)?
            │
            ├─ EVET → ADD primitive + semantic alias pair
            │
            └─ HAYIR (benzer ama mikro-farklı) → REDDET. Mevcut kullan.
```

### 8.2. Primitive vs Semantic levels

**Primitive (raw values):** `color-gold-500 = #E8C268`, `color-ink-900 = #24201B`, `spacing-16 = 16px`.
- Asla component'te direct kullanılmaz. Sadece semantic katmanı besler.

**Semantic (intent-based):** `color-action = color-gold-500`, `color-bg-primary = color-ink-900`.
- Component'ler **sadece semantic kullanır**. Intent değişince primitive değişmeden semantic alias güncellenir.

**İyiBiri mevcut** — karışık:
- Primitive benzeri: `gold`, `ink`, `cream` (ama direct kullanılıyor)
- Semantic benzeri: `success`, `warning`, `danger` (ok, az kullanım)

**Geçiş önerisi:** Phase 1'de (V1) `gold` primitive + `gold` direct kullan (mevcut); Phase 2'de `color-action-default` semantic katmanı ekle.

### 8.3. ADD / ALIAS / RENAME / RETIRE kuralları

| Aksiyon | Ne zaman | Etki | Effort |
|---|---|---|---|
| **ADD** | Mevcut kombinasyon yetmez, yeni primitive gerek | Palette büyür; sonraki auditte justify gerekir | S |
| **ALIAS** | Semantic intent netleşti (örn. "bu gold ama action anlamında") | Yeni kullanımlar semantic'a gider; eski primitive kalır | S |
| **RENAME** | Semantic kaydı (örn. "gold" → "emphasis") | **Breaking** — tüm kullanım + Figma + atlas grep | L |
| **RETIRE** | 6 ay <3 dosya kullanım, semantic yetmez | Deprecation banner → 2 ay sonra sil | M |

### 8.4. Rename protokolü (breaking change)

1. ADR aç (`docs/product/03-decisions/`).
2. Tüm kullanımı grep (`bg-gold-500`, `text-gold`, `border-gold`).
3. Atlas Bölüm 6'yı güncelle.
4. `tailwind.config.ts` + `globals.css` çift-alias: yeni + eski alias (geçiş).
5. Kodu yeni isme taşı (Edit + grep).
6. Figma Variables güncelle (varsa).
7. 1 release period sonra eski alias'ı retire et.

### 8.5. Aylık token audit

- [ ] Her semantic token ≥3 yerde kullanılıyor mu? (az kullanılan retire adayı)
- [ ] Hardcoded değer var mı? (grep `#[0-9A-Fa-f]{6}`)
- [ ] Yeni token eklendi mi? Justify yazıldı mı?
- [ ] Atlas ↔ tailwind ↔ globals.css senkron mu?

### 8.6. Anti-pattern

- **Token = "ben güzel gördüm, ekledim".** Justification yok → palette şişer.
- **Primitive'i direct kullanmak** + semantic eklemek. İki kat artış, governance kaybı.
- **Rename ADR'siz.** Breaking change sessiz yapılır → agent koordinasyonu kırılır.

---

## 9. Figma Variables + Semantic Naming — Modern Implementation

Kaynaklar: [Figma Variables Guide](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma) · [Figma Blog — Semantic Tokens](https://www.figma.com/blog/the-future-of-design-systems-is-semantic/)

Figma Variables (2023+) design token'ı modern implementation'a taşıdı. Primitive variable + mode (light/dark) + semantic alias. İyiBiri dark-only V1 ama Yıl 2 light mode için hazırlık şimdi.

### 9.1. Variables yapı (Figma 2025+)

- **Collections** — mantıksal gruplar (e.g., "Color", "Spacing", "Typography")
- **Modes** — her collection içinde paralel variant (Light / Dark)
- **Variables** — primitive (Color/Number/Boolean/String)
- **Aliases** — semantic isim → primitive'e bağlanır

### 9.2. Namespace-category-semantic pattern

```
color.bg.primary      → primitive: color-ink-900
color.bg.elevated     → primitive: color-ink-800
color.text.primary    → primitive: color-cream-500
color.text.muted      → primitive: color-ink-300
color.action.default  → primitive: color-gold-500
color.action.hover    → primitive: color-gold-400
color.state.success   → primitive: color-success
color.state.danger    → primitive: color-danger
```

Pattern: `{namespace}.{category}.{variant/state}` — okunabilir + sıralanabilir.

### 9.3. Figma → kod sync

**Seçenek A — Manual sync:** Figma'da değişen variable'ı manuel olarak `tailwind.config.ts` + `globals.css`'e yansıt. Küçük takım için ok; 5+ kişi kaosa gider.

**Seçenek B — Figma Tokens Plugin** ([github.com/tokens-studio/figma-plugin](https://github.com/tokens-studio/figma-plugin)) — Figma'dan JSON export → Style Dictionary → Tailwind config otomatik üretim. Setup effort M, ama governance devleşir.

**Seçenek C — Figma Variables REST API** — CI/CD ile her push'ta senkron. Setup effort L, Enterprise için.

**İyiBiri için öneri:** V1'de A (manual). V1.1'de B (Figma Tokens plugin) — pilot STK kazanımı ile birlikte.

### 9.4. Dark/Light mode hazırlık (Yıl 2)

İyiBiri dark-only V1 (ADR-004), ama Figma Variables mode yapısı şimdi kurulursa Yıl 2 light mode'u bir switch işi olur.

- Color collection → 2 mode (Default, Light)
- Light mode değerleri boş bırakılabilir (yarın doldurulur)
- Semantic alias'lar iki mode'da da aynı primitive'e bağlanır

### 9.5. Roadmap

| Faz | İş | Effort |
|---|---|---|
| V1 (şu an) | Tailwind config + CSS vars manuel sync | S — mevcut |
| V1.1 | Figma Variables kur + semantic naming migrate | M — 1 hafta |
| V2 | Style Dictionary + Figma Tokens plugin + CI sync | L — 2 hafta |
| V2+ | Light mode aç + kullanıcı theme toggle | L — 2 hafta |

### 9.6. Anti-pattern

- **Primitive değerler component'te.** `bg-[#E8C268]` → hiç semantic kullanılmadı, governance kayboldu.
- **Semantic isim yanıltıcı.** `color-primary` = "primary action" mi, "primary background" mi? Namespace zorunlu.
- **Figma ↔ kod ayrı evren.** Designer Figma'da ekliyor, engineer kod'da ekliyor, ikisi drift.
