---
name: agent-communication-protocol
description: Agent-to-agent iletişim protokolü. Handoff log (deliverable'lar arası zincir görünürlüğü), status board (kanban snapshot — kim neyi ne zaman bekliyor), unified journal front-matter (cross-agent okunabilirlik), 05-reviews peer review lifecycle (self-audit yetmediğinde), decisions queue canonical source (drift önleme), ADR accept workflow (5-dosya tutarlılığı). Bir agent deliverable yazdığında, başka agent'ın çıktısını alıp üzerine iş yaptığında, bir karar kuyruğa girdiğinde veya kapandığında, bir iş bitti "artık kim neyi bekliyor" sorusuna cevap aradığında — bu skill'i oku. Tek source of truth: tüm agent playbook'ları buraya referans verir.
---

# Agent Communication Protocol — İyiBiri

> "analyst UX'e task verdi mi, UI analyst'in direktifine cevap verdi mi, karar döngüsü kapanıyor mu" — bu soruların cevabını 30 saniyede veren iletişim altyapısı.

## 0. Problem ve çözüm

**Daha önce:**
- Her agent kendi journal'ına yazıyordu. Üretim var, zincir görünmüyordu.
- `02-briefs/ux/dashboard-ana-v2.md` yazıldı → ux audit + ui spec + fe code gerçekleşti ama **kaynak brief'te iz yoktu.** 2 hafta sonra brief'i açınca "bu iş ne oldu" sorusu 4 dosya taraması gerektiriyordu.
- Açık karar sayısı log'da vardı ama **kim bekliyor** belli değildi.
- Review folder'ları (`05-reviews/`) boştu — peer review hiç işlememişti.
- Decisions queue iki farklı yerde (`_decisions-queue.md` + `04-questions/open.md`) — drift riski.

**Şimdi:**
5 katmanlı protokol. Her agent her run sonunda 5 dakika fazladan iş yapar, karşılığında zincir anlık görünür olur.

## 1. Katman A — Handoff log (deliverable başına)

### Kural
Her brief / audit / spec / UI spec / eng brief dosyası, dosyanın sonunda bir **Handoff log** bölümü barındırır. Downstream agent bu dosyayı kaynak alıp çıktı ürettiğinde, **kaynak dosyaya 1 satır append eder** (yani çıktıyı yazdığı kendi klasörünün dışında da iz bırakır).

### Format

Dosyanın en altına, metadata'dan önce şu blok eklenir:

```markdown
## Handoff log

Bu brief'i alıp üreten agent'ların zinciri. Her downstream agent kendi çıktısını üretince aşağıya 1 satır ekler — en yeni **en altta** (kronolojik).

- YYYY-MM-DD HH:MM — **[agent-adı]** ✅ | ⚠️ | ❌ — **[çıktı tipi]**: `[dosya yolu]`. [opsiyonel 1 cümle not].
```

### Örnek (dashboard v2 brief'i için):

```markdown
## Handoff log

- 2026-04-24 06:30 — **ux-researcher** ✅ audit: `docs/ux/03-heuristics/2026-04-24-dashboard-ana-v2-heuristik-audit.md`. Kritik 3 bulgu (H6 günün görevi, I6 hero glow, H8 focal point).
- 2026-04-24 06:45 — **ui-designer** ✅ spec: `docs/ui/01-specs/2026-04-24-dashboard-ana-v2-ui-spec.md`. Audit K1-K5 → spec Bölüm 2-10.
- 2026-04-24 11:45 — **frontend-engineer** ✅ code: `components/dashboard/hero-card-v2.tsx` + wire. TSC 0 hata, 83/83 test.
- 2026-04-24 15:30 — **frontend-engineer** ⚠️ regression: HeroCardV2 tier sistemi + BrandLogo kayboldu. Fix yapıldı, commit d785ba0.
```

### Durum işaretleri

- ✅ **Tamamlandı** — downstream bu kaynağa uygun çıktı üretti, zincir ilerledi.
- ⚠️ **Kısmi / revize** — çıktı üretildi ama geri dönüş / revize gerekti (açıklama zorunlu).
- ❌ **Reddedildi / iptal** — downstream kabul etmedi (gerekçe zorunlu, kaynak brief revize edilmeli).

### Kim nereye handoff log yazar?

| Downstream agent | Kaynak dosyaya ekler |
|---|---|
| ux-researcher | `docs/product/02-briefs/ux/*.md` (product-analyst'in UX brief'i) |
| ui-designer | `docs/ux/03-heuristics/*.md` + `docs/ux/02-journeys/*.md` (ux audit/journey) |
| frontend-engineer | `docs/ui/01-specs/*.md` + `docs/product/02-briefs/eng/*.md` |
| supabase-backend | `docs/product/02-briefs/eng/*.md` + ADR dosyaları (şema etkisi) |
| auth-capacitor | `docs/product/02-briefs/eng/*.md` |
| design-system-keeper | `docs/ui/01-specs/*.md` (spec token ihlali tespit ettiyse) |

Bir deliverable birden çok kaynaktan beslenirse (örn. fe hem UI spec hem Eng brief okuyorsa), her ikisine ayrı handoff satırı eklenir.

### Retroactive doldurma

Önceden yazılmış brief/audit'ler için: bugüne kadar biriken çıktıları listele, "(retroactive)" işareti koy. Örnek:
```
- 2026-04-24 09:15 — **ux-researcher** ✅ audit: `docs/ux/...` (retroactive)
```

## 2. Katman B — Status board (kök snapshot)

### Kural
`docs/_status-board.md` — **tek dosya, kanban snapshot**. Her agent run sonunda ilgili satırı uygun kolona taşır. Dashboard historical timeline olarak kalır; status board "şu an kim neyi bekliyor" sorusunun anlık cevabıdır.

### Format

```markdown
# İyiBiri — Status Board

> Anlık durum. Her agent run sonunda kendi satır(lar)ını günceller. Geçmiş için: `docs/agents-dashboard.md`.

**Son güncelleme:** YYYY-MM-DD HH:MM — [güncelleyen agent]

---

## ⏳ Waiting for user

İnsan tarafında bekleyen iş. Agent ilerleyemez.

- **[başlık]** — owner: [kullanıcı tarafı], blocking: [ne iş], link: `[dosya]`, sinyal: YYYY-MM-DD

## 🔄 In progress

Şu an aktif olarak çalışılan iş. Her agent kendi turunda açtığı işleri buraya ekler, bitirince Done'a taşır.

- **[başlık]** — owner: [agent], started: YYYY-MM-DD HH:MM, link: `[dosya]`, ETA: [opsiyonel]

## 📥 Backlog

Bir sonraki turda yapılacak, öncelik sırası belli iş. Her satır bir link veya brief'e işaret eder.

- **[başlık]** — owner: [agent], priority: P0 | P1 | P2, link: `[dosya]`

## ✅ Done today

Bugün tamamlanan iş. Gün sonunda "Done this week"e taşınır.

- YYYY-MM-DD HH:MM — **[agent]** — [başlık] — link: `[dosya]`

## 📦 Done this week

Bu hafta tamamlanan iş. Pazartesi taşınır / özetlenir.

- YYYY-MM-DD — **[agent]** — [başlık]
```

### Güncelleme ne zaman?

Her agent deliverable bitiminde:
1. "In progress"ten ilgili satırı "Done today"e taşı.
2. Yeni açılan işler varsa "Backlog"a ekle.
3. Kullanıcı aksiyonu beklenen bir şey ortaya çıktıysa "Waiting for user"a ekle.
4. Dosyanın en üstündeki **Son güncelleme** satırını yenile.

**30 saniyelik iş.** Atlanmaz.

### Waiting for user kuralı
Agent *asla* "user bekliyor"u silmez — sadece kullanıcı aksiyonu aldıktan sonra kaldırılır. Kullanıcının migration apply'ı, deploy, onay, hukuki paketi gibi işleri burada birikir.

## 3. Katman C — Unified journal front-matter

### Kural
Her journal'ın (`_journal.md`) her girişi, **craft-specific alanlarından önce 4 zorunlu alan** taşır. Bu alanlar cross-agent okunabilirliği sağlar.

### Zorunlu 4 alan

```markdown
## YYYY-MM-DD HH:MM — [iş başlığı]

- **Upstream:** [hangi dosya/brief'ten beslendim] — `[dosya yolu]` | "—" (sıfırdan iş)
- **Downstream:** [kim ne bekliyor] — [agent] via `[dosya]` | "—" (zincir kapalı)
- **Handoff:** ✅ updated-source | ⚠️ pending | ❌ blocked — [kaynak dosyaya handoff log eklendiyse ✅]
- **Status-board:** ✅ updated | ❌ skipped (gerekçe) — [status board güncellendi mi]

[buraya craft-specific alanlar devam eder: product için `Kararlar açıldı/kapandı`, ux için `Kanıt sınıfı + Self-assessment`, ui için `Token ihlali + Motion spec`, eng için `Test + Next`]
---
```

### Neden 4 alan?

- **Upstream** — "bu iş nereden geldi" → scope doğrulama. Sıfırdan iş işaretlenirse (—), brief'siz başlanmış demek → red flag.
- **Downstream** — "zincir ilerliyor mu" → tıkanma tespiti. Boşsa: bu bir uç (son implementation) veya iş kapalı (ADR accepted).
- **Handoff** — "kaynak dosyaya geri bildirim yazdım mı" → Katman A disipline eder.
- **Status-board** — "anlık görünürlük güncel mi" → Katman B disipline eder.

### Self-enforcement

Handoff veya Status-board ❌ ise, agent deliverable'ı **kapatamaz.** Eksikliği giderir, tekrar yazar.

## 4. Katman D — 05-reviews peer review lifecycle

### Mevcut durum (problem)
- `docs/product/05-reviews/` — sadece `index.md` var.
- `docs/ux/05-briefs/` — boş (UX briefs burada toplanmalıydı ama hiç dolmadı).
- `docs/ui/05-reviews/` — sadece `index.md` var.
- product-analyst'in "self-audit"i kendi içinde kalıyor, başka agent görmüyor.

### Çözüm — zorunlu peer review tetikleyicileri

Peer review **şu 3 durumda tetiklenir** (self-audit yerine değil, ek olarak):

1. **Scope değişimi** — ADR Accepted sonrası bir workstream'in kapsamı ≥20% değişti.
2. **Handoff reddedildi** — downstream agent ❌ işaretledi (örn. ui-designer "bu audit yetersiz" dedi). Kaynak agent revize eder, ikinci tur peer review'e girer.
3. **Kritik deliverable** — P0 master plan item + ADR Accepted + production etkisi olan kararlar.

Opsiyonel tetikleyiciler:
- Agent kendi self-audit'inde "partial" işaretledi ama zamanı kısıtlı — peer review'e atar.
- Kullanıcı talep etti.

### Review dosyası template

Dosya: `docs/{product|ux|ui}/05-reviews/YYYY-MM-DD-[hedef-slug]-review.md`

```markdown
# Review — [hedef deliverable başlığı]

**Tarih:** YYYY-MM-DD
**Reviewer:** [agent-adı]
**Hedef dosya:** `[tam yol]`
**Tetikleyici:** scope-change | handoff-rejected | critical | optional
**Karar:** ✅ Pass | ⚠️ Pass with notes | ❌ Fail

## 1. Kapsam kontrolü (MECE + brief'e uygun)
- [ ] MECE kapsam
- [ ] Upstream brief'e sadık
- [ ] Out-of-scope maddeleri açık yazılmış

## 2. İçerik kontrolü (craft-specific)
[reviewer'ın craft'ına göre — ui-designer için token ihlali, ux-researcher için kanıt sınıfı, product-analyst için outcome-odaklılık vs solution-odaklılık]

## 3. Bulgular
| # | Severity | Bulgu | Öneri |
|---|---|---|---|
| 1 | 🔴 | ... | ... |
| 2 | 🟡 | ... | ... |

## 4. Karar
✅ Pass — handoff ilerleyebilir.
⚠️ Pass with notes — ilerleyebilir ama not'ları gidermek downstream'in sorumluluğunda.
❌ Fail — kaynak agent revize eder, ikinci tur review.

## 5. Handoff geri bildirim
Reviewer, **hedef dosyanın Handoff log'una** şu satırı ekler (Katman A):
- YYYY-MM-DD HH:MM — **[reviewer-agent]** ✅|⚠️|❌ — review: `docs/{...}/05-reviews/YYYY-MM-DD-*.md`
```

### Kim kimi review eder?

| Hedef deliverable | Default reviewer |
|---|---|
| product-analyst UX brief | ux-researcher (okuyucu olduğundan ideal reviewer) |
| product-analyst Eng brief | en yakın fe/be agent |
| ux-researcher audit | ui-designer (spec yazarken kaynak okuduğundan) |
| ui-designer spec | design-system-keeper (token ihlali için) + frontend-engineer (implementability için) |
| ADR Proposed | product-analyst + strategy-consultant (iki perspektif) |

Review yapan agent kendini çağırmaz — kullanıcı çağırır veya zincir içinde akışla geçilir.

## 5. Katman E — Decisions queue canonical source

### Kural
**Tek canonical:** `docs/product/04-questions/open.md` (+ `resolved.md`).

`docs/_decisions-queue.md` (root) artık sadece **pointer**: "Tüm açık sorular için `docs/product/04-questions/open.md` dosyasına bakın."

### ADR Accept workflow — 5-dosya checklist

Bir ADR `Proposed` → `Accepted` transition'ı **atomic 5 adım** gerektirir. Eksik bırakılırsa drift oluşur.

Agent ADR Accept sırasında şu sırayı yapar:

1. **ADR dosyası** — `docs/product/03-decisions/NNN-slug.md` status header'ı `Proposed` → `Accepted` + tarih + onay notu.
2. **open.md** — soruyu bul, satırı sil (veya strikethrough + çizik).
3. **resolved.md** — yeni satır ekle: `✅ QN — [başlık] — ADR-NNN — [cevap özeti 1 satır]`.
4. **İlgili workstream** — `docs/product/01-workstreams/*.md` — ADR referansı ekle ("Karar: ADR-NNN Accepted 2026-04-24, X sonucu").
5. **Status board** — "In progress"te karar bekleyen iş varsa uygun kolona taşı, "Waiting for user"dan kaldır.

**Plus Katman A:** Ana ADR dosyasının Handoff log bölümüne kim onayladı + hangi implementation tetiklediği eklenir.

## 6. Katman F — Playbook entegrasyonu

Her agent playbook'unda **3 nokta** değişir:

### Adım 0 (rituel) genişleme
Mevcut "atlas oku + playbook oku + open.md oku" ritüeline ekle:
- 4. **`docs/_status-board.md` oku.** Kendi kolonunda satır varsa okur, yoksa başka agent'ların ne bekleyebileceğine bakar.

### Çıktı kuralları genişleme
Mevcut "lean / outcome-odaklı / tarih+durum+sahip" kurallarına ekle:
- **Handoff log ekle.** Kaynak dosyayı biliyorsan (upstream), çıktını bitirdikten sonra kaynağın en altına handoff satırı ekle (Katman A).

### Journal/dashboard update genişleme
Mevcut "journal + dashboard" zorunluluğuna ekle:
- **Unified 4 alan** (Katman C) journal entry'nin üstünde.
- **Status board güncelle** (Katman B) — en az "Done today"e taşı, bekleyen iş varsa "Waiting for user"a ekle.

### Yasak bölgeler — yeni
- Hiçbir agent başka agent'ın kendi klasörüne yazmaz (mevcut kural). **Ama** handoff log ekleme istisnasıyla: downstream agent, upstream'in klasöründeki kaynak dosyanın **sadece "Handoff log" bölümüne** append yapabilir. Başka bölüme dokunulmaz.

## 6.5. Katman G — Orchestration layer (coordinator)

### Kural

Parent Claude session (kullanıcının anlık olarak konuştuğu Claude) her prompt'u değerlendirir ve **auto-trigger sinyalleri** varsa [`coordinator`](../../agents/coordinator.md) agent'ını devreye alır. Coordinator manuel çağrılmaz — parent session otomatik karar verir.

### Auto-trigger sinyalleri (≥1 varsa coordinator çağrılır)

1. **≥3 agent'lık zincir** gerekiyor (örn. brief→audit→spec→kod).
2. **Paralel thread ihtiyacı** — birden fazla iş parçası aynı anda koşacak.
3. **P0 master-plan feature tam lifecycle** — "X feature'ı başlatalım/kuralım" gibi yüksek scope.
4. **Scope muğlak/çok-yönlü** — triage gerekir.
5. **Proje durumunu tarayıp karar** — "sıradaki önemli ne" gibi durum-bağımlı sorgu.

### DEĞİL-tetik (parent doğrudan çözer)

- Tek agent'a gidecek kısa iş (direct call)
- Soru/konsültasyon (parent cevap)
- Küçük bug fix / tek dosya edit
- Yazışma/mail/özet
- Halihazırda in-progress tek thread'in devamı (manuel continue)

### Coordinator vs parent session ayrımı

| İş tipi | Kim yapar |
|---|---|
| Küçük fix, tek agent, tek dosya | Parent → direct agent call |
| Soru/konsültasyon, bilgi aktarımı | Parent direct answer |
| Büyük feature lifecycle, çok agent | Coordinator (auto-triggered) |
| Status board + open.md tarayarak triage | Coordinator |
| Handoff log + status board enforcement | Coordinator (sub-agent unutursa düzeltir) |
| ADR Accept 5-dosya checklist enforcement | Coordinator |

### Stop conditions — chain durdur

Coordinator şu durumlarda zinciri durdurup kullanıcıya döner:

1. 🔴 critical açık karar — ADR Proposed dahil.
2. ADR Accepted 5-dosya checklist eksik (drift tespit).
3. Handoff ❌ reddedildi.
4. Test/TSC ❌.
5. Kullanıcı "dur" dedi.

Stop anında status board'a "Chain paused: [sebep]" yazılır, kullanıcı aksiyonu sonrası "Resume?" önerisiyle devam.

### Neden auto-trigger?

Manuel çağrı ("coordinator al" diye user'ın explicit invocation'ı) 3 problem yaratır:

1. **Friction** — kullanıcı her büyük iş öncesi meta-komut vermek zorunda kalır.
2. **Unutma** — iş büyüdüğünü fark etmeyen kullanıcı coordinator'ı çağırmaz, zincir dağınık koşar.
3. **Tutarsızlık** — bazen çağrılır bazen çağrılmaz, protokol disiplin kaybeder.

Auto-trigger ile parent session "bu iş büyük/karışık mı?" sorusunu **her prompt'ta** otomatik sorar. Answer evet ise coordinator Task ile çağrılır — user'a meta-karar yüklenmez.

---

## 6.6. Katman H — Test communication (test-engineer ↔ diğer agent'lar)

### Kural

Test-engineer izole çalışmaz. Önemli değişiklikler sonrası **diğer agent'lar test-engineer'a notify eder**, test-engineer da raporundaki bug pattern'lerini ilgili agent'a **handoff** olarak iletir. İki yönlü kanal protokolün parçasıdır.

---

### Inbound (diğer agent → test-engineer notify)

Bir agent deliverable'ını bitirdiğinde, deliverable türüne göre test-engineer'a notify eder. Notify = `docs/test/_inbox.md`'ye 1 satırlık trigger entry eklemek.

**Trigger matrisi:**

| Tetik koşulu | Notify eden | Notify türü | Önerilen test fazı |
|---|---|---|---|
| Yeni feature/route deploy edildi (3+ commit veya yeni page) | frontend-engineer | "Feature deploy" | Faz 1 smoke + Faz 2 ilgili flow'lar |
| Migration apply edildi (özellikle RLS, schema, trigger) | supabase-backend | "Migration applied" | Faz 1 critical path + data integrity audit |
| UI spec implement edildi (component overhaul) | frontend-engineer | "Spec implemented" | Faz 2 ilgili flow + XC1 theme parity |
| Token değişti (palette, motion, shadow) | design-system-keeper | "Token change" | XC1 theme parity + XC2 motion (regression) |
| Auth flow değişti (Capacitor OAuth, KVKK, session) | auth-capacitor | "Auth change" | Faz 1 A1-A6 (auth suite) |
| ADR Accept edildi (architectural decision) | coordinator veya delivery agent | "ADR accepted" | İlgili flow + cross-cutting (varsa) |
| Bug fix sonrası | frontend-engineer veya supabase-backend | "Bug fix" | Sadece o bug'ın repro adımları + regression suite |

**Inbox entry formatı (`docs/test/_inbox.md`):**

```markdown
## YYYY-MM-DD HH:MM — [Notify türü]

**Notify eden:** frontend-engineer
**Tetik:** Job 7 dashboard hero kart minimal refactor merge edildi (commit abcd1234)
**Etkilenen ekran/flow:** /dashboard (D1), karma kart hero
**Önerilen test fazı:** Faz 2 — D1 + XC1 (theme parity)
**Aciliyet:** Routine | Smoke (deploy önce) | Hot fix (P0 bug doğrulama)
**Linkler:** PR/commit/spec dosyaları
```

Test-engineer her gece (veya kullanıcı çağırınca) `_inbox.md`'yi açar, biriken trigger'ları faz planına çevirir, kullanıcıdan onay alır, koşturur. **Inbox boşsa proaktif test başlatmaz** — talebe bağlıdır.

---

### Outbound (test-engineer → diğer agent'lar handoff)

Test-engineer faz raporunu kapatırken bug pattern'lerini ilgili agent'a yönlendirir. Yönlendirme = pattern memo + handoff log.

**Outbound matrisi:**

| Pattern türü | Routes to | Handoff dosyası | Severity threshold |
|---|---|---|---|
| Theme-blind component (hardcoded color, light/dark drift) | frontend-engineer + design-system-keeper | `docs/test/_patterns/<tarih>-theme-blind.md` | P1+ |
| Optimistic UI eksik | frontend-engineer | `docs/test/_patterns/<tarih>-optimistic-ui.md` | P0 (P1 eğer happy path'te değil) |
| Idempotency (duplicate insert) | supabase-backend | `docs/test/_patterns/<tarih>-idempotency.md` | P0 |
| Locale bug (`İstanbul.toLowerCase()`) | frontend-engineer | `docs/test/_patterns/<tarih>-locale.md` | P1 |
| Safe-area çakışması | frontend-engineer | `docs/test/_patterns/<tarih>-safe-area.md` | P1 |
| Cross-screen data drift | supabase-backend (RLS view) veya frontend-engineer (state mgmt) | `docs/test/_patterns/<tarih>-data-drift.md` | P0 |
| Reduced motion ihlali | frontend-engineer | `docs/test/_patterns/<tarih>-motion-a11y.md` | P1 |
| RLS leak (yetkisiz veri görünümü) | supabase-backend | `docs/test/_patterns/<tarih>-rls-leak.md` | P0 (security blocker) |
| ADR ihlali tespiti | coordinator + ilgili agent | `docs/test/_patterns/<tarih>-adr-violation.md` | P0 |
| UX research bulgusu (kullanıcı confused, copy belirsiz) | ux-researcher | `docs/test/_patterns/<tarih>-ux-finding.md` | P1+ |
| UI spec drift (implementation spec'le uyumsuz) | ui-designer | `docs/test/_patterns/<tarih>-spec-drift.md` | P1 |

**Handoff yöntemi:**

1. Pattern memo yaz (`docs/test/_patterns/<tarih>-<pattern-adı>.md`) — Bölüm 6'daki şablon (kök neden + etkilenen bug'lar + önerilen sistemik fix + handoff target).
2. **Hedef agent'ın "kaynak" dosyasında değil**, agent'ın **inbox'ında** veya **status board'da** notify et:
   - `docs/<domain>/_inbox.md` (varsa) — örn. frontend-engineer için `docs/eng/_inbox.md`
   - Veya status board'a "Pattern memo: <ad> → <agent>" satırı (Done today + handoff'a)
3. Pattern memo dosyasının kendi handoff log'unda hedef agent satırı:
   ```
   ## Handoff Log
   - YYYY-MM-DD HH:MM — frontend-engineer 📥 — Pattern review pending. Acil: P0.
   ```
4. Hedef agent fix'i bitirdiğinde aynı satırı `✅ Fixed (commit xyz)` olarak günceller.

---

### Coordinator role (test trafiği orkestrasyonu)

Coordinator, test-engineer ↔ delivery agent'lar arasındaki trafiği gözlemler ve şu durumlarda devreye girer:

- **3+ pattern memo aynı agent'a yığılırsa** — coordinator agent'a sprint task'ı önerir (toplu fix paketi).
- **Test-engineer P0 bug raporladıysa** — coordinator deploy bloke önerir, ilgili agent'a "stop other work, fix this" notify eder.
- **Aynı bug 2 faz arka arkaya tekrarlarsa** — coordinator regression test suite'e eklenmesini ister (test-engineer'a handoff).

