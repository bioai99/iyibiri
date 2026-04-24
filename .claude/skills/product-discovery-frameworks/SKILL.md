---
name: product-discovery-frameworks
description: Ürün discovery döngüsü — müşteri ihtiyacından solution'a kadar olan yol. Opportunity Solution Tree (Teresa Torres), Shape Up appetite-driven scoping (Ryan Singer), JTBD interview template (Bob Moesta), Marty Cagan 4 product risk, Shreyas Doshi LNO prioritization. Discovery protokolü, OST güncelleme ritüali, JTBD interview script, risk assessment checklist, appetite scope calculator. İyiBiri V1 pilot: 3 STK + NSM Make discovery — bu framework'ler haftalık learning loop'unda uygulanır.
---

# Product Discovery Frameworks

**Kaynaklar:**
- [Teresa Torres — Continuous Discovery Habits](https://www.producttalk.org/)
- [Ryan Singer — Shape Up](https://basecamp.com/shapeup)
- [Bob Moesta + Clayton Christensen — JTBD Interview](https://jtbd.info/)
- [Marty Cagan — INSPIRED (4 Product Risks)](https://www.producttalk.org/)
- [Shreyas Doshi — LNO Framework](https://coda.io/@shreyas/lno-framework)

> **Temel varsayım:** Spec'ten başlayan product lifecycle risk'lidir. Customer need → opportunity → solution → appetitesize'lı scope = faster learning, lower waste.

---

## 1. Discovery Felsefesi — Neden bu framework?

**Waterfall risk:** "6 ay spec'le, 3 ay build, sonra kullanıcıya sormak" = late discovery.

**Discovery-driven:** Weekly customer touch + parallel hypothesis + appetite-bounded scoping = iterative learning.

**İyiBiri context:** Gönüllüler / STK'lar / sponsor'lar (B2B/B2G2C) değişken feedback döngüsü. Her hafta 2–3 interview, OST append, 1 experiment parallel. Scope drift'ten kaçış: appetite (2 hafta vs. 6 hafta budget) sabitlenerek.

---

## 2. Opportunity Solution Tree (OST) — karar haritası

**Nedir:** Bir problem statement'tan şubenin ayrılıp opportunities, solutions, experiments'a giden visual tree.

**Yapısı:**

```
                   Outcome [ör. "STK üye takibi artsın"]
                   /
        ┌─────────┴───────────┐
        │                     │
    Problem            Assumption
    (müşteri
     acı nokta)
        │
    ┌───┴────────┬──────────┬──────────┐
    │            │          │          │
  Opp 1        Opp 2      Opp 3     Opp N
  ├─ Sol 1.1   ├─ Sol 2.1  ├─ Sol 3.1
  ├─ Sol 1.2   └─ Sol 2.2  └─ Sol 3.2
  └─ Sol 1.3      │
     ├─ Exp       └─ Exp 2.1
     └─ Exp
```

**Seviyeler:**

- **Outcome:** "Üye retention %30 artacak" — ölçülebilir, zaman sınırlı.
- **Problem:** "STK'lar masaüstü spreadsheet ile üye takip ediyor, bulunması zor, güncellemesi manuel."
- **Opportunity:** "STK'nın kendi dashboard'ı var (Opp 1), İyiBiri'nin STK bölümü kullanılır (Opp 2), API ile 3rd-party yazılım entegre edilir (Opp 3)."
- **Solution:** Her opportunity'e 2–3 alternatif UX/teknik yaklaşım.
- **Experiment:** Pilotlanmış solution'ın test yöntemi. "Opp 1.1 için 2 haftada lo-fi prototype, 5 STK'ya test, believer/skeptic/lover sayımız kaç."

**Güncelleme ritüali (haftalık):**

1. Customer interview'dan çıkan "yeni acı nokta" varsa, OST'ye yeni branch ekle.
2. Tercih edilen solution'ı mark et — "next sprint candidate."
3. Failed experiment = solution'u prune et, alternatifle devam.
4. Her OST file: `docs/discovery/ostree-[feature-slug]-v[N].md` veya Figma board.

---

## 3. JTBD (Jobs-to-be-Done) Interview Template

**Nedir:** Müşterinin "bu işi neden yapıyor, hangi bağlamda, ne başarılı demektir" sorularını anlamak.

**8-soru pattern (Bob Moesta):**

```markdown
# JTBD Interview: [Persona — ör. STK müdürü]

**İçeriği:**

### 1. Geçmiş — Eski yol
"Şimdiki bulunmadan (İyiBiri) önce, 
üyelerinizi nasıl takip ediyordunuz? 
Birisi insan mı, yazılım mı, hepsi mi?"

### 2. Trigger — Neden şimdi?
"Eski yöntemle ne sorun yaşadınız? 
Şu sorundan çıkıp yeni arama yapmanız 
neyi tetikledi?"

### 3. Search — Alternatif arama
"Eski yöntemden vazgeçip başka çözüm 
aradığınız dönemde, ne denedikleriniz?
(Rakip yazılım, başka araç, el yöntemi)"

### 4. Decision criteria
"Yapılan alternatifler içinde 
'bu bize uyar' dediğiniz özellikleri neler?
(Fiyat, kolay kullanım, iş akışı uyumu, vb.)"

### 5. Comparison
"Alternatifler içinde seçerkeniz 
hangisini tercih ettiniz ve neden?"

### 6. Current workflow
"Şu an İyiBiri'ndeki member takip 
akışınız nasıl gidiyor? 
Günlük rutinin başından sonuna."

### 7. Workaround / hack
"İyiBiri'nde şu an eksik / zor 
olan noktalar neler? 
O noktada neler yapıyorsunuz? 
(Manual export, dış araç, el döküm)"

### 8. Desired outcome
"Ideal durumda (sınırı yok, teknik 
imkansızlık görmezden) member takip 
sistemi neyle çalışabilir olurdu? 
Neden?"

---

### Çıktı dokumentasyonu

**Bulgu özeti:**
- Harika bulgu: [...]
- Şaşırtan insight: [...]
- Çakışan pattern (N diğer kişi ile): [...]

**OST'ye geri bildirim:**
- Yeni opportunity / solution candidate
- Tercih edilen solution'un risk'i (adoption friction)
- Test edilmesi gereken assumption

**ADR / decision çıktıysa:**
- Q[N] open.md'ye → koordinatöre
```

**Format disiplini:**
- Her interview min. 45 dakika.
- Kaydet: ses / not / transcript.
- İlk 15 dakika: bağlam, past behavior.
- Son 15 dakika: desired future.
- Orta 15 dakika: hepsi bağlantılı neden/nasıl sorular.

---

## 4. Shape Up Appetite-Driven Scoping

**Nedir:** Ryan Singer (Basecamp) — scope'u appetite (time budget) ile bind et, variable scope yerine.

**Framework:**

```markdown
# Shape Up Pitch: [Feature]

## Problem (bağlam)
Şimdiki durum nedir, neden sordu?
Veri / bulgu ile başla.

## Appetite
- **Small batch:** 2 hafta (1 kişi full-time)
- **Big batch:** 6 hafta (2 kişi full-time)
- **Cool-down:** 2 hafta (fix + polish, hiç yeni iş yok)

Bunu seçersen, scope bu appetite'a uyar.

## Rough outline (fat marker sketch)
Detayda kaybolma. Roughness kabul.
- [Screen 1]: ne görsün, ne yapabilir
- [Flow]: uç-uca kaç adım
- [Data]: yeni field var mı
- [Edge case]: ne unuttuk (bilinçli)

## Rabbit holes (uyarı noktaları)
"Bu scope'ta ama tuzağa düşme" listesi.
- Localization (sonra)
- Analytics (sonra)
- Admin panel (sonra)

## No-goes (kapsam dışı)
Yapmayacak şeyler açıkça.
Çünkü appetite'a sığmaz / risk'li / değer düşük.

## Kalan soru
Kullanıcıdan cevap bekleyen 1–2 soru.
```

**Disiplin:**
- Appetite = **fixed**, scope = **variable**.
- Appetite'dan daha uzun iş varsa, scope kırpılır veya next cycle.
- Cool-down = product stability + borç ödemesi.
- 6 hafta biterse ve hâlâ çok varsa: pivot veya V2.

---

## 5. Marty Cagan — 4 Product Risk

**Risk nedir:** Scope yazdınız, spec hazır. Ama 4 risk'ten biri isabet ederse feature fail'dir.

**4 Risk:**

### A. Value Risk
"Kullanıcı bunu gerçekten isteyecek mi?"
- Test: JTBD interview + competitive comparison.
- Mitigasyon: A/B test (lansman öncesi); lo-fi prototype user test.

### B. Usability Risk
"Kullanıcı bunu kullanabilir mi?"
- Test: Usability test (5 user, 30 min unmoderated).
- Mitigasyon: Design iteration (3 round); accessibility check.

### C. Feasibility Risk
"Teknik olarak yapılabilir mi, timeline var mı?"
- Test: Spike (2–3 gün proof of concept).
- Mitigasyon: Tech spike; familiar tech choice; capacity check.

### D. Viability Risk
"İş modeline uyar mı, resource'lar var mı?"
- Test: Cost-benefit analysis; resource conflict check.
- Mitigasyon: Clear owner; business case; kill criteria defined.

**Checklist — her feature spec'ten önce:**

```
[ ] Value risk: Customer interview / competitive / prior traction?
[ ] Usability risk: Design review / a11y check / similar feature okumak?
[ ] Feasibility risk: Tech feasible? Spike yapıldı mı?
[ ] Viability risk: Budget clear? Resource blocker var mı?
[ ] En yüksek risk mitigasyon planı var mı?
```

---

## 6. LNO Framework — Discovery backlog prioritization

**Shreyas Doshi:** Opportunities'i Leverage / Neutral / Overhead'e sınıflandır.

**Tanımlar:**

- **Leverage:** Düşük effort (~2 hafta), yüksek impact (~40% değer). "Quick wins." Topla, ilk yap.
  - Örn.: "STK'lar member export istiyordu, CSV button = 2 gün, retention +20%."
  
- **Neutral:** Orta effort (~6 hafta), orta impact (~20–30%). "Standard work." Kuyruğa sıra ile koy.
  - Örn.: "Gönüllü matching engine = 5 hafta, 3 STK açısından engagement +15%."
  
- **Overhead:** Yüksek effort (~10+ hafta), düşük impact (<10%) veya zorunlu. "Debt, compliance." Minimize et, cool-down'a koy.
  - Örn.: "KVKK 2.0 audit + redaction = 3 hafta, mandatory; no feature impact."

**Akış:**

```
Opportunity = [description]
↓
[Estimated effort: 2w / 6w / 12w+]
↓
[Impact hypothesis: X yeni user / Y retention +% / Z revenue]
↓
Leverage / Neutral / Overhead
↓
Schedule:
Leverage → Sprint N (next)
Neutral → Backlog / Sprint N+2
Overhead → Cool-down veya quarterly planned
```

**İyiBiri V1 örnek:**

| Opportunity | Effort | Impact | Type | Priority |
|---|---|---|---|---|
| STK member export (CSV) | 2w | Retention +20% | **Leverage** | P0 sprint 2 |
| Gönüllü matching (algoritma) | 6w | Engagement +15% | Neutral | P1 sprint 4 |
| KVKK redaction + audit | 3w | Mandatory, 0% impact | Overhead | Cool-down w6 |
| Donation history chart | 6w | Donor retention +10% | Neutral | P1 sprint 5 |

---

## 7. Weekly Discovery Ritual — team standup

**Format (45 min):**

1. **Customer interviews (15 min):** Geçen hafta kimi gördük, ne öğrendik. 1 insight + 1 surprise per interview.
2. **OST update (10 min):** Yeni opportunity / solution keşfi? Çürütülen assumption? Tree pruning.
3. **Experiment status (10 min):** Paralel test sonuçları. Believer / skeptic / lover dağılımı.
4. **Next sprint hypothesis (10 min):** "Şu hafta X'i test edeceğiz çünkü Y asumption var."

**Katılımcılar:**
- Product-analyst (lead)
- UX-researcher
- 1 engineering lead (context)
- STK sponsor (optional)

**Çıktı:** OST increment + 1 experiment lined up.

---

## 8. Continuous Discovery — İyiBiri V1 pilot

**Scope:** 3 STK (3 gönüllülük modeli) + 1 NSM Make (sponsor).

**Workflow:**

```
Week 1–2: Problem mapping
├─ 4 JTBD interview (1 STK 2 contact, 1 NSM sponsor)
├─ OST root = "STK member attrition / engagement friction"
└─ Outcome = "V1 churn +50% reduction within 6 months"

Week 3–4: Opportunity generation
├─ 4 interview (repeat personas)
├─ OST 5–6 opportunity branch
└─ Top 3 solution'ın rough sketch

Week 5–6: Solution + appetite
├─ Appetite scope (2w vs. 6w?)
├─ Shape Up pitch hazırla
└─ Top solution → sprint planı

Sprint 1–2: Build + learning
├─ Parallel: experiment (lo-fi test) + dev (high-fidelity)
└─ Weekly OST update
```

---

## 9. Anti-patterns — discovery tuzakları

❌ **"One big research blitz, then build 6 months."** — Feedback loop'u öldürür. Haftalık tutup.

❌ **"OST'yi bir kez çiz, kaybolmuş sayılır."** — Canlı dokümandır, güncelle.

❌ **"JTBD soruların cevabını ben bilirim."** — Varsayımsal. Interview yap.

❌ **"Appetite yok, scope sınırı yok."** — "Tüm özellikleri 2 haftada yap?" = failure. Appetite sabitle.

❌ **"4 risk'ten 2'si eksik, alalım yine de."** — En az 3'ü mitigate et, risk document et.

---

## 10. Kontrol listesi — discovery hazırlık

- [ ] OST problem statement veri ile desteklenmiş mi?
- [ ] En az 4 JTBD interview yapıldı mı (geçen 4 hafta)?
- [ ] Opportunity seçimi Leverage/Neutral/Overhead'e göre mi?
- [ ] Shape Up pitch appetite'ı sabitledi mi (2w / 6w)?
- [ ] 4 risk'ten en az 3'ü mitigate planı var mı?
- [ ] Parallel experiment lined up mi (next sprint)?
- [ ] Açık karar (Q#) open.md'ye yazılmış mı?

Checklist tam değilse iş "ready" değil, "discovery devam"eder.
