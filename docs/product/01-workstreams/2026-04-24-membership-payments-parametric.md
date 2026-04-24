# WS-03 — Membership Payments + Parametric Fee

**Durum:** scoping — **KAPSAM REVİZE EDİLDİ (ADR-008)**
**Sahip:** product-analyst
**Açıldı:** 2026-04-24
**Son güncelleme:** 2026-04-24 (ADR-008 pass-through)
**Vizyon kaynağı:** `docs/strategy/04-value-prop/2026-04-23-uyelik-akisi-kullanici-platform-stk.md`
**İlgili ADR:** ADR-002 (iyzico, scope daraltıldı), ADR-007 (parametric fee schema, bilgi amaçlı), **ADR-008 (pass-through default — primary)**

> **⚠️ Revizyon notu (2026-04-24 v2, ADR-008 v2 sonrası):**
> WS-03 mimarisi **3-modlu hibrit embedded/passthrough/marketplace** olarak yeniden çerçevelendi. Pilot 3 STK için primary mod **Embedded** (kullanıcı İyiBiri'den çıkmaz, STK processor arka planda iframe ile). Passthrough sadece embed desteklemeyen STK'lar için fallback (Kızılay gibi). Marketplace opt-in 2. dalga küçük STK'lar için.
> WS-03'ün yeni kapsamı:
> - **Processor adapter katmanı** (iyzico Checkout Form iframe + PayTR iframe_token + fonzip embed) — 3 adapter ilk dalga.
> - `/dashboard/ngos/[id]/membership` + `/dashboard/ngos/[id]/donate` sayfaları **embedded widget için yeniden tasarlanır**.
> - Supabase Vault entegrasyonu — STK merchant API key güvenli saklama.
> - Webhook endpoint (processor başına farklı format) — attribution + Karma trigger.
> - Referral tracking tablosu.
> - Parametric fee config UI (hem bilgi amaçlı hem embedded tahsilat amount parametresi).
> - Passthrough fallback UI (In-App Browser modal).
> - STK SaaS fee faturalama (ayrı akış, transaction'dan bağımsız).
>
> Teknik karmaşıklık v1'e göre arttı (3 adapter) ama pilot 3 STK için değer çok yüksek — İyiBiri'nin "tek app" vaadi korunur.

## 1. Kapsam (in / out)

**In:**
- iyzico Marketplace entegrasyonu + sub-merchant API.
- `ngos.membership_fee_config` jsonb field (ADR-007 migration).
- Parametric fee form rendering (`/dashboard/ngos/[id]/membership`).
- Split payment (processor + platform + STK ayrımı).
- Recurring billing (monthly/annual mode).
- 14 gün cayma hakkı iptal + iade flow.
- KVKK çifte onay (İyiBiri genel + STK özel) checkbox.
- Email makbuz tetiği (STK API'si varsa otomatik, yoksa admin kuyruk).

**Out:**
- Bağış ödeme akışı — ayrı WS-07 (V2).
- Premium subscription (R2) — ayrı WS (V2 lansmanı sonrası).
- Sponsor marka ödeme — WS-08.
- Kart bilgisi saklama (PCI DSS) — iyzico handle eder, İyiBiri hiç token tutmaz.
- Muhasebeci entegrasyon (Q22) — Yıl 3+.

## 2. Fonksiyonlar

1. **Fee config loader:** `/dashboard/ngos/[id]/membership` sayfa `membership_fee_config` okur → mode'a göre form render.
2. **Parametric form:**
   - `age_tiered` mode → kullanıcı yaş auto-match + tier kart görünür.
   - `monthly` mode → tek tier + "ayda ₺X, istediğin zaman iptal" mesajı.
   - `annual` mode → yıllık toplam + aylık taksit opsiyon (varsa).
   - `donation_based` mode → suggested amounts + custom input.
3. **iyzico Marketplace checkout:** İyiBiri iyzico API'sine split payment oluştur → kullanıcı kart bilgisi iyzico'ya verir.
4. **Split payment logic:**
   - Processor fee (%2.99 + 0.25 TL): iyzico kesilir.
   - Platform fee (%0 pilot / %8 sonra): İyiBiri sub-merchant.
   - Kalan: STK sub-merchant.
5. **Status tracking:** `ngo_memberships.status` (pending → active → expired/cancelled) + iyzico webhook.
6. **Recurring billing:** monthly/annual modda iyzico subscription; test bankaları ile verify.
7. **Cayma hakkı (14 gün):** "İptal et + tam iade" buton ilk 14 gün aktif; iyzico refund API.
8. **KVKK çifte onay:** 2 checkbox (İyiBiri genel + STK özel) + `form_data.kvkk` kayıt.
9. **Makbuz tetiği:** STK'nın makbuz API'si varsa otomatik; yoksa STK admin dashboard'da kuyruk.
10. **Admin görünüm:** STK admin Q27 fee config formunu düzenleyebilir.

## 3. Kullanıcı değeri (JTBD)

- **Kullanıcı (P1, P2 segment):** "STK üyeliği 60 saniyede tamamlanır. Kaybolmaz. Güvenli hissederim (14 gün cayma)."
- **STK admin:** "Kendi fee modelimi ayarlarım (TEMA yaş tier, HAYTAP aylık, LÖSEV bağış-based). İyiBiri hepsini destekler."
- **İyiBiri platform:** "3 farklı fee modeli tek kod yolundan yönetilir, yeni STK eklemek kod gerektirmez."

## 4. Başarı kriterleri

- **ADR-007 migration production'da** (Ay 1).
- **3 STK'nın farklı mode ile fee config'i canlı** (Ay 2) — TEMA age_tiered, HAYTAP monthly, LÖSEV donation_based.
- **İlk 20 ödeme başarılı** (Ay 3) — split payment doğrulanmış.
- **Recurring billing test %95+ başarı oranı** (monthly mode).
- **KVKK çifte onay %100** — hiçbir üyelik onaysız yapılamasın.
- **14 gün iptal flow end-to-end test** — parayı 14 gün içinde tam iade.
- **Processor + platform + STK ayrımı audit doğru** — muhasebe ekibi confirm.

## 5. Bağımlılıklar

- **ADR-002 Accepted** (iyzico seçimi, bloklayıcı).
- **ADR-007 Accepted** (parametric fee schema, bloklayıcı).
- **ADR-005 Accepted** (pilot 3 STK, WS-02 ile paralel).
- Hukuki mütalaa: KDV durumu (Q10 🔴), KVKK çifte onay formu (hukuki).
- iyzico Marketplace hesabı + MCC 8398 onboarding (2-3 hafta, WS-02 paralel).
- Email servis (Supabase veya Resend) — makbuz + cayma onay.
- Test bankaları (yerli + yabancı kart) — recurring test için.

## 6. Riskler

- **Q10 hukuki belirsizlik:** KDV + BDDK çerçevesi netleşmezse aracı model (P.1) risk içerir. Mitigation: ADR henüz imzalanmadan MVP test-mode, production öncesi mütalaa tamamla.
- **Recurring billing bankada sorun:** bazı TR banka kartları iyzico recurring'de fail. Mitigation: 3 banka pilot test (Garanti, İş, Akbank); fallback "yenileme hatırlatıcı + manuel" mod.
- **Parametric form karmaşıklık:** kullanıcı kaybolur. Mitigation: UX brief (UX-researcher) + ui-designer spec; onboarding wizard mode.
- **Cayma akışı yanlış para iadesi:** processor kesintisi iade edilmezse kullanıcı şikayet. Mitigation: 14 gün içi iade %100 (processor fee dahil); platform üstlenir.
- **Makbuz akış kopukluğu:** STK otomatik kesmezse kullanıcı bekler. Mitigation: admin kuyruk dashboard + SLA STK ile sözleşmede.

## 7. Açık kararlar

- **Q2** (iyzico) — ADR-002 Proposed.
- **Q10 🔴** (KDV/BDDK/KVKK) — hukuki mütalaa şart, WS kapsamında dış iş.
- **Q13** (bağışta cayma hakkı) — üyelikte 14 gün net, bağışta (WS-07) ayrı soru.
- **Q15** (pilot %0 komisyon) — ADR-005'te çözülmüş.
- **Q16** (auto-renew default) — off (sözleşmede + UI'da net).
- **Q27** (parametric fee) — ADR-007 çözüyor.

## 8. Öneri sırası (walking skeleton)

1. **ADR-002 + ADR-007 Accepted** → go signal.
2. **Ay 0-1:** Hukuki mütalaa (Q10) + iyzico onboarding + migration yaz/test.
3. **Ay 1:** ADR-007 migration production; her STK için fee config admin'de doldurma + seed.
4. **Ay 2:** Parametric form rendering + iyzico checkout sandbox → test.
5. **Ay 3:** Split payment production + ilk 20 ödeme.
6. **Ay 4:** Cayma/iptal + recurring billing + KVKK onay sertleştirme.
7. **Ay 5:** Admin fee editor + makbuz kuyruk.
8. **Walking skeleton (min viable):** Ay 2 sonunda 1 STK'da 1 mode ile test ödemeden uçtan-uca 1 gerçek ödeme yapılabilir.

## 9. Teslim planı

- **Eng brief (PRD):** analist yazar ADR onayından 1 hafta sonra (3-4 sayfa, parametric form + split payment).
- **UX brief:** 3 mode için form flow (ux-researcher) — age_tiered, monthly, donation_based.
- **UI spec:** parametric form + cayma flow + KVKK modal (ui-designer).
- **ADR-008 (aday):** KDV muhasebe modeli (Q10 çözümü sonrası).
- İmplementasyon: supabase-backend (migration + webhook) + frontend-engineer (form + checkout).
- İlk test: Ay 2 sonu (sandbox).
- İlk production payment: Ay 3.
- V1 full automation: Ay 5.
