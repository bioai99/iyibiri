# Karar Kuyruğu — Tek Dokümanda Tüm Açık Sorular

> **Bu dosya:** Analist ve consultant'ın çıkardığı tüm açık soruların tek yerde, seninle birlikte yanıtlamak için formatlanmış hali. Her sorunun altında **consultant önerisi** + **senin cevap kutusu** var.
>
> **Nasıl kullan:** Her soruyu oku → consultant önerisinin dayanağını gör → cevap kutusuna **A/B/C**, kısa not veya "ileri ertele" yaz. Sen bir grup soruya yanıt verdiğinde analist bunları `open.md` + `resolved.md`'ye taşır ve gereken ADR'leri yazar.
>
> **Tarih:** 2026-04-24

---

## 🔴 Kritik (9) — bu hafta yanıtlanmalı

### Q10 — Bağış aracılığı KDV / BDDK / KVKK çerçevesi

**Bağlam:** ADR-008 Marketplace mode'da İyiBiri iyzico sub-merchant olarak bağış toplar; paranın STK'ya transferi İyiBiri üzerinden. BDDK Law 6493 aggregator muafiyeti var **ama** detaylı avukat kontrolü şart — çünkü "aracı" sayılırsak ödeme kuruluşu lisansı lazım.

**Consultant önerisi (A):** Hukuk bürosuyla 1 saatlik mütalaa görüşmesi ayarla. Spesifik 3 soru: (1) bizim model "aggregator" mı "integrator" mı? (2) KDV muhatabı biz miyiz STK mı? (3) iyzico/PayTR tarafında risk bizi tamamen bağlıyor mu?

