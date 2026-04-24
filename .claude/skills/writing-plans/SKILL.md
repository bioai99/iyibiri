---
name: writing-plans
description: Plan ve brief yazma kılavuzu. Lean PRD (2–10 sayfa, outcome odaklı, lightweight), One-Pager PRD (küçük feature için), UX Design Brief (tasarım tarafına handoff), Shape Up Pitch (Basecamp — appetite + solution), RFC (mühendislik kararı önerisi), Tech Spec (detaylı mimari açıklama). Her şablonu ne zaman kullanırsın, hangi bölümleri atlamazsın, hangi tuzaklara düşmezsin — burada. Workstream scope, feature brief, PRD, UX brief, RFC, pitch, design handoff yazarken bu skill'i oku.
---

# Plan ve Brief Yazma Kılavuzu

Strateji uygulanabilir plan olmadan hayal kalır. Plan yazarken **hangi şablon, hangi iş için** sorusunun tek doğru cevabı yok — bağlam seçer. Bu kılavuz hangi durumda ne seçeceğini ve her şablonun içini neyle doldurduğunu söyler.

## 1. Hangi şablon, hangi iş?

| Durum | Şablon | Uzunluk hedefi |
|---|---|---|
| Küçük feature (1 ekran, 1 akış ucu) | **One-Pager PRD** | 1 sayfa |
| Orta-büyük feature / subsistem | **Lean PRD** | 2–6 sayfa |
| Karmaşık, çapraz ekip | **Full PRD** | 6–10 sayfa (ama nadir) |
| Tasarım tarafına devir | **UX Design Brief** | 1 sayfa |
| Mühendislik kararı önerisi | **RFC** | 2–4 sayfa |
| Detaylı mimari | **Tech Spec** | 4–10 sayfa |
| Zaman sınırlı büyük proje önerisi | **Shape Up Pitch** (Basecamp) | 2–4 sayfa |
| Bir satırlık özet gerekiyor | **One-Liner Brief** (Elevator) | 1 cümle |

**Varsayılan tercih:** **Lean PRD**. Bilginin %80'ini yakalar, her şeyi genel anlaşılır tutar, hızlı yazılır.

## 2. Temel kurallar (her şablonda geçerli)

- **Outcome yaz, solution değil.** "X kullanıcı Y'yi 30 saniyede yapabilsin" ≠ "ekranın sağına buton koy."
- **Problem veri ile başlar.** "Sayfa-audit %11 prototype gösteriyor" ≠ "ürünümüzün bağış akışı eksik." İlk daha kuvvetli.
- **Must / Should / Won't sınırla.** MoSCoW veya benzer — scope creep'in panzehiri.
- **Başarı kriteri tek cümle + ölçülebilir.**
- **Açık soruları madde madde listele.** Cevapsız bırakma — ya varsayım olarak işaretle ya sor.
- **Lean.** Taştıysa sil, ek (appendix) yap. Sayfa disiplin yaratır.

## 3. Şablon: One-Pager PRD

Küçük, scope'u net feature için. Maksimum 1 sayfa.

```markdown
# [Feature] — One-Pager PRD

**Tarih:** YYYY-MM-DD
**Sahip:** product-analyst
**Durum:** draft | ready | in-progress | shipped
**İlgili strateji:** `docs/strategy/[...].md`
**İlgili workstream:** `docs/product/01-workstreams/[...].md`

## Problem (1 paragraf, veriyle)
[Kullanıcı şu an neden zorlanıyor? Hangi sayı/bulgu gösteriyor?]

## Çözüm (outcome)
[Ne olacak? Kullanıcı ne yapabilecek?]

## Scope
- **Must:** [1–3]
- **Should (if time):** [0–2]
- **Won't (açıkça):** [1–2 — yoksa sayfa taşabilir]

## Başarı metriği
[Ölçülebilir tek bir şey + hedef.]

## Bağımlılıklar
- [Ne olmadan başlanamaz]

## Açık sorular
- [Q#] ...

## Teslim planı
UX brief: [tarih] · Eng brief: [tarih] · İlk demo: [tarih]
```

