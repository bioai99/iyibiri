---
name: app-wide-audit
description: Uygulamanın **tüm ekranları, akışları, data bağlantıları, UI component'leri ve stratejik uyumu** için çok-agent pipeline audit. Belli aralıklarla çalıştırılır (yılda 4 kez / major feature sonrası). 5 fazlı: strategy → product → ux → ui → qa/data. Çıktı: prioritized action list + health dashboard.
---

# App-Wide Audit — 5 Fazlı Pipeline

> **Ne zaman kullan:** Major feature shipment sonrası + V1 pilot öncesi + yılda 2-4 kez rutin.
> **Süre:** Focused çalışma 3-5 saat. Compressed çalışma 1-1.5 saat (sadece kritik findings).
> **Çıktı:** `docs/audit/YYYY-MM-DD-app-wide-audit.md` (actionable report)

## Amaç

Uygulama içindeki **5 katmandaki hizalamayı** tek seferde kontrol et:
1. Stratejik niyet ile ürün implementasyonu arasındaki boşluklar
2. Ürün kararlarının (ADR'ler) gerçekten gerçekleştiği
3. Kullanıcı akışları eksik mi, dead-end var mı, state coverage tam mı
4. UI tutarlılığı (design system, tokens, dark tema, accessibility)
5. Kod seviyesinde: butonlar doğru action'a bağlı mı, link'ler mevcut route'a gidiyor mu, data flow doğru mu

## Skill Aktivasyon

**Kullanıcı şu cümlelerden biriyle tetikler:**
- "App audit yap"
- "Genel bir kontrol et"
- "Her şey düzgün çalışıyor mu bak"
- "V1'den önce bir audit istiyorum"
- "Periyodik denetim zamanı"

**Claude cevap verir:**
- Compressed modu mu (1 saat, sadece kritik) veya full modu mu (3-5 saat, exhaustive) sorar
- Önceki audit varsa diff çıkarır (ne düzeldi, ne yeni çıktı)

---

## Pipeline Özeti

```
┌──────────────────────────────────────────────────────────────────┐
│  Faz 1: STRATEGY   — niyet ↔ implementasyon hizası               │
│  Faz 2: PRODUCT    — ADR'ler → kod, açık kararlar izlemesi      │
│  Faz 3: UX FLOW    — rota envanteri, journey, state coverage    │
│  Faz 4: UI VISUAL  — design system, component, motion, a11y    │
│  Faz 5: QA DATA    — buton→action, link→route, data→UI flow     │
│                                                                  │
│  → AGGREGATE: cross-phase findings + priority list + health     │
└──────────────────────────────────────────────────────────────────┘
```

Her faz kendi checklist'ine bakar, bulgularını `Kritik/Yüksek/Orta/Düşük` etiketiyle işaretler, son adımda hepsi birleşir.

---

## Faz 1 — Stratejik Alignment (consultant lens)

**Girdi:**
- `docs/strategy/00-playbook.md`
- Tüm `docs/strategy/06-memos/*` (sentez + pozisyon memo'ları)
- `docs/strategy/05-focus/*` (özellikle blue-ocean + positioning)
- `docs/product/01-workstreams/*-v1-improvement-master-plan.md`

**Checklist:**

- [ ] **NSM tutarlılığı:** Ana metrik (Monthly Active Karma Earner) gerçekten ürünün her katmanında ölçülebilir mi? `make_monthly` view aktif mi, dashboard'da görünüyor mu?
- [ ] **Value prop netliği:** Homepage/landing + auth + onboarding kullanıcıya **tek cümlelik değer** anlatıyor mu?
- [ ] **Rekabet pozisyonu:** fonzip ile farkımız (yol E) gerçek implementasyonda yansıyor mu? (embedded iframe'ler, C paralel yolu aktif mi)
- [ ] **3-sided marketplace:** Kullanıcı / STK / sponsor marka — 3'ünün de gerçek kullanım yolu kodda var mı?
- [ ] **Karma ekonomisi:** Formula (ADR-011) implementasyonu kalibre gidiyor mu? Override'lar kontrol ediliyor mu?
- [ ] **Fikri koruma:** Trademark + trade secret + moat stratejisi implementasyona yansıyor mu? (Karma formülü açık kod mu secret'ta mı?)

**Çıktı:** 5-10 stratejik finding, her biri 1-2 cümlelik probleme + çözüm önerisine sahip.

---

## Faz 2 — Ürün Completeness (product-analyst lens)

**Girdi:**
- `docs/product/03-decisions/*` (tüm ADR'ler)
- `docs/product/04-questions/open.md` + `resolved.md`
- `docs/_decisions-queue.md`
- `docs/product/01-workstreams/*` (workstream states)
- `docs/product/02-briefs/ux/*` + `docs/product/02-briefs/eng/*`

**Checklist:**

- [ ] **Her Accepted ADR için implementation kontrolü:** Kod gerçekten o kararı yansıtıyor mu?
  - Örn: ADR-007 parametric fee → `ngos.membership_fee_config` jsonb var mı + kullanılıyor mu?
  - Örn: ADR-012 access_level → `missions.access_level` var + `deriveMissionState` check ediyor mu?
  - Örn: ADR-013 cancel guardrail → trigger aktif mi?
- [ ] **Proposed ADR'ler:** Beklemede olan kararlar hala güncel mi? (ör. ADR-009 avukat cevabı var mı?)
- [ ] **Açık soru kuyruğu:** `_decisions-queue.md` — kritik sorular dondu mu ya da yeni açıldı mı?
- [ ] **Workstream progress:** V1 Master Plan P0/P1/P2 checklist'i güncel mi?
- [ ] **Brief → implementation zinciri:** UX brief yazılan iş gerçekten yapıldı mı?
- [ ] **Decision leakage:** Ürünün bazı alanları karar verilmeden mi implementasyona gitti? (undocumented decisions)

**Çıktı:** ADR-implementation matrix (her ADR için: status, gap varsa neresi).

---

## Faz 3 — Per-Screen Product Depth Audit (analyst × ux × ui birleşik)

> **Bu faz bu skill'in kalbi.** Yüzeysel "route var mı yok mu" kontrolü değil — **her ekran için** ürün adamı gözüyle 4-katman deep dive.

**Girdi:**
- Tüm `app/**/page.tsx` + eşlik eden client component'leri
- `docs/ux/02-journeys/*`, `docs/ux/03-heuristics/*`
- `docs/ui/01-specs/*`
- `docs/product/02-briefs/ux/*` (analyst'ın her ekran için product direktifi)
- `.claude/skills/ux-heuristics/SKILL.md`
- `.claude/skills/mobile-app-polish-standards/SKILL.md`

### Per-Screen 4-Katman Çerçeve

Her ekran için **şu 4 sorunun cevabı ayrı ayrı** dokümante edilir:

#### A. Product Intent (analyst lens)

- **Jobs-to-be-done:** Bu ekran kullanıcıya ne sağlıyor? Neden buraya geldi?
- **Eksik fonksiyon:** Tier-1 benchmark'lara göre kritik yetenek eksik mi? (ör. rewards ekranında search yok, leaderboard'da friend tab yok)
- **Data completeness:** Gerekli data gösteriliyor mu? Kullanıcı karar verebilir mi?
- **Analyst brief var mı:** `docs/product/02-briefs/ux/` altında bu ekran için brief var mı? Yoksa, undocumented decision riski var.

#### B. UX Completeness (ux-researcher lens)

- **Entry point:** Bu ekrana nereden geliniyor? Mantıklı mı?
- **Exit points:** Buradan nerelere gidilebilir? Bir şey kırık mı?
- **State coverage:** idle/loading/empty/error/success — hepsi implement edilmiş mi?
- **Edge case'ler:** İnternet kesik, yavaş bağlantı, 0 data, çok fazla data — UX bozulur mu?
- **Kullanıcı sıkışabileceği yer:** Geri dönüş yolu yok, back button kaybolur, modal trap gibi durumlar
- **Mobile-first:** 375px viewport'ta tasarım çalışır mı? Scroll, tap target, safe-area respect?

#### C. UI Quality (ui-designer lens)

- **Component quality:** Her kart, buton, liste item'ı tier-1 app kalitesinde mi? (Linear, Things 3, Duolingo standartı)
- **Data presentation:** Sayı formatı (TR locale), tarih formatı (relative "3 gün önce"), sayılı string ("5 gün seri")
- **Interaction kalite:** Tap feedback (haptic + visual), hover state (desktop), drag/swipe (varsa)
- **Typography hierarchy:** Başlık/body/caption net mi? Fraunces kullanımı doğru mu?
- **Empty state kalitesi:** Yaratıcı mı, yoksa "Veri yok" kuru metin mi?
- **Motion:** Entry animation var mı? prefers-reduced-motion respect?

#### D. Opportunity Gaps (vision lens)

- **Bugün vs tier-1:** Duolingo/Strava/Things 3 benzerleri nasıl yapıyor? Kritik fark ne?
- **Next-level özellikler:** V1.1'e taşınabilir ama **bugün eksik olduğunun bile farkında olmadığımız** özellikler
- **Personalization:** Kullanıcı-özel adaptation var mı? (örn. favorileri yukarı, son gezilen alt)
- **Viral loop:** Ekran ürünü büyütüyor mu? Paylaş CTA, davet, sosyal kanıt?

### Top-20 Must-Audit Screens (V1 pilot için)

Her audit'te bu 20 ekran **zorunlu** derin tarama:

**Dashboard ailesi (8):**
1. `/dashboard` (home)
2. `/dashboard/missions/[id]` (mission detail)
3. `/dashboard/missions/[id]/complete` (verification)
4. `/dashboard/missions` (mission list)
5. `/dashboard/ngos/[id]` (NGO profil)
6. `/dashboard/ngos/[id]/membership` (üyelik akışı)
7. `/dashboard/ngos/[id]/membership/success` (celebration)
8. `/dashboard/ngos` (NGO list)

**Kullanıcı profil + progression (6):**
9. `/dashboard/profile`
10. `/dashboard/profile/edit`
11. `/dashboard/leaderboard`
12. `/dashboard/rewards`
13. `/dashboard/rewards/[id]`
14. `/dashboard/tiers`

**Engagement loop (4):**
15. `/dashboard/streak`
16. `/dashboard/saved`
17. `/dashboard/discover`
18. `/dashboard/notifications`

**Onboarding (2):**
19. `/auth/signup` + `/auth/signin`
20. `/onboarding/causes` + `/onboarding/city`

### Per-Screen Rapor Formatı

Her ekran için standard template (`templates/screen-audit.md`):

```markdown
## /dashboard/rewards

### A. Product Intent
**JTBD:** Kullanıcı karma'sını gerçek ödüle çevirmek ister.
**Eksik fonksiyonlar:**
- [ ] Search (brand/kategori)
- [ ] Filter (yakında kilitlenecek, sadece uygun olanlar)
- [ ] Favorileme
- [ ] "Yakında açılacak" preview
**Data gaps:** Ödülün stoku / kullanım sayısı gösterilmiyor
**Analyst brief:** `docs/product/02-briefs/ux/rewards-list.md` — **YOK** (undocumented)

### B. UX Completeness
**Entry:** Bottom-nav (doğru)
**Exit:** Reward detail (doğru), geri buton (doğru)
**State coverage:** loading ❌ (skeleton yok), empty ❌, error ❌
**Edge cases:** 0 reward durumu test edilmedi
**Mobile-first:** ✅

### C. UI Quality
**Card kalitesi:** Orta — brand logo küçük, karma bar'ı kırık
**Data format:** Karma TR locale ✅, expiration formatı eksik
**Interaction:** Tap var, haptic yok
**Typography:** Fraunces başlıkta, body Jakarta — ✅
**Empty state:** Tanımlanmamış
**Motion:** Mount animation yok

### D. Opportunity Gaps
**Tier-1 benchmark:** Airbnb rewards "earning tier" gösterir, Uber Rewards "yakında kilitlenecek" timer
**Next-level:** Bizde:
- Earning bar ("1200 Karma'ya 300 kaldı")
- Upcoming unlock countdown
- Paylaş CTA ("Starbucks ödülüm geldi")

### Priority
- Kritik: state coverage 3/5 eksik
- Yüksek: analyst brief yok (undocumented decisions)
- Orta: earning bar + countdown
```

### Çıktı

Bir birleşik rapor: `docs/audit/YYYY-MM-DD-product-depth-audit.md`

Format:
- Her ekran için 4-katman dolu
- Cross-screen aggregate (tüm ekranlarda tekrar eden gap'ler)
- Priority action list (ekran × finding × severity)

---

## Faz 4 — UI Visual Audit (ui-designer + design-system-keeper lens)

**Girdi:**
- `docs/project-atlas.md` Bölüm 6 (tokens)
- `tailwind.config.ts`
- `app/globals.css`
- `lib/theme.tsx`
- Tüm `components/` dizini
- `.claude/skills/design-system-audit/SKILL.md`
- `.claude/skills/mobile-app-polish-standards/SKILL.md`

**Checklist:**

- [ ] **Design system compliance (token):** Hardcoded renkler var mı?
  ```bash
  grep -rn "#FFFFFF\|#000000\|rgb(\|bg-white\|bg-black\|text-white\|text-black" components/ app/
  ```
- [ ] **Dark tema leak'leri:** Eski `bg-white`, `text-text-primary`, `bg-stone`, `bg-primary/` kalıntıları:
  ```bash
  grep -rn "className=.*bg-white\|text-text-muted\|bg-stone\|bg-primary/" app/ components/
  ```
- [ ] **Component inventory:** `components/` altındaki her component için:
  - Hangi ekranda kullanılıyor?
  - Kullanılmıyor mu (orphan)?
  - Duplicate var mı? (ör. 2 farklı HeroCard)
- [ ] **Responsive:** Her sayfa iOS safe-area-inset-top/bottom respect ediyor mu?
- [ ] **A11y AA:**
  - `role="..."` var mı interaktif element'lerde?
  - `aria-label` text olmayan button'larda var mı?
  - Kontrast oranı 4.5:1+ mı?
- [ ] **Motion:** `prefers-reduced-motion` respect ediliyor mu?
- [ ] **Haptic:** Kritik aksiyonlarda Capacitor Haptics çağrılıyor mu?
- [ ] **Empty state:** Her list/grid için empty state var mı?
- [ ] **Loading state:** Async data fetching'in her yerinde skeleton/spinner var mı?
- [ ] **Error state:** Failure path'lerinde user-facing TR empathic mesaj var mı?

**Çıktı:**
- Token ihlali sayısı
- Orphan/duplicate component listesi
- Responsive/a11y gap'leri

---

## Faz 5 — QA Data/Function (frontend-engineer lens)

**Girdi:**
- Tüm `app/` + `components/` + `lib/` dizini
- `lib/supabase/types.ts`
- `supabase/migrations/*.sql`
- Unit test dosyaları

**Checklist:**

- [ ] **Button → action mapping:** Her `<button onClick={...}>` veya `<motion.button>` için:
  - Hangi function'a bağlı? Doğru mu?
  - Loading/error state handle ediliyor mu?
  - Server action ise 'use server' direktifi var mı?
- [ ] **Link → route mapping:** Her `<Link href={...}>` için:
  - `href` bir mevcut `app/**/page.tsx`'e mi çıkıyor?
  - Dynamic segment'ler (`[id]`) doğru pass ediliyor mu?
  ```bash
  # Tüm href'leri çıkar + mevcut route'larla karşılaştır
  grep -rohE 'href=["`]/[^"`]*' app/ components/ | sort -u
  ```
- [ ] **Server action integrity:** `lib/**/actions.ts` her action:
  - Auth guard var mı (`await supabase.auth.getUser()`)
  - Input validation?
  - Error response TR empathic mi?
  - `revalidatePath` çağrılıyor mu ilgili route'a?
- [ ] **RLS coverage:** Her Supabase query'si RLS policy'siyle uyumlu mu? Test kullanıcıyla doğrulanabilir mi?
- [ ] **Data flow doğruluğu:**
  - Dashboard'da gösterilen Karma = `profiles.karma_total`'dan mı geliyor?
  - Stat cell'lerde gösterilen "aktif görev" sayısı gerçek `user_missions` count'ı mı?
- [ ] **Type integrity:** `npx tsc --noEmit` 0 hata ile geçiyor mu?
- [ ] **Unit test coverage:** lib/ altındaki kritik function'lar test edilmiş mi? `computeKarma`, `deriveMissionState`, `codesMatch` gibi.
- [ ] **Migration idempotency:** Her migration `on conflict do nothing` / `if not exists` pattern'i kullanıyor mu?
- [ ] **Environment guards:** Dev/prod guard'ları doğru mu? (`NEXT_PUBLIC_PAYMENTS_SANDBOX` kontrolü gibi)

**Scripts (otomasyon ile yapılabilir):**

```bash
# TypeScript check
npx tsc --noEmit

# Unit tests
npx tsx lib/missions/__test__.ts
npx tsx lib/membership/__test__.ts

# Link inventory (tüm href'ler)
grep -rohE 'href="\K/[^"]*' app/ components/ | sort -u > /tmp/links.txt
# Route inventory
find app -name "page.tsx" | sed 's|app||;s|/page.tsx||' | sort -u > /tmp/routes.txt
# Missing routes (link var, route yok)
comm -23 /tmp/links.txt /tmp/routes.txt

# Server action inventory
grep -rln "'use server'" lib/ app/

# Migration count
ls -1 supabase/migrations/*.sql | wc -l

# Token leak
grep -rn "#FFFFFF\|bg-white\|bg-stone" app/ components/ | grep -v "node_modules" | wc -l
```

**Çıktı:**
- Broken link listesi (href → route yok)
- Server action integrity matrix
- Type/test/migration health

---

## Faz 7 — Verification Sweep (zorunlu son kontrol)

> **Ne için:** Önceki fazlardan çıkan ham bulguların **raporlanmadan önce gerçekliği teyit edilir.** 2026-04-24 ilk audit'te 2 false positive çıktı (`/auth/reset` ölü link iddiası + bağış ComingSoonBanner eksik iddiası), ikisi de gerçek değildi. Bu faz aynı hatayı önler.

### Her bulgu için doğrulama sorgusu

Faz 1-5'teki her bulgu kontrol edilir:

**Tip 1 — "X dosyası yok" iddiası:**
```bash
# Grep ile gerçek arama
find app/ components/ lib/ -name "*X*" 2>/dev/null
# VEYA spesifik path:
ls path/to/claimed/missing/file 2>&1
```

**Tip 2 — "X link'i kırık" iddiası:**
```bash
# Link gerçekte kodda var mı?
grep -rn 'href="/X' app/ components/ 2>/dev/null
# Route mevcut mu?
ls app/X/page.tsx 2>&1
```

**Tip 3 — "ADR-X implement edilmedi" iddiası:**
```bash
# ADR'deki key concept kodda var mı?
grep -rn "key_column_or_function_from_adr" lib/ app/ supabase/
# Migration apply edilmiş mi?
grep "adr_referenced_field" supabase/migrations/*.sql
```

**Tip 4 — "Component X kullanılmıyor" (orphan) iddiası:**
```bash
# Gerçekten import yok mu?
grep -rln "import.*ComponentX" app/ components/
```

**Tip 5 — "Token ihlali" iddiası:**
```bash
# Sayılı ihlal listesi (claim doğrulama için)
grep -rln "hardcoded-color-pattern" app/ components/ | wc -l
# Context'leri oku:
grep -rn "pattern" app/ components/ | head -20
```

### Kural

**Bulgu doğrulanmamış ise rapora YAZILMAZ.** Doğrulanmış olanlar "✓ verified" etiketiyle işaretlenir. Doğrulanamayanlar "suspicious, needs manual review" olarak ayrı bölüme taşınır.

### Output

- `findings-verified.md` — kesin bulgular (raporla gider)
- `findings-suspicious.md` — şüphe var, manuel kontrol gerekir

Bu aşamadan önce raporlanan bulgulara **güvenilmez.** False positive ratio'yu %0'a yaklaştırır.

---

## Aggregate — Master Audit Report

Tüm 5 faz bulguları birleşir. Format:

**Template:** `templates/audit-report.md`

```markdown
# App-Wide Audit — YYYY-MM-DD

## Executive Summary
- Genel sağlık: Yeşil / Sarı / Kırmızı
- En kritik 5-10 finding (cross-phase prioritized)
- V1 pilot'a uygunluk: ready / not-ready + neden

## Faz 1: Strategic Alignment
- Finding 1 [Kritik] — ...
- Finding 2 [Yüksek] — ...

## Faz 2: Product Completeness
- ADR-Implementation Matrix (tablo)
- Gap'ler

## Faz 3: UX Flow
- Route envanteri (X/Y route'lar erişilebilir)
- Dead-end / state eksikliği

## Faz 4: UI Visual
- Token ihlali sayısı
- Orphan component sayısı
- A11y skoru

## Faz 5: QA Data/Function
- Broken link sayısı
- Server action integrity
- TSC + test durumu

## Priority Action List
Cross-phase birleştirilmiş, sorted by severity:
1. [Kritik] ... — (hangi faz, hangi dosya, ne yapılacak)
2. [Kritik] ...
...

## Health Metrics Dashboard
| Metrik | Değer | Önceki audit | Delta |
|---|---|---|---|
| TSC error count | 0 | - | - |
| Unit test pass rate | 98/98 | - | - |
| Broken link count | 0 | - | - |
| Token violation count | 0 | - | - |
| Orphan component count | 2 | - | - |
| ADR coverage (Accepted implemented) | 12/13 | - | - |

## Öneriler & Sonraki adım
- Hemen düzeltilmesi gerekenler (Kritik+Yüksek)
- Sonraki audit'e kadar izlenecekler
```

---

## Çalıştırma Modları

### Full Mode (3-5 saat)
Her 5 fazı eksiksiz çalıştır. Tüm route'ları + component'leri tara. Detaylı audit report.

**Uygun durumlar:**
- V1 pilot öncesi
- Major refactor sonrası
- Yılda 2 kez rutin

### Compressed Mode (1-1.5 saat)
Her fazdan sadece **top 3-5 finding** çıkar. Health metrics + critical priorities.

**Uygun durumlar:**
- Feature shipment sonrası
- Haftalık/aylık check-up
- Sprint retrospektif

### Targeted Mode (30-60 dakika)
Sadece **tek faz** veya **tek route ailesi** (ör. sadece NGO membership flow). Diğer faz/route'lar atlanır.

**Uygun durumlar:**
- Spesifik bir feature bug raporu
- UX/UI iyileştirmesinden sonra izleme

---

## Output Dosyaları

Skill her çalıştığında şu dosyaları üretir:

```
docs/audit/
├── YYYY-MM-DD-app-wide-audit.md    # master report
├── YYYY-MM-DD-findings-raw.md      # ham finding listesi (internal)
├── YYYY-MM-DD-health-metrics.json  # metrics (delta karşılaştırma için)
└── templates/ (bu skill'den kopyalanır ilk çalıştırmada)
```

Birden fazla audit biriktikçe, **delta analizi**: bir finding'in:
- `resolved` → önceki audit'te vardı, şimdi düzeltildi (teşekkür emoji 🙌)
- `new` → yeni finding
- `regression` → daha önce düzeltilmişti, yine çıktı (⚠️ red flag)
- `ongoing` → her iki audit'te de var (öncelik arttır)

---

## Skill İle Tarihsel Trend Takibi

`docs/audit/` altındaki tüm audit'ler kronolojik → health metrics trend analizi:

- TSC error count trend: 0 → 0 → 0 (ideal)
- Broken link trend: 3 → 1 → 0 (iyileşiyor)
- Orphan component trend: 5 → 2 → 4 (⚠️ yeni deprecated'lar birikiyor)

Bu trendi **executive summary'ye her seferinde ekleyerek** ilerleme görünür olur.

---

## Cross-Skill Referanslar

Bu skill'i tamamlayan diğer skill'ler:

- `ux-heuristics` — Faz 3 için (Nielsen 10 + İyiBiri 6)
- `user-journey-mapping` — Faz 3 için (emotion curve + dark moment)
- `design-system-audit` — Faz 4 için (token + tutarlılık)
- `visual-spec-writing` — Bulgular → düzeltme brief'i yazımında
- `decision-docs` — Yeni bulgular ADR gerektirirse
- `consulting-methodology` — Faz 1 strategic review pattern'i

**İlk iki adım her çalıştırmada zorunlu:**
1. Önceki audit varsa oku (`docs/audit/*`)
2. `docs/project-atlas.md` ile context al

---

## Output Kalite Kriteri

Bir audit "iyi" sayılabilir için:
- [ ] Her bulgu **file:line** referanslı (soyut değil somut)
- [ ] Her bulgu **severity etiketli** (Kritik/Yüksek/Orta/Düşük)
- [ ] Her bulgu **suggested fix** içeriyor (sadece problem tanımı değil)
- [ ] Priority action list **cross-phase sorted** (bir faz içinde değil)
- [ ] Health metrics **yanında önceki değer** (delta görünür)
- [ ] Executive summary **5 cümleden kısa** (yönetici için)

---

## Periyodiklik Önerisi

- **Haftalık:** Compressed mode (health metrics + top findings) — otomasyona uygun
- **Aylık:** Targeted mode — spesifik feature alanı
- **Üç aylık:** Full mode — strategic + product + ux + ui + qa hepsi
- **Pre-launch:** Full mode (V1 öncesi, V2 öncesi, her major version öncesi)

---

## Self-Audit (Meta)

Bu skill de kendi kendini audit eder — sonunda:

- [ ] Rapor tamamen TR mi?
- [ ] Her finding'de file:line var mı?
- [ ] Health metrics tablo formunda mı?
- [ ] Priority list cross-phase mi?
- [ ] Önceki audit'le delta alındı mı (varsa)?
- [ ] Skill çağrısı dokümante edildi mi?
