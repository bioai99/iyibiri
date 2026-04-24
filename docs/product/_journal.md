# product-analyst Journal

> Her run sonunda bir giriş, en yeni en üstte. Operasyonel log. Kurumsal hafıza (insight-level) playbook'un Bölüm 6'sında.

**Format:**
```
## YYYY-MM-DD HH:MM — [iş başlığı]
- **Prompt:** [kısa]
- **Input:** [okunan dosyalar]
- **Output:** [yazılan dosyalar]
- **Kararlar açıldı:** N
- **Kararlar kapandı:** N
- **Self-audit:** pass | fail (N bulgu)
- **Next:** [bir sonraki soru / öneri]
---
```

<!-- YENİ GİRİŞLER BU ÇİZGİNİN ALTINA -->

## 2026-04-24 05:00 — V1 IMPROVEMENT MASTER + 7 BRIEF — aktarıma hazır ⭐
- **Prompt:** "Mevcut projeyi improve+change'lerle ilerliyoruz, analist geliştirme başlıklarını detaylı çalışsın, UX + dev agent'larına aktarım + start."
- **Input:** 8 Accepted ADR + 12 strateji memo + atlas 38 sayfa envanteri + page-audit + 3 WS.
- **Output:**
  - `docs/product/01-workstreams/2026-04-24-v1-improvement-master-plan.md` — 600+ satır, 38 sayfa × karar + 20 component × karar + 12 sistemik boşluk + P0-P3 matris + 26 iş kalemi × effort × owner.
  - **4 UX brief** (P0 iş için):
    - dashboard-ana-v2 (MAKE vurgusu)
    - ngo-membership-parametric (ADR-007 + 008 birleşim, en büyük P0)
    - mission-detail-state-clarity (4-state + Karma formülü)
    - loading-empty-error-sistemik (state library)
  - **3 Eng brief** (hemen başla):
    - ws01-make-view-kpi (supabase-backend)
    - bagis-coming-soon-entegrasyon (frontend-engineer, 1-2 saat iş)
    - sifre-sifirlama-akisi (auth-capacitor, 3-4 gün)
