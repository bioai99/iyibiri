# WS-02 — STK Pilot Onboarding (TEMA + TEGV + LÖSEV)

**Durum:** scoping
**Sahip:** product-analyst
**Açıldı:** 2026-04-24
**Son güncelleme:** 2026-04-24
**Vizyon kaynağı:** `docs/strategy/04-value-prop/2026-04-23-oncelikli-stk-gonullu-toplama-analizi.md`
**İlgili ADR:** ADR-005 (Proposed), ADR-007 (Proposed)

## 1. Kapsam (in / out)

**In:**
- 3 STK ile partnership sözleşme (hand-sold).
- Her STK için iyzico sub-merchant onboarding + MCC 8398.
- STK admin UI V0 (görev oluştur, üye listele, fee config yönet).
- Her STK için seed data: 5-10 görev + membership_fee_config.
- Her STK'ya özel partnership pitch dokümanı + ardından analiz raporu.

**Out:**
- 2. dalga STK'lar (TOG, Haytap, ÇYDD, AÇEV) — Ay 6+ ayrı workstream.
- Kızılay deeplink entegrasyonu — Yıl 1 sonu.
- Sponsor marka entegrasyonu — ayrı workstream (WS-08).
- STK admin UI full feature (analytics, export, email) — V1.1.

## 2. Fonksiyonlar

1. **STK partnership outreach** — brief dokümanı, meeting, sözleşme templating (hukuki mütalaa sonrası).
2. **Admin login flow** — STK admin hesabı (`profiles.role = 'ngo_admin'` + `ngo_id` ataması).
3. **Admin panel** — `/admin/ngo/[id]/*` route grubu.
4. **Görev oluşturma UI** — parametric taxonomy field'ları (ADR-008 sonra genişletilecek).
5. **Üye listesi** — kullanıcı × üyelik durumu, CSV export.
6. **Fee config editor** — `ngos.membership_fee_config` form-based editor.
7. **Onboarding wizard** — STK admin ilk girişte 6 adımlı setup.
8. **Seed data script** — 3 STK × 10 görev + üyelik config Supabase'e yükler.

## 3. Kullanıcı değeri (JTBD)

- **STK admin (TEMA, TEGV, LÖSEV):** "İlk görevimi 30 dk içinde yayınlarım + ilk üyemi 1 hafta içinde görürüm" — ürün mezunu deneyim.
- **İyiBiri kullanıcısı:** "3 farklı STK'da görev + üyelik aynı platformda, tek tıkla keşfederim."
- **Operasyon ekibi (product-analyst + strategy):** "Pilot sonrası 6 aylık veri ile komisyon müzakeresi hazırlarım."

## 4. Başarı kriterleri

- **3 STK imzalı** (Ay 2).
- **3 STK'nın en az 10 aktif görevi canlı** (Ay 3).
- **İlk 100 aktif kullanıcı** pilot içinde (Ay 4).
- **İlk 20 ödeme başarılı** (Ay 5) — ADR-007 parametric fee test.
- **3 STK memnuniyet skoru ≥ 7/10** pilot sonu anketinde.
- **Pilot sonu komisyon teklifi** kabul edilebilir (ADR-005 Ay 6).

## 5. Bağımlılıklar

- **ADR-005 Accepted** (3 STK seçimi, bloklayıcı).
- **ADR-007 Accepted** (parametric fee schema, bloklayıcı WS-03 birlikte).
- **ADR-002 Accepted** (iyzico, bloklayıcı ödeme).
- Hukuki mütalaa — partnership sözleşme + KVKK çifte onay (dış hukuk danışmanı).
- Supabase Auth + middleware — STK admin role `middleware.ts` güncel (şu an sadece `/admin` için ADMIN_SECRET cookie; `ngo_admin` role eklenmeli).
- iyzico Marketplace onboarding her STK için 2-3 hafta.

## 6. Riskler

- **STK komisyon reddi:** %0 pilot kabul ederler ama 6 ay sonunda %8 kabul etmeyebilirler. Mitigation: tier komisyon (Starter %0 → Growth %8 → Premium %5).
- **iyzico MCC 8398 onboarding gecikmesi:** 3 hafta yerine 6 olursa lansman kayar. Mitigation: paralel 3 STK submit + PayTR fallback.
- **Hukuki mütalaa gecikmesi:** Sözleşme imzalanamaz. Mitigation: mütalaa Ay 0'da başlatılır, partnership outreach ile paralel.
- **STK admin UI'ı karmaşık:** admin kullanamaz. Mitigation: onboarding wizard + video + 1-1 destek ilk ay.
- **Seed veri gerçek değil:** görevler fake görünür. Mitigation: STK ile 5 gerçek görev tanımla + onları seed'e koy.

## 7. Açık kararlar

- **Q15** (komisyon %8 pilot müzakere) — ADR-005'te çözüldü (%0 pilot, 6 ay sonu müzakere).
- **Q17** (STK admin UI kapsam) — bu WS'de min kapsam tanımı.
- **Q23** (pilot 3 STK) — ADR-005'te.
- **Q25** (pilot paket kapsamı) — bu WS'nin Bölüm 1.
- **Q26** (TEGV pre-screening) — bu WS'de TEGV özel fonksiyon olarak eklenir — 6 soruluk test admin UI'da konfigüre edilir.
- **Q27** (parametric fee) — ADR-007 + WS-03.

## 8. Öneri sırası (walking skeleton)

1. **ADR-005 + ADR-007 Accepted** → go signal.
2. **Ay 0:** Partnership outreach + hukuki mütalaa + iyzico submit (paralel).
3. **Ay 1:** 3 STK sözleşme + iyzico sub-merchant + admin role + auth fix.
4. **Ay 2:** Admin UI V0 (fee config + görev create + üye list) + seed data.
5. **Ay 3:** Onboarding wizard + 1-1 destek + her STK ilk görevini yayınlar.
6. **Ay 4-5:** Kullanıcı pilot + ilk ödemeler + iterasyon.
7. **Ay 6:** Pilot sonu analiz + komisyon müzakere + 2. dalga STK kontaktları.
8. **Walking skeleton:** Ay 2 sonuna kadar en azından 1 STK 1 görev yayınlayabilir durumda — minimum viable pilot.

## 9. Teslim planı

- **Partnership pitch dokümanı:** strategy-consultant yazsın (aday memo `docs/strategy/04-value-prop/2026-04-XX-stk-partnership-pitch-paketi.md`).
- **UX brief:** STK admin onboarding wizard + fee config UI (`docs/ux/05-briefs/2026-04-XX-stk-admin-onboarding.md` — ux-researcher).
- **UI spec:** admin panel komponenti (`docs/ui/01-specs/2026-04-XX-stk-admin-panel.md` — ui-designer).
- **Eng brief (PRD):** 2-3 sayfa, WS-02 kapsamı — analist yazar ADR'ler onaylandıktan sonra.
- İmplementasyon: frontend-engineer + supabase-backend (Faz 2 agent'lar).
- İlk demo: Ay 2 sonu.
- V1 pilot launch: Ay 4 (ilk 100 kullanıcı).
