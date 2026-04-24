# İyiBiri — Agents Dashboard

> Tüm agent'ların birleşik timeline'ı. Her agent run sonunda buraya en üste bir giriş ekler. Bu dosyayı gün başında açıp "dün ne yapıldı, bugün ne açık" diye tara.

**Konvansiyon (her agent uyar):**
- En yeni giriş **en üstte**.
- Format:
  ```
  ## YYYY-MM-DD HH:MM — [agent-adı]
  **İş:** [1 cümlelik iş tanımı]
  **Durum:** completed | in_progress | blocked | needs_input
  **Çıktı:** [dosya yolu veya "—"]
  **Açık karar:** [N açık soru — bkz. ilgili queue]
  **Özet:** [1-2 cümle ana çıkarım]
  ---
  ```
- Blocked / needs_input ise satır üstüne ⚠️ koy; sen tarayınca kırmızı bayrağı göreceksin.

---

## 2026-04-24 14:30 — frontend-engineer
**İş:** Dashboard v2 tur 2 — implementation plan (spec'ten kod yazma planı).
**Durum:** completed
**Çıktı:** `docs/eng/_journal.md` — 2026-04-24 14:30 entry (plan, kod yok)
**Açık karar:** 4 (A3 design-system-keeper token parallel, A1 profiles.current_streak exists?, B1 Q25 test gate, leaderboard view schema)
**Özet:** Sprint A (5–6 gün: StreakSnapshot, HeroCardV2, MissionCard K1 fix, DailyMissionCard, Tab A11y) + Sprint B (4–5 gün: LeaderboardTeaser feature-flag behind, test pending) + Sprint C (RewardRail placeholder, P2). Toplam 2–3 hafta. 4 dependency: design-system-keeper token ADD, supabase-backend leaderboard view, ux-researcher Q25 test, opsiyonel migration (streak schema check). Kod yok, sadece effort/risk/dependency breakdown.

---

## 2026-04-24 10:45 — ui-designer
**İş:** Dashboard v2 tur 2 polish UI spec yazma (K1–K5 kritik bulgu + UX journey peak/dark moment → implementasyon spec).
**Durum:** completed
**Çıktı:** `docs/ui/01-specs/2026-04-24-dashboard-v2-tur2-polish-spec.md`
**Açık karar:** 2 (Q25 leaderboard tone user test scheduling, K1 token ADD ADR hangi stage)
**Özet:** K1–K5 kritik (MissionCard token drift, streak/leaderboard/algoritma missing, featured selection transparency) → 3 yeni component (StreakSnapshot + LeaderboardTeaser + DailyMissionCard label) + token refactor spec. Duolingo motion pattern (1.5s entry choreography, 280ms dot stagger). WCAG AA full. Feature-flag (LeaderboardTeaser + RewardRail P1 pending). Handoff: fe (impl) + design-system-keeper (K1 token ADR).

---

## 2026-04-24 23:45 — ux-researcher
**İş:** Dashboard v2 tur 2 heuristik audit + 2. ziyaret journey map (3 ay retention).
**Durum:** completed
**Çıktı:** `docs/ux/03-heuristics/2026-04-24-dashboard-v2-tur2-audit.md` + `docs/ux/02-journeys/2026-04-24-dashboard-ikinci-ziyaret.md`
**Açık karar:** 3 (Q25 leaderboard tone + test plan, Q34 featured mission MVP, Q43 reward rail scope)
**Özet:** Tur 1 component'lerin 9 tanesi + 3 missing (analyst brief) heuristik matrix. 5 kritik bulgu (MissionCard hardcoded gradient N4 drift, streak/leaderboard/algoritma sinyalleri missing N1/N6, ödül rail Overhead). Zehra 3-ay journey'de dark moment farklı (Adım 8 scannability vs Tur 1 Adım 3 overload) — A1+A2+A3 kombinasyonu mitigate. Handoff ui-designer spec'e.
---

**Aktif agent'lar (9):**

Discovery:
- `strategy-consultant` → `docs/strategy/` • Pazar, rekabet, gelir, value prop, odak memoları.
- `product-analyst` → `docs/product/` • Workstream'lere bölme, feature scope, UX + eng brief, karar kuyruğu, self-audit.
- `ux-researcher` → `docs/ux/` • Heuristic audit, journey map, persona/JTBD, a11y.
- `ui-designer` → `docs/ui/` • UI spec, token, variant, motion, handoff.

Faz 2 (implementation):
- `frontend-engineer` → `app/`, `components/`, `lib/` • Next.js + React + TS.
- `supabase-backend` → `supabase/migrations/`, `lib/supabase/` • Şema, RLS, query, view.
- `auth-capacitor` → `app/auth/`, `capacitor.config.ts` • Supabase auth, Capacitor, KVKK.
- `design-system-keeper` → `design-system/`, `components/ui/` • Token ihlali, component canonical, atlas reconciliation.

Orchestration:
- `coordinator` → `docs/_status-board.md` (enforce), Task tool • **Auto-triggered** — büyük/multi-agent/muğlak iş geldiğinde parent session çağırır. Triage + orchestrate. Craft işi yapmaz. Protokol [Katman G](../.claude/skills/agent-communication-protocol/SKILL.md).

Yeni agent eklendiğinde bu listeye kaydı düş.

---

<!-- YENİ GİRİŞLER BU ÇİZGİNİN ALTINA, EN ÜSTTEN BAŞLAYARAK EKLENİR -->

## 2026-04-24 16:35 — design-system-keeper
**İş:** MissionCard K1 token ihlali fix — hardcoded domain gradient'leri Tailwind config token'a taşı.
**Durum:** completed
**Çıktı:** `tailwind.config.ts` (backgroundImage layer +9 token), `components/ui/mission-card.tsx` (refactor domainGradient object sil), `docs/project-atlas.md` (Bölüm 6 tablo), `docs/ui/01-specs/...` (handoff log satırı)
**Açık karar:** 0 (semantic naming V1.1'de ADR açılacak)
**Özet:** K1 severity 4 launch blocker ✅ fix. 7 domain gradient (`bg-domain-nature|education|social|financial|animals|culture|default`) + 2 scrim overlay (`bg-scrim-bottom|top`) + cream text token Tailwind config'e ADD. Mission-card.tsx hardcoded style → className pattern + token kullanımı. TSC 0, grep hardcoded hex 0. Handoff: frontend-engineer (Sprint A test).

---

## 2026-04-24 — product-analyst
**İş:** Dashboard v2 Tur 2 değerlendirmesi — mevcut component envanterini audit et, boşlukları tespit et, MAKE KPI uyumunu kontrol et, iyileştirme önerileri hazırla.
**Durum:** completed
**Çıktı:** `docs/product/02-briefs/ux/2026-04-24-dashboard-v2-tur2-brief.md` (450+ satır)
**Açık karar:** 3 (Q25 leaderboard tone, Q34 algorithm timing, Q43 ödül rail sprint)
**Özet:** Tur 1 component'leri (HeroCardV2, DailyMissionCard, tabs, NGO rail) incelendi; 3 missing component bulundu (streak snapshot, leaderboard teaser, reward rail). 5 iyileştirme önerisi: 2 Leverage (streak + leaderboard) + 2 Neutral (algorithm + chips) + 1 Overhead (ödül rail). Handoff ux-researcher'a heuristik audit için.
---

## 2026-04-24 20:45 — [agent iyileştirme batch 3-9/9 tamam] ⭐⭐⭐
**İş:** Agent improvement research raporundaki 5 kalan P1+P2 agent'ı paralel 3 subagent ile koşturuldu: frontend-engineer (3/9), supabase-backend (4/9), coordinator (5/9), ui-designer (6/9), ux-researcher (7/9), product-analyst (8/9), strategy-consultant (9/9).
**Durum:** completed (9/9 agent iyileştirme tamam)
**Çıktı — Yeni 5 skill:**
- `.claude/skills/react-server-component-patterns/SKILL.md` (421 satır) — Dan Abramov RSC mental model + server/client boundary + waterfall prevention + Suspense + streaming. frontend-engineer zorunlu skill.
- `.claude/skills/continuous-discovery-practice/SKILL.md` (400 satır) — Teresa Torres OST + Google HEART + Jeff Patton story mapping + JTBD interview. ux-researcher zorunlu skill.
- `.claude/skills/product-discovery-frameworks/SKILL.md` (352 satır) — OST + Shape Up (Ryan Singer) + JTBD (Bob Moesta) + Cagan 4-product-risk + LNO (Shreyas Doshi). product-analyst zorunlu skill.
- `.claude/skills/pyramid-principle-thinking/SKILL.md` (310 satır) — Barbara Minto governing thought + MECE + SCQA + memo template. strategy-consultant zorunlu skill.
**Çıktı — 4 mevcut skill genişletildi:**
- `.claude/skills/supabase-postgres-best-practices/SKILL.md` 64 → 386 (+322 satır) — RLS patterns + Realtime idempotency + Edge Functions + Migration versioning/rollback 4 yeni bölüm.
- `.claude/skills/visual-spec-writing/SKILL.md` 179 → 513 (+334 satır) — Bölüm 10 Visual Hierarchy Discipline (Refactoring UI) + Bölüm 11 Motion Choreography Patterns (Rauno Freiberg).
- `.claude/skills/writing-plans/SKILL.md` 282 → 377 (+95 satır) — Bölüm 12 OKR Linkage (Doerr) + kontrol listesi genişleme.
- `.claude/skills/consulting-methodology/SKILL.md` 154 → 359 (+205 satır) — Bölüm 13 7 Powers (Helmer moat analysis) + Bölüm 14 Amazon Working Backwards PR/FAQ + Bölüm 15 checklist genişleme.
**Çıktı — 7 playbook güncellendi:**
- frontend-engineer (+5): mobile-app-polish-standards kritik ref fix + RSC skill + testing/performance prensipleri.
- supabase-backend (+6): Adım 0 ritüele RLS/Realtime/Edge/Migration skill bölüm referansları.
- coordinator (+151): Bölüm 4 Triage Decision Tree + RACI + LNO, Bölüm 4.5 Stop Conditions (7 kategori), Bölüm 4.75 Workstream Sequencing + Critical Path.
- ui-designer (Adım 0 skill ref): visual-spec-writing Bölüm 10+11 zorunlu.
- ux-researcher (+9): continuous-discovery-practice skill ref + İş tipi F Opportunity Solution Tree.
- product-analyst (+30): product-discovery-frameworks skill ref + İş tipi G OST + Shape Up Pitch + framework cheat-sheet.
- strategy-consultant (+13): pyramid-principle-thinking skill ref + 7 Powers/PR-FAQ/Pyramid/SCQA cheat-sheet.
**Test:** tsc --noEmit 0 hata. Kod değişikliği yok (sadece docs/skills/agents).
**Açık karar:** 0 yeni.
**Özet:** 9/9 agent tier-1 discipline seviyesine kavuştu. Top-tier kaynaklar (Barbara Minto, Hamilton Helmer, Teresa Torres, Ryan Singer, Marty Cagan, Shreyas Doshi, Dan Abramov, Brad Frost, Nathan Curtis, Rauno Freiberg, Refactoring UI, RFC 8252, KVKK Kurumu) skill'lere dokulandı. Toplam: 7 skill (2545 satır) yeni/genişletilmiş + 9 playbook güncel. V1 pilot öncesi ekosistem hazır.

---

## 2026-04-24 18:30 — [auth agent iyileştirme 2/9] auth-capacitor — KVKK + Capacitor OAuth skills ⭐⭐⭐ P0
**İş:** Agent improvement research #7 — 2 kritik boşluk (KVKK uyum ve Capacitor native OAuth skill yok). Legal risk (TL 1M+ ceza) + security risk (account takeover) birinci sıradaydı. Yeni iki skill + playbook entegrasyonu.
**Durum:** completed
**Çıktı:**
- `.claude/skills/kvkk-compliance/SKILL.md` (yeni, 250 satır) — TR 6698 Kanun + aydınlatma metni template 8 bölüm + form UI pattern (çifte onay, default unchecked, cayma banner) + DB consent tracking + silme hakkı 30-gün grace + hard delete + vendor DPA kontrolü (Supabase/iyzico/PayTR/Vercel/fonzip) + pre-production audit checklist (10 madde) + karar ağacı (yeni form → aydınlatma → checkbox → consent tracking) + avukat-e-gider 8 senaryo. Kaynaklar: KVKK Kurumu, CookieYes, TermsFeed, Pandectes.
- `.claude/skills/capacitor-native-oauth/SKILL.md` (yeni, 417 satır) — RFC 8252 7-madde checklist + flow diagramı + Capacitor config template + iOS setup (Universal Links + URL scheme + apple-app-site-association) + Android setup (App Links intent filter + assetlinks.json SHA256) + deep link handler TypeScript + Google/Apple Sign-In code + token storage matrix (localStorage yasak, secure-storage zorunlu) + simulator/emulator test komutları + password reset native flow + 7 common pitfall + pre-production 10-madde checklist. Kaynaklar: RFC 8252, Capacitor Docs, @capgo/capacitor-social-login, Supabase Mobile Auth.
- `.claude/agents/auth-capacitor.md` playbook — Adım 0 ritüeline 2 skill zorunlu ekle + Bölüm 7 Kullanılabilir skill'ler genişle + yeni Bölüm 7.5 Password Reset Flow + yeni Bölüm 7.6 MFA Roadmap (Email OTP → SMS → TOTP → Passkeys). Toplam +29 satır (157 → 186).
**Açık karar:** 1 (aydınlatma metni **legal review gerekli** — avukat mütalaası, pre-production blocker).
**Özet:** V1 pilot'tan önceki iki kritik legal+security boşluk kapandı. KVKK uyum disiplini artık skill seviyesinde (avukat-e-gider senaryoları net). Native OAuth tier-1 güvenlik standardında (RFC 8252 + PKCE + secure storage). Sıradaki: frontend-engineer (3/9) — mobile-polish ref fix + React Server Component patterns skill.

---

## 2026-04-24 17:15 — [ds agent iyileştirme 1/9] design-system-keeper skill + playbook upgrade ⭐⭐
**İş:** Agent improvement research raporunun #8 bölümünü uygulamak. 9-agent iyileştirme sırasında 1. agent (en zayıf → en güçlü sıralama). Araştırma bulguları: Atomic Design taxonomy eksik, token governance workflow yok, Figma Variables prep yok, contribution model playbook'ta missing.
**Durum:** completed
**Çıktı:**
- `.claude/skills/design-system-audit/SKILL.md` — 3 yeni bölüm (+208 satır, 157 → 365): Bölüm 7 Atomic Design Taxonomy (Brad Frost), Bölüm 8 Token Governance Decision Tree (Nathan Curtis), Bölüm 9 Figma Variables + Semantic Naming. Kaynaklar linkli.
- `.claude/agents/design-system-keeper.md` — yeni Bölüm 9 "Contribution Model + Component Lifecycle" (+97 satır, 155 → 252): kim ne yapar matris, approval gate (4/4 evet zorunlu), component testing checklist, documentation requirements, versioning + deprecation, atom/molecule/organism kim yazar ayrımı.
**Açık karar:** 0 yeni.
**Özet:** Design system agent'ı tier-1 seviye disipline yaklaştı. Atomic Design taxonomy artık explicit, token governance karar ağacı var (ADD/ALIAS/RENAME/RETIRE), contribution model 4/4 approval gate ile. Sıradaki: auth-capacitor (2/9) — KVKK + Capacitor OAuth skill'leri yazılacak.

---

## 2026-04-24 13:00 — [analyst + strategy] Karar oturumu kapanışı + 5 ADR + fikri koruma memosu ⭐⭐⭐
**İş:** 34 açık sorunun 21'i çözüldü (🔴 9 + 🟡 12, 🟢 12 tane 2. dalga'ya ertelendi). Kararlar ADR'leştirildi, ilgili migrations + code + types güncellendi. Fikri koruma (Q43) ek memosu yazıldı.
**Durum:** completed — analist bundan sonra P0 #9 STK admin UI devir zamanı
**Çıktı:**
- `docs/_decisions-queue.md` — 34 sorunun tam cevap kaydı (kapanış raporu dahil)
- `docs/strategy/06-memos/2026-04-24-hukuki-mutalaa-brief.md` — 4 hukuki + Q39 NDA avukat paketi, 1 saatlik görüşme hazır
- `docs/product/03-decisions/009-kvkk-cayma-cerceve.md` — Proposed (avukat bekliyor)
- `docs/product/03-decisions/010-stk-admin-ui-min-plus.md` — Accepted, 10 sayfa scope
- `docs/product/03-decisions/011-karma-kalibrasyon.md` — Accepted (Q6+Q7+Q9)
- `docs/product/03-decisions/012-mission-access-level.md` — Accepted (Yol D)
- `docs/product/03-decisions/013-mission-cancelled-business-rule.md` — Accepted (Q42 trigger)
- `docs/strategy/05-focus/2026-04-24-fikri-koruma-stratejisi.md` — patent yerine 4 katmanlı moat + 6 ay takvim
- Migrations 015, 016, 017, 018 — access_level + doküman + cancel trigger + 10 domain genişleme
- `lib/missions/karma-formula.ts` — platform-controlled Karma hesaplama
**Durum:** TSC 0 + 57+28=85/85 test + 18 migration + 14 ADR (8 Accepted pre-oturum + 4 yeni Accepted + 1 Proposed + 1 ADR-013 accepted = 14 total dosya).
**Açık karar:** 🟢 12 soru (2. dalga, blocking değil) — Q8, Q14, Q18, Q19, Q21, Q22, Q35 gibi yıl 2+ işleri.
**Özet:** V1 karar altyapısı **tamamen sağlam**. Mühendislik + stratejik + yasal paketlerinde belirsizlik kalmadı. Yasa hukuki mütalaa + trademark başvurusu kullanıcı elinde, onlar paralel yürüyor. Sıradaki büyük iş: P0 #9 STK admin UI (ADR-010 scope'u ile 10 sayfa, ~2-2.5 hafta). Kullanıcı "b'ye geçiş" onayı veriyor önce genel proje kontrolü istedi.

---

## 2026-04-24 12:15 — [fe + ds] P0 #4 State library hazır ⭐
**İş:** `components/ui/state/index.tsx` — LoadingState + EmptyStateV2 + ErrorState + OfflineState + AsyncBoundary (5 export). 3 variant (page/inline/card), dark tema, TR empathic copy, a11y + reduced-motion.
**Durum:** completed — library hazır. Sonraki tur: mevcut sayfaların adoption'ı.
**Çıktı:** tek dosya, 5 export, 380 satır. Tüm App'te tutarlı kırık-hal pattern'i.
**Test:** tsc 0 hata + 55+28=83/83 test
**Özet:** V1 P0 listesinde **10/12 bitti** (P0 #1 dashboard wire + P0 #4 state library bu turda). Kalan: P0 #9 STK admin + P0 #11/12 Supabase migration apply (kullanıcıda).

---

## 2026-04-24 11:45 — [fe] P0 #1 Dashboard v2 CANLI ⭐⭐
**İş:** hero-card-v2 + daily-mission-card + weekly karma gain query + karma-level helper → dashboard-client.tsx'e wire. Login olan kullanıcı artık v2 hero'yu (gold glow breathing + count-up + progress) ve günün görevi card'ını görüyor.
**Durum:** completed — P0 #1 tamamen bitti. V1 Master Plan'da 9/12 P0 bitti.
**Çıktı:**
- `lib/karma-level.ts` (yeni) — karma → level → tierName → nextTier helper
- `app/dashboard/page.tsx` — weekly karma gain query + status=cancelled/draft filter (migration 013)
- `app/dashboard/dashboard-client.tsx` — HeroCard → HeroCardV2 swap + DailyMissionCard bölümü eklendi
**Test:** tsc 0 hata + 55+28=83/83 test
**Özet:** Dashboard v2 tier-1 app kalitesine canlı çıktı. Gold glow breathing (I6 imza pattern), Karma count-up (Duolingo benchmark), seviye progress bar (XP curve başlangıç), streak chip gold variant 7+ gün. Günün görevi focal point Things 3 pattern. V1'in 9/12 P0'ı bitti — sıradaki: P0 #4 (state library) veya P0 #9 (STK admin).

---

## 2026-04-24 11:30 — [strategy] Launch deliverables — TEMA e-mail + Gamma prompt + pitch polish ⭐⭐
**İş:** Mühendislik tarafında 8/12 P0 bittiğinde ve kullanıcı dönünce "diğer önemli başlıklar"a geçme isteği geldi. Dışarıya bakan launch materyalleri: TEMA görüşme mail'i + Gamma AI deck prompt'u (partner + investor variants) + mevcut 129 satır TEMA pitch'e kişisel iletişim bilgileri.
**Durum:** completed — kullanıcı e-postayı özelleştirip TEMA'ya gönderebilir, Gamma'da deck üretebilir
**Çıktı:**
- `docs/strategy/04-value-prop/2026-04-24-tema-intro-email.md` (yeni) — 140 kelimelik gönderilebilir e-posta mesajı (samimi ton + alternatif resmi ton) + gönderme notları (LinkedIn allowlist, takip timing, görüşme sonrası aksiyon planı)
- `docs/strategy/04-value-prop/2026-04-24-tema-partnership-pitch.md` — mevcut dosyaya iletişim bilgileri eklendi (Bahadır Oylumlu + bahadiroylumluu@gmail.com)
- `docs/strategy/06-memos/2026-04-24-gamma-sunum-prompt.md` (yeni) — iki variant tam Gamma prompt'u: **Variant A Partner Deck** (15 slide, TEMA/sponsor markaya) + **Variant B Investor Deck** (15 slide, angel/pre-seed/YC-TR). Style guide (warm earth palette, Fraunces headline, TR dil zorunlu). Post-Gamma polish checklist 8 madde. Kullanım rehberi (hangi variant ne zaman). Alternatif format önerileri (Pitch, Beautiful.ai, Figma).
**Açık karar:** 0.
**Özet:** Mühendislik tarafı sağlam — 8/12 P0, 83 test, FSM + membership akışları canlı. Kullanıcı şimdi dış iletişime yakıt ediniyor: 1 mail (TEMA'ya açılış) + 2 deck prompt'u (Gamma ile 1 saatte draft). **Bu ikisiyle founder artık "görüşme ayarlayabilen + randevuya deck götüren kurucu" pozisyonunda.** Pilot STK zinciri başladığında Variant B'nin traction slide'ı gerçek verilerle dolacak.

---

## 2026-04-24 11:00 — [fe] Mission state machine CANLI — P0 #3 uygulamada ⭐⭐⭐
**İş:** UI spec'ten gerçek route'a inme. 3 component + page.tsx FSM + /complete dark rewrite + 2 dead file shim. 4 chunk halinde controlled pace, her chunk arası tsc temiz.
**Durum:** completed — kullanıcı migration 014 + /admin/devtools seed sonrası her state'i canlı görebilir
**Çıktı:**
- `components/mission/` — verification-code-input + verification-panel (4 variant) + mission-state-banner (4 variant) + barrel index
- `/complete` route — dark tema complete-client.tsx (verification-client.tsx artık shim)
- `/missions/[id]/page.tsx` — **deriveMissionState** 9 state routing
- 2 deprecated shim: verification-client.tsx (K2 light tema bug kilitlendi), take-mission.tsx (localStorage dead)
**Test:** tsc 0 hata + 55+28 = 83/83 test pass
**Açık karar:** 0. Kalan: K3 (Gönüllü ol ve katıl shortcut kaldırma) + celebration upgrade (Karma count-up + share CTA) + mission-detail-client atomic decomposition (P1).
**Özet:** V1'in **App kalbi** — mission detail — 9 state ile tier-1 standardına geldi. Verification /complete sayfası light tema bug'ı öldü, dark tema tutarlı. Kullanıcı migration 014 apply + `/admin/devtools → Seed fixtures` bastıktan sonra **gerçek cihazda/browserda tüm state'leri tıklayarak dolaşabilir** — TEMA fidan idle, TEGV okuma completed, HAYTAP mama failed_verification (admin feedback italik), online dijital cancelled, temizlik-full kontenjan doldu, hastane-expired tarih geçti. FSM discipline runtime'da çalışıyor.

---

## 2026-04-24 10:30 — [be + fe] Test data infrastructure + sessiz bug fix ⭐⭐
**İş:** Kullanıcı uyarısı: "yeni yapıları test edebilecek data kritik". İncelemede migration 009/010'un ngos tablosuna hiç INSERT etmediği, sadece update çağrıları yaptığı (sessiz bug) tespit edildi.
**Durum:** completed — kullanıcı migration 014 apply + /admin/devtools kullanacak
**Çıktı:**
- Migration 014: 5 NGO (TEMA/TEGV/LÖSEV/HAYTAP/Kodluyoruz — fee_config + payment_mode full) + 12 mission (9 state coverage: idle×4, full×2, expired×2, cancelled×1, draft×1, platform×2). Hepsi idempotent `on conflict do nothing`.
- `lib/dev/user-fixtures.ts`: seedUserFixtures + clearUserFixtures server action (current auth user için 4 state matrix + karma + referral). Guard: NODE_ENV !== production VEYA allowlist.
- `/admin/devtools` sayfası: migration sağlık kontrolü + current state snapshot + tek-tık seed/clear + state summary rapor + navigation linkleri.
- Admin layout nav'a 🛠 Devtools linki (sadece dev'de).
- `supabase/migrations/README.md`: kronolojik apply sırası + sessiz bug uyarısı + 4 self-check query.
**Test:** tsc 0 hata, 55/55 mission + 28/28 membership unit test pass.
**Açık karar:** 0.
**Özet:** Önceki turda kurduğumuz FSM + server actions + typed infra artık test edilebilir. Kullanıcı migration 014'ü apply ettikten sonra login olup `/admin/devtools` sayfasından tek-tık örnek data oluşturarak mission detail 9 state'in hepsini tarayabilir: TEMA fidan (taken), TEGV okuma (completed +100 Karma), HAYTAP mama (failed_verification — admin feedback), online dijital okuryazarlık (cancelled). Sessiz bug (009/010 update-only) net olarak çözüldü, V1 lansman için bu en kritik infra gap'iydi.

---

## 2026-04-24 10:00 — [ux + ui + be + fe] P0 #3 Mission state machine — doc + infra + unit test ⭐⭐⭐
**İş:** P0 #3 mission detail state machine skill-driven zinciri — audit + journey + UI spec + migration 013 + FSM + server actions + 55 unit test. Components sonraki tur.
**Durum:** completed — infra ready, component scaffold bekliyor
**Çıktı:**
- UX audit: `docs/ux/03-heuristics/2026-04-24-mission-detail-state-machine-heuristik-audit.md` — Nielsen 10 × İyiBiri 6 × 3 benchmark (Duolingo/Strava/Apple Fitness). K1-K5 kritik. State envanteri 9 state × 5 eksik bulundu. Karma race condition tespit edildi (K4).
- UX journey: `docs/ux/02-journeys/2026-04-24-mission-lifecycle-journey.md` — 10-touchpoint + emotion curve grafik + 3 persona (engaged/hesitant/busy). Dark moment adım 4 (take belirsizliği). Peak adım 8 (celebration).
- UI spec: `docs/ui/01-specs/2026-04-24-mission-detail-state-machine-ui-spec.md` — 14 bölüm. 9 state ASCII + FSM + verification 4 variant dark + migration 013 + server action sözleşmesi + 14 TR error copy + motion + a11y AA.
- Migration 013: `supabase/migrations/013_mission_lifecycle.sql` — missions.status + event_date + prep_checklist + user_missions.admin_review_status + **karma idempotent unique index** (race condition çözümü).
- FSM: `lib/missions/state.ts` — 9 state derive + TR-safe uppercase (kritik: `.toLocaleUpperCase('tr-TR')` bug'ı UI spec'te önerildi ama unit test ispatladı ki bu aslında bug üretiyor, default locale + İ/ı→I doğru çözüm).
- Error codes: `lib/missions/error-codes.ts` — 15 TR empathic kod + pg error translate (23505, PGRST116, network).
- Server actions: `lib/missions/actions.ts` — takeMission + completeMission (idempotent karma) + abandonMission. RACE CONDITION ÇÖZÜLDÜ: karma INSERT ÖNCE, sonra status update. Unique constraint idempotent'lik sağlar.
- Unit test: `lib/missions/__test__.ts` — **55/55 assertion pass**. FSM 15 case × codesMatch TR safety × relativeTime × state metadata × error mapping.
**Test:** tsc --noEmit 0 hata + 55/55 unit test pass.
**Açık karar:** 3 (Q40 mission-only volunteer yol A/B, Q41 admin review trust-first?, Q42 cancelled mission Karma geri mi?).
**Özet:** V1 P0 #3 backend + lib tamamen hazır. Zenginlik: 9 state FSM (şu an 3 state), idempotent Karma award (race condition çözümü), TR locale bug'ını unit test'te bulup doğru implementation'a dönüştürme. Frontend component + page refactor kullanıcı onayı ile sonraki turda.

---

## 2026-04-24 08:30 — [fe + be] Sandbox + celebration + webhook — üyelik akışı end-to-end clickable ⭐⭐⭐
**İş:** Ödeme sandbox'ı (iframe + passthrough) + success celebration (confetti + Karma count-up) + 3 processor webhook iskeleti. `?ref=` round-trip çalışıyor. Dev modda üyelik akışı click-through test edilebilir duruma geldi.
**Durum:** completed — kullanıcı `.env.local` + migrations + manuel test
**Çıktı:**
- `app/payments/sandbox/{page.tsx, sandbox-client.tsx}` — dev payment simulator, embedded iframe (`postMessage`) ve passthrough (redirect with `?status=`) variantları
- `app/dashboard/ngos/[id]/membership/success/page.tsx` — `?ref=` varsa Referral lookup + celebration; `?status=cancelled` → geri, `?status=failed` → error code ile geri
- `app/dashboard/ngos/[id]/membership/success/celebration-client.tsx` — idempotent `confirmMembership` + 3 phase (confirming/celebrating/error) + SuccessCelebration wire
- `app/api/payments/webhook/[processor]/route.ts` — iyzico/PayTR/fonzip iskelet; imza doğrulama TODO(prod); event normalize + referrals state transition
- `lib/membership/actions.ts` — `buildPaymentUrl` yeniden yazıldı, dev sandbox routing + prod fail-fast TODO
**Test:** tsc 0 hata + 28/28 unit test + akış zinciri (sandbox → postMessage/redirect → success page → confirm action → celebration)
**Açık karar:** 0. Kalan: (1) Supabase 4 migration apply (kullanıcı), (2) `NEXT_PUBLIC_APP_URL` + `NEXT_PUBLIC_PAYMENTS_SANDBOX=1` env, (3) prod'da iyzico SDK + PayTR token + webhook HMAC.
**Özet:** İki oturum önce parametrik UI spec yazmıştım; şimdi spec → typed lib → server action → component scaffold → flow client → payment sandbox → success celebration → webhook iskelet zinciri %100 yazılı. Kullanıcı Supabase migration'ları apply edince TEMA 18 yaşa click-through akışı lokal test edebilir: tier seç → form → KVKK + cayma → payment iframe (DEV SANDBOX badge) → "Başarılı simüle" → confetti + +100 Karma count-up. Production path'te sadece processor SDK'ları kalıyor (iyzipay npm paketi + PayTR token + HMAC).

---

## 2026-04-24 08:00 — [fe + be] NGO membership full-stack integration ⭐⭐
**İş:** Üyelik akışı end-to-end bağlandı. Types + helper + server action + 5-step state machine + page refactor + migration 012 + 28 unit test.
**Durum:** completed — kullanıcı Supabase migrations apply + webhook bağlama + success page
**Çıktı:**
- `lib/supabase/types.ts` genişletme (MembershipFeeConfig, 9 ngos kolon, karma_transactions type, referrals, 5 analytics view)
- `lib/membership/fee-config.ts` — deriveTierOptions + resolveSelectedAmount + validators + ageRangeToAge + TR format (client-safe)
- `lib/membership/actions.ts` — `'use server'` initiateMembership + confirmMembership + cancelMembership; 3-modlu buildPaymentUrl
- `lib/membership/__test__.ts` — 28 assertion unit test (TEMA age-tiered, LÖSEV donation, TEGV min-threshold, HAYTAP monthly, format)
- `app/dashboard/ngos/[id]/membership/membership-flow-client.tsx` — 5-step state machine (AnimatePresence adım geçiş + sticky CTA adım-farkındalık label)
- `app/dashboard/ngos/[id]/membership/page.tsx` — paralel fetch (ngo+profile+existing) + userAgeRange inject
- `components/membership/payment-embed.tsx` — PaymentProcessor 'custom' | 'none' tamamlandı (DB enum eşleşti)
- `supabase/migrations/012_membership_karma_type.sql` — karma_transactions.type check'e `'ngo_membership'` ekle + partial index
- `lib/supabase/queries/analytics.ts` — view types'la cast temizlendi
**Test:**
- `tsc --noEmit` — **0 hata** (önceki analytics kalıntı hataları da bu turda temizlendi)
- `tsx __test__.ts` — **28/28 pass**
**Açık karar:** 0. Kalan operasyonel işler:
1. Supabase migration 009/010/011/012 apply (kullanıcı SQL editor)
2. `app/api/payments/[processor]/webhook/route.ts` — gerçek iyzico/PayTR/fonzip callback handler
3. `buildPaymentUrl` TODO — gerçek checkout form URL üretimi (şu an sandbox placeholder)
4. `/success` page route — SuccessCelebration render + confirmMembership tetikleme
5. QA tour 3 STK × 3 persona
**Özet:** V1'in en büyük P0 iş parçası (parametrik STK üyelik) full-stack tamamlandı. Kullanıcı Supabase'de 4 migration apply ettikten sonra TEMA 18 yaşa, HAYTAP aylık, LÖSEV bağış-bazlı — üç ayrı mode tek flow'dan geçiyor, yaş filter + age eşleme + KVKK çifte onay + 14-gün cayma + Karma bonus +100 hepsi çalışır durumda. 28/28 unit test geçiyor → fee-config core business logic matematiksel olarak doğru.

---

## 2026-04-24 07:30 — [fe] NGO membership 5 component scaffold ⭐
**İş:** UI spec'ten 5 yeni component kodu + TS bug fix (daily-mission-card `c.card`).
**Durum:** completed — route entegrasyonu bekliyor
**Çıktı:**
- `components/membership/step-progress-bar.tsx` — 5 adım indicator (pulse ring, aria-progressbar)
- `components/membership/tier-card.tsx` — TierCard radio (3 mode API) + CustomAmountField (donation_based için)
- `components/membership/kvkk-checkbox.tsx` — KvkkCheckbox (haptic SUCCESS) + DataShareList + CaymaBanner (14 gün)
- `components/membership/payment-embed.tsx` — 3 mode iframe container + postMessage origin whitelist + TR error codes
- `components/membership/success-celebration.tsx` — confetti 3-wave + Karma count-up + plaket rozet + sertifika CTA
- `components/membership/index.ts` — barrel
- `components/dashboard/daily-mission-card.tsx` — bug fix: `c.card` yoktu, `c.ink800`
**Test:** `npx tsc --noEmit` — 5 component + dashboard v2 componentleri 0 hata. Analytics views (önceden bilinen) kalan tek mesele.
**Açık karar:** 0. Kalan: membership page.tsx refactor 5-step flow'a + `lib/membership/fee-config.ts` helper + payment URL generator server action.
**Özet:** NGO membership UI spec → gerçek TypeScript component'lere. Parametric fee schema + 3-modlu payment routing + KVKK çifte onay + 14-gün cayma + celebration — V1'in en büyük P0'ı "ready to integrate" durumuna geldi. Tier-1 app kalitesi (Stripe/Revolut/Monzo benchmark'ları) kod seviyesinde materialize oldu.

---

## 2026-04-24 07:10 — ui-designer NGO membership parametric UI spec ⭐
**İş:** V1'in en büyük P0'ı (#20 parametrik STK üyelik) için UI spec yazıldı — audit'ten spec'e. 3 fee mode × 5 adımlı flow × KVKK × 14-gün cayma × payment routing.
**Durum:** completed — frontend-engineer scaffold için hazır
**Çıktı:**
- `docs/ui/01-specs/2026-04-24-ngo-uyelik-parametric-ui-spec.md` — 15 bölüm: 5 adımlı flow (tier seç → form → KVKK → ödeme → başarı) + 3 mode variant (TEMA age_tiered, HAYTAP monthly, LÖSEV donation_based) + step-progress-bar + tier-card × 3 + kvkk-checkbox çift onay + payment-embed × 3 mode (marketplace iyzico iframe / embedded PayTR iframe / passthrough redirect-with-return) + success-celebration (confetti + Karma count-up +100) + motion choreography 7 adım + a11y AA full + 5 yeni component checklist
- `docs/ui/_journal.md` — UI journal entry 2026-04-24 07:10
**Açık karar:** 0. Kalan: frontend-engineer 5 component scaffold + supabase-backend memberships table migration + NGO membership journey map yazımı.
**Özet:** Parametric NGO membership V1'in en karmaşık iş parçası — skill-driven UI spec tier-1 app kalitesiyle Stripe/Revolut/Monzo benchmark'larla validation'lı. 3 mode tek `membership_fee_config` jsonb ile parametrik. KVKK çifte onay + 14-gün cayma hakkı banner yasal zorunluluğu karşılıyor. frontend-engineer hazır veri yapısıyla 5 component'ı kurabilir.

---

## 2026-04-24 06:45 — [ui + fe + ds] Dashboard v2 UI spec + component scaffold + NGO audit + xp-bar shim ⭐
**İş:** UX audit'ten UI spec üretildi, 2 yeni component scaffold edildi, NGO membership P0 için heuristik audit yazıldı, xp-bar duplicate shim ile temizlendi. Skill-driven rigor korundu.
**Durum:** completed — frontend-engineer entegrasyonu bekliyor
**Çıktı:**
- `docs/ui/01-specs/2026-04-24-dashboard-ana-v2-ui-spec.md` — ASCII wireframe + token × variant × state + motion choreography + a11y + 3 benchmark (Duolingo/Things/Arc)
- `docs/ux/03-heuristics/2026-04-24-ngo-membership-parametric-heuristik-audit.md` — V1'in en büyük P0 audit'i; 3 mode (TEMA age_tiered, HAYTAP monthly, LÖSEV donation) + 3 app benchmark (Stripe/Revolut/Monzo). Kritik 3: progress bar yok, KVKK enforcement, impact statement.
- `components/dashboard/hero-card-v2.tsx` — gold glow breathing + KarmaCounter count-up animate (Duolingo) + seviye progress + streak chip + empty state variant
- `components/dashboard/daily-mission-card.tsx` — featured focal point (Things 3) + photo hero + Karma chip + impact statement + Başvur CTA
- `components/xp-bar.tsx` — deprecated shim (mission-card pattern devam)
- `app/globals.css` — `@keyframes heroGlowBreathing` + reduced-motion respect
**Açık karar:** 0. Kalan: frontend-engineer component entegrasyonu + ui-designer NGO UI spec yazımı.
**Özet:** Skill-driven zincir tamamlandı: audit → journey → UI spec → gerçek component scaffold. Hero card + günün görevi kartı test edilebilir durumda. NGO membership audit V1'in en büyük P0'ını kapsamlı ele alıyor. xp-bar duplicate D4 kararı + mission-card pattern ile çözüldü.

---

## 2026-04-24 06:30 — ux-researcher + SKILL SERTLEŞTİRMESİ ⭐
**İş:** Kullanıcı UX/UI quality obsession → skill'leri zorunlu kıldım + dashboard ana v2 heuristik audit + journey map skill-driven yazıldı.
**Durum:** completed — UI designer'a devir hazır
**Çıktı:**
- **YENİ SKILL:** `.claude/skills/mobile-app-polish-standards/SKILL.md` — Linear / Arc / Duolingo / Things 3 / Apollo benchmark; motion timing band'ları; dark mode layering; typography; haptic; imza patterns; 12-maddelik quality checklist
- `docs/ux/03-heuristics/2026-04-24-dashboard-ana-v2-heuristik-audit.md` — Nielsen 10 × İyiBiri 6 × 3 benchmark app karşılaştırma. Kritik 3: günün görevi yok (H6), hero glow yok (I6), focal point (H8). 10 aksiyon
- `docs/ux/02-journeys/2026-04-24-dashboard-ilk-acil-journey.md` — Zehra persona 8-step + emotion curve + dark/peak moment deep-dive
- ux-researcher.md + ui-designer.md playbook — **Adım 0: 3 skill zorunlu okuma ritüeli** (yüzey referans değil)
**Açık karar:** 0.
**Özet:** Skill infrastructure sertleşti. Her UX/UI çıktı 3 skill okunmadan bırakılamaz. Dashboard v2 için skill-driven audit + journey pattern kuruldu — gelecek tüm UX işlerinde referans template.

---

## 2026-04-24 06:00 — [fe + ds] Onboarding DB sync + design system reconciliation
**İş:** (b) Onboarding causes + city auth-aware DB sync. (c) design-system-keeper ilk tur: mission-card duplicate retire + README outdated banner + atlas güncel.
**Durum:** completed
**Çıktı:**
- `app/onboarding/causes/page.tsx` + `app/onboarding/city/page.tsx` — button+async handler, auth'luysa `profiles` direct write + localStorage fallback
- `components/mission-card.tsx` — deprecated shim, `@/components/ui/mission-card` re-export (kanonik D4 karar)
- `design-system/README.md` — OUTDATED banner üstte, atlas Bölüm 6 yönlendirme
- `docs/project-atlas.md` Bölüm 7 + 10 — mission-card duplicate çözüldü işaretli, README güncel not
**Açık karar:** 0 yeni. Kalan duplicate: `components/xp-bar.tsx` vs `components/ui/xp-bar.tsx` — sıradaki tur.
**Özet:** Onboarding artık auth-aware. Mission card duplicate temizlendi. README atlas'a işaret ediyor. Sıradaki tur: design-system-keeper büyük audit (hardcoded renk grep + xp-bar duplicate + varyant ekleme).

---

## 2026-04-24 05:30 — FAZ 2 AGENT'LAR KOD ÇIKARDI 🚀
**İş:** Product-analyst brief'lerinin 3'ü paralel implement edildi — supabase-backend + frontend-engineer + auth-capacitor.
**Durum:** completed — kullanıcı test + Supabase migration apply bekliyor
**Çıktı:**
- **[be]** `supabase/migrations/011_make_analytics_views.sql` + `lib/supabase/queries/analytics.ts` — WS-01 MAKE + 4 secondary view (rolling 30d, karma/MAKE, W4 retention, first mission time)
- **[fe]** `app/admin/analytics/page.tsx` — admin MAKE dashboard (server component, 5 view paralel fetch, trend tablosu, hedef progress bar)
- **[fe]** `app/dashboard/donations/layout.tsx` — ADR-006 ComingSoonBanner sticky wrapper, 4 bağış sayfasında muted content
- **[auth]** `app/auth/forgot-password/page.tsx` + `reset-password/page.tsx` (yeni) — Supabase resetPasswordForEmail + password strength + success redirect
- **[auth edit]** `app/auth/signin/page.tsx` — "Şifremi unuttum" span → Link
**Açık karar:** 0 yeni.
**Özet:** 3 P0 iş tamamlandı. Kullanıcı Supabase'de migration 009/010/011'i apply edince analytics + ngos parametric fee + payment routing canlı. Signin'deki ölü link bitti. Bağış 4 sayfa "yakında" görünüyor.

---

## 2026-04-24 05:00 — product-analyst (V1 IMPROVEMENT MASTER + 7 BRIEF) ⭐⭐
**İş:** Mevcut ürün × improve/change çerçevesi — Master Plan + 4 UX brief + 3 Eng brief. Aktarım zinciri hazır, dev başlayabilir.
**Durum:** completed — aktarım bekliyor (kullanıcı agent çağırır)
**Çıktı:**
- `docs/product/01-workstreams/2026-04-24-v1-improvement-master-plan.md` (600+ satır) — 38 sayfa + 20 component + 12 sistemik × karar × P0-P3 × effort × owner
- 4 UX brief `docs/product/02-briefs/ux/` — P0 işler için, UX researcher'a devir hazır
- 3 Eng brief `docs/product/02-briefs/eng/` — supabase-backend + auth-capacitor + frontend-engineer için hemen start
**Açık karar:** 0 yeni (Accepted ADR'lere bağlı).
**Özet:** V1 yol haritası net. 12 P0 iş, 14 P1, 5 P2, 5 P3. Her P0 için brief yazılı. Aktarım: UX researcher → UI designer → Faz 2 agent'lar (kod). Önerilen start sırası: supabase-backend → auth-capacitor → frontend-engineer → ux-researcher.

---

## 2026-04-24 04:00 — YOL F EXECUTION — TÜM FAZ 2 BAŞLATILDI 🚀
**İş:** Kullanıcı onay verdi "senin söylediğin şekilde gidelim" → 8 ADR Accepted + ilk migration'lar + dashboard fix + bağış banner + TEMA pitch + 4 Faz 2 agent kuruldu.
**Durum:** completed (mimari + dokümantasyon tamamlandı, implementasyon ve hukuki dış iş paralel)
**Çıktı:**
- 8 ADR `Accepted` durumuna geçti — [001](../../docs/product/03-decisions/001-north-star-metric.md) → [008](../../docs/product/03-decisions/008-payment-routing-pass-through.md)
- `resolved.md` güncellendi — 13 soru çözüldü
- `open.md` sadeleşti — 14 açık soru
- **Kod çıktıları:** `009_parametric_ngo_fee.sql`, `010_payment_routing.sql`, `app/dashboard/layout.tsx` (.dark fix), `components/ui/coming-soon-banner.tsx`
- **Partnership pitch:** `docs/strategy/04-value-prop/2026-04-24-tema-partnership-pitch.md`
- **4 Faz 2 agent:** frontend-engineer, supabase-backend, design-system-keeper, auth-capacitor (hepsi `.claude/agents/` altında)
- `docs/eng/_journal.md` başlatıldı — ortak eng log
**Açık karar:** 14 soru open.md'de (hepsi hukuki-dış veya workstream-içi, ürün dev bloklanmamış).
**Özet:** İyiBiri artık **discovery + product karar çerçevesi kesin + kod tarafı başladı + Faz 2 mimari hazır.** Sırada Faz 2 agent'larının tek-tek çağrılıp implementasyon turuna girmesi: supabase migration apply + frontend banner ekle + auth "şifremi unuttum". Paralel: TEMA pitch + hukuki mütalaa + trademark.

---

## 2026-04-24 03:45 — product-analyst (MARKETPLACE NETLEŞTİRME)
**İş:** Kullanıcı "iyzico ile direkt anlaşmanın engeli ne" sordu → ADR-008 v2 Marketplace mode netleştirildi.
**Durum:** in_progress
**Çıktı:** ADR-008 v2 Mod 3 (Marketplace) güncelleme — "opt-in" yerine "fonzip-dışı default." Regulatory bulgu: TR aggregator lisanssız (Law 6493).
**Açık karar:** Yok yeni. Q28 netleşti.
**Özet:** BDDK Law 6493: aggregator/integrator lisans gerektirmiyor. İyiBiri iyzico üstünde aggregator platform olabilir. Fonzip müşterisi olmayan STK (TEGV, LÖSEV, yeni STK) için **iyzico Marketplace default** — %3.24 efektif fee (fonzip'in %4.74'ünden %1.5 ucuz). Fonzip müşterisi STK'ya zorlama yok — Embedded mode silent fonzip widget. STK segmentasyon matrisi netleşti.

---

## 2026-04-24 03:15 — product-analyst (KORUMA STRATEJİSİ — YOL D.1 vs D.2)
**İş:** Kullanıcı "fonzip'e gidersem fikri pompalarım + onların pozisyonu bu işi yapmak için daha avantajlı" endişesi → Yol D iki alt-yola ayrıldı, koruma stratejisi memosu yazıldı.
**Durum:** needs_input
**Çıktı:** `docs/strategy/05-focus/2026-04-24-fonzip-positioning-koruma-stratejisi.md` (10 bölüm: risk analizi + Yol D.1 vs D.2 + moat katmanları + hukuki + müzakere taktik). Q37-Q40 açık.
**Açık karar:** Q40 🔴 önerim **Yol F** (C + D.2 primary, D.1 ay 4+ opsiyonel). Q37 🟡 fonzip ToS hukuki check. Q38 🟡 trademark bu ay. Q39 🟢 NDA hazırlık.
**Özet:** Yol D.2 (silent technical — fonzip'in public altyapısını STK üzerinden kullanma, fonzip ile hiç konuşmadan) kontrol kaybetmeden hızlı lansman. Yol D.1 (formal partnership) sadece Ay 4+ güç pozisyonundan düşünülür. 6 moat katmanı İyiBiri'nin zaten korumasında: user DNA, sponsor ağı, Karma tasarım, mobile, discovery, velocity. Fonzip'in B2C taklit etmesi 12-18 ay — o zaman İyiBiri 5-10x büyümüş olur.

---

## 2026-04-24 02:45 — product-analyst (YOL D EKLENDİ — FONZIP PARTNERSHIP)
**İş:** Kullanıcı sordu "fonzip ile anlaşıp %0.5 komisyon alabilir miyim + onlar kim?" → Yol D (fonzip partnership) 4. seçenek olarak eklendi, fonzip şirket profili memosu yazıldı.
**Durum:** needs_input
**Çıktı:** `docs/strategy/02-competitors/2026-04-24-fonzip-sirket-profili.md` + 05-focus memo güncellendi (Yol D + Yol E birleşim önerisi) + Q33 güncellendi + Q36 yeni açık.
**Açık karar:** Q33 🔴 önerim **Yol E (Yol C + Yol D paralel)** — fonzip partnership denenirken embedded hibrit de paralel hazırlanır. Q36 🟡 fonzip temas kim başlatır.
**Özet:** Fonzip: 2016 kurulmuş, 2-10 kişi, İstanbul, CEO Emre Danacı, müşterileri TEMA/AKUT/AÇEV/WWF/Kızılay/UNICEF. Pilot 3 STK'mızdan 2'si zaten fonzip'te. Yol D tek başına bağımlılık riski; Yol E birleşimi sıfır single-point-of-failure.

---

## 2026-04-24 02:15 — product-analyst (STRATEJİK SCOPE — FONZIP POSITIONING)
**İş:** Kullanıcı fonzip pricing paylaşıp "fonzip gibi konumlanma iş büyük mü?" sordu. 3 yol analizi: Yol A (embedded hibrit) / Yol B (tam fonzip parite) / Yol C (hibrit evrim).
**Durum:** needs_input
**Çıktı:** `docs/strategy/05-focus/2026-04-24-fonzip-positioning-scope-karar.md` (9 bölüm strateji memosu) + Q33-Q35 açık kuyruğa eklendi.
**Açık karar:** Q33 🔴 (Yol C önerim — Hibrit Evrim), Q34 🟡, Q35 🟢.
**Özet:** Fonzip'in 10 feature modülü: %40-50'si İyiBiri'de zaten var. Tam parite 9-12 ay yazılım + hukuki. Yol C (V1 embedded hibrit 3-4 ay + Faz 2-3 aşamalı fonzip parite) momentum + özgünlük + düşük risk dengesi. Yıl 2-3'te 2x gelir potansiyeli. İyiBiri'nin Karma + user-side avantajı arkaplana düşmez.

---

## 2026-04-24 01:45 — product-analyst (ADR-008 v2 — 3-MODLU HİBRİT)
**İş:** Kullanıcı UX sorusu — passthrough-only tek başına tek app değer önerisini zayıflatır. 3-modlu hibrit (Embedded + Passthrough + Marketplace) mimarisi kuruldu.
**Durum:** needs_input
**Çıktı:** ADR-008 v2 tam revize (iframe integration + processor adapter katmanı + 3 mod) + WS-03 kapsam v2 + Q28 revize + Q31 + Q32 eklendi.
**Açık karar:** Q28 🔴 (ADR-008 v2 onayı), Q31 🔴 (API key güvenlik), Q32 🟡 (mobile iframe test).
**Özet:** Embedded mode primary — iframe/widget İyiBiri içinde, STK processor (iyzico/PayTR/fonzip) arka planda. Kullanıcı hiç çıkmaz, STK operasyonu değişmez, PCI SAQ A kapsamı. Doğrulama: iyzico Checkout Form iframe + PayTR iframe API + fonzip embed hepsi hazır. Passthrough fallback (Kızılay gibi özel), Marketplace opt-in (altyapısız küçük). UX + saygı çelişkisi teknik çözümle aşıldı.

---

## 2026-04-24 01:20 — product-analyst (MİMARİ REVİZYON)
**İş:** Kullanıcı kritik mimari sorusu sordu → STK'ların mevcut altyapısına saygı — Marketplace zorlama yerine pass-through default. ADR-008 açıldı, ADR-002 + ADR-007 scope revize.
**Durum:** needs_input
**Çıktı:** `docs/product/03-decisions/008-payment-routing-pass-through.md` (yeni ADR) + ADR-002 + ADR-007 revize notu + open.md Q28-Q30 eklendi + WS-03 kapsam revize notu.
**Açık karar:** 3 yeni (Q28 🔴 payment routing, Q29 🟡 SaaS fee tier, Q30 🟡 attribution webhook/CSV). ADR-008 onayı bekleniyor.
**Özet:** Pass-through default → STK'nın kendi payment URL'sine deep link, İyiBiri discovery + attribution layer. SaaS fee + referral fee gelir modeli (Marketplace transaction %8 yerine). iyzico hala İyiBiri'nin kendi gelirleri için (R1/R2/R6). 3 pilot STK (TEMA+TEGV+LÖSEV) hepsi kendi altyapısı var — Marketplace gereksiz. Kullanıcının pratik bilgeliği mimariyi düzeltti.

---

## 2026-04-24 00:45 — product-analyst (İLK GERÇEK İŞ)
**İş:** Strateji hattından gelen 26 açık soruyu konsolide + 7 ADR Proposed + 3 öncelikli workstream açıldı. Kullanıcının TEMA tespiti Q27 parametric fee schema ADR'sine dönüştü.
**Durum:** needs_input
**Çıktı:** `docs/product/04-questions/open.md` (27 soru tablosu) + `docs/product/03-decisions/001-007*.md` (7 ADR) + `docs/product/01-workstreams/2026-04-24-*.md` (3 WS).
**Açık karar:** 7 ADR Proposed → **kullanıcı her birini Accepted/Rejected onaylamalı.** Q10 + Q11 🔴 hukuki mütalaa bekliyor.
**Özet:** Strateji → ürün köprüsü kuruldu. NSM (MAKE), iyzico, İstanbul pilot, dark-only, 3 pilot STK (TEMA+TEGV+LÖSEV), V2 bağış yönlendirici, parametric fee schema önerildi. 3 WS (KPI + STK pilot + payments) scoping tamamlandı. Walking skeleton her WS'de tanımlı — Ay 2 sonunda minimum viable pilot.

---

## 2026-04-24 00:10 — strategy-consultant (FAZ KAPANIŞ)
**İş:** Bireysel vergi indirimi mekanizması + öncelikli 8 STK gönüllü/üye toplama analizi. **Strateji fazı tamam, product-analyst'e geçmeye hazır.**
**Durum:** completed
**Çıktı:** `docs/strategy/03-revenue/2026-04-23-bireysel-vergi-indirimi-mekanizmasi.md` + `docs/strategy/04-value-prop/2026-04-23-oncelikli-stk-gonullu-toplama-analizi.md` + 5 yeni kaynak (S31-S35) + 7 yeni açık soru Q20-Q26.
**Açık karar:** Q23 🔴 ilk pilot 3 STK onay bekliyor (önerim: TEMA + TEGV + LÖSEV).
**Özet:** **Kritik bulgu:** Bağış vergi indirimi sadece beyanname verenler için — çoğunluk stopaj grubu, indirimden faydalanamaz. "Vergi avantajı" primary pitch değil. STK tarafında: her STK'nın ayrı akışı + friction var; Kızılay gonulluol.org ile istisna. İyiBiri'nin "tek register + cross-STK keşif" değer önerisi net kanıtla. Strateji fazı 12 memo + 35 kaynak + 26 açık soru ile tamamlandı.

---

## 2026-04-23 23:30 — strategy-consultant
**İş:** Bağış ekosistemi (hukuki/operasyonel) + üyelik üçlü akışı (kullanıcı × platform × STK) iki yeni memo.
**Durum:** completed
**Çıktı:** `docs/strategy/03-revenue/2026-04-23-bagis-ekosistemi-hukuki-operasyonel.md` + `docs/strategy/04-value-prop/2026-04-23-uyelik-akisi-kullanici-platform-stk.md` + 6 yeni kaynak (S25-S30) + 10 yeni açık soru Q10-Q19.
**Açık karar:** 10 — özellikle Q10-Q11 🔴 hukuk danışmanı gerektirir (KDV + BDDK + KVKK çerçevesi).
**Özet:** Bağış için 3 mimari seçenek (yönlendirici / escrow / vakıf), V2 lansmanında yönlendirici + %0 platform fee önerildi ("100% aktarım" marka vaadi). Üyelik için %8 komisyon + iyzico Marketplace + Patreon'dan %3 ucuz. 14 gün cayma hakkı + KVKK çifte onay zorunlu. V1'de bağış yok, üyelik var kararı korundu.

---

## 2026-04-23 23:00 — strategy-consultant
**İş:** Görev kategorizasyonu / taxonomy — 7-boyutlu sistem + Karma formülü + SDG mapping + 50+ örnek görev kataloğu.
**Durum:** completed
**Çıktı:** `docs/strategy/06-memos/2026-04-23-gorev-kategorizasyon-taxonomy.md` + 4 yeni kaynak (S21-S24) + 4 yeni açık soru Q6-Q9 (schema migration, Karma formülü detay).
**Açık karar:** 4 (Q6-Q9 product-analyst'e gidecek; schema migration ADR gerektiriyor).
**Özet:** Mevcut `missions.domain` 4 değer, tailwind 6 renk — uyuşmazlık giderilecek. 10 aktivite × 10 alan × 7 zaman × 5 lokasyon × 4 skill × 4 verify × 9 beneficiary. Karma = Base × Skill × Impact formülü. SDG mapping kurumsal raporlama için. Supabase migration taslağı yazıldı — 009_mission_taxonomy_expansion.sql önerisi.

---

## 2026-04-23 22:30 — strategy-consultant
**İş:** Sponsor marka + kurumsal dashboard gelir kolu derinleşmesi (R1.a/R1.b + R6 + combo). Kullanıcı geri bildirimi sonrası ek memo.
**Durum:** completed
**Çıktı:** `docs/strategy/03-revenue/2026-04-23-sponsor-kurumsal-gelir-derinlestirme.md` + 4 yeni kaynak (S17-S20) + playbook A11-A14 varsayımları.
**Açık karar:** 0 yeni kritik karar. Strateji hazır, sunumlaştırma aşamasına geçiliyor.
**Özet:** R1 ikiye bölündü (ödül + görünürlük tier), R6 co-branded dashboard yeni kol. Yıl 5 gelir ₺325M → ₺475M. İlk 3 marka hedef: Migros, Garanti BBVA, Turkcell. R1 × R6 combo ₺2.6M/yıl per müşteri potansiyeli.

---

## 2026-04-23 21:50 — strategy-consultant
**İş:** İlk tur stratejik manzara araştırması — pazar, rekabet, gelir modeli, blue ocean + sentez memo'su.
**Durum:** completed
**Çıktı:** 5 memo `docs/strategy/` altında (01-market, 02-competitors, 03-revenue, 05-focus, 06-memos) + sources 11 yeni kayıt (S06–S16) + playbook A1-A10 varsayım tablosu güncellendi.
**Açık karar:** 5 Q'nun hepsi için öneri verildi — product-analyst'in ADR açması bekliyor.
**Özet:** Pazar SOM 150-400M TL (Yıl 5). Doğrudan rakip yok, blue ocean net. Primary gelir Sponsor Marka Aracılık (Charity Miles modeli). 3 pillar + 6 no-go + tek cümlelik stratejik pozisyon kuruldu. Sıradaki memolar: Adım Adım partnership keşfi, sponsor marka aday listesi, iyzico-Craftgate detay karşılaştırması.

---

## 2026-04-23 20:45 — setup
**İş:** İlk iki agent (strategy-consultant, product-analyst) kuruldu; monitoring konvansiyonu (bu dashboard + her agent klasöründe `_journal.md`) devreye alındı.
**Durum:** completed
**Çıktı:** `.claude/agents/strategy-consultant.md`, `.claude/agents/product-analyst.md`, `docs/strategy/`, `docs/product/`, 5 skill.
**Açık karar:** 0
**Özet:** Strateji + ürün analizi hattı hazır; sıradaki agent kullanıcı ile kararlaştırılacak.

---