---

### Cheat-sheet — Inbound + Outbound

**Delivery agent (FE/BE/UI/DS) deliverable bitirdiğinde:**
1. Mevcut Katman A handoff log + Katman B status board + Katman C journal yaz (her zamanki gibi).
2. **Katman H ek:** Eğer trigger matrisinde bulunduğun bir koşul varsa, `docs/test/_inbox.md`'ye 1 satır notify entry ekle.

**Test-engineer faz raporu kapatırken:**
1. Faz raporu yaz (Bölüm 4-5 mevcut format).
2. **Katman H ek:** 3+ bug aynı kök nedene bağlıysa pattern memo aç + outbound matrisindeki agent'a handoff bildir.
3. Status board'a "Pattern memo → <agent>" satırı.

---

### Anti-patterns (Katman H için)

❌ **"Major refactor merge edildi, kimseye haber yok."** — Test-engineer regresyonu kaçırır, bug deploy'a sızar.
❌ **"Test raporu yazıldı, pattern memo açılmadı."** — Tek tek bug listesi var ama kök neden adreslenmedi, agent fix'leri spot fix kalır.
❌ **"Inbox dolu ama test agent çağrılmadı."** — Trigger'lar birikiyor; en kötüsü 2 hafta sonra "neden bu kadar bug deploy oldu" sorusu.
❌ **"Pattern memo yazıldı, hedef agent'a notify yok."** — Memo dosyası klasörde unutulur, kimse okumaz.

