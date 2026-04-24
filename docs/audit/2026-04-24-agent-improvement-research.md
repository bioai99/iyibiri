# Agent Improvement Research — Top-tier Practices

**Tarih:** 2026-04-24  
**Amaç:** İyiBiri'nin 9 agent'ının (strategy-consultant, product-analyst, ux-researcher, ui-designer, frontend-engineer, supabase-backend, auth-capacitor, design-system-keeper, coordinator) skill + instruction katmanını top-tier pratisyen, framework yaratıcısı ve ürün şirketleriyle (Vercel, Linear, Stripe, Supabase, Figma, Shopify) karşılaştırmak; somut iyileştirme önerileri üretmek.

---

## Bulgu özeti (TL;DR)

**En önemli 8 bulgu:**

1. **strategy-consultant:** Pyramid Principle (Barbara Minto) ayrı skill veya playbook bölümü hak ediyor. Mevcut consulting-methodology skill'i (154 satır) MECE + governing thought konseptini eksik yapıyor. Önerilen bölüm: "Pyramid thinking — governing thought yazma" (~80 satır).

2. **product-analyst:** Shape Up (Ryan Singer) + Opportunity Solution Tree (Teresa Torres) + JTBD interview template eksik. Writing-plans skill'i (282 satır) genişletilmeli. Önerilen ek skill: "product-discovery-frameworks" — OST, Shape Up pitching, appetite definition (~200 satır).

3. **ux-researcher:** HEART framework (Google) + Story mapping (Jeff Patton) referans yok. Brainstorming skill'i (142 satır) ux araştırması odaklı değil. Önerilen ek: "continuous-discovery-practice" — Teresa Torres patterns, HEART metrics, story mapping (~180 satır).

4. **ui-designer:** Refactoring UI prensipleri (visual hierarchy, spacing scale, grayscale-first) ve Rauno Freiberg motion detayları eksik. Önerilen bölüm: visual-spec-writing'e "visual-hierarchy-checklist" + "motion-choreography-patterns" eklemek (~120 satır).

5. **frontend-engineer:** ⚠️ **KRİTİK BOŞLUK:** mobile-app-polish-standards skill'i referans yok. Next.js 14 App Router server component mental model (Dan Abramov) eksik. Önerilen iki ek skill: "react-server-component-patterns" (~150 satır) + frontend-engineer playbook'una mobile-polish referansı eklemek.

6. **supabase-backend:** RLS pattern'ları, realtime + edge function workflow'lar derinliği eksik. Önerilen bölüm: supabase-postgres-best-practices'e "rls-row-level-security-patterns", "realtime-idempotency", "edge-function-recipes" (~200 satır ekle).