## 4. Şablon: Lean PRD (varsayılan)

2–6 sayfa. İyiBiri gibi 10 kişilik bir ekip için çoğu feature'a bu yeter.

```markdown
# [Feature/subsistem] — Lean PRD

**Tarih / Durum / Sahip** + strateji/workstream referansı.

## 1. Bağlam ve Problem (1–2 paragraf, veri ile)
- Şu an ne?
- Hangi kanıt sorunu gösteriyor? (audit, kullanıcı görüşü, analytics, rakip karşılaştırma)

## 2. Kullanıcı ve JTBD
"[segment], [bağlamda], [işi] halletmek istiyor."
Acı nokta listesi (madde madde).

## 3. Çözüm (outcome)
Tek paragrafta: ne olacak.
Uç-uca kısa bir senaryo (user journey) — ekran çizme, olay sırası yaz.

## 4. Scope
### Must
- [1–4]
### Should (v1+)
- [0–3]
### Won't (açıkça dışlıyoruz)
- [1–3 — tuzak alternatif, kötü yol]

## 5. Başarı ölçümü
- Primary metric + hedef + ölçüm zamanı
- Guardrail metrics (ne bozulmasın)

## 6. Kısıt ve bağımlılıklar
- Teknik: [varsa mevcut kodla uyum, migration, vb.]
- Operasyonel: [STK onayı, content hazırlık, vb.]
- Yasal: [KVKK, BDDK, vb. — uzman görüşü gerekliyse işaretle]
- Zaman: [genel aralık, kesin değil]

## 7. Risk ve açık sorular
- R1: [ne yanlış gidebilir → nasıl erken tespit edilir]
- Q1: [QNN'ye link — open.md]

## 8. Teslim planı
UX brief tarihi · Eng brief tarihi · İlk demo · V1 tarihi (soft)

## (Opsiyonel) Ek
Alternatifler düşünüldü — seçilmedi çünkü ...
```

## 5. Şablon: UX Design Brief

Tasarım yapacak agent'a / designera devir için. ~1 sayfa.

```markdown
# [Feature] — UX Design Brief

**Tarih / Durum / Sahip**
**İlgili workstream:** ...
**İlgili Eng brief (varsa):** ...

## 1. Özet (1 paragraf)
Ne yapacağız, kim için, neden önemli.

## 2. Kullanıcı hikayesi (1–3)
"[persona] olarak, [istediği] çünkü [sebebi]."

## 3. Senaryo
Kullanıcının uç-uca deneyimi, 3–7 adım. Ekran çizme — olay sırası.

## 4. UI ipuçları (yönlendirici, dikte değil)
- Tonalite: "sen" dili, design-system sıcaklığı.
- Ekran sayısı tahmini: [N]
- Ana UI elemanları: [mission card? modal? full-bleed? bottom sheet?]
- Neyi kesinlikle YAPMA: [örn. başka bir yere link, karışık CTA]

## 5. Design system referansları
- `design-system/README.md`, `app/globals.css`, `tailwind.config.ts`
- Benzer ekran: `app/dashboard/[...]` (varsa)
- Hareket: Framer Motion spring, `{stiffness:400, damping:30}` default.

## 6. Başarı kriteri (tasarım)
- Nitel: [örn. "görev seçmek 3 tap veya daha az"]
- Nicel (varsa): [örn. "tamamlama oranı >%60"]

## 7. Kısıtlar
- Mobile-first, `max-w-lg mx-auto` container.
- Safe area (Capacitor).
- Dark mode öncelikli; light opsiyonlu (Q5'e bağlı).
- Erişilebilirlik: WCAG AA kontrast.

## 8. Referans / moodboard (varsa)
Linkler, ekran görüntüleri, rakip örnekleri.

## 9. Teslim formatı
- [ ] Figma frame(s) / markdown wireframe / kod prototipi?
- [ ] Handoff notları: state listesi, mikrokopya, error/empty/loading tümü.

## 10. Açık sorular
- Q# : ...
```