**Alternatif (B):** V1 lansmanda sadece embedded + passthrough modlarıyla başla (ADR-008 v2 default'u zaten bu). Marketplace'i Yıl 2'ye bırak.

**Öneri:** A + B kombine. Hukuki paralel ilerlesin, V1 lansmanda Marketplace mode kullanma — passthrough default yeterli.

**CEVABIN:** ✅ **Avukat paketi briefi hazırlandı** (2026-04-24): `docs/strategy/06-memos/2026-04-24-hukuki-mutalaa-brief.md`. Q10 + Q11 + Q13 + Q37 tek görüşmeye paketlenmiş. 60 dakikalık sözlü mütalaa yapıları önerilen cevaplarla, öncelik sırası (Q37 ilk, Q11 ikinci, Q13 üçüncü, Q10 son). Cevaplar geldiğinde ADR-009 yazılır + Marketplace modu V1'de aktif olup olmayacağı kesinleşir.

---

### Q11 — Makbuz STK → İyiBiri veri akışı garantisi

**Bağlam:** Embedded modda ödemeyi STK'nın processor'ı (fonzip) kesiyor, İyiBiri sadece tetikliyor. Makbuz PDF'i STK tarafında. Kullanıcı "Karma log'umda makbuz görebileyim" derse — STK'dan otomatik veri akışı yoksa manuel admin kuyrukla çözeceğiz.

**Consultant önerisi (A):** API varsa API (fonzip public API'si yok büyük ihtimalle). Yoksa CSV export (STK ayda 1x CSV yükler, biz match ederiz — user_id + transaction_id eşleştirme).

**Alternatif (B):** Makbuz ile İyiBiri profili arası hiç bağlantı kurma. "Makbuzun için STK'ya başvur" UI mesajı.

**Öneri:** B ilk 3 ay. Pilot 6 ay sonunda CSV match yapıp yapmayacağımıza karar ver.

**CEVABIN:**
```
[senin yanıtın]
```

---

### Q31 — STK processor API key paylaşımı güvenlik

**Bağlam:** Marketplace mode'da iyzico Marketplace API key gerekli. Bu key STK'nın hassas verisi — doğrudan DB'de tutmak RLS'le bile risk.

**Consultant önerisi (A):** Supabase Vault kullan. Key'i DB'de değil, `vault.tema_iyzico_key` reference ile sakla. Migration 010'da `payment_merchant_key_ref` kolonu zaten bu pattern için. Avukat bunu Q10 mütalaasında onaylasın.

**Öneri:** A. Mimarimiz doğru yönde, sadece implementation + legal sign-off kaldı.

**CEVABIN:**
```
[senin yanıtın]
```

---

### Q33 / Q40 — Fonzip-positioning final yol (numara çakışması)

**Bağlam:** Strategy memo'larında 3 yol vardı. Consultant sentezde **Yol E (C + D.1 + D.2 birleşimi)** önerdi — D.2 primary (silent technical integration), C paralel (hibrit evrim), D.1 Ay 4+ opsiyonel (formal partnership).

**Consultant önerisi (E):** Yol E onay. D.2 bugün zaten çalışıyor — fonzip embed URL'ini STK'nın donation_url alanında tutuyoruz. C (hibrit evrim) Marketplace mode opt-in olarak zaten var. D.1 (partnership) risk-alma kararı, 6 ay sonra.

**Öneri:** E.

**CEVABIN:** ✅ **E onaylandı** (2026-04-24 Bahadır)
- D.2 primary — TEMA fonzip embed ile bugün başlar
- C paralel — non-fonzip STK'lar (TEGV/LÖSEV/HAYTAP/Kodluyoruz) için iyzico Marketplace mode opt-in
- D.1 Ay 4+ opsiyonel — pilot traction geldiğinde fonzip partnership konuşulabilir
- **Takip aksiyonu:** Q37 (fonzip ToS avukat okuma) öncelikli — D.2'nin güvenli devamı için

*(Not: Numara çakışması — bu Q33/Q40-fonzip. Mission audit Q40-UX ayrıca işlenecek, aşağıda.)*

---

### Q40-UX — Mission-only volunteer kavramı mı, paralı üyelik zorunlu mu?

**Bağlam:** Mevcut mission detail'de "Gönüllü ol ve katıl" shortcut'ı var — user KVKK onayı verip ngo_memberships'te active row oluşturuyor (ücret ödemeden). Bu demek ki para ödenmese bile yasal olarak üye oluyor. Mission state machine audit (2026-04-24) K3 olarak flag etti.

**Opsiyonlar:**
- **Yol A (mission-only volunteer):** Yeni `mission_participant` rolü — üye değil, sadece görev katılımcısı. Yeni enum + RLS karmaşıklığı.
- **Yol B (paralı üyelik only):** Shortcut'ı kaldır. Her mission için önce `/membership` akışına yönlendir. Tek üyelik tipi, yasal basitlik.

**Consultant önerisi (B):** Yasal basitlik + KVKK tutarlılık + NGO membership parametric flow zaten çalışıyor. Shortcut kaldırıldığında UI state `requires_membership` zaten yönlendiriyor.

**Öneri:** B.

**CEVABIN:** ✅ **Yol D — Per-mission visibility** (2026-04-24 Bahadır, consultant önerisi üstüne Bahadır'ın sezgisi)

Her görevin `access_level` flag'i olur:
- `'public'` (default) — Herkes katılabilir, hafif KVKK onayı yeterli
- `'members_only'` — Sadece o STK'nın aktif üyeleri; değilse `requires_membership` state

**Avantaj:** STK kendi kontrolü max; biz politika zorlamıyoruz. TEMA "sahil temizliği" public, "Orman Bekçileri eğitimi" members_only yapabilir.

**Schema:** Migration 015 `missions.access_level` text + check + index.

**FSM:** `deriveMissionState()` güncellenecek — access_level check.

**KVKK:** Public mission için hafif onay ("ad+e-posta+şehir STK ile paylaşılacak"), members_only için mevcut tam flow.

**Seed:** TEGV okuma atölyesi (m-tegv-okuma) çocukla çalışma → `members_only` seed'i. Diğerleri public kalır.

---

### Q41-UX — Photo verification admin moderasyonu zorunlu mu?

**Bağlam:** Mission completion'da photo verify seçildiğinde — STK admin fotoğrafı kontrol etmeli mi, yoksa trust-first (anında Karma + sonradan flag edilirse geri al)?

**Opsiyonlar:**
- **Trust-first:** Anında Karma ver, admin flag ederse revoke et. Hızlı UX, düşük abuse riski (ilk yıl küçük topluluk).
- **Review-first:** Karma ancak admin onayladıktan sonra. Güvenli ama 24-48 saat gecikme → kullanıcıda momentum kaybı.
- **Hibrit:** Default trust-first; %10 random sampling + flagged abuse review.

**Consultant önerisi (Hibrit):** İlk yıl trust-first çalışır, topluluk büyüdüğünde hibrit'e geç. Migration 013 zaten `admin_review_status = 'auto_approved'` default'u koyuyor, sonradan değiştirmek kolay.

**Öneri:** Hibrit, V1'de "auto_approved" default. Yıl 2'de sampling eklenir.

**CEVABIN:** ✅ **D — Photo V1'de gizli** (2026-04-24 Bahadır + consultant insight)

Gerekçe: Gerçekçi kullanım — QR ~60%, code ~25%, auto ~10%, photo ~5%. QR/Code/Auto her zaman server-side validate (abuse imkansız, moderasyon konusu yok). Photo %5 için ayrı review akışı yapmak karmaşıklık.

**Uygulama:**
- Migration 016: HAYTAP mama (m-haytap-mama) seed `verify_method: 'photo'` → `'code'` + `verify_code: 'MAMA2026'`
- Admin UI #2 (Görev yayınla) verify_method seçenekleri V1: QR / Code / Auto. Photo ileride eklenir.
- verify_method DB constraint photo'yu hâlâ kabul ediyor (forward compat).
- VerificationPanel kodunda photo variant duruyor (dead branch şu anda, V1.1'de aktifleşir).
- `admin_review_status` kolonu (migration 013) duruyor — photo V1.1'de geldiğinde kullanılır.

**Ayrıca: Yasal doküman yönetimi Min+'a eklendi** (Bahadır 2026-04-24):

Migration 016: `ngos.kvkk_document_url` + `membership_contract_url` + `volunteer_consent_url` text kolonları. Admin UI #9 (Üyelik ayarları) sayfasına "Yasal dokümanlar" bölümü eklenecek — 3 PDF upload + son güncelleme tarihi.

**KVKK inline metni (minimum friction kararı, consultant):**
- **Public mission idle state** — tek satır checkbox:
  > "Bu göreve katıldığında ad, e-posta ve şehir bilgin [STK adı] ile paylaşılacak. [Detaylı metin ↗](KVKK PDF URL varsa)"
- **Members_only** — mevcut tam membership akışı (3 adım KVKK + sözleşme + 14 gün cayma) — zaten parametric flow'da.
- STK KVKK PDF yüklememişse inline metin tek başına yeterli; admin UI'da "eksik doküman" uyarısı görünür.

**ADR-009 updated scope:** KVKK çifte onay + 14 gün cayma + yasal doküman yönetimi.

---

### Q42-UX — Admin iptal ettiği mission'da Karma geri alınır mı?

**Bağlam:** STK'nın admin panelden mission'u cancelled yapması veya completion'u rejected etmesi durumunda kullanıcının kazandığı Karma ne olur?

**Opsiyonlar:**
- **Kalır:** Kullanıcı cezalandırılmaz — "STK iptal etti, senin suçun değil". Strateji: kullanıcı güveni.
- **Geri alınır:** karma_transactions negative entry + karma_total düşer. Adalet argümanı.

**Consultant önerisi (Kalır):** Kullanıcı platformu terk etmez. Nadiren olacak bir durum, finansal değil, sponsor markaya etkisi yok. "Güvenli olmak" kritik.

**Öneri:** Kalır. UI spec'e yazılı ("Kazandığın Karma sende kalır — sorun değil").

**CEVABIN:** ✅ **Soru geçersiz oldu — business rule ile sıfırlandı** (2026-04-24 Bahadır insight)

Bahadır'ın netliği: "Bir görev tamamlandıysa kullanıcılar tarafından iptal edilemez."

**Yeni business rule:** `missions.status = 'cancelled'` yalnızca **hiçbir `user_missions.status='completed'` kaydı yoksa** izinli. Değilse STK admin ancak `'completed'` işaretleyebilir (etkinlik yaşandı, geriye dönüşü yok).

**Uygulama:**
- Migration 017: DB trigger `tg_prevent_completed_mission_cancel` — before update on missions status check
- Error message TR empathic: "Bu görev N kullanıcı tarafından tamamlanmış — iptal edilemez. Ancak 'tamamlandı' olarak işaretleyebilirsin."
- Admin UI #3 (Görevlerim) "İptal et" butonu state-aware: tamamlanma varsa "Tamamlandı işaretle"e dönüşür (P0 #9 FE görevi)
- MissionStateBanner cancelled copy güncellendi: "Karma sende kalır" metni kaldırıldı (artık mümkün değil, açıklamak gerekmez)
- error-codes.ts MISSION_CANCELLED mesajı sadeleşti

**Statü semantiği netleşti:**
- `active` = açık, kayıt alıyor
- `completed` = etkinlik gerçekleşti, past tense, kapalı
- `cancelled` = etkinlik **YAŞANMAYACAK** (future tense), tamamlanma yoksa izinli

---

### Q17 — STK admin UI V1 min/orta/tam kapsam

**Bağlam:** P0 #9 STK admin UI V0 başlaması için ADR-010 gereken scope kararı. 3 seviye:
- **Min (MVP):** Görev yayınla + üye listesi + ay raporu. 4-5 sayfa.
- **Orta:** + Görev moderasyon + admin_review_status değiştirme + CSV export.
- **Tam:** + Sponsor marka analitik + STK'ya özel özelleştirilebilir dashboard.

**Consultant önerisi (Min → Orta kademesi):** İlk pilot STK sayısı 3; başlangıçta Min yeterli. Ay 3-6'da Orta'ya çık.

**Öneri:** Min V1 lansmanda. ADR-010'u buna göre yaz.

**CEVABIN:** ✅ **Min+ onaylandı** (2026-04-24 Bahadır) — Min'in genişletilmiş hali:

**10 sayfa:**
1. Dashboard overview (ay özeti)
2. Görev yayınla/düzenle + görev görseli upload
3. Görevlerim listesi + status toggle + edit
4. Üye listesi + CSV export
5. Doğrulama kuyruğu (photo/code/QR approve/reject + admin_feedback)
6. Aylık rapor (ay karşılaştırma dahil)
7. **Blog yazma** (posts, per-STK — `posts.ngo_id` filter, `published` admin toggle)
8. **STK profil** (logo + cover + tagline + description + iletişim)
9. **Üyelik ayarları** (fee config jsonb editör + membership_form_fields + cooling_off_days)
10. **Ödeme bağlantıları** (fonzip URL text fields kullanıcı self-serve + iyzico/PayTR read-only status)

**Ödeme altyapı ayrımı:**
- ✅ STK self-serve: fonzip URL, fee config, form fields
- 🔒 Platform manuel: iyzico Marketplace sub-merchant onboarding + PayTR merchant onboarding + Supabase Vault key storage. 1 STK başı 2-4 saat + iyzico 3-7 iş günü onay. Pilot 3-5 STK için operasyon ekibi kurar.

**Effort:** ~10 gün FE + 4.5 gün BE ≈ 2-2.5 hafta (1 FE) veya 1.5 hafta (FE+BE paralel).

**Takip aksiyonu:**
- ADR-010 bu scope ile yazılacak
- WS-02 workstream (stk-pilot-onboarding) güncellenecek — admin UI Min+ scope eklenecek
- V1 Master Plan P0 #9 güncellenecek — 10 sayfa + ödeme ayrımı
- Pilot STK onboarding runbook'u (biz manual yaparız) ayrı doküman — analist yazacak

---

### Q38 — Trademark "İyiBiri" başvurusu zamanı

**Bağlam:** Türk Patent'e İyiBiri marka başvurusu. Cost ₺3-5k, 3-6 ay süreç. fonzip-positioning memosunda flag.

**Opsiyonlar:**
- **Şimdi (Nisan-Mayıs):** Rakip (fonzip vb.) gördüğünde aynı adı alma riskini kes.
- **Pilot sonrası:** Budget öncelikli değil, ürün hacmi geldiğinde.

**Consultant önerisi (Şimdi):** ₺3-5k küçük miktar, ama marka koruması kritik. fonzip positioning stratejisinin temel taşlarından.

**Öneri:** Şimdi. Bu ay başvur.

**CEVABIN:** ✅ **A — user handling offline** (2026-04-24 Bahadır)
- Bahadır marka ajansıyla teklif aldı, dönüş bekliyor
- **Ek:** Fikir patenti sordu — consultant açıkladı ki TR'de yazılım/iş modeli patentlenmiyor (SMK m.82). Gerçek koruma = 6 moat (STK exclusive + sponsor multi-year + Karma balance + taxonomy + marka + TR craft)
- **Yeni aday soru Q43** — "Fikri koruma stratejisi memosu" (defensive publication + trade secret disiplini + sözleşme exclusivity maddeleri). Bu memo analiste yazdırılabilir, Bahadır onayladığında 1-2 saat iş.

---

## 🟡 Önemli (13) — scope etkiliyor, varsayımla devam edilebilir ama karar iyi

### Q13 — Bağışta 14 gün cayma hakkı geçerli mi?

**Bağlam:** Tüketici Kanunu 6502 m.48 mesafeli sözleşmelerde 14 gün. Ama bağış "tüketici işlemi" mi? Avukat görüşü farklılaşıyor.

**Consultant önerisi:** Yasal zorunluluk olmasa bile kullanıcı güveni için 14 gün cayma uygula. UI'da "14 gün cayma hakkı" banner zaten var (KVKK component'i).

**CEVABIN:**
```
[senin yanıtın]
```

---

### Q37 — Fonzip User Agreement 3. taraf embed kısıtı

**Bağlam:** fonzip'in public donation URL'lerini embed etmek ToS ihlali mi? Yol D.2 (silent technical) bu belirsizliğe giriyor.

**Consultant önerisi:** Avukat fonzip ToS'u okusun. Kısıt yoksa D.2 emniyetle devam. Kısıt varsa STK'dan explicit onay (STK'nın sözleşmesi fonzip'le, bizimle değil).

**CEVABIN:**
```
[senin yanıtın]
```

---

### Q16 — Auto-renew default on/off?

**Bağlam:** Membership fee_config'te `auto_renew_default`. HAYTAP monthly için true, TEMA annual için false olarak seed'ledik.

**Consultant önerisi:** Yıllık üyelik default false (kullanıcı kontrolü), aylık default true (beklenti). KVKK explicit onay her durumda.

**CEVABIN:** ✅ **STK karar verir** (2026-04-24 Bahadır) — her STK'nın mevcut kurgusu baştan yazılmasın. `fee_config.auto_renew_default` parametric, onboarding'de STK kendi kuralını koyar. Platform suggest etmez, STK seçer. KVKK explicit onay her durumda (bu zorunlu).

---

### Q20 — Vergi beyannamesi opsiyonel tag yeri

**Bağlam:** Bireysel vergi indirimi sadece beyanname filer'larına uygun (~%10-15). UI'da opsiyonel tag — "Vergi muafiyetli STK" rozet nerede gösterilsin?

**Consultant önerisi:** NGO detay sayfasında info card + mission detail'de küçük ✓ rozet. Ana akışı bulandırmasın — opt-in bilgi.

**CEVABIN:** ✅ **Şimdilik gizle** (2026-04-24 Bahadır). V1'de `tax_exempt` rozet/tag UI'da gösterilmeyecek. Bilgi kirliliği + beyanname filer'ı ~%10-15 olduğundan ana akışı bulandırmaya değmez. V2 veya pilot geri bildirimlerinde ekleme kararı verilebilir.

---

### Q6, Q7, Q9 — Karma ekonomi kalibrasyonu (3 soru tek karar)

**Bağlam:** ADR-011 adayı.
- Q6: `missions.domain` enum 4 → 10 migrasyon yolu
- Q7: Karma formülündeki Impact multiplier (1.3× afet, 1.5× kan) — admin mi ürün mü?
- Q9: Geçmiş `missions.karma` değerleri formüle geçişte yeniden hesaplansın mı?

**Consultant önerisi:**
- Q6: Lookup table (enum expansion migration riski yüksek, lookup esnek)
- Q7: Ürün kontrol — STK adminler formül karışıklığı istemez
- Q9: Hayır, retroactive değişim user trust düşürür

**CEVABIN:** ✅ **Q6 + Q7 + Q9 paketi onaylandı** (2026-04-24 Bahadır)

- **Q6 ✅** — Domain 4 → 10: `nature, education, social, health, animals, arts, sports, advocacy, economic, emergency`. Migration 018 check constraint genişletildi. Mevcut schema text+check olduğu için lookup table gereksiz.
- **Q7 ✅ B** — Platform-controlled Karma formula. `lib/missions/karma-formula.ts` yazıldı. Formula: `base_karma × domain_multiplier × duration_factor`. Multipliers: emergency 1.5×, health 1.3×, animals 1.1×, baseline 1.0×, arts/sports 0.9×.
- **Q9 ✅ Grandfather** — Mevcut 12 seed mission manuel Karma değerleri korundu. Migration 018 domain'leri yeni taxonomy'ye taşıdı (LÖSEV kan → health, HAYTAP → animals) ama karma değerleri DEĞİŞMEDİ.

**V1 yumuşak geçiş:**
- Admin UI Min+ sayfa #2 "Görev yayınla" formunda `computeKarma()` helper ile "önerilen Karma" göster
- STK admin kabul eder veya override eder (V1 grandfather esnekliği)
- Pilot 6 ayında formül kalibre edilir (multipliers tune edilir)
- V1.1'de formül zorunlu, override kaldırılır

**Takip aksiyonu:**
- ADR-011 yazılacak (bu 3 karar + formül kalibrasyon planı)
- `computeKarma()` unit test (Q9 hibrit davranış — sadece yeni missions etkilenir)
- P0 #9 Admin UI implementation'da formü "Karma öner" butonu kullanılacak

---

### Q26 — TEGV pre-screening ürün değişimi

**Bağlam:** TEGV gönüllü olmak için zorunlu pre-screening formu var (güvenlik). Biz NGO membership parametric flow'da form field destekliyoruz ama pre-screening asenkron (STK admin onaylıyor).

**Consultant önerisi:** Mevcut `membership_approval_required: true` flag + `membership_form_fields` jsonb ile TEGV onay kuyruğu hazır. Admin UI V1'de bunu destekle.

**CEVABIN:** ✅ **Onaylandı** (2026-04-24 Bahadır) — mevcut yapı yeterli, ek feature gerekmez. Admin UI Min+ #5 (Doğrulama kuyruğu) TEGV membership onaylarını da otomatik gösterir.

---

### Q29 — Pass-through SaaS fee tier yapısı

**Bağlam:** Passthrough mode'da kullanıcı STK'ya direkt bağışlıyor. Bizim gelirimiz nasıl olacak? SaaS platform fee (aylık sabit) veya attribution fee (her tamamlanan bağış için) olabilir.

**Consultant önerisi:** Hibrit — aylık sabit düşük ₺500/ay + başarılı attribution %0.5. Pilot 6 ay ücretsiz, sonra müzakere.

**CEVABIN:** ✅ **Ücretsiz pilot** (2026-04-24 Bahadır) — V1 lansmanda passthrough mode tamamen ücretsiz. Pilot 6 ayında STK memnuniyeti + kullanıcı hacmi kanıtlanınca fiyatlandırma müzakeresi. Sponsor marka geliri zaten primary revenue stream — STK'dan para almaya acele yok. **Takip:** "Pass-through pricing model" memo'su V2 zamanı (pilot sonrası), analist task listesine eklensin.

---

### Q30 — Pass-through attribution webhook vs CSV

**Bağlam:** Passthrough'da bizim tracking nasıl? iyibiri_ref param callback URL'de → webhook mu, STK'nın ayda 1 CSV yüklemesi mi?

**Consultant önerisi:** Webhook primary (otomatik, real-time), CSV fallback. fonzip webhook desteklemiyorsa CSV zorunlu.

**CEVABIN:** ✅ **Onaylandı** (2026-04-24 Bahadır) — webhook primary, CSV fallback. Schema hazır (`referral_webhook_url` kolonu migration 010'da). fonzip webhook desteklemiyorsa STK adminden aylık CSV bekler.

---

### Q32 — Capacitor mobile iframe recurring test

**Bağlam:** iOS/Android native WebView'de iframe payment recurring (aylık otomatik çekim) çalışıyor mu? PayTR iframe + auto-renew + iOS Safari WebView = test edilmedi.

**Consultant önerisi:** Pilot 1 STK (HAYTAP monthly) ile 3 gerçek kullanıcı test et. 2 saat QA, 1 hafta içinde cevap.

**CEVABIN:** ✅ **Pilot sırasında öğren** (2026-04-24 Bahadır). Pre-QA zamanı harcama; HAYTAP ilk aylık üyeler canlıda sorun yaşarsa hızla çözelim. Cost-of-defect kabul edilebilir (küçük pilot hacmi).

---

### Q24 — Kızılay gonulluol.org deeplink fizibilite

**Bağlam:** Kızılay kendi gonulluol.org platformu kullanıyor. Passthrough URL'le bağlanabilir miyiz?

**Consultant önerisi:** Yıl 1 sonu araştırma. Kızılay'ın 2.1M üyesi ile integration yüksek değerli ama onların izni gerekli.

**CEVABIN:** ✅ **Yıl 1 sonu** (2026-04-24 Bahadır). Pilot başarısı kanıtlanınca gündeme gelir. Şu an diğer pilot STK'lara odaklan.

---

### Q34 — Faz 2 STK admin tool kapsam

**Bağlam:** Q17 Min kapsam V1 sonrası genişleme. Pilot verisi geldikçe değişebilir.

**Consultant önerisi:** Pilot 6 ay sonu değerlendirme. Öncelikli: CRM basic (üye etiketi/notu), analytics expansion (hangi görevler başarılı).

**CEVABIN:** ✅ **Pilot sonrası değerlendir** (2026-04-24 Bahadır). Pilot verisi gelmeden kapsam tartışması erken. Ay 5-6 arası STK admin kullanım raporlarına bakıp karar verilir.

---

## 🟢 Bilgi / 2. dalga (12) — karar şu an bloklamıyor

| # | Soru | Consultant notu |
|---|---|---|
| Q8 | SDG mapping zorunlu mu opsiyonel | Opsiyonel başlat, mission oluşturma UX'ini bulandırma. |
| Q14 | Kurumsal bağışçı ayrı akış mi | Yıl 2+, B2B market olgunlaşınca. |
| Q18 | Multi-NGO bundle ne zaman | Yıl 2, bu bir acil problem değil. |
| Q19 | 3 katmanlı üyelik isimlendirme | UX brief, pilot data'dan sonra. |
| Q21 | Yıllık makbuz özeti format | V2 özelliği. |
| Q22 | Muhasebeci entegrasyonu | Yıl 3+. |
| Q35 | fonzip migration tool Yıl 2 | Pilot başarısı kanıtlandıktan sonra. |
| Q39 | Mutual NDA template | ✅ **Avukat paketine eklendi** (2026-04-24 Bahadır). fonzip görüşmesi + sponsor marka görüşmeleri öncesi hazır olsun. Maliyet ₺500-1500. |

Bu 8 soru için şu an karar gerekmiyor — bilgi. "İleri zaman" etiketinde kalır.

---

## 📊 Özet — sen kaç cevaba odaklanacaksın?

**~~Bu hafta: 🔴 9 kritik~~ — ✅ HEPSİ KAPANDI** (2026-04-24)
**~~2. hafta: 🟡 13 önemli~~ — ✅ HEPSİ KAPANDI** (2026-04-24)

**Kalan:** 🟢 12 bilgi / 2. dalga. Pilot sonrası, yıl 2+. Şu an blocking değil.

### Karar kapanış raporu 2026-04-24

**🔴 9/9 kritik tamamlandı:**
- Q33/Q40 fonzip positioning → Yol E (D.2 primary + C paralel + D.1 opsiyonel)
- Q38 trademark → Bahadır ajansla handling
- Q17 STK admin scope → Min+ 10 sayfa + doküman upload
- Q40-UX mission visibility → Yol D per-mission access_level (migration 015)
- Q41-UX photo verification → V1'de gizli, QR/Code/Auto only (migration 016)
- Q42-UX cancelled karma → business rule, tamamlanmış görev iptal edilemez (migration 017 trigger)
- Q10/Q11/Q13/Q37 hukuki paket → avukat briefi hazır (hukuki-mutalaa-brief.md) + Q39 NDA eklendi

**🟡 13/13 önemli tamamlandı:**
- Q6/Q7/Q9 Karma kalibrasyon → Domain 10'a genişle, platform-controlled formula, grandfather (migration 018 + karma-formula.ts)
- Q16 auto-renew → STK karar verir (parametric fee_config)
- Q20 vergi tag → V1'de gizle
- Q26 TEGV pre-screening → mevcut yapı yeterli
- Q29 passthrough SaaS → ücretsiz pilot, V2 fiyatlandırma
- Q30 attribution → webhook primary + CSV fallback
- Q24 Kızılay deeplink → Yıl 1 sonu
- Q32 Capacitor iframe → pilot sırasında öğren
- Q34 Faz 2 admin → pilot sonrası
- Q39 NDA şablonu → avukat paketine eklendi
- Q13 (cayma hakkı) ve Q37 (fonzip ToS) → Q10 hukuki paketine dahil

### Sonraki aksiyonlar

**Analist yazacak:**
- ADR-009 — KVKK + 14 gün cayma uygulama çerçevesi (avukat cevap sonrası)
- ADR-010 — STK admin UI Min+ scope (10 sayfa, yazımı başlayabilir)
- ADR-011 — Karma kalibrasyon (3 soru paketi)
- ADR-012 — Mission access_level (Yol D, kısa ADR)
- ADR-013 — Mission cancelled business rule (Q42 trigger)
- Q43 — Fikri koruma stratejisi memosu (Bahadır onay bekliyor, trademark dışı defensive publication + moat derinleşme)
- Pass-through pricing V2 memo (2026 Q4)

**Kullanıcı (Bahadır) yapacak:**
- Trademark ajans dönüşü (devam)
- TEMA intro email gönderimi + pitch
- Avukat görüşmesi (brief hazır)
- 6 migration apply (009-018 + README)

---

## 📋 Bu dosya tamamlandıktan sonra ne olur?

1. Sen cevap kutularını doldurduğunda analist `open.md` + `resolved.md`'yi günceller
2. 🔴 kritiklerden 3'ü ADR'ye dönüşür:
   - ADR-009 — KVKK + cayma (Q10/Q11/Q13 mütalaa sonrası)
   - ADR-010 — STK admin UI V1 (Q17 sonrası)
   - ADR-011 — Karma kalibrasyon (Q6/Q7/Q9 sonrası)
3. Q38 (trademark) senin direkt yapacağın — avukat değil Türk Patent online sistem.
4. Avukat mütalaası alınacak sorular ayrı bir brief'e listelenir ("hukuki mütalaa isteği — 4 soru, 1 saat").

---

**Son not:** Cevaplarını buraya yazmak zorunda değilsin — isterseniz sözlü söyle, direkt doldurum. Asıl değer kararların kendisi, yazma formatı değil.