- **Kararlar açıldı:** 0 yeni (Accepted ADR'lere bağlı).
- **Kararlar kapandı:** Workstream scope + brief'ler açıldı — kod ready.
- **Self-audit:** pass. Her P0 için brief var. Owner net atanmış. Aktarım zinciri çalışır.
- **Next:** Kullanıcı agent çağırır: (1) supabase-backend migration apply + MAKE view, (2) auth-capacitor şifre reset, (3) frontend-engineer bağış banner + onboarding DB sync, (4) ux-researcher dashboard heuristik audit.
---

## 2026-04-24 04:00 — YOL F EXECUTION — 8 ADR Accepted + kod tarafı başladı + Faz 2 agent'ları kuruldu
- **Prompt:** "Senin söylediğin şekilde gidelim" → Yol F tam execution.
- **Input:** 8 ADR Proposed durumda, tüm WS'ler scoping, mimari netleşmiş.
- **Output:**
  - **8 ADR Accepted** (ADR-001 → 008). Durum: Proposed → Accepted (2026-04-24) ✅.
  - `resolved.md` — 13 soru çözüldü, tablo halinde.
  - `open.md` — 14 açık soru + zaman kategorileri + sonraki ADR adayları.
  - **İlk somut kod çıktıları:**
    - `supabase/migrations/009_parametric_ngo_fee.sql` (ADR-007, TEMA + TEGV + LÖSEV seed dahil)
    - `supabase/migrations/010_payment_routing.sql` (ADR-008 v2, payment_mode + processor + referrals tablo + indexler)
    - `app/dashboard/layout.tsx` — ThemeProvider initial="light" → "dark" (ADR-004 fix, 1-line edit)
    - `components/ui/coming-soon-banner.tsx` — ADR-006 için reusable banner component
  - **TEMA partnership pitch yazıldı:** `docs/strategy/04-value-prop/2026-04-24-tema-partnership-pitch.md` — fonzip'ten söz etmez, 3 slayt-quality strateji + pilot teklifi + iç notlar.
  - **Faz 2 4 agent kuruldu:**
    - `.claude/agents/frontend-engineer.md` (Next.js + Tailwind + Framer + Capacitor)
    - `.claude/agents/supabase-backend.md` (migration + RLS + seed + query)
    - `.claude/agents/design-system-keeper.md` (ui/ atomlar + token'lar + atlas reconciliation)
    - `.claude/agents/auth-capacitor.md` (Supabase SSR + native OAuth + KVKK + şifre sıfırla)
  - **`docs/eng/_journal.md` başlatıldı** — Faz 2 ortak log.
- **Kararlar açıldı:** 0.
- **Kararlar kapandı:** 13 (Q1, Q2, Q3, Q4, Q5, Q12, Q15, Q23, Q25, Q27, Q28, Q33, Q40).
- **Self-audit:** pass. 8 ADR kabul edildi, kod çıktı başladı, partnership pitch hazır, Faz 2 mimari kuruldu. İyiBiri V1 yol haritası artık net ve aksiyonable. Sonraki mesai Faz 2 agent'larını tek-tek çağırıp implementasyon yapmak.
- **Next:**
  1. **supabase-backend** çağrılıp 009 + 010 migration'larını Supabase'e apply etmek.
  2. **frontend-engineer** çağrılıp bağış mock sayfalarına `ComingSoonBanner` eklemek.
  3. **auth-capacitor** çağrılıp "şifremi unuttum" akışını başlatmak.
  4. TEMA pitch'ini kullanıcı onayladığında TEMA'ya iletilir — paralel iş.
  5. Hukuki mütalaa — Q10, Q11, Q13, Q37, Q38 (trademark başvurusu) dış avukatla.
---

## 2026-04-24 03:45 — Marketplace mode netleştirme
- **Prompt:** Kullanıcı sordu: "Fonzip farklı payment provider kullanıyor, ben direkt onunla anlaşmamın engeli ne?"
- **Input:** iyzico Marketplace API doc + BDDK Law 6493 (aggregator exempt) + fee matematiği.
- **Output:**
  - **Kritik regulatory bulgu:** TR'de aggregator/integrator/wallet lisans gerektirmiyor (Law 6493). İyiBiri iyzico'nun üstünde platform olarak çalışabilir — BDDK lisans gereksiz.
  - ADR-008 v2 Marketplace mode güncelleme: "opt-in küçük STK için" → "fonzip-dışı tüm STK için DEFAULT."
  - Segmentasyon matrisi:
    - Fonzip müşterisi → Embedded (Mod 1, silent widget)
    - Kızılay benzeri özel → Passthrough (Mod 2)
    - Fonzip'te olmayan → **Marketplace (Mod 3) DEFAULT**
  - Fee matematiği: İyiBiri direct iyzico + %0 platform = STK için %3.24 (fonzip'in %4.74'ünden %1.5 ucuz).
- **Kararlar açıldı:** 0 yeni.
- **Kararlar kapandı:** Q28 daha net çözüm.
- **Self-audit:** pass. Marketplace mode aslında "opt-in fallback" değil, "fonzip-dışı için primary." Bu küçük netlik büyük strateji etkisi.
- **Next:** Yol F süreci başlıyor. TEGV + LÖSEV için iyzico Marketplace adapter + sub-merchant onboarding planı. TEMA + Haytap için fonzip embed (Yol D.2). Kullanıcı onay verirse Faz 2 agent kurulumu başlar.
---

## 2026-04-24 03:15 — koruma stratejisi (Yol D → D.1 + D.2)
- **Prompt:** "Fonzip'e teklif etmek ona bu fikri yapma hissi uyandırır mıyım? Onların konumu iyi biri yapmak için çok daha avantajlı. Kendimi nasıl korurum?"
- **Input:** Fonzip şirket profili, startup NDA best practices, moat analizi.
- **Output:**
  - `docs/strategy/05-focus/2026-04-24-fonzip-positioning-koruma-stratejisi.md` — 10 bölüm koruma strateji memosu.
  - Yol D iki alt-yola ayrıldı: **D.1 Formal Partnership** (ifşa riski) + **D.2 Silent Technical Integration** (fonzip ile hiç konuşmadan, STK ile ikili anlaşma).
  - 6 moat katmanı listelendi (user acquisition, sponsor ağı, Karma ekonomi, mobile, discovery, velocity).
  - 3 hukuki koruma: trademark + fonzip ToS check + mutual NDA.
  - **Yol F** = Yol C + Yol D.2 paralel, Yol D.1 ay 4+ opsiyonel (önceki Yol E'yi güncelliyor).
  - Q37-Q40 açık kuyruğa eklendi.
- **Kararlar açıldı:** 4 (Q37-Q40). Q33 önerim Yol F olarak güncellendi.
- **Kararlar kapandı:** 0.
- **Self-audit:** pass. Kullanıcı çok doğru endişeye parmak bastı — "fonzip'e git → fikri ifşa" yaklaşımı rokı olurdu. Yol D.2 (silent integration, fonzip'in public altyapısını STK üzerinden kullanma) kontrol kaybetmeden hızlı lansman sağlıyor. Hukuki belirsizlik: fonzip ToS 3. taraf embed yasaklıyor mu — kullanıcı/avukat kontrol etmeli.
- **Next:** Yol F onaylanırsa Faz 0 aksiyonları: (a) trademark başvuru, (b) fonzip ToS hukuki okuma, (c) TEMA ile ayrı görüşme — fonzip'ten söz etmeden partnership pitch. STK görüşme brief'i analist yazabilir.
---

## 2026-04-24 02:45 — Yol D eklendi (fonzip partnership)
- **Prompt:** "Yani ya fonzip'le anlaşıcam... %0,5'i ayır ya da onun yaptığı işi de yapabilir miyim + onlar kim"
- **Input:** Fonzip şirket araştırması (F6S, LinkedIn, TechSoup, About Us), mevcut 05-focus memo (Yol A/B/C).
- **Output:**
  - `docs/strategy/02-competitors/2026-04-24-fonzip-sirket-profili.md` — detay profil (kuruluş 2016, 2-10 kişi, Emre Danacı, müşteri listesi büyük).
  - 05-focus memo revize (Yol D + Yol E birleşim önerisi).
  - Q33 güncellendi (Yol E önerim), Q36 🟡 yeni (fonzip temas kim başlatır).
  - S36 kaynak kaydı.
- **Kararlar açıldı:** 1 (Q36). Q33 revize.
- **Kararlar kapandı:** 0.
- **Self-audit:** pass. Yol D güçlü görünüyor ama tek başına riskli — **Yol E (C + D paralel)** sıfır single-point-of-failure sağlıyor. Fonzip kabul ederse hızlı, reddederse embedded zaten hazır. Partnership pitch'inin tonu önemli ("tehdit değil, hacim getiriyoruz" şeklinde).
- **Next:** Kullanıcı Yol E onayı verirse fonzip temas süreci başlatılır (bkz. Q36). Paralel olarak WS-03 embedded adapter'ı ilerler. ADR-009 "Yol E roadmap" açılması bekliyor.
---

## 2026-04-24 02:15 — strategik scope analizi (fonzip positioning)
- **Prompt:** Kullanıcı fonzip pricing ekranını paylaşıp sordu: "fonzip gibi konumlanıp ödeme kurgusunu üstüme çevirmem çok büyük bir iş mi?"
- **Input:** Fonzip feature listesi (CRM + donation forms + recurring + automation bots + email + custom domain + telemarketing + integrations + makbuz), TR pricing ₺499-799, %1.5 + 0,05₺/email, İyiBiri mevcut altyapı.
- **Output:**
  - **Strateji memo:** `docs/strategy/05-focus/2026-04-24-fonzip-positioning-scope-karar.md` — 3 yol karşılaştırma + effort estimate + Yol C (Hibrit Evrim) önerisi.
  - open.md Q33 🔴 (yol seçimi), Q34 🟡, Q35 🟢 eklendi.
  - Fonzip'in 10 feature modülü: 4'ü zaten İyiBiri'de kısmen var, 6'sı yeni geliştirme (25-35 hafta).
  - Tam fonzip parite 9-12 ay, pazar momentum riski.
  - Yol C (Hibrit Evrim): V1 3-4 ay, Yıl 2 tam parite. Yıl 2+ gelir 2x.
- **Kararlar açıldı:** 3 (Q33-Q35).
- **Kararlar kapandı:** 0.
- **Self-audit:** pass. Ekran görüntüsü ve URL kullanıcı verdi — data concrete. Yol C önerim 3 kriteri karşılıyor: hız, farklılaşma, risk düşük.
- **Next:** Kullanıcı Yol C onayı verirse ADR-009 "Aşamalı Fonzip Parite Stratejisi" açılır, WS-02/WS-03 Faz 1 embedded kapsam revize (değişmez gibi görünüyor ama Faz 2-3 planı eklenir).
---

## 2026-04-24 01:45 — ADR-008 v2 (3-modlu hibrit embedded)
- **Prompt:** Kullanıcı UX sorusu: "direkt browserda onun sitesini açarsam platformun tek app'te tüm stk'lar değer önerisi zayıflayabilir. Arka planda onların anlaşması da kullanılabilir ya da farklı modeller ama direkt dışarda stk sitesine atıp oradan ödeme alırsak emin olamadım."
- **Input:** iyzico Checkout Form iframe doc + PayTR iframe API + fonzip embed araştırma + PCI DSS SAQ A.
- **Output:**
  - **ADR-008 v2 (tam revizyon):** 3-modlu hibrit (Embedded primary + Passthrough fallback + Marketplace opt-in). iframe integration ile STK processor arka planda + kullanıcı İyiBiri içinde.
  - open.md Q28 revize (embedded default).
  - WS-03 kapsam v2 (processor adapter katmanı, 3 adapter: iyzico + PayTR + fonzip).
  - Q31 🔴 yeni (API key paylaşımı güvenlik çerçevesi), Q32 🟡 yeni (mobile iframe recurring test).
- **Kararlar açıldı:** 2 yeni (Q31, Q32). Q28 önerisi tamamen değişti.
- **Kararlar kapandı:** 0.
- **Self-audit:** pass. Kullanıcı UX disiplinini unutmamıştı — "operasyonel saygı + deneyim kalitesi" çelişkisi yoktu, teknik çözümle her ikisi karşılanır. iframe integration standart pattern (Stripe Elements benzeri), TR processor'larının hepsi destekliyor.
- **Next:** Kullanıcı ADR-008 v2 onayı verirse WS-03 processor adapter katmanı implementasyonu başlar. fonzip + iyzico ilk adapter (TEMA + HAYTAP kapsanır). TEGV + LÖSEV kendi processor API key alınması partnership sözleşmesinde.
---

## 2026-04-24 01:20 — mimari revizyon (pass-through)
- **Prompt:** Kullanıcı kritik soru sordu: "STK'lar kendi payment altyapısı kullanıyor, kesinti alıyor — biz bağladıysak onların çalıştığı şekilde ilerlemeli değil mi?"
- **Input:** STK ödeme altyapı araştırması (TEMA kendi+fonzip, HAYTAP fonzip, Kızılay kendi, LÖSEV kendi, TEGV kendi); ADR-002, ADR-007, WS-03.
- **Output:**
  - **ADR-008 (YENİ, Proposed):** Pass-through default, Marketplace opt-in. Payment routing enum `ngos.payment_mode`.
  - **ADR-002 revize notu:** iyzico scope daraldı (sadece İyiBiri kendi gelir kolları R1/R2/R6).
  - **ADR-007 revize notu:** parametric fee schema hala geçerli ama bilgi amaçlı (pass-through'da tahsilat yok).
  - **open.md güncelleme:** Q28 🔴 Q29 🟡 Q30 🟡 eklendi.
  - **WS-03 kapsam revize notu:** primary pass-through, Marketplace sadece opt-in.
- **Kararlar açıldı:** 3 (Q28-Q30).
- **Kararlar kapandı:** 0 (hepsi Proposed).
- **Self-audit:** pass. Kullanıcının pratik bilgeliği büyük hata yakaladı: Marketplace zorlamak partnership'i bozar. Pass-through hem STK'ya saygılı hem İyiBiri için operasyonel olarak daha basit.
- **Next:** Kullanıcı ADR-008'i onaylarsa 3 STK için pass-through URL'leri toplanır (WS-02 kapsamında TEMA/TEGV/LÖSEV admin'leriyle tek telefon). SaaS fee tier (Q29) müzakereye açık; kullanıcı tercihini işaretlemeli.
---

## 2026-04-24 00:45 — ilk analist turu (İLK GERÇEK İŞ)
- **Prompt:** "Analyst artık bir şeylere başlasın" — strateji memolarını ürüne geçir, 26 açık sorudan ilk dalgayı ADR ve workstream haline getir. Kullanıcı TEMA ₺256 üyelik fee tespiti paylaştı → parametric schema gereksinimine dönüştü.
- **Input:** 12 strateji memosu + atlas + `04-questions/open.md` + TEMA/HAYTAP/ÇYDD/LÖSEV fee araştırması.
- **Output:**
  - `04-questions/open.md` konsolide 27 soru tablosu
  - 7 ADR Proposed: ADR-001 (NSM), ADR-002 (iyzico), ADR-003 (İstanbul), ADR-004 (dark-only), ADR-005 (pilot 3 STK), ADR-006 (V2 bağış yönlendirici), ADR-007 (parametric fee)
  - 3 Workstream: WS-01 NSM KPI, WS-02 STK Pilot, WS-03 Membership Payments
- **Kararlar açıldı:** 1 yeni (Q27 parametric fee)
- **Kararlar kapandı:** 0 (hepsi Proposed — kullanıcı onayı bekliyor)
- **Self-audit:** pass (checklist MECE + JTBD + başarı ölçülebilir + bağımlılık + risk + strateji referansı + tarih + sayfa disiplinli hepsi ✓)
- **Next:** Kullanıcı ADR'lerden hangilerini Accepted/Rejected işaretleyecek? Onaylanan kararlar resolved.md'ye taşınır, workstream'ler "active" durumuna geçer, eng/UX brief yazımı başlar.
---

- **Prompt:** product-analyst agent'ı + docs/product iskeleti + karar kuyruğu ilk 5 başlangıç sorusuyla
- **Input:** `docs/page-audit.md`, `docs/strategy/00-playbook.md`
- **Output:** `docs/product/**`, `.claude/agents/product-analyst.md`, 3 yeni skill
- **Kararlar açıldı:** 5 (Q1–Q5, playbook Bölüm 7)
- **Kararlar kapandı:** 0
- **Self-audit:** pass (ilk kurulum — deliverable yok)
- **Next:** Kullanıcının ilk stratejik işi verme bekleniyor. Q1 (north-star metrik) ve Q2 (ödeme sağlayıcı) en kritik açık kararlar.
---