## 6. Şablon: Shape Up Pitch (Basecamp)

Zaman bütçeli (appetite) bir iş önerisi. 2–4 sayfa.

```markdown
# [Proje başlığı] — Shape Up Pitch

**Appetite:** [2 hafta / 6 hafta — ne kadar yatırım yaparız?]

## Problem
Bir sayfa. Gözlenen davranış, veri, "neden şimdi."

## Çözüm (kaba eskiz)
Fat markered sketch. Rough, low-fidelity. Kime hitap ediyor, ne sağlıyor.

## Rabbit holes (tehlikeli yollar)
Scope içinde ama dikkat gerektiren noktalar. "Şunu burada değil, sonra çözeriz."

## No-gos
Scope'a alınmayacaklar. Açıkça.

## Kalan soru
Kullanıcının cevaplaması gereken.
```

Shape Up felsefesi: "Yapılacak iş miktarını sabitle, scope'u adjust et" — deadline'ı değil scope'u oynar.

## 7. Şablon: RFC (Request for Comments)

Mühendislik kararı önermek için. 2–4 sayfa.

```markdown
# RFC: [Karar başlığı]

**Tarih** · **Önerici:** [agent / kullanıcı]
**Durum:** Draft | Review | Accepted | Rejected

## 1. Bağlam
Şu anki durum, neden karar gerekiyor.

## 2. Önerilen yaklaşım
Detaylı ama kesin cevap vermeden — bir yaklaşım öneriyoruz.

## 3. Alternatifler (en az 2)
- A) [yaklaşım 1] — artı/eksi
- B) [yaklaşım 2] — artı/eksi

## 4. Öneri gerekçesi
Neden A (veya B, veya hibrit)?

## 5. Etki analizi
- Kod: hangi dosyalar, hangi migration
- Ürün: kullanıcıya ne fark eder
- Operasyon / destek

## 6. Migration planı
Eski → yeni. Basamak basamak.

## 7. Açık sorular
...
```

## 8. Şablon: Tech Spec

Mimari dahil, detaylı. RFC kabul edildikten sonra yazılır. 4–10 sayfa — bu çıkış maksimum.

```markdown
# Tech Spec: [Başlık]

## 1. Hedef ve başarı kriteri
## 2. API tanımları (endpoint, request/response)
## 3. Veri modeli (tablo, ilişki, migration)
## 4. UI bileşenleri (bağlantı noktaları)
## 5. Error / edge case matrisi
## 6. Performans / scale düşünceleri
## 7. Güvenlik / yetki / RLS
## 8. Test stratejisi
## 9. Telemetry / logging
## 10. Rollout ve rollback planı
```

## 9. Sık tuzaklar

- **Framework for framework's sake** — her feature'a Tech Spec yazmak. Çoğu zaman Lean PRD yeter.
- **Solution dikte etme** — "şunu şöyle yap" yazmak tasarımı/mimariyi yapanın alanına girer. Outcome kal.
- **Veri yok → varsayım fabrikası** — rakamsız "belki kullanıcı bunu ister" cümleleri briefi zayıflatır.
- **Must listesinde 10 madde** — scope creep sinyali. 3 must ortalaması idealdir.
- **"Won't" bölümü boş** — yazmadıysan scope kapalı değildir. En az 1 madde zorla.
- **Başarı kriteri subjektif** — "iyi olur" değil, "4 hafta sonra hedef %X metrik."

## 10. Yazım disiplini

- Her cümle: özne + fiil + ölçülebilir nesne. Pasif çatıdan kaçın.
- Tekrar okuyunca silinebilecek her kelime gider.
- Başlıklar senaryo gibi okunsun: "Problem → Çözüm → Scope → Metrik" bir hikâye anlatır.
- Liste 5'i geçerse alt başlığa böl.
- Grafik/tablo katar sadece kelime yetmiyorsa. Her tablo bir iddianın kanıtı olsun.

## 11. Kontrol listesi — brief'i bırakmadan önce

