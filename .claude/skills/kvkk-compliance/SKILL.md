---
name: kvkk-compliance
description: TR Kişisel Verilerin Korunması Kanunu (6698 sayılı, KVKK) uyumu için operasyonel kılavuz. Aydınlatma metni template, çifte onay (double opt-in) pattern, açık rıza tracking, veri minimizasyonu, silme hakkı, veri sorumlusu/işleyeni ayrımı, saklama süreleri. İyiBiri signup + NGO üyelik + bağış akışlarında yasal uyum. Avukat mütalaa kapısı, ceza (TL 1.000.000+) önleme. Hukuki mütalaa skill'i değildir (uzman görüşü alınmalı) — ancak agent'ların günlük kararlarına çerçeve verir.
---

# KVKK Compliance — 6698 Sayılı Kanun İşletme Kılavuzu

> ⚠️ **Bu skill hukuki mütalaa yerine geçmez.** Canlı yayın öncesi avukat onayı zorunlu. Bu skill'in amacı: agent'ların aydınlatma, onay ve silme işlemleri üzerinde tutarlı + kontrolden geçmiş pattern uygulaması.
>
> **Ceza:** Non-compliance TL 1.000.000+ (Kişisel Verileri Koruma Kurumu — KVKK). 2024'te 142 milyon TL ceza dağıtıldı (kaynak: KVKK Faaliyet Raporu).

