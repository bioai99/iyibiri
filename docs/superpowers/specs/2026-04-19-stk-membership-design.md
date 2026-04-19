# İyilik Öncüsü Üyelik Sistemi — Tasarım Spec'i

## Özet

Kullanıcıların İyilik Öncülerine (STK, belediye, sponsor) üye olmasını sağlayan esnek sistem. MVP'de tek tıkla üyelik, ileriye dönük onay/ödeme/eğitim altyapısı hazır.

## Kararlar

| Konu | MVP Kararı | Gelecek |
|------|-----------|---------|
| Üyelik modeli | Ücretsiz, anında | Aidatlı + onaylı seçenekler |
| Onay süreci | Yok, direkt üye | STK admin panelinden onay |
| Ödeme | Yok | iyzico/Stripe entegrasyonu |
| Ek bilgi formu | STK bazında parametrik (basit) | Tam form builder |
| Eğitim | Yok | STK bazında zorunlu eğitim modülleri |

---

## 1. Veritabanı

### `ngo_memberships` tablosu (YENİ)

```sql
create table public.ngo_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  ngo_id text references public.ngos not null,
  status text not null default 'active' check (status in ('pending','active','rejected','expired','cancelled')),
  tier text default 'free' check (tier in ('free','basic','premium')),
  form_data jsonb default '{}',
  joined_at timestamptz not null default now(),
  expires_at timestamptz,
  unique(user_id, ngo_id)
);
```

**Alanlar:**
- `status`: MVP'de her zaman `active`. Gelecekte `pending` (onay bekliyor), `rejected`, `expired` (süre doldu), `cancelled`
- `tier`: MVP'de `free`. Gelecekte `basic` (aidatlı), `premium` (üst seviye)
- `form_data`: STK'nın istediği ek bilgiler JSON olarak saklanır (telefon, yaş, motivasyon vs.)
- `expires_at`: Süresiz üyelikler için null, yıllık üyelikler için bitiş tarihi

### `ngos` tablosuna ek kolonlar

```sql
alter table public.ngos
  add column if not exists membership_enabled boolean default true,
  add column if not exists membership_form_fields jsonb default '[]',
  add column if not exists membership_approval_required boolean default false,
  add column if not exists membership_description text;
```

**`membership_form_fields` yapısı:**
```json
[
  { "key": "phone", "label": "Telefon", "type": "tel", "required": true },
  { "key": "motivation", "label": "Neden gönüllü olmak istiyorsun?", "type": "textarea", "required": false },
  { "key": "experience", "label": "Daha önce gönüllülük yaptın mı?", "type": "select", "options": ["Evet", "Hayır"], "required": false }
]
```

MVP'de çoğu STK için bu alan boş olur — yani ek form yok, tek tıkla üyelik.

---

## 2. Kullanıcı Akışı

### 2a. Üye Olma

```
STK Profili → "Üye Ol" butonu
  ↓
  form_fields boş mu?
    EVET → Direkt üye yap → Başarılı ekranı
    HAYIR → Form ekranı → Doldur → Üye yap → Başarılı ekranı
  ↓
  approval_required?
    HAYIR (MVP) → status = 'active'
    EVET (gelecek) → status = 'pending', STK'ya bildirim
```

### 2b. Başarılı Ekranı

- Konfeti efekti
- "X'e hoş geldin!" mesajı
- STK logosu + üyelik kartı görünümü
- "Görevleri keşfet" CTA

### 2c. Üyelik Durumu

Kullanıcı şu yerlerde üyeliklerini görür:
- **Profil** → "Üyeliklerim" bölümü (STK logoları + tarih)
- **STK Profili** → "Üye Ol" butonu yerine "Üyesin ✓" badge
- **Görev Kartı** → Üye olduğun STK'nın görevlerinde "Üye" rozeti

---

## 3. STK Profil Sayfası Değişiklikleri

Mevcut STK profil sayfasına eklenenler:

### "Üye Ol" Butonu
- Sayfanın üst kısmında, paylaş/beğen butonlarının yanında
- Zaten üyeyse: "Üyesin ✓" (altın badge, tıklanınca üyelik detayı)
- Üye değilse: "Üye Ol" (gold CTA buton)

### Üyelik Bilgi Kartı
- Mevcut "Aylık destek" kartını değiştir
- STK'nın `membership_description` metni
- Üye sayısı
- "Üye Ol" CTA

---

## 4. Üyelik Formu (Parametrik)

STK'nın `membership_form_fields` dolu ise gösterilir. Desteklenen alan tipleri:

| Tip | UI | Örnek |
|-----|-----|-------|
| `text` | Text input | Ad soyad |
| `tel` | Tel input | Telefon |
| `email` | Email input | İletişim email |
| `textarea` | Multi-line | Motivasyon |
| `select` | Dropdown | Deneyim seviyesi |
| `chips` | Çoklu seçim | İlgi alanları |

Form verileri `ngo_memberships.form_data` JSONB'ye kaydedilir.

---

## 5. Görev Erişim Kuralları

MVP'de:
- **Tüm görevler herkese açık** — üyelik zorunlu değil
- Üye olduğun STK'nın görevlerinde "Üye" rozeti gösterilir
- İleride: bazı görevler sadece üyelere açık olabilir (görev bazında `members_only: true` flag)

---

## 6. Profil Sayfası — Üyeliklerim

Profilde yeni bölüm:
- Üye olunan STK'ların logoları (yatay scroll)
- Her biri tıklanınca STK profiline gider
- Üyelik tarihi gösterilir

---

## 7. Bildirim Tetikleyicileri

Üyelikle ilgili bildirimler (gelecekte):
- "X'e üye oldun! İlk görevini seç." (anında)
- "X yeni görev paylaştı" (üye olduğun STK'lardan)
- "Üyelik yenileme zamanı" (aidatlı üyelikler için)

---

## 8. Kapsam Dışı (MVP)

- Ödeme entegrasyonu
- STK admin paneli
- Onay/ret workflow
- Eğitim modülleri
- Üyelik sertifikası
- Saat takibi (50 saat = sertifika)

Bunlar ayrı spec'lerle ele alınacak.