---

## 7. Pratik cheat-sheet

### Bir deliverable yazarken (her agent)

**Başlarken (3 dk):**
1. Atlas + playbook + open.md + status board oku (Adım 0 ritüeli).
2. Upstream brief'i bul. Yoksa "sıfırdan iş" kırmızı bayrak — kullanıcıya sor.
3. Status board'a "In progress" satırı ekle.

**Yazarken:** Craft-specific skill'leri oku + işi yap.

**Bitirirken (5 dk):**
1. Deliverable'ı yaz.
2. **Upstream kaynağa handoff log satırı ekle** (Katman A).
3. Journal entry'yi unified 4 alan başlığıyla yaz (Katman C).
4. Status board'da "In progress" → "Done today" taşı (Katman B).
5. Açık karar varsa `04-questions/open.md`'ye yaz (Katman E).
6. Dashboard'a tarihli giriş ekle (mevcut kural).

### Karar kapatırken

1. ADR Accept 5-dosya checklist (Katman E).
2. Status board güncelle (Katman B).

### Review tetiklendiyse

1. Review dosyası yaz (Katman D template).
2. Hedef dosyanın Handoff log'una review satırı ekle (Katman A).
3. Status board'da hedef deliverable'ı uygun kolona taşı (Fail → Backlog; Pass → akış devam).

