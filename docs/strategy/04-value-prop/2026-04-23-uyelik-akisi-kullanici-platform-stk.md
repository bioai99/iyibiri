# Üyelik Akışı — Kullanıcı × Platform × STK Üçlü Kurgu

**Tarih:** 2026-04-23
**Yazar:** strategy-consultant
**Bağlam:** İyiBiri'nin üçlü pazar yeri (marketplace) olarak kullanıcı × platform × STK ilişkisi net olmalı. "Tek platformdan birçok STK'ya hızlı register + erişim" iddiasının ürün/operasyonel/yasal çerçevesi. Mevcut `ngo_memberships` tablosu + `membership_form_fields` jsonb altyapısı var — bu memo onun üstüne strateji koyuyor.

---

## Yönetim Özeti

**Üyelik akışı İyiBiri'nin ikinci gelir kolu + STK network etkisinin motorudur.** Kullanıcı tek hesaptan 10+ STK'ya cross-membership kurabiliyor; STK tek admin'le tüm üyelerini yönetebiliyor; İyiBiri %8-12 komisyon alıyor. Patreon modeli benzer ama yapısal olarak İyiBiri daha sadık — çünkü üye **STK'nın kendisi** değil, aynı zamanda topluluk. Üç bulgu:

1. **Mevcut DB altyapı hazır** — `ngo_memberships` tablosunda tier (free/basic/premium), status (pending/active/rejected/expired/cancelled), form_data jsonb, expires_at zaten tanımlı. Ürün ekran tarafı (%100 prod 4 sayfa: profil → form → submit → success) canlı.
2. **Komisyon modeli kritik** — Patreon ~%13-14 total [S26] kullanıcı-zararlı değil çünkü üye STK'nın içeriği için ödüyor. İyiBiri'de yapı farklı: üye STK'ya destek için ödüyor; platform %8-12 komisyonu STK anlaşmasında netleştirilir (yıllık lisans + bağış/transaction fee modeli olmalı).
3. **KVKK çifte onay zorunluluğu** — her STK üyeliğinde kullanıcı İyiBiri + STK ayrı aydınlatma onaylar. `membership_form_fields` jsonb bu için hazır.

**Öneri:** 3 katmanlı model: (1) "İyiBiri üyesi" (ücretsiz, tek register), (2) "STK takipçisi" (subscribe, bildirim, ücretsiz, mevcut `user_ngo_subscriptions`), (3) "STK üyesi" (ödenmiş, parametrik form, recurring, `ngo_memberships`). Üçü ayrı veri, ayrı ürün deneyimi — net kavram ayırımı.

---

## 1. Üçlü Değer Tanımı

Her iş ilişkisinde her tarafın **ne aldığını + ne verdiğini** net yaz. Muğlaklık kayıpla sonuçlanır.

### Kullanıcı (User)