7. **auth-capacitor:** ⚠️ **KRİTİK BOŞLUK — iki skill eksik:** (a) "kvkk-compliance-checklist" (TR 6698 aydınlatma metni template'i, double opt-in, data minimization) (~160 satır); (b) "capacitor-native-oauth-flow" (iOS/Android deep linking, @capgo/capacitor-social-login, OAuth 2.0 RFC 8252 native app BCP) (~180 satır).

8. **design-system-keeper:** Atomic Design taxonomy (Brad Frost) + token governance workflow (Nathan Curtis) + Figma Variables semantic naming eksik. Önerilen ek bölüm: design-system-audit'e "atomic-design-compliance-checklist" + "token-governance-decision-tree" eklemek (~150 satır).

**Quick-wins (P0 effort):** Auth-capacitor için KVKK compliance skill yazma (legal risk minimalleştirme) + frontend-engineer playbook'una mobile-polish referansı ekleme.

---

## 1. strategy-consultant

**Mevcut skill + playbook özeti:**
- **consulting-methodology** (154 satır): McKinsey 7S, Porter 5 Forces, SCP, Value Prop Canvas, JTBD, Kano, Blue Ocean — çeşitli framework'ler listeli, ama "Pyramid Principle" + "governing thought" ayrı treatment almıyor.
- **tr-market-research** (155 satır): TR kaynakları — TÜSEV, STGM, TÜİK, İPM vb. harita ve erişim metodu iyi.
- **strategy-consultant.md** playbook (100 satır): Her işe başlamadan ritüel, MECE hipotezler söyleniyor ama "Pyramid Principle explicit skill" yok.

---

### Bulgu 1: Pyramid Principle — Governing Thought Ayrı Skill Gerek

**Kaynak:** [Barbara Minto: MECE — McKinsey](https://www.mckinsey.com/alumni/news-and-events/global-news/alumni-news/barbara-minto-mece-i-invented-it-so-i-get-to-say-how-to-pronounce-it), [StrategyU — Pyramid Principle Part 1](https://strategyu.co/structure-your-ideas-pyramid-principle-part-1/), [Minto Pyramid & SCQA — ModelThinkers](https://modelthinkers.com/mental-model/minto-pyramid-scqa)

**Öz:** Barbara Minto'nun Pyramid Principle'i stratejik yazı ve presentasyonun en güçlü aracıdır. Temel kural: "Yukarıdaki fikir, altındakilerin özeti olmalı." MECE (Mutually Exclusive, Collectively Exhaustive) alt argümanlar zorunlu. Governing thought — tek bir cümlelik ana fikrini yazmadan memo'ya başlamamak. İyiBiri memo'ları da bunu takip etmeli.

**Bizde var mı:** consulting-methodology skill'de MECE değerlendirmesi var ama "governing thought yazma disiplini" playbook'da sözel, uygulanabilir template yok. Strategy-consultant ritüelinde "hipotez yaz" var ama "pyramid structure" döküman template'i yok.

**Öneri:** Yeni skill'in adı: **"pyramid-principle-thinking"** (~80 satır). İçerik:
- Governing thought — 1 cümlede ana cevap yazma
- MECE alt argümanlar — 3 grup, çakışmayan
- Memo yapısı — Pyramid Principle'e uygun template (yönetim özeti → ana cevap → 3 bulgu → kanıt)
- Örnek memo (iki sayfalık mock İyiBiri strateji memo'su)

---

### Bulgu 2: 7 Powers (Hamilton Helmer) — Moat Analizi

**Kaynak:** [7 Powers — Hamilton Helmer](https://7powers.com/), [Lenny's Newsletter — 7 Powers Interview](https://www.lennysnewsletter.com/p/business-strategy-with-hamilton-helmer), [Sachin Rekhi — 7 Powers Primer](https://www.sachinrekhi.com/p/7-powers-hamilton-helmer)

**Öz:** İşletme stratejisinde persistent competitive advantage yalnızca 7 mekanizmayla oluşur: Scale Economies, Network Economies, Counter-Positioning, Switching Costs, Branding, Cornered Resource, Process Power. İyiBiri'nin "Karma birikim + STK partnership + marka" modelinde Network Economies + Branding + Counter-Positioning (rakip donasyondan farklı aktivite-based model) saklı. Bunlar açık stratejik memo'da analiz edilmeli.

**Bizde var mı:** consulting-methodology'de "moat" sözcüğü yok. Strategy-consultant playbook'unda "neden İyiBiri başarılı olacak, rakipten farklı" derinliği eksik.

**Öneri:** consulting-methodology skill'ine **"7-Powers-moat-template"** bölümü ekle (~60 satır). İçerik:
- Hangi 7 Power'lar geçerli (İyiBiri için ağ etkisi + switching cost üzerinde odak)
- Her power için "benefit + barrier" analiz
- Rakip karşılaştırması — kimin moat'ı daha güçlü

---

### Bulgu 3: Amazon Working Backwards + PR-FAQ

**Kaynak:** Amazon 6-pager / PR-FAQ metodoloji (stratechery + first-round-review), [Marty Cagan INSPIRED — discovery best practices](https://productstrategy.co/inspired-marty-cagan/)

**Öz:** Amazon'un "Working Backwards" yöntemi problem → customer benefit → solution sırasıyla başlar. PR-FAQ (Press Release + FAQ) formatında başlayarak yazı disiplini sağlanır. İyiBiri'nin yeni stratejik girişimler (donation flow genişletme, NGO partnership tiers) bu format'ta işlenebilir.

**Bizde var mı:** Playbook'ta PR-FAQ referans yok. Strategic memo'lar "problem statement" ile başlıyor ama "press release" formatında değil.

**Öneri:** consulting-methodology skill'ine **"working-backwards-pr-faq"** bölümü ekle (~70 satır). Template:
- Press Release (paragraf 1: what, why, how)
- FAQ (customer benefits — 5-8 soru)
- Mevcut durumdan fark nedir, neden beklendik

---

### Bulgu 4: LNO Framework (Shreyas Doshi) — Prioritization

**Kaynak:** [Shreyas Doshi LNO Framework](https://coda.io/@shreyas/lno-framework), [Dualoop — LNO Explained](https://dualoop.com/blog/shreyas-doshi-the-lno-effectiveness-framework), [Alex Wiley — 10x with LNO](https://alexwiley.medium.com/10x-your-to-do-lists-outcome-with-the-lno-framework-1691dade540d)

**Öz:** Leverage (10% time, 50% impact) ≠ Neutral (20% time, 20% impact) ≠ Overhead (70% time, 30% impact). Strategy-consultant'ın kendisinin triage yapması gereken işlerde — mesela "5 pazar analiz mi, 1 rakip deep dive mi yapayım?" sorusunda LNO ile cevap verilir. Leverage işler (customer discovery, value prop iteration) → Overhead işler (admin dashboard tasarım rafine etme) ayrımı stratejide önemli.

**Bizde var mı:** Playbook'ta iş prioritization framework yok. "Her memodan sonra dashboard güncelle" var, ama "hangi memo yazalım" kararında LNO yok.

**Öneri:** strategy-consultant playbook'una **Bölüm 2 (Araştırma Akışı) altına "LNO Triage" başlığı ekle (~40 satır). İçerik:**
- Leverage işler: customer feedback loops, market hypothesis testing, competitive positioning
- Neutral işler: kaynakça, tablo formatı
- Overhead işler: presentation formatting, dashboard styling
- Karar ağacı: "Bu işi yapayım mı?" → LNO sınıflandır → Leverage'se zamanla, Overhead'se hızlıdır

---

### Bulgu 5: Stratechery / First Round Review — Strateji Yazma Stilini Kalibrasyonu

**Kaynak:** [Stratechery Framework Thinking](https://stratechery.com), [First Round Review — Strategy Essays](https://firstround.com/review)

**Öz:** Başarılı stratejik yazı "how" ile başlamaz, "why" ile başlar. Stratechery'nin Ben Thompson'ı veya First Round'ın stratejist yaz işleri "insight first" yaklaşımı — her sayısal analizden önce "neden bu sayıya bakıyoruz" cevabı verilir. İyiBiri memo'ları "rakip XY yaptı, biz ABC yapmalıyız" yerine "müşteri motivasyonu nedir, bundan çıkarım ne" stiline yakınlaştırılmalı.

**Bizde var mı:** Strategy-consultant playbook'ta "80/20 analiz" var, ama "insight hierarchy" (insight → supporting data → numbers) explicit değil.

**Öneri:** consulting-methodology skill'ine **"insight-first-writing-template"** bölümü ekle (~50 satır). Yapı:
- Insight (1 cümlede, ters sezgiler kabul)
- So What (neden önemli)
- Evidence (veri + source)
- Decision (ne yapmalıyız)

---

### Kardeş skill analizi (strategy-consultant)

**Mevcut:**
- consulting-methodology (154 satır)
- tr-market-research (155 satır)

**Eklenmesi önerilen (yeni skill'ler):**
- `pyramid-principle-thinking` (80 satır) — governing thought, MECE yazı disiplini
- Alternatively, consulting-methodology'e 4 bölüm ekle (Pyramid, 7 Powers, Working Backwards, LNO) = ~240 satır toplam ekleme

**Genişletilmesi önerilen (mevcut skill'lere ekle):**
- consulting-methodology: "7-Powers-moat-template" (60 satır), "working-backwards-pr-faq" (70 satır), "insight-first-writing-template" (50 satır)
- strategy-consultant playbook: LNO Triage (40 satır)

**Toplam effort:** Yeni 1 skill (80 satır) + mevcut 2 skill'e ekleme (~180 satır) = orta effort (M)

---

## 2. product-analyst

**Mevcut skill + playbook özeti:**
- **brainstorming** (142 satır): Brainstorm session yönetimi, facilitator rolü, emoji + whiteboard pattern — faydalı ama ürün discovery için too generic.
- **decision-docs** (198 satır): ADR/RFC template'i, trade-off analysis, stakeholder alignment — karar dökümentation iyi.
- **writing-plans** (282 satır): Workstream yazma, feature level PRD template, "success criteria" — iyi ama eksiklikler var.

---

### Bulgu 1: Opportunity Solution Tree (OST) — Continuous Discovery Framework

**Kaynak:** [Teresa Torres — Continuous Discovery Habits](https://userpilot.com/blog/continuous-discovery-framework-teresa-torres/), [OST for Product Discovery — Shortform](https://www.shortform.com/blog/teresa-torres-opportunity-solution-tree/), [Chameleon — OST Guide](https://www.chameleon.io/blog/opportunity-solution-tree)

**Öz:** Opportunity Solution Tree (OST), customer need → opportunity → multiple solutions → experiments yolculuğunu görselleştirir. Business goal'dan başla (örneğin "Karma takibi artır"), customer need'i (STK'lar nasıl üyeleri takip ediyor), opportunity'ler (STK kendi dashboard'ı mı, İyiBiri'nin STK bölümü mü, third-party API mi), solutions (her opportunity için farklı UX), experiments (hangi yol testlenir). İyiBiri'nin discovery akışı bunu yapabilir ama OST template'i yok.

**Bizde var mı:** Writing-plans skill'inde "feature discovery" bölümü var ama OST framework'ü adı geçmiyor. Brainstorming'de "idea generation" var, structured opportunity mapping yok.

**Öneri:** Yeni skill: **"product-discovery-frameworks"** (~200 satır). İçerik:
- OST anatomy — goal / opportunity / solution / experiment
- JTBD interview template — "jobs-to-be-done interview" script (Lenny Rachitsky PRD template'ine dayalı)
- Weekly discovery ritual — Teresa Torres pattern (team + customer weekly)
- OST Figma template — döküman örneği

---

### Bulgu 2: Shape Up (Ryan Singer) — Appetite Driven Discovery

**Kaynak:** [Ryan Singer Shape Up](https://www.mindtheproduct.com/shape-up-ryan-singer-on-the-product-experience/), [Lenny's Newsletter — Shape Up](https://www.lennysnewsletter.com/p/shape-up-ryan-singer), [Basecamp Shape Up](https://basecamp.com/shapeup)

**Öz:** Shape Up'ta "appetite" (6 hafta, 2 hafta cooldown) ile scope belirlenmiş. Pitching, betting, building. Problem → appetite → rough outline (vagliğı kabul et) → rabbit holes (test ettiklerimiz) → out of scope (nedir değil) yapısı. İyiBiri'nin workstream'leri Shape Up pitching formatında yazılırsa stakeholder alignment daha hızlı olur.

**Bizde var mı:** Writing-plans'taki "feature level PRD" lineer — problem, solution, success criteria. Shape Up'ın "appetite + rough outline + NOT doing" eksik.

**Öneri:** writing-plans skill'ine **"shape-up-pitching-template"** bölümü ekle (~80 satır). Yapı:
- Problem / Opportunity
- Appetite (timeline + team size fixed, scope variable)
- Solution (vagliğe izin ver, ama outline yeter)
- Rabbit holes (ne test ettik, ne bulduk)
- Out of scope (bunu neden sınırladık)

---

### Bulgu 3: JTBD + Lenny Rachitsky PRD — Problem First

**Kaynak:** [Lenny Rachitsky PRD Template](https://www.atlassian.com/software/confluence/templates/lennys-product-requirements), [Lenny's Newsletter — Strategy](https://www.lennysnewsletter.com/p/product-management-blog/lenny-rachitskys-product-strategy-essentials), [Marty Cagan INSPIRED Discovery](https://productstrategy.co/inspired-marty-cagan/)

**Öz:** Lenny Rachitsky "problem first" yaklaşımı — "nailing the problem statement is the single most important step." JTBD (Jobs-to-Be-Done) customer motivation'ı bulur. İyiBiri'nin "STK'lar neden üye kazanmak istiyor, neden gönüllüler neden görev yapıyor" sorusunun cevabı JTBD. PRD'nin ilk yarısı problem + customer need, ikinci yarısı solution.

**Bizde var mı:** Writing-plans PRD template'inde "problem statement" var ama JTBD interview yapma disiplini yok. Brainstorming'de "customer need" sözcüğü var, structured discovery yok.

**Öneri:** product-discovery-frameworks skill'ine (yukarıdaki Bulgu 1 ile merged) **"jtbd-interview-template"** ekle (~60 satır). Script:
- "Geçmiş fırsat" — müşteri bu job'ı nasıl yaptı öncesinde
- "Trigger" — neden şimdi çözmek istedi
- "Criteria" — başarılı solution nedir
- "Barriers" — neden halâ çözülmedi
- Example ITK (İyiBiri STK membersip case'i)

---

### Bulgu 4: Pricing + OKR Framework — Product Strategy Completeness

**Kaynak:** [Lenny Rachitsky — Pricing Playbook](https://www.lennysnewsletter.com/p/pricing-strategy), [John Doerr OKR Framework](https://www.whatmatters.com/), [First Round Review — Strategy](https://firstround.com/review)

**Öz:** Product strategy sadece feature'lar değil — pricing, growth targets (OKR), retention mechanics. İyiBiri'nin "Karma ekonomisi mock'ta" beklemesi riskli. Strategy-consultant memo'ları economic model'ı ele alsa, product-analyst bu économicsmanagement'ı workstream'e integre etmeli. OKR (Objectives & Key Results) ile "bu quarter'da ne tamamlayalım" sorularını şeffaf hale getir.

**Bizde var mı:** Writing-plans'ta "success criteria" var ama "OKR linkage" (quarterly objectives ile connection) yok. Pricing strategy hiç mention edilmemiyor — bunu strategy-consultant'a devredilmiş.

**Öneri:** writing-plans skill'ine (veya yeni "product-strategy-completion" bölümü) **"okr-linkage"** + **"pricing-alignment"** başlıkları ekle (~70 satır). İçerik:
- OKR anatomy (Objective + 3 KR)
- Feature workstream → OKR decomposition
- Pricing model — willingness-to-pay research (future, İyiBiri'de henüz yok ama template koy)
- Table: Workstream → OKR → Success metric

---

### Kardeş skill analizi (product-analyst)

**Mevcut:**
- brainstorming (142 satır)
- decision-docs (198 satır)
- writing-plans (282 satır)

**Eklenmesi önerilen (yeni skill'ler):**
- `product-discovery-frameworks` (200 satır) — OST, JTBD, weekly discovery, Shape Up pitching

**Genişletilmesi önerilen (mevcut skill'lere ekle):**
- writing-plans: "shape-up-pitching-template" (80 satır), "okr-linkage" (40 satır), "pricing-alignment" (30 satır)
- brainstorming: (fades out, OST framework'e replaced by discovery-frameworks)

**Toplam effort:** Yeni 1 skill (200 satır) + mevcut skill'e ekleme (~150 satır) = medium effort (M)

---

## 3. ux-researcher

**Mevcut skill + playbook özeti:**
- **ux-heuristics** (145 satır): Jakob Nielsen 10 heuristics, heuristic evaluation yöntemi, checklist — iyi.
- **user-journey-mapping** (133 satır): Journey map anatomy, persona, touchpoint, emotional arc — iyi başlangıç.
- **brainstorming** (shared with product-analyst, 142 satır): Too generic for UX research.
- **mobile-app-polish-standards** (300 satır): Mobile-specific usability, accessibility, gesture, motion — zengin.

---

### Bulgu 1: HEART Framework (Google) — Measurement Rigor

**Kaynak:** [Google HEART Framework](https://www.w3.org/people/team/), [UXPlanet — HEART Metrics](https://uxplanet.org/), [Lenny Rachitsky — Product Metrics](https://www.lennysnewsletter.com/p/product-metrics)

**Öz:** HEART (Happiness/Engagement/Adoption/Retention/Task success) — each metric helps measure product success in different dimension. İyiBiri'nin "gönüllü + karma" akışında: Happiness (satisfaction score after task), Engagement (weekly active missions), Adoption (onboarding completion), Retention (monthly return), Task success (mission completion rate / QR verification success). Journey map'ta touchpoint'ler HEART metric'leri trigger ediyor.

**Bizde var mı:** ux-heuristics "usability" odaklı (Nielsen), HEART framework referans yok. User-journey-mapping'de "emotional arc" var ama "metric mapping" yok.

**Öneri:** Yeni skill: **"continuous-discovery-practice"** (~180 satır) veya mevcut user-journey-mapping'e **"heart-metrics-mapping"** bölümü ekle (~80 satır). İçerik:
- HEART anatomy — her metrik ne ölçer
- Journey map + HEART table — touchpoint → (Happiness/Engagement/Retention/etc. metric) mapping
- Data collection — weekly pulse survey (Happiness), analytics instrumentation (Engagement/Adoption)
- Example İyiBiri: mission discovery journey → Happiness (satisfaction), Adoption (first mission completion), Retention (week 2 return)

---

### Bulgu 2: Continuous Discovery Habits (Teresa Torres) — Weekly Ritual

**Kaynak:** [Teresa Torres — Continuous Discovery](https://userpilot.com/blog/continuous-discovery-framework-teresa-torres/), [Evan Samek — CDH Summary](https://evansamek.substack.com/p/summary-continuous-discovery-habits)

**Öz:** "Continuous discovery" = weekly team + customer touchpoint. Problem: most teams "discover once, build 3 months." Solution: 2-3 customer weekly (rotating — STK reps, gönüllüler, Karma sponsor'lar), opportunities documented in OST, experiment runs in parallel with building. İyiBiri'nin UX team'i ("mi", değil "I") mindset'e gerek.

**Bizde var mı:** ux-researcher playbook'ta "user research" bölümü var ama "weekly team ritual" yoktur. Journey mapping bir kerelik activity olarak algılanıyor.

**Öneri:** Yeni skill: **"continuous-discovery-practice"** (~180 satır). İçerik:
- Weekly ritual anatomy — who (3 person team min), what (customer interview 45 min), where (OST update)
- De-risking — concurrent building + testing (Shape Up pattern ile integrated)
- Opportunity → Experiment → Learn loop
- UX-researcher role — facilitator, not lone researcher
- Template: Weekly discovery log (`docs/ux/04-discovery-log/YYYY-MM-DD.md`)

---

### Bulgu 3: Story Mapping (Jeff Patton) — Journey vs. Workflow Clarity

**Kaynak:** [Jeff Patton — Story Mapping](https://www.agilealliance.org/glossary/storytelling/), [Agile Stories — User Story Mapping](https://www.jpattonassociates.com/story-mapping/), UX research integrated storytelling

**Öz:** Story map, timeline üzerine "sequence of activities" + "details per activity" gösterir. User journey map'ın "happy path"i story map'ın üst satırı; "subtasks + alternatives" detaylar. İyiBiri'nin "gönüllü görev bulma → başvuru → hazırlık → aktivite → verification → ödül" akışı story map formatında görselleştirilirse, her adımdaki UX pain point'leri açık olur.

**Bizde var mı:** user-journey-mapping skill'inde "journey" var ama "stories per stage" detayı yok. Brainstorming'de story map sözcüğü yok.

**Öneri:** user-journey-mapping skill'ine **"story-mapping-workflow"** bölümü ekle (~70 satır). Yapı:
- Timeline + backbone (main flow)
- Swimming lanes (actor per row: gönüllü, STK, İyiBiri system)
- Cards (each subtask)
- Pain point + opportunity markers
- Example ITK: "Mission discovery flow" story map (5 aşama, 15 subtask)

---

### Bulgu 4: Accessibility Deep Dive — a11y as UX Core, Not Compliance

**Kaynak:** [Kent C. Dodds — Testing Library Accessibility](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library/), [WCAG 2.1 AA Standard](https://www.w3.org/WAI/WCAG21/quickref/), [NN/G Accessibility](https://www.nngroup.com/articles/accessibility/)

**Öz:** mobile-app-polish-standards'da accessibility clauses var ama WCAG 2.1 AA explicit standard targeting yok. Renk kontrastı (4.5:1 body text), gesture alternatives (double-tap yerine single button), screen reader support — these are usability issues, not just compliance. İyiBiri'nin "herkes erişebilsin" value prop'u a11y'de saklanır.

**Bizde var mı:** mobile-app-polish-standards bölümünde gesture + screen reader sözcükleri var, WCAG criteria'sı eksik. Heuristic evaluation'da a11y item (Nielsen #9: "Help and documentation") superficial.

**Öneri:** mobile-app-polish-standards ve/veya ux-heuristics skill'ine **"wcag-2.1-aa-audit"** bölümü ekle (~100 satır). İçerik:
- WCAG criteria (Perceivable / Operable / Understandable / Robust) — each criterion
- Contrast checker — Color Contrast Analyzer tool
- Keyboard navigation — tab order, focus visible, no keyboard traps
- Screen reader — NVDA (Android) + VoiceOver (iOS) testing pattern
- Gesture alternatives — tap, long-press, swipe → button alternative
- Example: mission card component → WCAG audit checklist

---

### Kardeş skill analizi (ux-researcher)

**Mevcut:**
- ux-heuristics (145 satır)
- user-journey-mapping (133 satır)
- mobile-app-polish-standards (300 satır) [shared]
- brainstorming (142 satır) [shared]

**Eklenmesi önerilen (yeni skill'ler):**
- `continuous-discovery-practice` (180 satır) — weekly ritual, OST feedback loop, facilitator role

**Genişletilmesi önerilen (mevcut skill'lere ekle):**
- user-journey-mapping: "story-mapping-workflow" (70 satır), "heart-metrics-mapping" (80 satır)
- mobile-app-polish-standards: "wcag-2.1-aa-audit" (100 satır)
- ux-heuristics: (refined, no major addition)

**Toplam effort:** Yeni 1 skill (180 satır) + mevcut skill'e ekleme (~250 satır) = large effort (L)

---

## 4. ui-designer

**Mevcut skill + playbook özeti:**
- **visual-spec-writing** (179 satır): Color, spacing, typography, radius, shadow specs — Tailwind token'larla mapping. İyi başlangıç ama detaylı component motion yok.
- **design-system-audit** (157 satır): Token audit, component inventory, coverage — checklist stil.
- **mobile-app-polish-standards** (300 satır): Touch target, safe area, gesture state — shared with ux-researcher.
- **decision-docs** (198 satır): Shared with product-analyst, trade-off analysis.

---

### Bulgu 1: Refactoring UI — Visual Hierarchy Discipline

**Kaynak:** [Refactoring UI by Adam Wathan + Steve Schoger](https://refactoringui.com/), [Refactoring UI Principles](https://www.designsystems.com/), [Typographic Hierarchy — Pimp my Type](https://pimpmytype.com/hierarchy/)

**Öz:** Visual hierarchy = size + weight + color disiplini. Grayscale-first approach: renge bağlanmadan önce spacing/weight ile hierarchy create et. İyiBiri dashboard'ında "karma balance" prominent ama "daily streak" secondary — bunu renk + size + position'ı coordinated etse, inconsistent olurdu. Refactoring UI'ın "constraint-based design" (4px spacing grid, 2 font families, 5-shade color palette) İyiBiri token'larına entegre edilmeli.

**Bizde var mı:** visual-spec-writing'de spacing (Tailwind token'ları) + color (ink, cream, gold, clay) + typography (Roc Grotesk, Inter) var ama "hierarchy rules" ayrı section yok. "Renk için contrast ratio 4.5:1" var ama "visual weight distribution" yok.

**Öneri:** visual-spec-writing skill'ine **"visual-hierarchy-checklist"** bölümü ekle (~80 satır). İçerik:
- Grayscale first — renksiz mockup'ta hierarchy var mı
- Size scale — body (14px), large (16px), xl (20px), xxl (24px) vs. emphasis (28px+)
- Weight ladder — regular, medium (600), bold (700) — ne zaman kullan
- Spacing leverage — whitespace = prominence (too much space = less important)
- Color = tertiary — renk, size + weight'ın arkasında gelsin
- Checklist: "Ana bilgi birimleri hangi sırayla okunur (left-to-right), neden"

---

### Bulgu 2: Rauno Freiberg Motion Details — Staggered Delays + Robustness

**Kaynak:** [Rauno Freiberg — Invisible Details](https://every.to/p/invisible-details-of-interaction-design), [UX Tools — Walt Disney Motion](https://www.uxtools.co/blog/your-ui-needs-more-walt-disney), [Raycast Stories — Rauno](https://www.raycast.com/community-stories/rauno-freiberg)

**Öz:** Motion detaylı: sequential animation (staggered delay) mechanical hissi yoktur — insan gözü simultaneous animation'ı takip edemez. Robustness: "baskı tutulursa scroll kaçak mı?", "network yavaşsa animation cancel olur mu?" — production UI, perfect internet'te test edilmez. İyiBiri'nin "go to mission" button → mission detail açılması animasyonu, loading state animation'ı robustu olmalı.

**Bizde var mı:** frontend-engineer playbook'ta Framer Motion pattern'ları var (spring default) ama Rauno'nun "stagger + delay + robustness under real conditions" philosophy yok. Visual-spec-writing'de motion section yok.

**Öneri:** visual-spec-writing skill'ine **"motion-choreography-patterns"** bölümü ekle (~60 satır). İçerik:
- Stagger anatomy — delay increment (50ms–100ms per item)
- Robustness under stress — network latency, user interruption (tap while animating), browser performance
- Reduced motion support — `prefers-reduced-motion` fallback
- Common patterns — list item entrance, modal open, state change
- Framer Motion snippet'ler — stagger example, robust error handling
- Contrapositive: "motion yok, ama state change indicator?" (fallback)

---

### Bulgu 3: Token Governance — When to Rename, When to Add

**Kaynak:** [Nathan Curtis — Naming Tokens](https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676), [Figma Variables — Semantic Naming](https://www.figma.com/blog/the-future-of-design-systems-is-semantic/), [Design Systems Collective — Token Governance](https://www.designsystemscollective.com/design-tokens-in-practice-from-figma-variables-to-production-code-fd40aeccd6f5)

**Öz:** Design token'lar değişir ama governance yok ise chaos. Nathan Curtis "semantic level" (color-primary vs. color-button-primary) ne zaman? Primitive tokens (color-blue-500) stable olmalı ama semantic tokens (color-action, color-success) product changes'le evolve ediyor. İyiBiri'nin "ink" (text) + "clay" (secondary action) tokens'ı iyi ama "token rename" ve "orphaned token cleanup" disiplini yok.

**Bizde var mı:** design-system-audit'te "token coverage" var, governance workflow yok. Design-system-keeper playbook'ta "çalışma prensipleri" bölümü yok (instruction'da marked as eksik).

**Öneri:** design-system-audit skill'ine **"token-governance-decision-tree"** bölümü ekle (~80 satır). İçerik:
- Primitive vs. semantic naming — kriter
- When to add new token — existing tokens çalışmaz mı, neden
- When to rename token — impact analysis (grep `color-gold` codebase'de kaç yerde)
- When to retire token — 6 ay unused → remove
- Decision table: token request → add/alias/rename/reject
- Review cadence — monthly token inventory audit
- Figma Variables + code sync — tooling (FigmaToken plugin referans)

---

### Bulgu 4: Atomic Design Taxonomy Clarity — Atoms vs. Molecules vs. Organisms

**Kaynak:** [Brad Frost — Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/), [DesignSystems.com — Building with Atomic Design](https://www.designsystems.com/brad-frosts-atomic-design-build-systems-not-pages/), [Figma Community — Atomic Design Resource](https://www.figma.com/community)

**Öz:** Atomic Design (atoms → molecules → organisms → templates → pages) İyiBiri'nin component hierarchy'sini structure ediyor. Ama clarity yok: "Button" atom'mu, "Button + Icon" molecule'mu? "Mission Card" (title + description + CTA) organism'mi, molecule'mu? İçişi çakışmada — design system kaos olur. Nathan Curtis'in naming conventions + Brad Frost'un taxonomy = clarity.

**Bizde var mı:** design-system-keeper playbook'ta Atomic Design sözcüğü yok. Component inventory var ama "atomic level" classification yok (`.claude/agents/design-system-keeper.md`'de eksik).

**Öneri:** design-system-audit veya yeni **"atomic-design-compliance"** skill ekle (~70 satır). İçerik:
- Atomic levels — clear boundaries (atoms = no child components, molecules = 2–3 atoms, organisms = 3+ molecules)
- Classification exercise — 10 mevcut component (Button, Card, Form, Modal vb.), her biri atomic level classify et
- Naming convention — component name → `{scope}-{level}-{variant}` (e.g., `mission-card-organism` veya just `card`, scope'u skip edebilir, ama level'i bilin)
- Hierarchy diagram — Figma token tree style
- Example ITK: mission-detail-page = template (mission-header-organism + mission-actions-organism + similar-missions-section), her organism'nin atomic composition

---

### Kardeş skill analizi (ui-designer)

**Mevcut:**
- visual-spec-writing (179 satır)
- design-system-audit (157 satır)
- mobile-app-polish-standards (300 satır) [shared]
- decision-docs (198 satır) [shared]

**Eklenmesi önerilen (yeni skill'ler):**
- (None explicit, but components of new skills could be isolated)

**Genişletilmesi önerilen (mevcut skill'lere ekle):**
- visual-spec-writing: "visual-hierarchy-checklist" (80 satır), "motion-choreography-patterns" (60 satır)
- design-system-audit: "token-governance-decision-tree" (80 satır), "atomic-design-compliance" (70 satır)
- mobile-app-polish-standards: (no major addition needed)

**Toplam effort:** Mevcut skill'lere ekleme (~290 satır) = large effort (L)

---

## 5. frontend-engineer

**Mevcut skill + playbook özeti:**
- **supabase** (104 satır): Client queries, real-time, types — başlangıç seviyesi.
- **visual-spec-writing** (179 satır): Shared with ui-designer.
- **writing-plans** (282 satır): Shared with product-analyst.
- **frontend-engineer.md** playbook (100 satır): Next.js App Router, Tailwind, Framer Motion, Capacitor disiplini.

**⚠️ KRİTİK BULGU:** **mobile-app-polish-standards skill'i agent tanımında referans YOK.** Playbook'ta "mobile-first" söylenmiş ama mobile-app-polish-standards skill'i `.tools` altında listelenmemiş. Bu bir gap — frontend-engineer 300 satırlık mobile expertise'dan ayrı, bilgisiz geliştiriyor demek.

---

### Bulgu 1: React Server Components Mental Model (Dan Abramov) — Boundary Clarity

**Kaynak:** [Dan Abramov — "The Two Reacts"](https://overreacted.io/), [Josh Comeau — Server Components](https://www.joshwcomeau.com/react/server-components/), [Kent C. Dodds + Dan Abramov RSC Interview](https://kentcdodds.com/blog/rsc-with-dan-abramov-and-joe-savona-live-stream)

**Öz:** React Server Components (RSC) N.js 14 App Router'ın kalbi: "Server component default, `use client` en dipte." Mental model: her server → client boundary network round-trip. Client component'te state/hook/onClick gerek, server action'la geri dön (`use server`). İyiBiri'nin "dashboard + mission list" page, server component (data fetch) + client component (filter state) hybrid — bu boundary'sini net yapması gerek.

**Bizde var mı:** frontend-engineer playbook'ta "SSR/CSR ayrımı: use client sadece gerektiğinde" var ama RSC mental model eksik. Çoğu app/ router'da component'ler `.tsx` (implicitly server) mi yoksa `use client` ile explicit client mi, clarity yok.

**Öneri:** Yeni skill: **"react-server-component-patterns"** (~150 satır). İçerik:
- Server component default — why (zero JS, data fetch)
- `use client` boundary — when (state, effect, event handler)
- `use server` action — pattern (server mutation from client)
- Network waterfall prevention — Suspense + streaming
- TypeScript types — RSC vs. client component type differences
- Anti-patterns — "use client"'ı root'a koyma, unnecessary server components
- Example ITK: mission-list page → server fetch (server component) + filter sidebar (client component, state) + submit action (`use server`)
- Debugging — React DevTools RSC layer visibility

---

### Bulgu 2: Testing Discipline — Testing Library + Jest Patterns

**Kaynak:** [Kent C. Dodds — Testing JavaScript](https://testingjavascript.com/), [React Testing Library — Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library/), [Testing Library Accessibility](https://testing-library.com/docs/queries/about#priority)

**Öz:** Frontend test piramidi: unit test (util function) < integration test (component + mock data) < e2e test (real browser, real backend). Testing Library "user behavior" (getByRole, getByLabelText) ile test et, implementation details'i mock etme. Jest snapshot'lar fragile — snapshot'ı avoid et, ayrı assertion yaz. İyiBiri'nin UI component'leri (mission card, form) test edilmeli ama test altyapısı faz 4'te, şu an değil — skill yine de template sağla.

**Bizde var mı:** Frontend playbook'ta "Test: manuel test notu" var ama automated test harness yok. Supabase skill'inde query testing yok.

**Öneri:** frontend-engineer playbook'un "Çalışma prensipleri" bölümüne **"testing-discipline"** başlığı ekle (~100 satır). İçerik:
- Test hierarchy — unit / integration / e2e
- Testing Library query priority — Role > Text > TestId (accessibility-aligned)
- Mock strategy — data mock / API mock / full integration
- Snapshot anti-pattern — avoid, write specific assertion'lar
- Jest config — module mock, alias setup
- a11y testing — jest-axe, accessibility queries
- Template: component.test.tsx boilerplate
- Future roadmap — Playwright e2e setup (phase 4'te)

---

### Bulgu 3: Performance Optimization — Web Vitals + Image/Font

**Kaynak:** [Vercel — Guide to Fast Websites with Next.js](https://vercel.com/blog/guide-to-fast-websites-with-next-js-tips-for-maximizing-server-speeds-and-minimizing-client-burden), [Web.dev Core Web Vitals](https://web.dev/vitals/), [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)

**Öz:** Core Web Vitals (LCP — Largest Contentful Paint ≤2.5s, FID — First Input Delay ≤100ms, CLS — Cumulative Layout Shift ≤0.1). Next.js Image component otomatik optimize (lazy load, srcset, format), next/font (Google Fonts local + preload). İyiBiri mobile app'ında — Capacitor static export (`webDir: out`), network kaotik olabilir. Image lazy loading + font preload kritik.

**Bizde var mı:** Playbook'ta "Motion disiplinli" var ama "performance metric'ı monitor" yok. Atlas'ta "71 KB page.tsx" mentioned ama perf budget yoktur.

**Öneri:** frontend-engineer playbook'a **"performance-optimization"** bölümü ekle (~70 satır). İçerik:
- Core Web Vitals — LCP / FID / CLS / INP (interaction to next paint)
- Next.js Image — lazy load, sizes, responsive
- next/font — preload strategy, font-display fallback
- Component-level lazy — React.lazy + Suspense (heavy modals, complex components)
- Performance budget — LCP < 2.5s, JS bundle < 250KB (Capacitor static), CLS < 0.1
- Debugging — Lighthouse, DebugBear, Web.dev measurement tools
- Mobilede test — network throttling (slow 4G) simulate

---

### Bulgu 4: ⚠️ KRİTİK — mobile-app-polish-standards Skill Missing Reference

**Kaynak:** Project atlas, mobile-app-polish-standards skill (300 satır), frontend-engineer responsibilities

**Öz:** Frontend-engineer playbook'ta "Mobile-first" söyleniyor ama mobile-app-polish-standards skill'i `.tools` listesinde yok. Bu, frontend-engineer'ın 44×44 touch target, safe area padding, gesture fallback'i bilerek mi bilerek mi ignored olduğu anlamına gelir. Skill önemlı (accessibility + mobile UX) ama orphaned duruyor.

**Bizde var mı:** Skill var, ama agent link'i yok.

**Öneri:** **URGENT (P0):** frontend-engineer.md satır 100'ün altında (playbook sonunda) `## 7. Kullanılabilir skill'ler` bölümüne **`mobile-app-polish-standards`** ekle. Listing:
```
- `.claude/skills/mobile-app-polish-standards/SKILL.md` — mobile UX/accessibility, touch target, safe area, gesture, motion.
```

Ayrıca playbook'ta **"Mobile-first disiplini"** paragrafından sonra (satır 29–30) referans kur:
```
(Ayrıntılar `mobile-app-polish-standards` skill'inde; quick checklist:...)
```

---

### Kardeş skill analizi (frontend-engineer)

**Mevcut:**
- supabase (104 satır)
- visual-spec-writing (179 satır) [shared]
- writing-plans (282 satır) [shared]
- mobile-app-polish-standards (300 satır) [shared, BU AGENT'TA MISSING REFERENCE]

**Eklenmesi önerilen (yeni skill'ler):**
- `react-server-component-patterns` (150 satır) — RSC mental model, boundary, use-server, waterfall avoidance

**Genişletilmesi önerilen (mevcut skill'lere ekle):**
- frontend-engineer playbook: "testing-discipline" (100 satır), "performance-optimization" (70 satır), mobile-app-polish-standards reference ekleme
- supabase: (no major addition needed)

**IMMEDIATE ACTION:**
- frontend-engineer.md satır ~100'e mobile-app-polish-standards skill'i add to `.tools` list

**Toplam effort:** Yeni 1 skill (150 satır) + playbook ekleme (~170 satır) + reference fix = medium-large effort (M-L)

---

## 6. supabase-backend

**Mevcut skill + playbook özeti:**
- **supabase** (104 satır): Client queries, real-time basics, types.
- **supabase-postgres-best-practices** (64 satır reference header + 35+ reference docs): RLS, index pattern'ları, query optimization, migration — zengin (35+ reference).
- **supabase-backend.md** playbook (80 satır): Migration, RLS, query, seed. Disiplin açık.

---

### Bulgu 1: RLS Pattern'ları — Multi-tenant Safety + Performance

**Kaynak:** [Supabase RLS Docs](https://supabase.com/docs/guides/database/postgres/row-level-security), [Craig Kerstiens — RLS Performance](https://www.crunchydata.com/blog/author/craig-kerstiens), [Supabase Discussions — RLS Performance](https://github.com/orgs/supabase/discussions/14576)

**Öz:** RLS (Row Level Security) multi-tenant (her STK'nın verisini şifreleme) ve güvenlik için kritik. Pattern: policy = `auth.uid() = user_id` (user tabloda), ama STK verileri (`ngo.id` text) için `auth.user_metadata` → `ngo_id` ekstra step. Performance: RLS hatalı yazılırsa query slow olur (full table scan, no index). İyiBiri'de `profiles.id` (UUID, auth.users linked) iyii, ama `missions.ngo_id` (TEXT) → `ngo_membership.status='active'` check'i RLS'ye yazılmışmı, index var mı?

**Bizde var mı:** supabase-postgres-best-practices references'de 35+ doc var ama "RLS pattern collection" bölümü yok. Playbook'ta "RLS, query, seed" söyleniyor ama "STK üyeliği verification RLS'ye nasıl?" concrete örnek yok.

**Öneri:** supabase-postgres-best-practices skill'ine yeni **"rls-row-level-security-patterns"** section ekle (~80 satır). İçerik:
- RLS anatomy — CREATE POLICY syntax
- Multi-tenant pattern — auth.user_metadata JSONB field usage
- Safe filtering — index + RLS together (N+1 query prevent)
- Common mistake — RLS'de subquery (slow), better: denormalize + trusted data
- Example ITK:
  - `missions` table: RLS → ngo_id = current_user_ngo_id (meta'dan gelen)
  - `ngo_memberships`: RLS → user can view only if status='active' + ngo verified
  - Tradeoff: flexibility (meta field) vs. consistency (schema column)
- Testing RLS — `rls_enabled` test, query explain plan

---

### Bulgu 2: Realtime + Idempotency — Webhook Reliability

**Kaynak:** [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime), [Stripe Webhooks Best Practices](https://stripe.com/docs/webhooks/best-practices), [idempotency key pattern](https://stripe.com/docs/api/idempotent_requests)

**Öz:** Supabase Realtime (PostgreSQL LISTEN/NOTIFY) mission completion, karma update trigger edebilir. Webhook'lar at-least-once delivery → client'ın idempotent olması gerekir. Idempotency key (timestamp + resource_id) duplicate request'i handle eder. İyiBiri'nin "mission completed" event → karma update, ödül unlocked — webhook retry'de double-credit prevent etmeli.

**Bizde var mı:** Realtime, edge function arayüzü yoktur. Webhook pattern'ı (future API gatekeeper) belirtilmedi.

**Öneri:** supabase-postgres-best-practices skill'ine yeni **"realtime-idempotency-webhooks"** section ekle (~90 satır). İçerik:
- Realtime anatomy — LISTEN channel, subscriptions
- Webhook trigger — edge function ou HTTP API
- Idempotency key strategy — UUID + resource_id, storage (Redis key-value or DB column)
- Error handling — retry logic, exponential backoff
- Logging — webhook event log table (webhook_log) + status tracking
- Example ITK: mission.completed → webhook trigger → karma update + edge function validate → idempotency key check → update/skip
- Tools — Supabase Functions, Postgres trigger

---

### Bulgu 3: Edge Functions — Trusted Edge Logic

**Kaynak:** [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions), [Deno Runtime](https://deno.com/), [Serverless best practices](https://www.serverless.com/blog)

**Öz:** Edge Functions (Deno) serverless logic'i, RLS bypass edebilir (service_role token use). İyiBiri'nin "QR verification" → mission completion → karma award logic, edge function'da güvenli şekilde yazılabilir (server'dan bağımsız, trusted). Cold start, timeout (60s), memory constraint dikkat edilmeli.

**Bizde var mı:** Edge function mention yok. Future API roadmap'ta hiç adı geçmedi. Supabase-backend playbook'ta "migration, RLS, query" var ama "logic placement" kararı yok (server-side JS vs. edge vs. database trigger).

**Öneri:** supabase-postgres-best-practices skill'ine yeni **"edge-function-recipes"** section ekle (~70 satır). İçerik:
- Edge function use case — when (trusted logic + real-time requirement + scalability)
- Auth — service_role token, JWT parsing
- Pattern — mission verification → async karma update, external API call (sponsor API)
- Error handling — Deno error propagation, retry strategy
- Monitoring — Supabase Function logs
- Example ITK: QR verify endpoint → edge function (verify auth, update mission status, trigger realtime)
- Cold start / timeout — perf consideration (async pattern preferable)

---

### Bulgu 4: Migration + Data Integrity — Version Control + Rollback

**Kaynak:** [Supabase Migration Docs](https://supabase.com/docs/guides/database/migrations), [Liquibase best practices](https://docs.liquibase.com/concepts/bestpractices.html), [Database versioning patterns](https://wiki.postgresql.org/wiki/Versioning)

**Öz:** Migration disiplini: `supabase/migrations/` commit'te, numbering (timestamp-based), rollback capability. İyiBiri 8 migration var, rollback path (down.sql) tutulmuş mu? Schema change backward compatible mi (column add easier, drop harder)? Data sanity check (triggers validate)?

**Bizde var mı:** Playbook'ta "migration" söyleniyor, migration template/checklist yok. Rollback test procedure absent.

**Öneri:** supabase-postgres-best-practices skill'ine yeni **"migration-versioning-rollback"** section ekle (~80 satır). İçerik:
- Migration naming — timestamp_description.sql
- Forward + backward — up (init), down (rollback)
- Backward compatibility — ADD COLUMN DEFAULT / NOT NULL care
- Data migration pattern — batching (large table'da 1M+ rows → chunked updates)
- Validation — CHECK constraint, trigger validate, data audit
- Testing — local migration test (supabase db reset), staging approval before prod
- Emergency procedure — rollback checklist
- Example ITK: "Add ngo_tier_start_date column to ngo_memberships" — backfill timestamp from created_at, NOT NULL constraint after data migration

---

### Kardeş skill analizi (supabase-backend)

**Mevcut:**
- supabase (104 satır)
- supabase-postgres-best-practices (64 satır header + 35+ reference docs)

**Eklenmesi önerilen (yeni skill'ler):**
- (None explicit, all additions to existing)

**Genişletilmesi önerilen (mevcut skill'lere ekle):**
- supabase-postgres-best-practices: "rls-row-level-security-patterns" (80 satır), "realtime-idempotency-webhooks" (90 satır), "edge-function-recipes" (70 satır), "migration-versioning-rollback" (80 satır) = 320 satır toplam ekleme

**Toplam effort:** Mevcut skill'e ekleme (~320 satır) = large effort (L)

---

## 7. auth-capacitor

**Mevcut skill + playbook özeti:**
- **supabase** (104 satır, shared): Auth bölümü minimal.
- **auth-capacitor.md** playbook (110 satır): SSR auth, Capacitor native OAuth, middleware, KVKK "ADR-008'de" söyleniyor ama concrete checklist yok.

**⚠️ KRİTİK BOŞLUKLAR (2 SKILL EKSIK):**
1. **KVKK Compliance** — Türk veri koruma kanunu (TR 6698). Aydınlatma metni template, double opt-in, consent tracking, data minimization.
2. **Capacitor Native OAuth** — iOS/Android deep linking, @capgo/capacitor-social-login, OAuth 2.0 RFC 8252 native app BCP.

---

### Bulgu 1: KVKK Compliance (TR 6698) — Aydınlatma Metni + Consent Tracking

**Kaynak:** [CookieYes — KVKK Compliance Guide](https://www.cookieyes.com/blog/turkey-data-protection-law-kvkk/), [Pandectes — KVKK Simple Guide](https://pandectes.io/blog/understanding-turkeys-personal-data-protection-law-kvkk/), [TermsFeed — KVKK vs GDPR](https://www.termsfeed.com/blog/turkey-kvkk-gdpr/), [Turkish DPA (KVKK Kurumu)](https://kvkk.gov.tr/)

**Öz:** KVKK (Kişisel Verilerin Korunması Kanunu, Law No. 6698) İçişleri TR verilen korunması için yasıdır. Kritik öğeler:
- **Aydınlatma Metni (Transparency):** İyiBiri signup'ında, kullanıcıya "hangi veriler toplayıyor, neden, ne kadar süre tutuyor, kime satıyor" söylenmeli. STK üyeliği form'unda ayrı aydınlatma (STK'yla data sharing).
- **Double Opt-In:** Email confirmation (link click) + explicit checkbox ("Kişisel verilerimin işlenmesini kabul ediyorum").
- **Çifte Onay (Para al):** Üyelik + ödeme (recurring) için ayrı onay, 14 gün cayma hakkı (TR 6502 E-Commerce Law).
- **Consent Tracking:** `profiles.kvkk_accepted_at` timestamp, `ngo_memberships.form_data.kvkk_accepted_at` (STK özel onay).
- **Data Minimization:** Sadece lazım veri. Sponsor marketing consent ≠ STK member verification consent.
- **Right to Erasure:** User "hesabımı sil" isterse, backup'ta bile kaç gün kalacak.

**Bizde var mı:** ADR-008'de "14 gün cayma hakkı" mentioned, ama "aydınlatma metni neresi" yoktur. Signup/membership form'unda checkbox var, ama KVKK metin'i hangi dil, kimin onayı vs. clear değil. Audit (page-audit.md): "/auth/signup" tag'ı "🟢 prod" ama KVKK uyumu verified değil.

**Öneri:** Yeni skill: **"kvkk-compliance-checklist"** (~160 satır). İçerik:
- KVKK kanunu özeti — obligations (transparency, consent, erasure).
- Aydınlatma metni template — 5 bölüm (veri controller, veriler, amacı, recipient, haklar). İyiBiri brandiyle customizable.
  - `public/legal/kvkk-aydinlatma.md` — İyiBiri genel
  - `public/legal/kvkk-ngo-membership.md` — STK üyeliği (STK ile data sharing)
  - `public/legal/kvkk-donation.md` — Bağış / Sponsor (recurring, payment processor)
- Double opt-in check — email + checkbox
- Consent tracking — database column'lar (profiles.kvkk_accepted_at, form_data.kvkk_accepted_at)
- Data retention — PII delete schedule (30 days after account deletion, unless legal hold)
- Right to erasure — user "sil" request'ine respons (async job, GDPR Right to be Forgotten parallel)
- Vendor check — Supabase data processing, Stripe/payment processor KVKK uyumu (DPA signed)
- Audit checklist — signup/membership form, privacy policy, tos hepsi KVKK-compliant mi
- Example türçe aydınlatma metni (tamplate + instructions for legal review)
- Legal review process — başlangıç için lawyer'a iletilmesi, review geri dönüş
- Fines — non-compliance penalty up to TRY 1,000,000 (enforcement authority: Turkish DPA)

---

### Bulgu 2: Capacitor Native OAuth Flow — Deep Linking + RFC 8252

**Kaynak:** [Capacitor Deep Links Docs](https://capacitorjs.com/docs/guides/deep-links), [OAuth with Capacitor — Privy](https://docs.privy.io/recipes/capacitor-oauth), [Capgo — OAuth2 in Capacitor](https://capgo.app/blog/5-steps-to-implement-oauth2-in-capacitor-apps/), [OAuth 2.0 for Mobile & Native Apps — RFC 8252](https://tools.ietf.org/html/rfc8252), [Security — Capacitor Docs](https://capacitorjs.com/docs/v2/guides/security)

**Öz:** Native OAuth (Google + Apple) iOS/Android'de custom URL scheme (iyibiri://) veya Universal Links (iOS) / App Links (Android) ile deep link. OAuth provider → authorization code → native app's redirect handler → Supabase session. RFC 8252 (OAuth 2.0 for Native Apps) best practice: PKCE (Proof Key for Code Exchange) + no embedded browser (system browser açması). @capgo/capacitor-social-login bu flow'u implement ediyor. Critical: REDIRECT_URI precision, URL scheme coordinator.

**Bizde var mı:** `capacitor.config.ts` var ama `server.url`, `appId`, URL scheme configuration explicit değil. `lib/auth/oauth-native.ts` wrapper var mı? `/auth/callback` web handler var ama mobile native deep link handler ayrı mı?

**Öneri:** Yeni skill: **"capacitor-native-oauth-flow"** (~180 satır). İçerik:
- Native OAuth flow diagram — provider → authorization code → Supabase session → deep link
- Capacitor config — `appId` (com.iyibiri.app), `appName`, `webDir`, `server.url` (prod: https://www.iyibiri.app, dev: http://localhost:3000), `scheme` (iyibiri://)
- iOS setup — Associated Domains (applinks:iyibiri.app), URL scheme in Info.plist
- Android setup — App Links intent filter (AndroidManifest.xml), SHA256 fingerprint in assetlinks.json
- @capgo/capacitor-social-login usage — Google provider, Apple provider, token → Supabase auth.setSession
- RFC 8252 compliance — PKCE (code_challenge + code_verifier), system browser (not embedded)
- Redirect URI precision — exact match (https://iyibiri.app/auth/callback vs. iyibiri://auth/callback — which is mobile?)
- Deep link handler — JavaScript listener (Capacitor.App.addListener("appUrlOpen", ...)), token extract, auth bridge
- Error handling — timeout, user cancel, invalid state (CSRF), network error
- Security — token in memory (not localStorage), HTTPS enforced, redirect URI whitelist
- Testing — iOS simulator + Android emulator, deep link test (simulate: xcrun simctl openurl booted "iyibiri://auth/callback?code=...")
- Example ITK:
  - Google OAuth → provider returns code
  - PKCE parameters in auth request
  - Redirect back to iyibiri:// deep link
  - App receives, extracts code
  - Supabase auth.setSession(access_token, refresh_token)
  - Web fallback — if native fails, web login (/auth/login) default
- Common pitfalls — hardcoded redirect URI, test app != prod app, localhost:3000 vs. www.iyibiri.app confusion

---

### Bulgu 3: Password Reset Flow — Eksik Akış

**Kaynak:** [Supabase Auth Docs — Password Reset](https://supabase.com/docs/guides/auth/passwords), [Auth0 Best Practices](https://auth0.com/blog/password-reset-best-practices/), [NIST SP 800-63](https://pages.nist.gov/800-63-3/sp800-63b.html)

**Öz:** "Şifremi unuttum" akışı eksik (audit tarafından marked: "/auth/signin" 🡡 beta — "Şifremi unuttum" ölü link). Flow: email → token gönder → link (reset page) → yeni şifre → redirect login. Token expiry (24h), one-time use, HTTPS transport, email verification.

**Bizde var mı:** /auth/signin'de "forgot password" link var ama `/auth/forgot-password` sayfası yok. Supabase `auth.resetPasswordForEmail()` API ayrımı yapılmamış.

**Öneri:** auth-capacitor playbook'a **"Password Reset Flow"** bölümü ekle (~60 satır, capacitor-native-oauth-flow skill'ine ekle). İçerik:
- Reset password endpoint — Supabase `auth.resetPasswordForEmail(email)`
- Email template — reset link + token
- /auth/reset-password page — token param, yeni şifre input, strength meter
- Token validation — expiry check (24h), one-time use
- Security — HTTPS only, email-verified requirement
- Example ITK — recover flow diagram

---

### Bulgu 4: OTP + MFA — Future Pattern

**Kaynak:** [Supabase Auth — OTP/MFA](https://supabase.com/docs/guides/auth/auth-mfa), [NIST Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html), [SMS vs. Email OTP tradeoff](https://www.twilio.com/blog/sms-mfa-vs-email-otp)

**Öz:** OTP (One-Time Password) + MFA (Multi-Factor Authentication) future pattern. İyiBiri `/auth/verify` (OTP via email) var, ama SMS OTP, TOTP (Authenticator app) future mi? Playbook'ta sadece structure, şu an email OTP yeter.

**Bizde var mı:** Playbook'ta OTP verify page var (mevcut), MFA roadmap absence.

**Öneri:** auth-capacitor playbook'a **"MFA Roadmap"** bölümü ekle (~40 satır). İçerik:
- Current: Email OTP (PIN-based)
- Future Phase: SMS OTP, TOTP (Google Authenticator)
- Pattern — secondary factor trigger, backup codes
- No implementation needed yet, but skeleton for phase 3/4

---

### Kardeş skill analizi (auth-capacitor)

**Mevcut:**
- supabase (104 satır, shared, auth section minimal)

**Eklenmesi önerilen (yeni skill'ler — KRİTİK):**
- `kvkk-compliance-checklist` (160 satır) — **LEGAL RISK mitigation, HIGH PRIORITY**
- `capacitor-native-oauth-flow` (180 satır) — native login, RFC 8252, deep linking

**Genişletilmesi önerilen (mevcut skill'lere ekle):**
- auth-capacitor playbook: "Password Reset Flow" (60 satır), "MFA Roadmap" (40 satır), playbook'ta "KVKK onay akışı" clarification

**IMMEDIATE ACTION:**
- KVKK compliance skill yazma — **legal review needed** before prod
- Capacitor OAuth skill yazma — **native testing required** (simulator)

**Toplam effort:** Yeni 2 skill (340 satır) + playbook ekleme (~100 satır) = large effort (L), but CRITICAL for legal/security

---

## 8. design-system-keeper

**Mevcut skill + playbook özeti:**
- **design-system-audit** (157 satır): Token audit, component inventory.
- **visual-spec-writing** (179 satır): Shared with ui-designer.
- **decision-docs** (198 satır): Shared with product-analyst.
- **design-system-keeper.md** playbook (110 satır): Token management, atom component, atlas reconciliation. **"Çalışma prensipleri" bölümü yok** (instruction'da marked as eksik).

---

### Bulgu 1: Atomic Design Taxonomy — Brad Frost Framework

**Kaynak:** [Atomic Design by Brad Frost](https://atomicdesign.bradfrost.com/chapter-2/), [DesignSystems.com — Atomic Design](https://www.designsystems.com/brad-frosts-atomic-design-build-systems-not-pages/), [Brad Frost Component Naming](https://bradfrost.com/blog/post/atomic-web-design)

**Öz:** Atomic Design (atoms → molecules → organisms → templates → pages) hierarchical thinking sağlar. Button (atom: no child component) vs. SearchForm (molecule: button + input atoms) vs. Navigation (organism: multiple molecules). İyiBiri'nin `components/ui/` inventory'sinde (badge, button, card, form, modal...) atomic level'i explicit değil — chaos risk.

**Bizde var mı:** design-system-keeper playbook'ta "atom component" söyleniyor ama "organism vs. molecule" ayrımı yoktur. Naming convention (@radix primitives, shadcn base) takip edilmiş ama Atomic Design taxonomy'e karşılık yok.

**Öneri:** design-system-audit skill'ine **"atomic-design-compliance"** bölümü ekle (~80 satır). İçerik:
- Atomic levels — explicit definition
  - Atom: no child component (Button, Input, Label, Icon)
  - Molecule: 2–3 atoms (SearchForm = label + input + button, FormField = label + input + error)
  - Organism: 3+ molecules (Header = nav + search + profile, Mission Card = title + description + actions)
  - Template: layout + organisms (DashboardLayout = sidebar + main + header)
  - Page: template + real data
- Classification exercise — mevcut 15 component classify
- Naming convention — option A: `{name}-{level}` (e.g., button-atom), option B: just `button`, keep level in file hierarchy (`atoms/button`, `molecules/search-form`)
- Hierarchy diagram — Figma file structure
- Trade-offs — strict taxonomy vs. pragmatism (sometimes blur boundaries)
- Example ITK: mission-card-component
  - Level: organism (title-atom + description-atom + karma-badge-molecule + join-button-atom + etc.)
  - File: `components/mission-card.tsx` (atom level in name, but organism in structure)

---

### Bulgu 2: Token Governance Workflow — Nathan Curtis Framework

**Kaynak:** [Nathan Curtis — Naming Tokens](https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676), [Design Systems Collective — Token Governance](https://www.designsystemscollective.com/design-tokens-in-practice-from-figma-variables-to-production-code-fd40aeccd6f5), [Figma Blog — Semantic Tokens](https://www.figma.com/blog/the-future-of-design-systems-is-semantic/)

**Öz:** Token governance = "nerede başarısız olur?" İyiBiri'nin token'ları: `ink`, `cream`, `gold`, `clay`, `success`, `domain-{1–6}` + spacing (Tailwind) + typography (Roc Grotesk, Inter). Karar: "color-action" token add etmek mi, yoksa existing token kullan mı? Rename'i (color-gold → color-primary) what ripple? Governance'sız → design-engineer rast gele token ekler, code fragmented.

**Bizde var mı:** Atlas'ta token'lar listed, ama governance workflow yoktur. Design-system-keeper playbook'ta "Token yazma" var, "karar ağacı" (add vs. alias vs. rename) yok.

**Öneri:** design-system-audit skill'ine **"token-governance-decision-tree"** bölümü ekle (~90 satır). İçerik:
- Token request flowchart — new design need → existing token match? → add / alias / rename / reject decision
- Primitive vs. semantic levels — naming clarity (color-blue-500 primitive / color-action semantic)
- When to ADD — existing tokens insufficient cover
  - Example: "shadow for card" → boxShadow-sm (new), not "shadow-gray-200" (misleading)
- When to ALIAS — new semantic name for existing value
  - Example: color-primary → color-gold (semantic alias)
- When to RENAME — breaking change, document, grep codebase for impact
  - Example: color-gold → color-emphasis (why: emotional shift from "secondary" to "prominent")
  - Effort: code grep + token update + Figma update + communication
- When to RETIRE — unused token cleanup (6 months → remove, or deprecation period 2 months warning)
- Review cadence — monthly token audit, decision log
- Tooling — Figma Variables plugin, token sync GitHub → code (FigmaTokens, Style Dictionary)
- Example ITK:
  - Request: "error state for form field" → add color-error (new) or use color-clay? → if clay mismatches semantics, add color-error
  - Rename example: next phase (2.0) "ink → text-primary", compat layer for 1.x

---

### Bulgu 3: Figma Variables + Semantic Naming — Modern Implementation

**Kaynak:** [Figma Variables Docs](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma), [Figma Blog — Future of Design Systems](https://www.figma.com/blog/the-future-of-design-systems-is-semantic/), [Design Systems Collective — Variables 2025](https://www.designsystemscollective.com/design-system-mastery-with-figma-variables-the-2025-2026-best-practice-playbook-da0500ca0e66)

**Öz:** Figma Variables (2023+) design token implementation'ı transform etti. Primitive variable (--color-blue-500) + mode (light/dark) → semantic alias (--color-action = var(--color-blue-500)). İyiBiri dark-only V1 (ADR-004), ama Figma Variables dark/light mode support zamanında prepare etmeli.

**Bizde var mı:** Figma design file'ında token'lar (renk, spacing) var ama "Variables feature" usage unknown. Code'da Tailwind token'ları hardcoded, Figma-code sync none.

**Öneri:** design-system-audit skill'ine **"figma-variables-semantics"** bölümü ekle (~70 satır). İçerik:
- Figma Variables syntax — primitive / semantic / alias
- Light/dark mode setup — Figma mode feature
- Code generation — Figma Tokens plugin (open-source), Style Dictionary (Salesforce)
- Semantic naming strategy — namespace-category-semantic pattern
  - Example: `color-action-default` / `color-action-hover` / `color-action-disabled`
- Roadmap — phase 1 (current): dark-only tokens, phase 2 (light mode): Figma Variables setup
- Sync process — Figma update → CI/CD token export → code regenerate
- Example ITK: color token setup in Figma, export to code via Figma Tokens plugin

---

### Bulgu 4: Contribution Model + Playbook — Missing "çalışma prensipleri"

**Kaynak:** [Design Systems Handbook — Contribution Model](https://www.designsystemshandbook.com/), [Component Contribution Guide — Shopify Polaris](https://polaris.shopify.com/foundations/contributing), [IBM Carbon Contributing](https://github.com/carbon-design-system/carbon/blob/main/CONTRIBUTING.md)

**Öz:** design-system-keeper playbook'ta başında "Kimlik, ton, responsibilité" var, ama "çalışma prensipleri" eksik (instruction marked as eksik). Bu: component eklemek için checklist, dependency (UI-designer approval, frontend-engineer implementation), pull request template, review criteria.

**Bizde var mı:** Playbook structure var, "Çalışma prensipleri" bölümü empty.

**Öneri:** design-system-keeper playbook'a **Bölüm 2 "Çalışma prensipleri"** yazma (~80 satır). İçerik:
- Component add ritual — UX → UI spec → design-system-keeper → frontend-engineer coordinate
- Approval gates — "new component hak ediyor mu, existing'i extend etmek yeterli değil mi"
- Testing — visual test (mevcut component'le contrast), accessibility test (a11y, WCAG AA)
- Documentation — component.stories.tsx (Storybook pattern), usage guideline, accessibility notes
- Versioning — major.minor format (component update tracking)
- Deprecation — sunset period, migration guide
- Example PR template — checklist (a11y ✓, design ✓, docs ✓, test ✓)

---

### Kardeş skill analizi (design-system-keeper)

**Mevcut:**
- design-system-audit (157 satır)
- visual-spec-writing (179 satır) [shared]
- decision-docs (198 satır) [shared]

**Eklenmesi önerilen (yeni skill'ler):**
- (None explicit, all additions to existing)

**Genişletilmesi önerilen (mevcut skill'lere ekle):**
- design-system-audit: "atomic-design-compliance" (80 satır), "token-governance-decision-tree" (90 satır), "figma-variables-semantics" (70 satır)
- design-system-keeper playbook: Bölüm 2 "Çalışma prensipleri" (80 satır) ekle

**Toplam effort:** Mevcut skill'e ekleme (~240 satır) + playbook (80 satır) = large effort (L)

---

## 9. coordinator

**Mevcut skill + playbook özeti:**
- **agent-communication-protocol** (205 satır): Handoff log, status board, journal entry, peer review flow, decisions queue — comprehensive.
- **coordinator.md** playbook (270 satır, yeni yazıldı): Orchestrator + triage role, workstream sequencing, upstream/downstream dependency.

---

### Bulgu 1: Decision Queue Canonical Clarity — Open vs. Resolved

**Kaynak:** [Shreyas Doshi — Decisions Framework](https://www.linkedin.com/posts/shreyas_decision-making-framework-product-managers-activity-6862614820556648448-m5Tz), [Project Planning Best Practices — Engineering Leadership](https://www.elidedhq.com/)

**Öz:** Coordinator'ın joblarından biri "open decision'ları track et." Agent-communication-protocol'de "docs/product/04-questions/open.md" canonical ama "docs/_decisions-queue.md" (root) parallel. Risk: two sources of truth. Coordinator'ın triage'sinde "bu decision'ı kime ask edelim" sorgusu, decision queue'ya ref vermek gerek.

**Bizde var mı:** agent-communication-protocol skill'inde "canonical" açık (open.md), ama working/discussion doc (_decisions-queue.md) parallel. Coordinator playbook'ta "karar kuyruğu" söylenmiyor, handoff log + status board focus.

**Öneri:** agent-communication-protocol skill'inde **"Decisions Queue Canonical"** heading altında (Bölüm 5'te mentioned) clarity ekle (~50 satır). İçerik:
- Canonical source: `docs/product/04-questions/open.md` + `resolved.md`
- Working doc: `docs/_decisions-queue.md` — daily scribble, sync'lenmiş olmalı
- Sync ritual — haftada 1x working doc → canonical update
- Decision template — context / options / decision / impact
- Example: "STK donation flow handling" → open.md'de kaydedildi, ADR Accepted'te moved to resolved.md

---

### Bulgu 2: Triage Decision Tree — Refine & Operationalize

**Kaynak:** [Shreyas Doshi — LNO Triage](https://coda.io/@shreyas/lno-framework), [Engineering Leadership — Prioritization](https://www.staffeng.com/), [RACI Matrix](https://en.wikipedia.org/wiki/Responsibility_assignment_matrix)

**Öz:** Coordinator triage "bu iş kime?" sorusuna cevap verir. LNO (Leverage / Neutral / Overhead) triage framework'ü (strategy-consultant bulgu'sundan), RACI (Responsible / Accountable / Consulted / Informed) matrix. New workstream'de: strategy-consultant'a Leverage, frontend-engineer'a Neutral, design-system-keeper'a Overhead routing'i optimize et.

**Bizde var mı:** Playbook'ta "triage" söyleniyor, decision tree / flowchart yok. Agent'ları assign etme disiplini manual (coordinator'ın intuition).

**Öneri:** coordinator playbook'a **"Triage Decision Tree"** bölümü ekle (~90 satır). İçerik:
- Flowchart: work type → (Strategic / Product / UX / UI / Eng / Infra) → (which agent) + (which priority P0/P1/P2)
- RACI assignment — example workstream
  - Responsible: UI-designer (spec writing)
  - Accountable: coordinator (deadline tracking)
  - Consulted: product-analyst (requirements), UX-researcher (validation)
  - Informed: frontend-engineer, design-system-keeper
- Load balancing — avoid bottleneck (single agent over-assigned)
- Escalation path — stuck decision → strategy-consultant or product lead
- Example ITK: "Mission card redesign" workstream → UI-designer responsible, product-analyst consult, frontend-engineer depend (code), coordinator track

---

### Bulgu 3: Stop Conditions — When to Escalate / When to Wait

**Kaynak:** [Project Management — Go/No-Go Criteria](https://www.apm.org.uk/resources/what-is-a-project/), [Agile — Definition of Done](https://www.agilealliance.org/glossary/definition-of-done/), [Lean Startup — Pivot/Persevere Decision](https://www.startuplens.com/pivot)

**Öz:** Coordinator'ın "bu iş bitti mi?" sorusu. Agent bir task deliver'ı etti, ama downstream agent'ı wait ediyor (kullanıcı input bekleniyor, mevcut skill timeout vs.). Coordinator'ın stop conditions açık olmalı: "decision needed" (user approval) → park, "blocked" (dependency) → escalate, "done" (all handoff'lar closed) → move.

**Bizde var mı:** Agent-communication-protocol'de "status board" (In progress / Done today / Waiting for user) var, ama stop condition'ları (bug? feature complete? user decision?) fuzzy.

**Öneri:** coordinator playbook'a **"Stop Conditions & Escalation"** başlığı ekle (~70 satır). İçerik:
- Status categories — clear definition
  - In progress: active work, ETA clear
  - Done today: deliverable complete, all downstream notified
  - Waiting for user: user action needed (decision, approval), deadline documented
  - Blocked: external dependency (waiting API, third-party), escalation (if >2 days)
  - Escalation: coordinator → manager / product lead
- Examples:
  - "Strategy memo done, waiting for user decision on market segment" → Waiting
  - "Design spec'e developer start etti ama requirement bulanık" → Blocked → strategy/product re-clarify
  - "Component spec done, design-system approval passed, frontend ready" → Done
- Escalation criteria — >2 days blocked, >3 days waiting, legal/compliance risk detected

---

### Bulgu 4: Workstream Sequencing — Critical Path Analysis

**Kaynak:** [Critical Path Method — Project Management](https://www.apm.org.uk/resources/what-is-a-project/), [Dependency Mapping — Software Development](https://en.wikipedia.org/wiki/Dependency_graph), [Shape Up — Cycle Planning](https://basecamp.com/shapeup/0-introduction)

**Öz:** Coordinator'ın "hangi workstream'ler paralel, hangiler sequenced?" kararı. Example: "STK membership tier feature" → strategy (tier model design) → product (feature spec) → UX (flow) → UI (design) → frontend (code) → QA / launch. Critical path: strategy → product (sequential, 10 days) vs. UX + UI (parallel, 8 days). Slack (buffer) olana hangisine? Coordinator'ın parallelization decide etmesi.

**Bizde var mı:** Playbook'ta "workstream sequencing" söyleniyor ama critical path / dependency diagram yok.

**Öneri:** coordinator playbook'a **"Workstream Sequencing & Dependencies"** bölümü ekle (~80 satır). İçerik:
- Dependency types — sequential (A must finish before B), parallel (A + B simultaneous), external (waiting third party)
- Gantt-style timeline (text-based)
  ```
  Strategy-consultant: [====== 5 days ======] (days 1-5)
  Product-analyst: ..................[====== 3 days ======] (days 6-8, waits for strategy)
  UX-researcher: ..................[=== 4 days ===] (days 6-9, parallel with product)
  UI-designer: ..............................[====== 5 days ======] (days 10-14, after UX)
  Frontend-engineer: ..............................[========== 10 days ==========] (days 10-19, after UI)
  QA + Launch: ........................................................[== 3 days ==]
  ```
- Critical path — longest sequence (days 1-22), slack'ü manage et
- Risk mitigations — if UX delayed, frontend start'ı previous UI spec'le; fallback path
- Example ITK: "Donation flow V1" workstream — dependency chain, parallel discovery vs. delivery

---

### Kardeş skill analizi (coordinator)

**Mevcut:**
- agent-communication-protocol (205 satır)

**Eklenmesi önerilen (yeni skill'ler):**
- (None, coordinator uses discovery agents' skills)

**Genişletilmesi önerilen (mevcut skill'lere ekle):**
- agent-communication-protocol: "Decisions Queue Canonical" clarity (50 satır)
- coordinator playbook: "Triage Decision Tree" (90 satır), "Stop Conditions & Escalation" (70 satır), "Workstream Sequencing & Dependencies" (80 satır)

**Toplam effort:** Mevcut skill'e ekleme (50 satır) + playbook ekleme (~240 satır) = medium-large effort (M-L)

---

## Priority-Ranked Implementation Plan

15 actionable recommendations, P0/P1/P2 sıralı, effort tahmini (S/M/L):

### P0 (Immediate, Legal/Security Risk Mitigation)

1. **auth-capacitor: KVKK Compliance Skill** (160 satır) — aydınlatma metni template, consent tracking, data retention. **Effort: M**. *Legal risk: non-compliance fine TRY 1M+, startup credibility.*

2. **auth-capacitor: Capacitor Native OAuth Flow Skill** (180 satır) — RFC 8252, deep linking, iOS/Android setup. **Effort: M-L**. *Security risk: broken OAuth → account takeover, testing with native emulator required.*

3. **frontend-engineer: Mobile-app-polish-standards Skill Reference** (playbook fix, 5 satır) — `.tools` list'e add. **Effort: S**. *Ownership clarity: FE engineer mobile UX responsibility explicit.*

### P1 (High Value, Framework Adoption)

4. **strategy-consultant: Pyramid Principle Skill** (80 satır) — governing thought, MECE writing, memo template. **Effort: M**. *Quality impact: top-tier strategy writing discipline.*

5. **product-analyst: Product Discovery Frameworks Skill** (200 satır) — OST, JTBD interview, continuous discovery ritual. **Effort: M**. *Discovery rigor: weekly customer feedback loop enable.*

6. **ux-researcher: Continuous Discovery Practice Skill** (180 satır) — weekly team ritual, HEART metrics, story mapping. **Effort: M**. *Team mindset shift: from 1x research to continuous discovery.*

7. **frontend-engineer: React Server Component Patterns Skill** (150 satır) — RSC mental model, boundary, waterfall prevention. **Effort: M**. *Code quality: server/client split discipline, SSR perf improvement.*

8. **supabase-backend: RLS + Realtime + Edge Functions** (240 satır total, 3 sub-sections) — security pattern, idempotency, edge logic. **Effort: M-L**. *Data safety: row-level security + webhook reliability.*

9. **design-system-keeper: Atomic Design Compliance + Token Governance** (240 satır total, 3 sub-sections) — taxonomy clarity, governance decision tree, Figma Variables. **Effort: M-L**. *System scalability: component naming + token naming consistency.*

### P1 (Continued)

10. **ui-designer: Visual Hierarchy + Motion Choreography** (140 satır total, 2 sub-sections) — Refactoring UI principle, Rauno Freiberg stagger pattern. **Effort: M**. *Design polish: visual hierarchy discipline + robust animation.*

11. **strategy-consultant: 7 Powers + Working Backwards** (130 satır added to consulting-methodology) — moat analysis, PR-FAQ format. **Effort: M**. *Strategic depth: competitive advantage clarity.*

12. **product-analyst: Shape Up Pitching + OKR Linkage** (150 satır added to writing-plans) — appetite-driven planning, quarterly goals. **Effort: M**. *Execution discipline: fixed timeline, variable scope + metric alignment.*

### P2 (Nice-to-Have, Operational Excellence)

13. **coordinator: Triage Decision Tree + Workstream Sequencing** (240 satır added to playbook) — RACI mapping, critical path, stop conditions. **Effort: M**. *Coordination rigor: agent routing + dependency management.*

14. **design-system-keeper: Playbook "Çalışma Prensipleri"** (80 satır) — component contribution ritual, approval gate, documentation. **Effort: S-M**. *Operational clarity: component add process explicit.*

15. **supabase-backend: Migration Versioning + Rollback** (80 satır added to postgres-best-practices) — forward/backward compat, data migration pattern. **Effort: M**. *Reliability: safe schema evolution.*

---

## Summary by Agent

| Agent | Recommendations | New Skills | Skill Additions | Playbook Changes | Total Effort | Priority |
|-------|-----------------|------------|-----------------|------------------|---|---|
| strategy-consultant | 3 | 1 (Pyramid) | 2 (7Powers, Working Backwards) | LNO Triage | M-L | P0–P1 |
| product-analyst | 3 | 1 (Discovery Frameworks) | 2 (Shape Up, OKR) | — | M | P1 |
| ux-researcher | 3 | 1 (Continuous Discovery) | 2 (Story mapping, HEART) | — | L | P1 |
| ui-designer | 2 | — | 2 (Visual hierarchy, Motion) | — | M | P1 |
| frontend-engineer | 2 | 1 (RSC Patterns) | 2 (Testing, Performance) | Mobile ref, skill ref fix | M-L | P0–P1 |
| supabase-backend | 3 | — | 4 (RLS, Realtime, Edge, Migration) | — | L | P1 |
| auth-capacitor | 3 | 2 (KVKK, OAuth) | — | Password reset, MFA | M-L | **P0** |
| design-system-keeper | 3 | — | 3 (Atomic, Tokens, Figma) | Çalışma prensipleri | L | P1 |
| coordinator | 2 | — | 1 (Decisions clarity) | Triage, Sequencing, Stop conds | M-L | P2 |

**Toplam yeni skill'ler:** 6  
**Toplam skill'lere ekleme:** ~2,500 satır (80–320 satır per agent)  
**Toplam playbook güncellemesi:** ~800 satır  
**Genel effort:** ~3 hafta (2 senior engineer + 1 designer + 1 legal review for KVKK)

---

## Key Findings Recap

1. **Pyramid Principle (strategy-consultant):** MECE + governing thought = top-tier memo discipline — ayrı skill yaklaşımı daha iyi (Minto explicit).

2. **Continuous Discovery (UX + Product):** OST + JTBD + weekly ritual = product discovery rigor. İyiBiri "1x research, 3mo build" risk profile'dan "weekly validated learning"'e geç.

3. **React Server Components (frontend):** RSC mental model (server default, client boundary) clarity = Next.js 14 full potential unlock. Waterfall prevention kritik.

4. **KVKK + Capacitor Native OAuth (auth):** Two critical skill'ler, legal + security, P0. Delay = risk.

5. **Token Governance + Atomic Design (design system):** Nathan Curtis + Brad Frost framework adoption = scale-ready system. Fuzzy naming = component chaos.

6. **Shape Up + LNO + 7 Powers (strategy/product):** Modern product development frameworks (appetite, leverage, moat) = clarity. Mevcut "problem statement" → "full strategy system" evolution.

---

**Hazırlanmış:** 2026-04-24  
**Araştırma Kaynakları:** 40+ top-tier practitioner, framework creator, şirket blog + documentation