- [ ] Problem veri ile desteklendi mi?
- [ ] Must/Should/Won't net mi?
- [ ] Başarı kriteri tek cümle + ölçülebilir?
- [ ] En az bir strateji memosuna referans var mı?
- [ ] Açık sorular `04-questions/open.md`'ye düştü mü?
- [ ] Tarih + durum + sahip başta mı?
- [ ] Sayfa disiplini? (one-pager 1, lean PRD ≤6 vs.)
- [ ] Outcome, solution değil mi?

Checklist tam değilse brief hazır değil.

## 12. OKR Linkage — Quarterly Objective'lerle bağlama

Hedef: Her PRD/brief en az bir quarter OKR'a atanmış olsun.

### Nedir: OKR (Objective & Key Result)

John Doerr "Measure What Matters" — Objective + Key Result.

- **Objective:** Nitel, motivasyonal. "STK gönüllülüğü artıracağız" (neden?).
- **Key Result:** Ölçülebilir, ambitious. "Gönüllü engagement +40%" (nasıl ölçeriz, hedef ne?).

**Yapı:**

```markdown
## Q2 2026 OKR — STK Partnership Growth

**Objective:** 
Türkiye'deki STK'ları doğrudan member katılımı 
ve bağış kullanıcı olarak embed et.

**Key Results:**
1. STK member count +50% (500 → 750)
   - Metric: `member_new_via_stk` * STK ratio
   - Target: 250 yeni member, min 3 STK

2. STK event creation +30% (rate)
   - Metric: `event_created_per_stk_per_week` average
   - Target: 0.5 → 0.65 events/STK/week

3. Donation via STK platform +25% (revenue mix)
   - Metric: `donation_attributed_stk` / `donation_total`
   - Target: 15% → 20%

4. STK admin satisfaction 8/10 (NPS proxy)
   - Metric: Quarterly surveyinde avg score
   - Target: Baseline 6 → 8
```

### PRD ↔ OKR bağlama

Her PRD dosyasında başta:

```markdown
# [Feature] — Lean PRD

**Tarih:** YYYY-MM-DD
**İlgili OKR:** Q2/Objective-1, Key-Result-2
**OKR impact:** "STK member adoption +30%"
```

Gerçek örnek:

```markdown
# STK Member Export (CSV) — One-Pager PRD

**OKR:** Q2/Objective-1 (STK Partnership), KR-1 (Member count +50%)
**Impact:** Reduce friction for bulk member sync → +15% adoption rate

**Problem:**
STK üyelik listeleri Excel/CSV tutulur. İyiBiri'ye manuel giriş → 
"3 saatlik iş, hata riski." 75% STK bu eksikten şikâyet.

**Çözüm (outcome):**
STK admin bir-tıkla `.csv` export yapsın, kendi CRM'ine import etsin.
Üyelik senkronizasyonu (sync interval) otomatik olabilir. 
Adoption friction down, engagement up.

...
```

### Quarterly review — OKR-based

Her quarter sonunda (6 hafta once):

1. Tüm PRD'leri OKR'a group et.
2. "X OKR'a gittik, Y PRD'ler tamamlandı, impact ölçüm [sayı]?"
3. "Plan'da KR-2 %80 yapıldı (target 100%), neden? Next quarter neler?"
4. Product backlog'u re-prioritize et: "Şu KR'ye daha çok PRD gerek."

---

## 13. Kontrol listesi — brief finalize öncesi (genişletilmiş)

- [ ] Problem veri ile desteklendi mi?
- [ ] Must/Should/Won't net mi?
- [ ] Başarı kriteri tek cümle + ölçülebilir?
- [ ] En az bir strateji memosuna referans var mı?
- [ ] **OKR atanmış mı?** (varsa)
- [ ] Açık sorular `04-questions/open.md`'ye düştü mü?
- [ ] Tarih + durum + sahip başta mı?
- [ ] Sayfa disiplini? (one-pager 1, lean PRD ≤6 vs.)
- [ ] Outcome, solution değil mi?

Checklist tam değilse brief hazır değil.