Kaynaklar: [KVKK Kurumu Resmi Site](https://kvkk.gov.tr/) · [6698 Sayılı Kanun Metni](https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6698.pdf) · [KVKK vs GDPR — TermsFeed](https://www.termsfeed.com/blog/turkey-kvkk-gdpr/) · [CookieYes — KVKK Compliance Guide](https://www.cookieyes.com/blog/turkey-data-protection-law-kvkk/)

## 1. Temel kavramlar (agent için)

| Terim | Tanım | İyiBiri karşılığı |
|---|---|---|
| **Veri sorumlusu** | Kişisel veri işleme amaç ve vasıtalarını belirleyen | İyiBiri (platform) |
| **Veri işleyen** | Sorumlunun verdiği yetkiye dayanarak veri işleyen | Supabase (altyapı), Stripe/iyzico (ödeme) |
| **Açık rıza** | Belirli konuya ilişkin, bilgilendirilmeye dayanan, özgür irade ile | Form checkbox + aydınlatma metni linki |
| **Aydınlatma** | İşlenme öncesi bilgilendirme | Her form öncesi görünen metin |
| **Veri minimizasyonu** | İş için gerekli asgari veri | Sadece ihtiyacın olanı sor |
| **Silme hakkı** | Kullanıcı talebiyle veri silme | Account delete → 30 gün geri dönüş + backup purge |
| **Saklama süresi** | Veri tutma süresi, amaçla sınırlı | Her veri tipi için ayrı tanımlı (örn. makbuz 10 yıl — 213 VUK) |

## 2. Agent disiplin kuralları

1. **Her form aydınlatma metni gerektirir.** Signup + üyelik + bağış + sponsor + newsletter — hepsi.
2. **Checkbox değer öncesi işaretli olamaz.** Pre-checked yasak (KVKK 5/1 — açık rıza "özgür irade" şartı).
3. **"Kabul ediyorum" tek tıklama yetmez** — iki kategoride ayrı onay (veri işleme + ticari elektronik ileti). ETİ yaptırımı apart (Ticari Elektronik İleti Yönetmeliği).
4. **Her onay timestamp'li.** `*.kvkk_accepted_at` DB'de `timestamptz` — audit trail için.
5. **STK üyeliği çifte aydınlatma.** Platform genel aydınlatma + STK özel aydınlatma (veri paylaşımı nedeniyle).
6. **14 gün cayma hakkı banner'ı.** TR 6502 Tüketicinin Korunması Kanunu — mesafeli sözleşme (bağış ve ücretli üyelik için). Onay kutusunun yanında gözükmeli.
7. **Data minimization** — "ileride lazım olabilir" yasak. Her alan justify edilmeli.

## 3. Aydınlatma metni template (TR)

Her form için aynı yapı, konuya özel doldurma. Legal review öncesi taslak:

```markdown
# Aydınlatma Metni — [Form Adı]

## 1. Veri Sorumlusu
İyiBiri [adresi], KEP: [kep-adresi], [VKN]. İletişim: info@iyibiri.app.

## 2. İşlenen Kişisel Veriler
- Kimlik: ad, soyad
- İletişim: e-posta, telefon (opsiyonel)
- İşlem: üyelik tier, bağış tutarı, tarih
- [Konuya özel — örn. STK üyeliğinde: seçilen STK, üyelik durumu]

## 3. İşlenme Amaçları
- Hizmet sunumu (üyelik/bağış yönetimi)
- Yasal yükümlülükler (muhasebe, vergi)
- [Konuya özel — STK'ya iletim (STK üyeliği için)]

## 4. Aktarım
- İşleyici olarak: Supabase Inc. (veri altyapısı, AB/ABD), iyzico/PayTR (ödeme)
- STK'ya: sadece sizin seçtiğiniz STK'ya, sadece üyelik bilgisi
- [Konuya özel]

## 5. Hukuki Sebep
- Açık rızanız (KVKK 5/1)
- Sözleşme ifası (KVKK 5/2/c) — üyelik/bağış sözleşmesi
- Yasal yükümlülük (KVKK 5/2/ç) — muhasebe/vergi kayıtları

## 6. Haklarınız (KVKK Madde 11)
a) İşlenip işlenmediğini öğrenme
b) İşleniyorsa bilgi talep etme
c) Amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme
d) Aktarıldığı kişileri bilme
e) Eksik/yanlış işlenen verinin düzeltilmesini isteme
f) Silinmesini / yok edilmesini isteme
g) Düzeltme/silme işlemlerinin aktarılan 3. kişilere bildirilmesini isteme
h) Otomatik analize karşı itiraz etme
i) Kanuna aykırı işleme sebebiyle zararın giderilmesini talep etme

## 7. Saklama Süreleri
- Üyelik verisi: üyelik sonlanmasından 10 yıl (6102 TTK + 213 VUK)
- Pazarlama: rızanız geri alınana kadar, en fazla 2 yıl
- [Konuya özel]

## 8. Başvuru
VERBİS kayıtlı KVK Başvuru Formu ile: kvkk@iyibiri.app veya KEP.
Veri Sorumlusu 30 gün içinde ücretsiz cevap verir.
```

Saklanacağı yerler:
- `public/legal/kvkk-aydinlatma-genel.md` — signup için
- `public/legal/kvkk-aydinlatma-uyelik.md` — STK üyeliği (STK paylaşımı)
- `public/legal/kvkk-aydinlatma-bagis.md` — bağış (ödeme processor)
- `public/legal/kvkk-aydinlatma-sponsor.md` — sponsor kurumsal

## 4. Form UI pattern (çifte onay)

```tsx
<form>
  {/* Zorunlu alanlar */}
  <Input name="email" required />
  
  {/* Aydınlatma — link + özet */}
  <AydinlatmaBanner>
    Formunuzu göndermekle, <Link href="/legal/kvkk-aydinlatma-uyelik">
    Aydınlatma Metni</Link>'nde açıklanan şartlar altında kişisel verilerinizin 
    işlenmesini kabul etmiş olursunuz.
  </AydinlatmaBanner>
  
  {/* 1. açık rıza — zorunlu, default unchecked */}
  <KvkkCheckbox
    name="kvkk_accepted"
    required
    defaultChecked={false}  // KVKK 5/1 — özgür irade
  >
    Kişisel verilerimin <Link href="/legal/kvkk-aydinlatma-uyelik">
    Aydınlatma Metni</Link>'nde açıklanan şekilde işlenmesini kabul ediyorum.
  </KvkkCheckbox>
  
  {/* 2. ticari elektronik ileti — opsiyonel, ayrı */}
  <KvkkCheckbox
    name="marketing_accepted"
    required={false}
    defaultChecked={false}
  >
    İyiBiri'den e-posta/SMS ile bilgilendirme almak istiyorum. 
    (opsiyonel, sonra kaldırabilirsiniz)
  </KvkkCheckbox>
  
  {/* 3. cayma hakkı banner — ücretli işlemde (bağış/üyelik) */}
  <CaymaBanner>
    14 gün içinde (TR 6502 md. 47) hiçbir gerekçe göstermeden cayma hakkınız 
    vardır. Cayma için: bagis@iyibiri.app veya hesap ayarlarından.
  </CaymaBanner>
  
  <Button type="submit">Onaylıyorum</Button>
</form>
```

## 5. Consent tracking — DB pattern

Her onay timestamp + kaynak + versiyon ile kaydedilir:

```sql
-- profiles tablosu genel platform onayı
alter table profiles add column kvkk_accepted_at timestamptz;
alter table profiles add column kvkk_version text;  -- "2026-04-24" gibi versiyonlama
alter table profiles add column marketing_accepted_at timestamptz;

-- STK üyelik ayrı onay (data sharing)
alter table ngo_memberships add column kvkk_accepted_at timestamptz not null;
alter table ngo_memberships add column kvkk_version text not null;
alter table ngo_memberships add column cayma_expires_at timestamptz;  -- +14 gün
```

**Kural:** Aydınlatma metni güncellendiğinde yeni version → kullanıcı bir sonraki login'de yeniden onay alınır.

## 6. Silme hakkı (right to erasure) — akış

Kullanıcı "hesabımı sil" diyor:

1. **Anında ekran:** "Hesabınız 30 gün içinde silinecek. Bu süre içinde yeniden aktive edebilirsiniz."
2. **Soft delete:** `profiles.deleted_at = now()` — kullanıcı görünmez olur, session invalidate.
3. **30 gün grace:** Kullanıcı `/auth/reactivate` ile geri gelebilir.
4. **30 gün sonra hard delete:** Async job (cron) — PII silinir, audit trail'de anonymize hash kalır.
5. **Yasal hold istisnası:** Makbuz/fatura 10 yıl (VUK 213) — anonymize edilerek saklanır (kişi verisi çıkartılır, sadece kurumsal kayıt).

**İstisnalar:**
- Açık davadaki veri — hukuki bitene kadar saklanır.
- Vergi denetimi — zamanaşımı sonrası silinebilir (5 yıl).

## 7. İşleyen (processor) kontrolü

Her 3. parti data processor için **Veri İşleme Sözleşmesi (DPA)** imzalı olmalı:

| Vendor | Rol | DPA | KVKK/GDPR uyum |
|---|---|---|---|
| Supabase (AB/ABD) | Data infrastructure | ✅ Standard Contractual Clauses | GDPR uyumlu + SCC ile KVKK uyumlu transfer |
| iyzico | Ödeme | ✅ PCI DSS + DPA | TR'de yerleşik, KVKK direct compliance |
| PayTR | Ödeme | ✅ PCI DSS + DPA | TR'de yerleşik |
| Vercel | Hosting | ✅ DPA | GDPR + SCC |
| fonzip | Partnership | ⚠️ DPA gerekli | Embedded widget = processor ilişkisi var |

**Agent kuralı:** Yeni vendor eklenirken DPA sign'lı mı önce kontrol et. DPA yoksa legal kapı.

## 8. Audit checklist — pre-production

- [ ] Her form bir aydınlatma metnine link veriyor (genel/üyelik/bağış/sponsor)
- [ ] Checkbox default **unchecked** (pre-checked yasak)
- [ ] KVKK checkbox + marketing checkbox **ayrı** (ETİ ayrı yönetmelik)
- [ ] Consent timestamp + version DB'de
- [ ] "Hesabımı sil" endpoint'i çalışıyor, 30 gün grace + hard delete cron var
- [ ] 3. parti vendor'lar DPA'lı
- [ ] VERBİS kaydı (Veri Sorumluları Sicil Bilgi Sistemi) başvurusu (çalışan sayısı/ciro şartına bakar)
- [ ] Çerez politikası (KVKK + ePrivacy) — banner'lı
- [ ] İletişim formu kvkk@iyibiri.app aktif (30 gün cevap şartı)
- [ ] Aydınlatma metinleri **avukat tarafından onaylanmış**

## 9. Agent için karar ağacı

```
Yeni form / data alımı geliyor
    │
    ▼
Aydınlatma metni var mı (public/legal/)?
    │
    ├─ HAYIR → DUR. Önce metin yaz (template'den) → avukat'a gönder.
    │
    └─ EVET
        │
        ▼
    Form'da KVKK checkbox + aydınlatma linki var mı?
        │
        ├─ HAYIR → Ekle. Default unchecked. Separate marketing checkbox.
        │
        └─ EVET
            │
            ▼
        Consent tracking DB'de timestamp + version saklanıyor mu?
            │
            ├─ HAYIR → Migration aç, kolon ekle.
            │
            └─ EVET → Form prod'a geçebilir (avukat final check sonrası).
```

## 10. Anti-pattern

- **Pre-checked checkbox.** "Hızlı UX" bahanesiyle KVKK 5/1 ihlali = açık rıza geçersiz.
- **Tek "Kabul ediyorum"** birleşik onay. Veri işleme + marketing ayrı olmalı.
- **Aydınlatma metni = Privacy Policy** direkt kopyası. KVKK madde 10'a uygun 8 başlık şart.
- **Silme talebine "hemen silindi" cevabı** — 30 gün grace + hard delete işletme bilgi sistemine dokümante olmalı.
- **Vendor onboard DPA'sız.** fonzip widget embed etmeden önce DPA zorunlu.

## 11. Yıllık + olay-bazlı review

- **Yıllık:** Aydınlatma metinleri avukat review → versiyonlama (örn. 2027-01).
- **Olay-bazlı:** Veri ihlali → 72 saat içinde Kurum'a bildirim (KVKK 12/5), etkilenen kullanıcıya bildirim.
- **Yeni vendor:** DPA imza + aydınlatma metnine vendor listesi eklenmesi.
- **Yeni data kolonu:** Aydınlatma metninde "işlenen veriler" listesi güncellenir.

## 12. Avukat-e-gider — ne zaman?

1. Aydınlatma metni final onay.
2. Yeni veri tipi (örn. sağlık verisi — özel nitelikli).
3. Veri transferi (yurt dışı).
4. Yasal hold / dava durumu.
5. Veri ihlali.
6. Kurum denetimi talebi.
7. DPA yenileme / iptal.
8. Yıllık uyum review.

**Agent kuralı:** Bu 8 senaryoya giren bir iş geldiğinde **iş bırak, avukat'a yönlendir**.