## 8. Anti-patterns

❌ **"Self-audit pass, handoff log yok."** — Katman A atlanınca zincir görünmez.
❌ **"Dashboard update, status board skip."** — Kullanıcı state snapshot'ı alamaz.
❌ **"Aynı soru iki yerde."** — `_decisions-queue.md` + `open.md` ikisinde aynı Q yazılması drift üretir. Canonical `open.md`.
❌ **"Handoff log ekle ama satırsız."** — Bölüm başlığı olup altı boşsa "hiç downstream yok" mu "unutuldu mu" belli değil. Her zaman ya satır ya "— [henüz downstream yok]" yazılır.
❌ **"ADR Accepted ama 3 dosya güncellendi."** — 5 dosya checklist'i eksik = drift. Agent atomic tamamlar.
❌ **"Peer review tetikleyici var ama yapılmadı."** — Tetik varsa review zorunlu. Yoksa kaynak agent blocker.

## 9. Ölçüm — protokol çalışıyor mu?

Haftalık self-check (user veya meta-agent çalıştırır):

1. Son 7 günün tüm briefs/specs dosyalarında **"Handoff log" section var mı?** → %100 olmalı.
2. Status board **son 24 saatte güncellendi mi?** → en azından 1 agent touched olmalı.
3. Journal entry'lerin **üst 4 alanı dolu mu?** → %100.
4. Open.md'de ≥7 gün cevapsız kalan 🔴 soru var mı? → İdeal 0, tolerans 2.
5. ADR Accepted var ama open.md'de hâlâ açık görünen soru? → drift, 0 olmalı.

Bu 5 ölçü haftalık dashboard özetinde raporlanır.

## 10. Bu skill değiştiğinde

Protokol değişikliği = tüm agent playbook'larına yansıtılır. Değişiklik çapı büyükse, sırayla:

1. Bu SKILL.md revize edilir.
2. 8 agent playbook'u (strategy-consultant, product-analyst, ux-researcher, ui-designer, frontend-engineer, supabase-backend, design-system-keeper, auth-capacitor) güncellenir.
3. Mevcut açık işler status board'da flag'lanır: "protokol v2 sonrası re-check".
4. Retroactive uyum opsiyoneldir — yeni işten başlar, eski iş olduğu gibi bırakılabilir.

---

**Son söz:** Bu protokol disiplin aracıdır, bürokrasi değil. Amacı 5 dakikalık ek iş karşılığında 4 saatlik arkeoloji tasarrufu. Handoff log 1 satır, status board taşıma 30 saniye, unified journal 4 alan = toplam 5 dk/run. Karşılığında: her deliverable'ın zincirini görebiliyor, kim ne bekliyor 30 saniyede anlıyor, ADR drift'i kalmıyor.