**Ne alır (value):**
- Tek tıkla birçok STK'yla ilişki kurma (friction azalması).
- STK üyelik yönetimini tek yerde takip (vadeli, çoklu).
- Karma + seviye + topluluk.
- Doğrulanmış STK'lar (İyiBiri vetting) — trust signal.
- Parametrik form otomatik tamamlama (email/isim/adres İyiBiri'den gelir).

**Ne verir:**
- Profil bilgisi (isim, email, şehir, ilgi alanı, age_range).
- Üyelik ödemesi (STK'ya + İyiBiri %).
- Aktivite verisi (hangi görevlere katıldı, ne kadar Karma kazandı, davranış).
- Zaman ve sadakat.

### STK

**Ne alır:**
- Dijital üye akışı + yönetim paneli (ngo admin dashboard).
- Üye veri tabanı (KVKK uyumlu paylaşılabilir veri).
- Çoklu platformdan kurtuluş (kendi app'i yerine İyiBiri).
- Analytics: yeni üye/ay, churn, demografik profil.
- Görev yayınlama altyapısı (mission creator tool).
- Content (posts) yayınlama.

**Ne verir:**
- Aylık/yıllık komisyon veya SaaS fee (modele göre).
- Üye ile iletişim kalitesi (tonu İyiBiri ile çelişmesin).
- Makbuz + legal compliance (KVKK, vergi, tüketici hakları).
- Onboarding içeriği (hoşgeldin postası, üye rozeti, vs.).

### İyiBiri (Platform)

**Ne alır:**
- %8-12 komisyon veya aylık SaaS fee.
- Multi-sided network etki — her yeni STK + yeni üye birbirini güçlendiriyor.
- Veri varlığı (aggregated cross-STK davranış).
- Marka gücü (category lider).

**Ne verir:**
- Ürün + altyapı + bakım.
- Kullanıcı edinme yatırımı (marketing, ASO, referral).
- Sponsor marka pazarlaması (R1) aracılığıyla Karma ödül economy'si kullanıcılara.
- Trust + vetting — her STK İyiBiri'ye katılırken check edildi.
- Pazarlama + content + topluluk yönetimi.

---

## 2. Mevcut İyiBiri Altyapısı (Kod-tarafı gerçek)

`docs/project-atlas.md` Bölüm 4'ten özet (tabloyu tam okumak için atlas).

### Tablolar
- `ngos` — STK master (id text, name, membership_enabled, membership_form_fields jsonb, approval_required, description, terms_url).
- `ngo_memberships` — kullanıcı × STK üyelik kaydı (status enum pending/active/rejected/expired/cancelled, tier enum free/basic/premium, form_data jsonb, joined_at, expires_at).
- `user_ngo_subscriptions` — "takipçi" (ödeme yok, sadece takip).
- `profiles` — kullanıcı (auth.users + app verileri).

### Sayfa akışı (production durumda)
- `/dashboard/ngos` — liste (search + kart).
- `/dashboard/ngos/[id]` — profil + üyelik butonu.
- `/dashboard/ngos/[id]/membership` — parametrik form (membership_form_fields jsonb'den dinamik form).
- `/dashboard/ngos/[id]/membership/success` — konfeti + pending/active durumu.

**Eksik olanlar:**
- Ödeme entegrasyonu (Q2 🔴 iyzico henüz yok).
- Recurring billing (aylık/yıllık yenileme).
- İptal / cayma hakkı akışı.
- KVKK çifte onay formda.
- STK admin tarafında üyelik onayı (şu an approval_required bool var ama admin UI yok).
- Member list export / STK admin tarafında üye listesi.
- Churn önleme (expiring_soon reminder).

---

## 3. Akış Senaryoları

### Senaryo 1 — Tek tıkla cross-register

**Kullanıcı hikayesi:** Zehra zaten İyiBiri üyesi. Yeni bir STK (Haytap) keşfetti. "Üye ol" dedi. Form otomatik dolu geldi (profil verisinden). 3 soru Haytap'a özel (evcil hayvan sayısı, bağış tercihi, iletişim). KVKK çifte onay. Ödeme → membership_form başarılı. Hoş geldin e-postası Haytap'tan.

**Adım sayısı:** 3 ekran (profil → form → success). Hedef: **90 saniye altı** complete (UX brief — UX researcher sonra test edecek).

### Senaryo 2 — Multi-NGO bundle (önerim)

**Fırsat:** Kullanıcıya "3 STK'lık paket" sun — TEMA + TEGV + Kızılay aylık. Bundle fiyat %15 indirimli.

**Ürün:** yeni `ngo_bundles` tablosu + bundle tier. V1'de yok, Yıl 2 aday.

### Senaryo 3 — STK tarafı onboarding

**STK hikayesi:** TEMA İyiBiri'ye katılmak istiyor. 1 sözleşme + admin hesabı + form alanları + ödeme entegrasyonu (STK hesabına bağlı iyzico sub-merchant). İyiBiri ilk 3 STK için hand-sold, sonrası self-serve signup.

**Admin UI ihtiyacı:** şu anda sadece `/admin/missions` var, STK admin UI'ı yok. Workstream aday.

---

## 4. Para Akışı Mimarisi

### Seçenek P.1 — Aracı (İyiBiri ödeme alır)

```
Kullanıcı → iyzico (ödeme processor) → İyiBiri hesabı → İyiBiri %X komisyon → STK hesabı
```

- iyzico Marketplace API ile split payment (sub-merchant = STK).
- İyiBiri komisyonu otomatik alır.
- Makbuz STK tarafından kesilir (bağış memosundaki Seçenek B ile aynı yapı).

### Seçenek P.2 — Yönlendirici (STK doğrudan)

```
Kullanıcı → STK'nın ödeme sayfası → STK hesabı (İyiBiri pay almıyor)
```

- İyiBiri sadece yönlendirme.
- Komisyonsuz → İyiBiri gelir kaybı.
- Sadece KPI/attribution İyiBiri'de.

### Seçenek P.3 — SaaS (fonzip modeli)

```
STK aylık İyiBiri'ye SaaS fee öder (₺X/ay)
Kullanıcı ödemesi STK'ya doğrudan gider
```

- fonzip [S29] benzeri yapı.
- Komisyon değil, fixed SaaS.
- İyiBiri gelir tahmin edilebilir ama upside düşer.

**Öneri:** **Seçenek P.1 (aracı) Yıl 1-2 primary.** Komisyon %8 (Patreon %10 benchmark'ı altında agresif, çünkü TR pazarında fiyat hassasiyeti yüksek). Yıl 3+ büyük STK'larla SaaS tier eklenebilir (P.3 hybrid).

---

## 5. Komisyon Yapısı — Detay

### Model: %8 platform + %2.99 processor = ~%11 total

100 TL aylık üyelikte:
- iyzico komisyonu: %2.99 + 0.25 TL = ₺3.24
- İyiBiri komisyonu: %8 = ₺8.00
- STK'ya gider: ₺88.76

Patreon %13-14 benchmark [S26] — İyiBiri %3 daha ucuz. Rekabet avantajı pazarlama argümanı.

### STK tarafında pitch

"Ayda ₺100 üyelikte ₺88.76 kasanıza giriyor, İyiBiri %8 komisyon alıyor. Karşılığında: üye yönetimi, ödeme + makbuz altyapısı, bildirim kanalı, analytics, yeni üye akışı, görev yayınlama aracı."

### Alternatif: Tier bazlı komisyon

| STK Tier | Komisyon | Özellikler |
|---|---|---|
| **Starter** (ilk 100 üye) | %0 ilk 6 ay, sonra %10 | Kendini test et |
| **Growth** (100-1000 üye) | %8 | Full feature |
| **Premium** (>1000 üye) | %5-6 + aylık ₺5k SaaS | Priority support + custom |

Growth size büyüdükçe komisyon düşer — STK büyük olursa İyiBiri uzun vadede kazanır.

---

## 6. KVKK Çifte Onay Yapısı

Her membership'te iki aydınlatma:

### İyiBiri aydınlatması (1 kez, register'da)
- Veri işleme genel çerçevesi.
- Üçüncü taraf (STK) paylaşımı — genel onay.
- Ödeme processor (iyzico) veri paylaşımı.

### STK aydınlatması (her membership'te ayrı)
- STK'ya özel veri işleme (üye profili, iletişim, KVKK form alanları).
- STK'nın kendi gizlilik politikası linki (`ngos.privacy_policy_url` yeni alan adayı).
- Parametrik onay kutusu (membership_form_fields içinde).

**UI:** Form submit öncesi iki checkbox — (1) İyiBiri genel, (2) STK özel. İkisi birden işaretlenmeden submit yok.

**Mevcut durum:** `ngo_memberships.form_data` jsonb var ama KVKK onay kaydı yapısı explicit değil. Yeni alan veya convention gerekiyor (ör. `form_data.kvkk_accepted_at`).

---

## 7. İptal / Cayma Hakkı — TR Tüketici Hukuku

### 14 gün cayma hakkı (Tüketici Kanunu 6502)

- İyiBiri uzaktan satış → kullanıcı 14 gün içinde cayabilir.
- Üyelik bağış değil hizmet sözleşmesi → cayma hakkı var.
- Para iadesi + STK tarafında üyelik iptali otomatik.

**UI ihtiyacı:**
- Üyelik sözleşmesi öncesi cayma hakkı açıkça bildirilir.
- 14 gün boyunca "İptal et + tam iade" butonu aktif.
- 14 gün sonra aylık dönem sonunda iptal (no pro-rata refund).

### Sonraki dönem iptali

- **Auto-renew karar:** Kullanıcı varsayılan olarak yenile mi?
  - Patreon default: Yes.
  - TR tüketici algısı: "otomatik kesinti" negatif.
  - Öneri: Yıl 1 "açık onay" modeli — kullanıcı her dönem sonunda tekrar onaylar. Churn yüksek ama güven yüksek.

### Refund senaryoları

| Durum | Aksiyon |
|---|---|
| 0-14 gün cayma | Tam iade (platform + STK payı iade edilir) |
| 15+ gün, dönem ortası | İptal ileriye dönük; iade yok |
| STK ihlali (fraud) | İyiBiri resen iade; STK kontrat ihlali |
| Teknik arıza (ödeme çift çekim) | Otomatik iade |

---

## 8. Onboarding Optimizasyonu

### Tek tıkla multi-NGO (the pitch)

Kullanıcı 3 STK'ya aynı anda üye olmak istiyor → tek checkout, tek ödeme (toplamda 300 TL), 3 ayrı ngo_membership kaydı.

**UX implikasyon:** "Sepet" benzeri bir konsept — şu an yok. V2 için aday.

### Hızlı form doldurma

- İyiBiri profil bilgileri otomatik → STK formu pre-fill.
- Sadece STK-specific sorular kalır (2-3 soru hedef).
- **Hedef:** Upsell sırasında 60 saniye altı form.

### Onboarding kuyruk

Yeni kayıt olan kullanıcıya `/onboarding/causes` ekranında seçtiği kategorilere uygun STK'lar otomatik önerilir. 3 STK önerisi → "hepsini takip et" (ücretsiz, `user_ngo_subscriptions`) → sonra "en ilgilisine üye ol" upsell.

---

## 9. STK Admin Tarafı (B2B Açısı)

Şu an İyiBiri'de STK admin tool'ları **yok** (sadece İyiBiri super-admin var — `/admin/missions`). V2 için workstream aday:

**İhtiyaçlar:**
- STK admin login (`/admin/ngo/[id]`).
- Üye liste (CSV export).
- Yeni üye onayı (approval_required true ise).
- Form alanı yönetimi (membership_form_fields jsonb editör).
- Görev oluşturma (mission creator).
- İletişim (newsletter to members — mass email).
- Analytics (üye sayısı, churn, retention).

**Benchmark:** fonzip tam bu SaaS modelini çalışıyor [S29]. İyiBiri "fonzip + kullanıcı deneyimi" birleşimi → katma değer STK için yüksek.

---

## 10. Benchmark Karşılaştırma

| Platform | Komisyon | Güçlü yan | Zayıf yan |
|---|---|---|---|
| **Patreon** [S26] | %10 platform + %2.9 processor | Scale + marka | Mobil weak, creator-focus (STK değil) |
| **fonzip** [S29] | SaaS ₺/ay (detay yok) | TR odaklı + STK UI | Kullanıcı-yüzey deneyim zayıf |
| **GlobalGiving** | ~%5-15 (model karışık) | Global trust + vetting | Türkçe değil + lokal STK az |
| **İyiBiri (önerim)** | %8 platform + %2.99 processor | Gamification + Karma + mobile-first | Yeni oyuncu, trust yok henüz |

İyiBiri'nin mimari avantajı: **kullanıcı zaten aktif (görev tamamlayan) + STK üyesi aynı platformda** — cross-selling doğal. Patreon ve fonzip'te bu yok.

---

## 11. Sonuç ve Öneriler

1. **3 katmanlı kullanıcı-STK ilişkisi:** "İyiBiri üyesi" (free, platform) / "STK takipçisi" (free, user_ngo_subscriptions) / "STK üyesi" (paid, ngo_memberships). Net kavram ayırımı UI'da da görünsün.
2. **Para akışı: Seçenek P.1 (aracı) + iyzico Marketplace + %8 platform komisyon.** Patreon'dan %3 daha ucuz — rekabet avantajı.
3. **KVKK çifte onay zorunlu** — İyiBiri genel + STK özel + `form_data.kvkk_accepted_at` kayıt.
4. **14 gün cayma hakkı net UI** — kullanıcı hakları görünsün (yasal + trust avantajı).
5. **STK admin tool'ları V2 için kritik** — fonzip benzeri SaaS UI. Büyük STK'ları çekmek için şart.
6. **Multi-NGO bundle** Yıl 2+ aday.
7. **UX akışı UX-researcher ile test edilmeli** — özellikle "tek tıkla cross-register" hedefi gerçek mi.

---

## 12. Açık Sorular (Q15+ — product-analyst kuyruğuna)

- **Q15 🔴** Komisyon oranı %8 kabul edilebilir mi, önce pilot STK'larla müzakere?
- **Q16 🟡** Auto-renew default on mı off mı (TR kullanıcı psikolojisi)?
- **Q17 🟡** STK admin UI kapsamı V2'de nereye kadar (min/viable)?
- **Q18 🟢** Multi-NGO bundle Yıl 2 mi Yıl 3 mü?
- **Q19 🟢** 3 katmanlı üyelik kavramları (Takipçi / Üye / Katmanlar) UI isimlendirmesi ne olur?

---

## 13. Sonraki Memolar ve Delegeler

- `2026-04-XX-iyzico-marketplace-sub-merchant-teknik.md` — para akışı teknik (supabase-backend birlikte).
- `2026-04-XX-stk-admin-ui-minimum-kapsam.md` — product-analyst workstream.
- `2026-04-XX-uyelik-kvkk-ciftli-onay-prosedur.md` — hukuk danışmanı + content-tr-voice.
- **UX-researcher'a:** "Tek tıkla multi-NGO register" user journey map.
- **UI-designer'a:** Membership form parametrik field spec + KVKK double checkbox.

## Referanslar (yeni)

- [S29] Fonzip platform — fonzip.com + pricing + features
- [S30] TR Tüketici Kanunu 6502 — 14 gün cayma hakkı (istanbullawyerfirm.com referans)
- [S26] Patreon fees — (önceki memo, burada da atıf)

Detay: `docs/strategy/99-sources/index.md`.
