---
name: continuous-discovery-practice
description: Haftalık customer research ritual disiplini. Continuous Discovery Habits (Teresa Torres), Opportunity Solution Tree (OST), HEART framework (Google), Jeff Patton story mapping. Discovery team'inin min 1 customer conversation/hafta + OST güncelleme + parallel experiment çalıştırma pratiği. İyiBiri gönüllü/STK/sponsor akışında haftalık discovery ritual'ı embedding etme — daha sık learning, faster pivoting, hypothesis-driven design.
---

# Continuous Discovery Practice

**Kaynaklar:**
- [Teresa Torres — Continuous Discovery Habits](https://www.producttalk.org/continuous-discovery-habits/)
- [Google HEART Framework](https://www.w3.org/people/team/)
- [Jeff Patton — User Story Mapping](https://www.jpattonassociates.com/story-mapping/)
- [Tomer Sharon — Validating Product Ideas](https://www.nngroup.com/)
- [Evan Samek — CDH Summary](https://evansamek.substack.com/p/summary-continuous-discovery-habits)

> **Temel varsayım:** "Discover once, build 3 months" yaklaşımı risk'lidir. "Weekly customer touchpoint + OS Tree + parallel hypothesis testing" = faster learning cycle, lower build waste.

---

## 1. Continuous Discovery nedir?

**One-time research vs. weekly ritual:**

| Yaklaşım | Frekans | Ekip | Çıktı | Risk |
|---|---|---|---|---|
| One-time survey/usability test | Project başında, sonunda | UX alone | Spec, heuristics list | Built on 6-month-old feedback |
| Continuous discovery | Weekly | 2–3 kişi (PM + UX + backend) | Opportunity backlog, validated hypothesis | Learning loop integrates with delivery |

**İyiBiri için:** Ürün market validate aşamasında. Gönüllü / STK / sponsor feedback'i haftada döner. Discovery team (product-analyst + ux-researcher + 1 backend) haftalık 45min customer interview (3x rotating personas) + OST append.

---

## 2. Opportunity Solution Tree (OST) yapısı

OST = Visual decision tree. Root: problem statement. Branches: opportunities + solutions + experiments.

```
                    ┌─ Outcome
                    │
            ┌───────┤
            │       └─ Assumption
            │
      Problem
            │
            ├─ Opp 1 ── Sol 1.1 ── Exp 1.1.1
            │        └─ Sol 1.2
            │
            ├─ Opp 2 ── Sol 2.1
            │
            └─ Opp 3
```

**Bileşenler:**
1. **Problem Statement (Root):** "Gönüllüler, etkinlik bulmakta güç çekiyorlar çünkü..."
2. **Opportunity:** "Gönüllüler, ilgi alanlarına göre etkinlik discover edebilseler..."
3. **Solution:** "Kategorize edilmiş grid + search filter"
4. **Assumption:** "Gönüllüler, kategori filtresinden yararlanır"
5. **Experiment:** "50 active volunteer'e 1 hafta test, completion rate ölç"

---

## 3. Haftalık Discovery Ritual

### Adım 0: Team + Cadence

- **Who:** PM (research brief set) + UX researcher (interview facilitate) + 1 engineer (technical feasibility)
- **When:** Her Perşembe saat 14:00
- **Duration:** 45 min interview + 15 min debrief
- **Rotation:** STK reps (hafta 1), gönüllüler (hafta 2), sponsor (hafta 3) — cycle repeat

### Adım 1: Customer interview (45 min)

**Setup:**
- Ön hafta: candidate bulma (email campaign, in-app prompt, refferal)
- Zoom/in-person 45 min + incentive (kart/karma bonus)

**Flow:**
1. **Warm-up (5 min):** "Geçen hafta hangi görevleri yaptın?"
2. **Problem exploration (15 min):** "Şu an hangi challenge yaşıyorsun?"
3. **Story:** JTBD style — "Geçen ay, X yapmak istedin, ne oldu?"
4. **Context:** "Neden bu mühimdi, başka ne denedi?"
5. **Debrief:** Interviewee dönüş sorusu: "Bizi nasıl geliştirebiliriz?"

**Forbidden:**
- Cevap leading ("Filtrenin hoşuna gitti mi?" — evet/hayır bias)
- Multiple stakeholder interrupt
- "Research is data we'll use later" — action belirlenmez

### Adım 2: OST + Backlog update (15 min)

**Right after interview:**
1. 1 key opportunity bul (interview'deki pain / unmet need)
2. OST'ye append (problem node üzerine)
3. 2–3 solution alternative brainstorm
4. 1 most-likely assumption identify
5. 1-line backlog entry: `[OPPE-{date}]: {opportunity} — {assumption} — {experiment size}`

**Example (İyiBiri):**
```
[OPPE-2026-04-24]: "STK yöneticiler üyelerini bulk-onboard etmek ister"
- Assumption: "CSV import + validation → manual bulk action sayısını 70% düşürür"
- Exp size: "10 STK × 100 üyelik test (3 hafta), time-to-complete + error rate"
```

### Adım 3: Parallel experiment + learning

**Shape Up pattern ile integrated:**
- "Current cycle: 2-week feature build"
- "Parallel: 1 hypothesis test (OST-driven experiment) — 2–3 days sprint"
- **Learning = lead metric,** feature velocity = lag metric

**Example cycle:**
```
Week 1: Interview → OST opp #3 → "Gönüllüler, peer recommendations önemser"
       Parallel exp: 4 gönüllüye "peer suggestion card" mockup test → click rate ölç

Week 2: Build feature #5 (concurrent) + hypothesis validate/invalidate
       Next interview: "peer suggestion test'i neler trigger etti?" → iterate

Week 3: Feature launch + OST backlog gözden geçir
```

---

## 4. HEART Framework — Metric Mapping

HEART (Happiness/Engagement/Adoption/Retention/Task success) = each metric measures different dimension of product health.

| Metrik | Tanım | İyiBiri measure | Trigger | Collection method |
|---|---|---|---|---|
| **Happiness** | Satisfaction, preference | "Mission discovery satisfaction" | Post-task survey | Post-mission 5-point NPS |
| **Engagement** | Intensity of use | Weekly active missions | Analytics event | Backend event log |
| **Adoption** | New user/feature uptake | "First mission completion" rate | Onboarding end | Funnel analysis |
| **Retention** | Repeat usage | "Monthly active" vs. "inactive 30d" | Cohort track | Retention curve (Mixpanel) |
| **Task success** | Goal completion rate | "Mission QR verify success" rate | Post-mission | Backend completion event |

**Journey map + HEART integration:**

```
Gönüllü journey: Discovery → Apply → Prepare → Participate → Verify → Reward

HEART metrics mapped:
- Discovery: Happiness (satisfaction with search), Engagement (time spent browsing)
- Apply: Task success (application submission rate)
- Prepare: Adoption (material download), Engagement (recheck frequency)
- Participate: Task success (show up on time)
- Verify: Task success (QR scan success)
- Reward: Happiness (reward appeal), Retention (next mission within 7d)
```

---

## 5. Story Mapping — Workflow Clarity

Story Map = timeline + "main actor tasks" (top row) + "subtasks/variations" (rows below).

**Structure:**

```
Gönüllü story map: "İlk görev bulma ve katılma"

Timeline (top):
[ Browse ]  [ Filter ]  [ Select ]  [ Apply ]  [ Confirm ]  [ Prepare ]  [ Participate ]

Subtasks (per step):
Browse:
  - Browse popular
  - Browse by category
  - Browse by location
  - Browse by skill

Filter:
  - Filter by distance (5km)
  - Filter by availability (weekend)
  - Filter by cause (environment)
  - Sort by rating
  
[... continue for each step]

System actor:
  - Push notification (new mission)
  - Validation (apply form)
  - Reminder (2d before)
  - QR check (day-of)

STK actor:
  - Post mission
  - Modify details
  - Accept/reject apply
  - Verify completion
```

**Pain point + opportunity marker:**

```
Apply step:
┌─────────────────────────────┐
│ [#1 Pain] "Form na long"    │ Opp: "Smart field hints"
│ [#2 Pain] "No preview"      │ Opp: "Show me who's going"
│ [Opp] "Peer suggestions"    │ Sol: "See friends also applied"
└─────────────────────────────┘
```

---

## 6. JTBD interview questions (Bob Moesta style)

JTBD = Jobs to be Done. "Person" nedir değil, "what job are they trying to accomplish?" nedir.

**Question pattern:**

1. **Trigger:** "Geçen ay, hangi amaçla bir görev aramaya başladın?"
2. **Context:** "O zaman neler oluyordu hayatında?"
3. **Alternative:** "O job'ı halletmek için başka ne denedi?"
4. **Pushback:** "Niye bu alternatifi seçmedi?"
5. **Ideal:** "Seninle beraber bunun ideal halini tasarlarken, neler farklı olurdu?"

**İyiBiri example:**

```
Trigger: "Geçen hafta bir görev arıyordun, neden?"
Resp: "Selamlaşan bir arkadaşım çağırmıştı, kendisi bir STK'da çalışıyor"

Context: "O gün başka neler vardı?"
Resp: "Kütüphane açık, havası güzeldi, boş zamanım vardı"

Alternative: "Bunun yerine başka neler yapabildirdin?"
Resp: "Kitap okuyabilirdim, uyuabilirdim, web'de dolaşabilirdim"

Pushback: "Niye görev seçtin?"
Resp: "Arkadaşımı desteklemek istiyordum, sosyal birşey olmasını istedim"

Ideal: "Bunu yaparken neler daha kolay olsaydı?"
Resp: "Arkadaşlarımın hangi görevlere gideceğini önceden görmek"
```

---

## 7. İyiBiri pilot: Discovery team adım adım

### V1 pilot (3 STK context)

**Month 1: Ritual setup**
- Week 1: Interview × 3 STK coordinator (current pain)
- OST v1: 5 opportunity + 15 possible solution
- Assumption prioritize (RICE score)

**Month 2: Parallel experiment**
- Interview × 4 gönüllü (mission discovery pain)
- 2 hypothesis test (in parallel with feature build)
- OST update: new 3 opp + retire 2 (validate/invalid)

**Month 3: Learning integration**
- Cadence optimize (coordinator feedback → meeting time shift)
- Dashboard: "Weekly OST entry count", "Hypothesis validation %"
- Handoff: Next cycle team'e "Learnings" doc + OST artifact

---

## 8. Discovery vs. Delivery ayrımı

**Common mistake:** "Discovery = sıfırdan tasarım" / "Delivery = execute to spec"

**Right model:**
- **Discovery cycle:** OST update, 1–2 hypothesis test, learning accumulation
- **Delivery cycle:** Feature implement (2–3 week sprint), parallel discovery running
- **Feedback loop:** Discovery output → backlog → delivery → metric → discovery trigger

**Timeline:**

```
┌─────────────┬───────────┬───────────┐
│ W1-W2: Build Feature #5 │ Parallel: │ W3: Metric review
│ Delivery-focused        │ Exp #2    │ Next iteration setup
│                         │ (Disc)    │
└─────────────┴───────────┴───────────┘
  ↑ OST baseline           ↑ Exp result → OST
```

---

## 9. Assumption mapping + test priority

**Assumption types:**

| Type | Example | Risky? | Test method |
|---|---|---|---|
| **User need** | "Gönüllüler, buddy system ister" | HIGH | Interview ask + observed need |
| **Feature usage** | "Users filter'i 40% of time use" | MEDIUM | Prototype test + analytics |
| **Implementation** | "Bulk CSV import 3 days build" | LOW | Spike (engineer estimate) |
| **Business** | "STK pays $100/month" | HIGH | Early user conversation |

**Priority matrix:**

```
         High impact
             ↑
             │  [#1] User need:
             │  buddy system?  ← HIGH impact + HIGH risk
             │
Impact  │    [#2] Feature usage:
        │    filter frequency?
        │
        │               [#4] Implementation
             │           difficulty?
             │           ← LOW impact + LOW risk
        └───────────────────→ Risk/Uncertainty
                        Low impact
```

**Test strategy:**
- `#1 (HIGH impact + HIGH risk)` → Full interview cycle (week 1)
- `#2 (MEDIUM)` → Prototype + 5-user test (week 2)
- `#3 (unused)` → Deprioritize unless unlocked
- `#4 (LOW)` → Spike, no user test needed

---

## 10. Anti-pattern: "Research as theater"

**Avoid:**

1. **Survey without follow-up:** 200 response survey → stat analysis → ignore outliers → done. ❌
   - **Right:** Survey → top 5 hypothesis → 10 deep interview

2. **Usability test, no iteration:** 5 user → pain point list → 6-month delivery → test again. ❌
   - **Right:** Usability test → fix → prototype → test week-2 (parallel build)

3. **"Research is background" → "Delivery is foreground":** ❌
   - **Right:** Discovery + delivery parallel (time-shared team)

4. **Assumption not explicit:** "Users want X" [no evidence] → build X → users don't use → "research was wrong" ❌
   - **Right:** "Assumption: users want X because [interview quote]. Test: [how]. Outcome: [metric]."

---

## 11. Karar ağacı: Yeni iş = discovery ritual

```
Kullanıcı = "Yeni feature hakkında research yapmak istiyorum"
│
├─ "Varsayım belirlendi mi?" (problem statement + assumption)
│  ├─ EVET → Step 2
│  └─ HAYIR → "Interview konusunu netleştirme sorusu sor"
│
├─ Step 2: "Customer segment rotationı" (STK vs. gönüllü vs. sponsor?)
│  ├─ BELIRTILMEDI → "Pilot 1 segment seç (en high-impact)"
│  └─ BELIRTILDI → Step 3
│
├─ Step 3: "Haftalık ritual'e entegre et"
│  ├─ "Current OST + new assumption ekle"
│  ├─ "Interview script yazılacak mı? (5 min brief + Moesta pattern)"
│  └─ "Parallel exp size (3 days vs. 1 week)" → backlog entry
│
└─ Deliver: OST entry + interview summary + next hypothesis
```

---

## 12. Pre-production checklist

- [ ] Problem statement (1 sentence, specific to segment)
- [ ] Customer segment (STK / volunteer / sponsor)
- [ ] Interview schedule (date + 3 candidate names)
- [ ] JTBD interview script (Moesta pattern template used)
- [ ] Current OST (5+ opportunity node visible)
- [ ] Assumption prioritized (top 3, RICE score)
- [ ] Parallel experiment size (hours/days, metric defined)
- [ ] Collection method (survey tool / prototype platform / analytics instrumentation)
- [ ] Feedback cadence (weekly debrief meeting time booked)
- [ ] Artifact location (`docs/ux/04-discovery-log/YYYY-MM-DD.md`)

---

## Antiphon: Common mistakes

| Mistake | Why risky | Fix |
|---|---|---|
| "Talk to 50 users once" | Survivorship bias, no repeat learning | Min 3 users × 4 weeks = pattern |
| "Research = UX alone" | Missing context (product, eng constraints) | 3-person team ritual |
| "Interview = final answer" | Confirmation bias (ask YES questions) | Story method + diverge alternatives |
| "OST never updated" | Opportunity backlog becomes stale | Week-over-week append (visible artifact) |
| "Exp too big" | No learning for 6 weeks | Keep exp ≤ 3 days dev, start/stop in cycle |
| "Assumption not tracked" | Can't measure validation rate | OST = explicit assumption node per branch |

---

## Kontrol listesi

- [ ] Haftalık ritual setup? (time, team, cadence booked)
- [ ] OST artifact var mı? (problem root + 5+ opportunity)
- [ ] HEART metric mapping yapıldı mı? (journey → metric)
- [ ] Story map (main steps + subtask rows) çizildi mi?
- [ ] Assumption prioritized (RICE / impact matrix)?
- [ ] JTBD interview protocol setup? (Moesta pattern)
- [ ] Parallel experiment backlog entry yazılmış?
- [ ] OST v1 → v2 iteration example gösterildi?
- [ ] Anti-pattern check (survey-only / usability-then-wait / implicit assumption)?
- [ ] Next week schedule → discovery log location → handoff (product-analyst) tanımlandı?

Kontrol listesi tam değilse discovery ritual başlatılamaz — prep bir haftalık baştan yapılır.
