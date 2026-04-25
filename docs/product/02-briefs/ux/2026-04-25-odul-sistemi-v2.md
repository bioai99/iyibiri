# UX Brief — Ödül Sistemi V2 (Karma → Gerçek Değer Dönüşümü)

**Tarih:** 2026-04-25  
**Sahip:** product-analyst  
**Durum:** Ready for UX research  
**Sonraki sahipler:** ux-researcher → ui-designer → frontend-engineer + supabase-backend

**Upstream:**  
- Strateji memo: `docs/strategy/06-memos/2026-04-25-odul-sistemi-derin-arastirma.md`
- Rekabet analizi: `docs/strategy/02-competitors/2026-04-25-faz2-rekabet-analizi.md`
- Faz 2 backlog: `docs/product/01-workstreams/2026-04-25-faz2-backlog-master.md`

**Bağlı ADR:**  
- ADR-001 NSM (MAKE) — ödül sistemi, sponsor KPI sürüşü
- ADR-006 bağış V2 — match mekanizması
- ADR-014-TBD — matching algoritma
- ADR-XXX-reward — kupon/match/badge tier ekonomisi (bu workstream'de açılacak)

**Priority:** P1 · **Faz:** V2 (Ay 6–9 Q2–Q3 2026) · **Effort:** XL (8–12 hafta, 4 sprint) · **Team:** product-analyst + ux-researcher + ui-designer + 2 FE + 1 BE + 1 Supabase

---

## 1. Governing Thought (Ana Cevap)

İyiBiri V2 ödül sistemi, gönüllü tarafında **karma birikimini (soyut puan) kupon + bağış match + dijital badge kombinasyonuyla gerçek değere dönüştürmesi** ile; sponsor tarafında ise **CSR KPI'ları ölçülebilir hale getirerek yıllık ₺1–3M kontrat değeri** sağlarsa başarılı; bunu yapmak için Türkiye'ye özgü 4 yasal kısıt (tüketici hukuku şeffaflığı, 300₺ hediye vergisi, BDDK elektronik para yasakları, KVKK çifte onay) içinde yer alması şart.

---

## 2. Kullanıcı Persona & JTBD

### Ayşe (Gönüllü, 28 yaş, İstanbul)

**Profili:**  
2000 karma birikmiş, haftada 1–2 görev yapıyor, STK'nın misyonuna güveniyor, ancak "kazandığım puanları ne yapacağım" sorunu var.

**JTBD (Jobs-to-be-Done):**
1. **"Karma'mı değerli bir şeye dönüştürmek istiyorum"** → Kullanıcı 500–5000 karma harcayıp anında kupon koduyla Migros'ta ürün alabilmeli.
2. **"Marka kuponu aldığımda nerede geçerli olduğunu anında görmek istiyorum"** → Kupon kodu + Migros app linki + "30 gün geçerli, kasada gösteriniz" adımları 1 ekranda.
3. **"Bağış yaparsam ve sponsor 2x katsayısı ile etkim artarsa, motivasyonum artar"** → "Sen ₺100 bağışla, Migros ₺100 daha ver → TEMA'ya ₺200" mesajı net olmalı.
4. **"Özel bir rozetle sosyal medyada paylaşmak istiyorum"** → Badge (İyiBiri Elçi, Fidan Ustası vb) Instagram story'de paylaşılabilir OG image ile.
5. **"Ayın en iyi gönüllüsü olmak bana statü kazandırır"** → Leaderboard'da görünüş + "İyiBiri Elçi" title.

### Murat (Sponsor CSR Yöneticisi, 42 yaş, Migros Kurumsal)

**Profili:**  
Migros'un CSR raporu yazmak zorunda. Gönüllü gençlere nasıl dokunduğunu ölçülebilir göstermek istiyor. Brand safety kritik.

**JTBD:**
1. **"Gönüllülere ulaştığımızı CSR raporunda ölçülebilir şekilde göstermek istiyorum"** → Dashboard: "2026 Q2'de 1500 gönüllüye ₺300k kupon dağıttık, 1200'ü kullandı (80%), 450k impressions sosyal medya."
2. **"Kampanyama kaç kişi ulaştı, hangi segmentten?"** → "Gen Z 45%, 18–25 yaş 60%, İstanbul 65%, Ankara 20%" breakdown.
3. **"Kupon redemption trafiğini kendi POS'umla eşleştirmek istiyorum"** → (İleriki versiyon) API ile Migros Sanal Kart backendine kupon kodu sorgulama.
4. **"Marka güvenliği: toxic topics (siyaset, din tartışması) dışında kalsın"** → Platform moderation, sponsor kategori exclusion list.
5. **"Otomatik yenilenen quarterly kampanya istiyorum"** → "Her quarter başında otomatik canlı, bir tıkla deactivate," template seçimi.

---

## 3. JTBD Matrisi — Detay

| # | JTBD | Feature | Wireframe Ekran | Priority |
|---|---|---|---|---|
| **User 1** | Karma'mı değerli şeye dönüştürme | Rewards Hub (katalog) + filter | Screen 1: Grid layout | P0 |
| **User 2** | Kupon şartlarını anında görmek | Reward detail card | Screen 2: Detail modal | P0 |
| **User 3** | Bağış match (2x etki) | Donation match redemption flow | Screen 4: Confirm + success | P0 |
| **User 4** | Badge sosyal paylaşım | Badge share → Instagram OG | Screen 5: Share celebration | P1 |
| **User 5** | Leaderboard statüsü | Leaderboard "friends" + ranking | Screen 6: Leaderboard tab | P1 |
| **Sponsor 1** | Quarterly CSR rapor PDF | Analytics dashboard + export | Admin screen 1: Dashboard | P0 |
| **Sponsor 2** | User segmentasyon (yaş/şehir) | Cohort analytics | Admin screen 2: Cohort view | P0 |
| **Sponsor 3** | POS entegrasyonu | API key management (scope: V2.1) | Admin screen 3: API settings | P2 |
| **Sponsor 4** | Brand safety (topic exclusion) | Moderation settings | Admin screen 4: Safety settings | P1 |
| **Sponsor 5** | Otomatik kampanya | Campaign template + auto-renew | Admin screen 5: Campaign builder | P1 |

---

## 4. Test Data Senaryosu — 3 Sponsor × 10+ Katalog Item

**Amaç:** V2 launch pilot (500+ redemption, 4-hafta) için mock data ve senaryoları tanımlamak.

### Sponsor 1: Migros (Gıda + Bağış Match)

| Ödül | Kategori | Karma Cost | Değeri | Tier | Stok | Açıklama |
|---|---|---|---|---|---|---|
| Migros ₺100 kupon | Kupon | 500 | 100 TRY | Gümüş | Sınırsız | %15 indirim, 30 gün geçerli |
| TEMA fidan ×2 (match) | Bağış match | 300 | 100 TRY platform match | Bronz | Sınırsız | Kullanıcı ₺50, Migros ₺50 |
| Migros Jet Bisiklet Günü | Deneyim | 1500 | Katılım bedeli | Altın | 20 bilet/ay | Kapalı davet, top 50 user |
| Migros ₺50 kupon (çift) | Kupon | 250 | 50 TRY | Bronz | Sınırsız | Çift paket, arkadaşla paylaş |
| TEMA fidan sertifikası | Fiziksel | 200 | Sanal sertifika | Bronz | Sınırsız | PDF + shared Instagram post |

### Sponsor 2: Garanti BBVA (Finansal + Bağış)

| Ödül | Kategori | Karma Cost | Değeri | Tier | Stok | Açıklama |
|---|---|---|---|---|---|---|
| Garanti Bonus ₺200 iade | Kupon | 1000 | 200 TRY | Gümüş | Sınırsız | Garanti app'te kullanılabilir |
| LÖSEV ×2 (match) | Bağış match | 500 | 200 TRY platform match | Gümüş | Sınırsız | Yaşlı bakım, ₺100+₺100 |
| Garanti Müzesi özel tur | Deneyim | 2500 | Rehberli tur + çay | Altın | 15 tur/ay | Gurupla max 20 kişi |
| Garanti kart cüzdan takı | Fiziksel | 750 | Hediye ürün | Gümüş | 50 stok/ay | Baskılı, sertifika ile |
| Ticari Hayat eğitim kursu | Dijital | 800 | 4-hafta online | Gümüş | Sınırsız | CEO tarafından kayıt mesajı |

### Sponsor 3: Turkcell (Teknoloji + Eğitim)

| Ödül | Kategori | Karma Cost | Değeri | Tier | Stok | Açıklama |
|---|---|---|---|---|---|---|
| Turkcell dijital paket 3 ay | Kupon | 800 | 3 GB/ay | Gümüş | Sınırsız | Uygulamaya SMS linki |
| Kodluyoruz ×2 (match) | Bağış match | 400 | 160 TRY platform match | Bronz | Sınırsız | STEM eğitim bağışı |
| TikTok partnership event | Deneyim | 2000 | Konser + meet & greet | Altın | 25 bilet/ay | Gen Z targeted |
| Dijital Dönüşüm sertifikası | Dijital | 5000 | Udemy + certificate | Elmas | 5/ay | 12-hafta online kurs |
| Turkcell Young Hub access | Dijital | 3000 | 1 yıl mentorship | Altın | 10/ay | Girişimci danışmanlık |

### Test Senaryoları

**Scenario A: Bronz tier user (Dara, 400 karma)**
- TEMA fidan ×2 redemption → Email confirmation → Shared Instagram story (OG image) → Verification (STK foto)
- Türkçe flow, simpler CTA, quick-win dopamine loop

**Scenario B: Gümüş tier user (Ali, 1200 karma)**
- Migros ₺100 kupon redemption → Code copy → Browser redirect Migros app → Checkout
- Bağış match redemption (TEMA) → Dialog "Ali'nin adına ₺100 bağış" → Donation success email → Badge unlock

**Scenario C: Altın tier user (Zeynep, 3500 karma)**
- Garanti Müzesi tur redemption → Raffle entry (top 100 users, 1:4 chance) → Winner notification → Tur detay email → STK thank-you letter

**Scenario D: Sponsor analytics (Murat, Migros CSR)**
- Dashboard açılış → April redemption: 250 kod talep, 180 kullanım (72%) → Segment breakdown: Gen Z 45%, Kadın 60% → PDF download → "CSR Rapor Q2 2026" attachment

---

## 5. 5-Adım Redemption Flow (Kullanıcı Tarafı)

### Step 1: Rewards Hub (Katalog & Filter)

```
┌─────────────────────────────────────┐
│ İyiBiri Ödüller                      │
│                                      │
│ Karma: 1200 ┃ [Ödül Geçmişi]        │
├─────────────────────────────────────┤
│ Filtrele:                            │
│ ├─ [Hepsi] [Kupon] [Deneyim] [Bağış]│
│ ├─ [Bronz] [Gümüş] [Altın] [Elmas]  │
│ └─ [Hepsi] [Migros] [Garanti] [Turk]│
├─────────────────────────────────────┤
│ ┌──────────┐  ┌──────────┐          │
│ │ Migros   │  │ Garanti  │          │
│ │ ₺100kup  │  │ ₺200iade │          │
│ │ 500 km   │  │1000 km   │          │
│ │[Redeem]  │  │[Redeem]  │          │
│ └──────────┘  └──────────┘          │
│                                      │
│ ┌──────────┐  ┌──────────┐          │
│ │ TEMA ×2  │  │ Bisiklet  │          │
│ │Bağış mat │  │ Deneyim   │          │
│ │ 300 km   │  │ 1500 km   │          │
│ │[Redeem]  │  │[Redeem]   │          │
│ └──────────┘  └──────────┘          │
└─────────────────────────────────────┘
```

**Key elements:**
- Sponsors as top-level filter (Migros logo prominent)
- Category pill selector (kupon/deneyim/badge), tier pill selector
- Grid layout (2-3 cards/row mobile, 4 desktop)
- Card hierarchy: sponsor logo + ödül image + karma cost + tier badge + action button

### Step 2: Reward Detail (Bottom Sheet / Modal)

```
┌─────────────────────────────────────┐
│  ╳                                   │
│ ┌─────────────────────────────────┐ │
│ │  Migros Logo | ₺100 Kupon       │ │
│ │                                  │ │
│ │ [Hero image: Migros storefront]  │ │
│ └─────────────────────────────────┘ │
│                                      │
│ Karma gereklilği: 500               │
│ Senin karma'n: 1200 ✅              │
│                                      │
│ Geçerlilik: 30 gün                  │
│ Nerede kullanabilirim? Migros'ta   │
│                                      │
│ Ödül özellikleri:                    │
│ • Migros market, hipermarket         │
│ • Promo ürünler hariç                │
│ • Öğrenci kartı ile kombinasyon ok   │
│                                      │
│ [Şartları Oku] (bottom sheet açma)  │
│                                      │
│ ┌─────────────────────────────────┐ │
│ │ [ŞIMDI TALEP ET]                │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Key patterns:**
- Sponsor co-branding (logo + color), hero image
- Karma cost + visual feedback (green checkmark yeterli ise)
- Expiry + location + terms teaser link
- Single CTA button (prominent, full width)

### Step 3: Confirm Dialog (Bottom Sheet with Karma Deduction Animation)

```
┌─────────────────────────────────────┐
│  Ödülü Talep Et?                    │
├─────────────────────────────────────┤
│                                      │
│ Migros ₺100 Kupon                   │
│ Karma: 500                           │
│                                      │
│ Senin Karma'n:                       │
│ 1200 ──── [Animasyon] ──→ 700       │
│  ┌─────────────────────┐            │
│  │ Kanaatkar Ol        │ ℹ️          │
│  │ (TR: "Be mindful")  │            │
│  │ Her ödülü bilinçli  │            │
│  │ seç — daha fazla    │            │
│  │ katı olsun.         │            │
│  └─────────────────────┘            │
│                                      │
│ ┌─────────────────────────────────┐ │
│ │ [ONAYLA]      [GERİ]            │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Key elements:**
- Karma counter animate (1200 → 700, 0.8s duration, spring motion)
- "Kanaatkar Ol" tooltip (usage education)
- 2 CTAs: confirm + back

### Step 4: Success Celebration

```
┌─────────────────────────────────────┐
│                                      │
│           🎉🎊🎉 (Confetti)          │
│                                      │
│     Tebrikler!                       │
│                                      │
│  Migros Kupon Kazandın              │
│                                      │
│  ┌─────────────────────────────────┐│
│  │ IYBIBERI-2026-50001             ││
│  │   [Copy Kopiala]                ││
│  └─────────────────────────────────┘│
│                                      │
│  Talimatlar:                         │
│  1. Migros app'ini aç (link)        │
│  2. "Kupon Gir" → Kodu yapıştır    │
│  3. Kasada "Yönetilen Kupon" seç    │
│  4. Öde ve bitir ✨                 │
│                                      │
│  ⏰ Kupon 30 gün geçerli             │
│  (Expire: 2026-05-25)               │
│                                      │
│ ┌─────────────────────────────────┐ │
│ │ [Instagram'da Paylaş] 📸        │ │
│ └─────────────────────────────────┘ │
│                                      │
│ ┌─────────────────────────────────┐ │
│ │ [Ödül Geçmişini Gör]            │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Key interaction:**
- Confetti animation (Framer Motion, 1s duration)
- Copy-to-clipboard button (toast: "Kopyalandı!")
- Multi-step talimatlar (Numara formatı)
- Social share button (Instagram story OG image generator)
- Next step CTA'lar

### Step 5: Reward History & Redemption Status

```
┌─────────────────────────────────────┐
│ 📋 Ödül Geçmişi                     │
├─────────────────────────────────────┤
│                                      │
│ ┌─────────────────────────────────┐ │
│ │ 2026-04-25                      │ │
│ │ Migros ₺100 Kupon               │ │
│ │ Kod: IYBIBERI-50001             │ │
│ │ Status: ✅ Talep Edildi         │ │
│ │ Expire: 2026-05-25              │ │
│ │                                 │ │
│ │ [Tekrar] [Bitti] [Paylaş]      │ │
│ └─────────────────────────────────┘ │
│                                      │
│ ┌─────────────────────────────────┐ │
│ │ 2026-04-20                      │ │
│ │ Garanti ₺200 İade               │ │
│ │ Kod: BNFT-48002                 │ │
│ │ Status: ✅ Kullanıldı           │ │
│ │                                 │ │
│ │ [Makbuz] [Yardım]               │ │
│ └─────────────────────────────────┘ │
│                                      │
│ ┌─────────────────────────────────┐ │
│ │ 2026-04-15                      │ │
│ │ TEMA ×2 Bağış Match             │ │
│ │ Status: ⏳ Bekleniyor (STK onay)│ │
│ │                                 │ │
│ │ [Durum Kontrolü]                │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Status values:**
- ✅ Talep edildi (kod gönderildi)
- ✅ Kullanıldı (redemption confirmed)
- ⏳ Bekleniyor (awaiting STK verification)
- ❌ Süresi doldu (expiry reached)

---

## 6. DB Schema Önerisi (Migration 024+)

### Tablo Yapısı

**`sponsors`** — Ödül veren markalar

```sql
create table public.sponsors (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  logo_url text,
  brand_color text default '#000000',
  contact_email text,
  contact_phone text,
  website text,
  kvkk_dpa_signed_at timestamptz,
  kvkk_dpa_url text,
  active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz default now()
);
-- RLS: public read (active = true), admin insert/update
```

**`sponsor_campaigns`** — Sponsor'un periyodik kampanyaları

```sql
create table public.sponsor_campaigns (
  id uuid primary key default gen_random_uuid(),
  sponsor_id text not null references public.sponsors(id) on delete cascade,
  name text not null,
  description text,
  
  budget_total_try numeric check (budget_total_try > 0),
  budget_spent_try numeric default 0,
  
  active boolean default true,
  starts_at timestamptz,
  ends_at timestamptz,
  auto_renew boolean default true,
  auto_renew_interval text default 'quarterly', -- 'monthly', 'quarterly', 'annual'
  
  category_exclusivity text[], -- ['market', 'fashion'] = hiç başka ödül paketçisi yok
  topic_exclusions text[], -- ['politics', 'religion'] = STK'da bu konuştuysa görev eligible değil
  
  created_at timestamptz not null default now(),
  updated_at timestamptz default now()
);
-- Index: sponsor_id, active, starts_at desc
```

**`rewards`** — Mevcut tabloyu genişlet (Migration 024: ADD COLUMN)

```sql
-- Mevcut reward_type, tier yok; ekleme:

alter table public.rewards add column if not exists sponsor_id text references public.sponsors(id);
alter table public.rewards add column if not exists campaign_id uuid references public.sponsor_campaigns(id);

alter table public.rewards add column if not exists reward_type text check (
  reward_type in ('coupon', 'experience', 'donation_match', 'badge', 'physical', 'digital')
) default 'coupon';

alter table public.rewards add column if not exists tier text check (
  tier in ('bronze', 'silver', 'gold', 'diamond')
) default 'silver';

alter table public.rewards add column if not exists stock_remaining integer; -- null = unlimited
alter table public.rewards add column if not exists expiry_days integer default 30;
alter table public.rewards add column if not exists terms_url text;
alter table public.rewards add column if not exists brand_color text; -- sponsor fallback
alter table public.rewards add column if not exists image_url text; -- hero image (Storage)

-- Bağış match için
alter table public.rewards add column if not exists donation_ngo_id text references public.ngos(id);
alter table public.rewards add column if not exists donation_match_multiplier numeric default 1.0;
alter table public.rewards add column if not exists donation_base_amount numeric; -- sponsor ₺X katkı

-- Metadata
alter table public.rewards add column if not exists metadata jsonb default '{}'::jsonb; -- custom fields per sponsor
```

**`reward_redemptions`** — Mevcut tabloyu genişlet

```sql
alter table public.reward_redemptions add column if not exists redemption_code text unique; -- Generated kupon kodu
alter table public.reward_redemptions add column if not exists expiry_date timestamptz;
alter table public.reward_redemptions add column if not exists used_at timestamptz;
alter table public.reward_redemptions add column if not exists used_by_partner boolean default false; -- POS scan (future)
alter table public.reward_redemptions add column if not exists metadata jsonb default '{}'::jsonb;

-- Status transitions
alter table public.reward_redemptions add column if not exists status text check (
  status in ('pending', 'redeemed', 'used', 'expired', 'cancelled')
) default 'pending';
```

### RLS Policies

```sql
alter table public.sponsors enable row level security;
alter table public.sponsor_campaigns enable row level security;

-- Sponsors: public read
create policy "Public read sponsors"
  on public.sponsors for select
  using (active = true);

-- Sponsor campaigns: public read
create policy "Public read campaigns"
  on public.sponsor_campaigns for select
  using (active = true and starts_at <= now() and (ends_at is null or ends_at > now()));

-- Rewards: public read (filter by active sponsor)
create policy "Public read rewards"
  on public.rewards for select
  using (exists (select 1 from sponsors s where s.id = rewards.sponsor_id and s.active));

-- Redemptions: user sees own
create policy "Users view own redemptions"
  on public.reward_redemptions for select
  using (auth.uid()::text = user_id);

create policy "Users create own redemptions"
  on public.reward_redemptions for insert
  with check (auth.uid()::text = user_id);
```

**Migration numarası:** 024 (022-023 son, bu sonraki). 

---

## 7. OST — Opportunity Solution Tree

```
                    Outcome: V2 Ödül launch
           4 hafta pilot, 500+ redemption, NPS ≥40
            ↓
   ┌────────┴────────┬────────────┬────────────┐
   │                 │            │            │
Opp 1:           Opp 2:       Opp 3:      Opp 4:
Karma            Sponsor      Brand       STK
biriktiği        CSR rapor    safety      görünürlük
halde            metrikleri   (topic      + bağış
"ne yapacağım"   ölçülemiyor  exclusion)  match

│                 │            │            │
├─ Sol 1.1:      ├─ Sol 2.1:  ├─ Sol 3.1:  ├─ Sol 4.1:
│  Tier katalog   │  Dashboard │ Moderation │ TEMA
│  (Bronz–Elmas)  │  analytics │ filter     │ fidan
│  + kupon search │  + PDF     │ (admin)    │ matching
│  + filter       │  export    │            │
│                 │            │            │
├─ Sol 1.2:      ├─ Sol 2.2:  └─ Sol 3.2:  └─ Sol 4.2:
│  Bağış match    │  Quarterly │ Content    │ Fidye +
│  redemption     │  email+PDF │ moderation │ adak
│  (2x motive)    │ (auto)     │ (STK led)  │ (TR-first)
│                 │            │            │
└─ Sol 1.3:      └─ Sol 2.3:                └─ Sol 4.3:
   Badge social      API export               Bağış
   share (OG)        (Sponsor POS)            tracking
   + leaderboard                              + reporting
```

**Test tahminleri (Pilot 4 hafta):**
- Sol 1.1 (katalog): 300–400 user test, conversion 40–50%
- Sol 1.2 (match): 50–80 redemption (bağış match daha düşük friction)
- Sol 1.3 (badge share): 20–30 Instagram story (dijital badge share friction var)
- Sol 2.1 (dashboard): Sponsor analytics weekly view, PDF export satisfaction 4/5+
- Sol 3.1 (moderation): 0 safety incident (success criterion = no blocked content)
- Sol 4.1 (fidan match): Ramazan özel kampanya trial, 10–15 redemption target

---

## 8. Cagan 4-Risk Kontrolü

| Risk | Durum | Kanıt / Test | Mitigation |
|---|---|---|---|
| **Value Risk** | ⚠️ **Partial** | JTBD araştırması Ayşe + Murat ile — kupon ≥40% accept, match ≤20% ilk iterasyon (bağış psikolojisi kompleks). Badge share %5–10 friction yüksek. | Mini UX research (3 gönüllü, 30 min unmoderated prototype test) + Sponsor feedback focus group (Migros CSR team, 2 saat) |
| **Usability Risk** | ✅ **Mitigated** | V1 rewards page mevcut (basit), Duolingo + Strava UI patterns test edilmiş. 5-step flow reasonable, bottom-sheet pattern mobile standard. | Heuristic audit mevcut reward UI + prototype usability test (8 user, moderated) + accessibility scan (WCAG AA) |
| **Feasibility Risk** | ✅ **Low** | Supabase rewards table var (lite schema eklemeler). Sponsor onboarding flow (backend) 2–3 hafta API. Kupon integration (Migros Sanal Kart REST API) known vendor. | Tech spike migration + sponsor API integration (1 hafta parallel) + staging test (Migros sandbox) |
| **Viability Risk** | ✅ **High** | Strateji memo Bölüm 2.2 — sponsor motivation (CSR KPI) net. ₺1–3M/sponsor yıllık, pilot 3 sponsor × ₺300k = ₺900k Yıl 1 (conservative). Platform MAKE NSM üçgen kapanır. | Migros + Garanti legal + procurement brief (Q2 Haziran), PO signed Temmuz. Kontrat template hazır (avukat feedback sonrası). |

**Açık karar:** Deneyim raffle (concert ticket) piyango yasallığı ve guarantee mekanizması (stock out scenario). → **ADR-XXX-experience-reward gerekli.** Avukat konsültasyonu, e-ticaret platform precedent araştırma.

---

## 9. LNO — Leverage / Neutral / Overhead

| Kategorisi | Features | Effort | Impact | Type | Sıra |
|---|---|---|---|---|---|
| **Leverage** | Katalog browse + filter (tier/sponsor) + kupon redemption simple flow | 3w | 300+ user adoption, ödül utilization 40%+ | MVP yapılır | **Sprint 1** |
| **Leverage** | Email notification (kupon kodu + expiry reminder) + success UX | 1.5w | STK retention + user delight (dopamine peak) | SendGrid integration | **Sprint 1** |
| **Leverage** | Sponsor dashboard MVP (redemption count + basic analytics) | 2w | Sponsor NPS +15, CSR rapor başlangıç | Admin UI | **Sprint 2** |
| **Neutral** | Badge share (OG image generator, Instagram integration) | 1.5w | Viral coefficient +10%, brand awareness | Secondary loop | **Sprint 2** |
| **Neutral** | Bağış match flow + verification (STK approval) | 2w | User engagement depth (intrinsic motivation), match conversion 15–20% | Complex flow | **Sprint 2-3** |
| **Neutral** | Detailed sponsor analytics (cohort, retention, segment breakdown) | 1.5w | Quarterly CSR PDF export, sponsor retention 90%+ | Ad-hoc analytics | **Sprint 3** |
| **Overhead** | Deneyim raffle mekanizması + POS scan integration (V2.1) | 2w | "Guardrail" ödülü, raffle fairness | Scope deferral | **Sprint 4 / V2.1** |
| **Overhead** | Sponsor API (kupon redemption tracking via Migros POS) | 3w | Sponsor closing loop (use confirmation), churn ↓ | Advanced feature | **V2.1+** |
| **Overhead** | Multi-language (EN, KU) + localization | 2w | International expansion prep | Market expansion | **V2.2+** |

**Öncelik:** Leverage (Sprint 1–2) → Neutral (Sprint 2–3) → Overhead (Sprint 4 / V2.1 çıkarmamız).

---

## 10. Shape Up — 4-Sprint × 2 Hafta (8 Hafta Total)

**Appetite:** XL (8–12 hafta dev time; 2 FE + 1 BE + 0.5 UX paralel)

### Sprint 1: Rewards Katalog + Redemption MVP (Hafta 1–2)

**Scope:**
- DB migration (sponsors + campaigns + reward_type kolonları) + seed script (3 sponsor × 10 reward)
- `/dashboard/rewards` page (katalog hub + grid + filter UI)
- `/dashboard/rewards/[id]` detail page (modal / bottom sheet)
- Redemption flow (Step 2–4: detail → confirm → success)
- Email notification: kupon code + talimatlar (SendGrid template)
- Success celebration component (confetti + code copy)

**Rabbit holes:**
- Sponsor branding (color gradient, logo placement) — minimum viable, sponsor brand-kit later
- Stock management edge cases (overselling) — assume unlimited stock + manual cap later
- Internationalization — TR only, multi-lang V2.1

**No-gos:**
- Deneyim raffle mekanizması (complexity)
- Badge social share (V2 Sprint 2)
- Sponsor dashboard admin (V2 Sprint 2)
- Matching gift verification (STK API integration V2.1)

**Open question:**
- Kupon code format: IYBIBERI-DATE-SEQ mi, yoksa Migros provided code mi?
- Email delivery: Resend vs SendGrid? (ADR-015)

### Sprint 2: Sponsor Dashboard MVP + Social Share (Hafta 3–4)

**Scope:**
- `/admin/sponsor/[sponsorId]/` route group (new)
- Sponsor dashboard: campaign list, redemption count timeline, basic analytics (table: category × count)
- Weekly snapshot email to sponsor
- Badge social share (OG image generator) + Instagram story test
- Push notification (Firebase) setup (optional if time)

**Key stories:**
- Sponsor opens dashboard, sees "April: 250 redemption, 180 used (72%), Gen Z 45%"
- User redeems, gets social share option, Instagram story OG pre-filled
- Weekly email to sponsor (auto SendGrid digest)

**No-gos:**
- Detailed cohort analytics (later sprint)
- Sponsor onboarding UI (manual setup Ay 3)
- POS integration API (V2.1)

### Sprint 3: Bağış Match + Detailed Analytics (Hafta 5–6)

**Scope:**
- Donation match redemption flow (3-step: amount selector → match confirm → STK verification pending)
- STK verification workflow (notification + approval)
- Sponsor cohort analytics (repeat vs. first-time user, retention table)
- Sponsor quarterly PDF report exporter (simple template)
- Leaderboard "friends" tab (if time)

**Test data:**
- 50–80 donation match redemptions simulated
- STK verification SLA (max 24 hours)
- Sponsor PDF export quality check

### Sprint 4: Gamification Deepening + V2.1 Prep (Hafta 7–8)

**Scope:**
- Reward history page (detailed list + status + actions: "Use again", "Share", "Help")
- Leaderboard upgrade (monthly top 20 + friends tab)
- Badge atomic library (5 tier × 5 category = 25 badge SVG's + animation)
- V2.1 scope specification (deneyim raffle + POS API + multi-lang)

**Optional (if time):**
- Raffle mechanics spec + UI mockup (no implementation)
- Sponsor API spec (no implementation)

---

## 11. Success Metrics

### 4-Hafta Pilot Çıkış Kriterleri (V2.0 launch)
- ✅ 5 pilot sponsor canlı (Migros, Garanti, Turkcell + 2 daha)
- ✅ 10+ reward (3 sponsor × 3–4 type) katalogda
- ✅ **300+ redemption** (minimum viability threshold)
- ✅ **40%+ redemption-to-use conversion** (kupon kodu talep → actual use)
- ✅ Email deliverability **>95%**
- ✅ Sponsor NPS ≥40 (pilot feedback form)
- ✅ User feedback: "Kupon almak çok kolay" 4/5+
- ✅ 0 regulatory/KVKK incidents

### 8-Hafta Çıkış Kriterleri (V2 full release ready)
- ✅ 500+ redemption cumulative (pilot + early access)
- ✅ Sponsor dashboard adoption 100% (5/5 sponsor aktif kullanıyor)
- ✅ Bağış match redemption 15%+ (higher friction, lower expected)
- ✅ Sponsor quarterly PDF export 3+ sponsor downloaded
- ✅ Badge social share click-through 5–10% (OG image quality metric)
- ✅ **No critical bugs** (TSC 0 blocker defects)
- ✅ Sponsor contract renewals 100% (Ay 3 satış cycle sonrası)

### 12-Hafta+ (V2 stabilization)
- **Sponsor revenue:** ₺300k–500k Q2 (3 sponsor × avg ₺100–150k)
- **MAKE (gönüllü NSM):** Retention +20–30% vs V1
- **Platform growth:** 30+ STK active (pilot + referral)
- **Kurumsal pipeline:** 2 sponsor commitment Q3 için (Ay 6 konuşmalar başlasın)

---

## 12. Bağımlılık & Risk

### Teknik
- **Supabase Storage:** sponsor logo + reward image (bucket `ngo-assets` extend)
- **Migration 024+:** sponsors + campaigns + reward_type columns (no breaking changes, additive)
- **Email provider:** Resend or SendGrid API key (ADR-015 + procurement)
- **Firebase Cloud Messaging:** push notification setup (iOS APNS cert, Android FCM key)

### Operasyonel
- **Sponsor legal:** KVKK DPA signed (Migros + Garanti, target Haziran)
- **Sponsor onboarding:** 3–4 hafta procurement cycle per sponsor (start Q2)
- **STK pilot feedback:** 2x haftalık sync (Ay 2–3), insight capture

### Yasal / Hukuk
- **Avukat konsültasyon:** 5 açık soru (Bölüm 13) — deadline Mayıs
- **Deneyim raffle:** Kumarbilir Kanunu riski (ADR-XXX gerekli)
- **Sponsor data sharing:** KVKK çifte onay (consent form template)
- **BDDK:** Kupon aracılığı lisans gerekli mi? (Strategy memo Q42 belge)

### Partner
- **Migros + Garanti API:** Sandbox access, documentation, support SLA (May sonuna)
- **Turkcell:** Data paket redemption API (şu an belirsiz, V2.1 defer)

---

## 13. Açık Karar (5 Madde)

### Q47: İlk Sponsor Seçimi — Migros solo mu, Garanti paralel mi?

**Seçenekler:**
- **(A) Migros first (Ay 4–5), Garanti Q3'de** — sequential ramp, resource focus
- **(B) Migros + Garanti parallel (Ay 4–5)** — dual sales cycle, 1.5x complexity
- **(C) Turkcell third (not primary)** — tech-first, lower CSR maturity

**Tavsiye:** **(B) Paralel** — Procure aynı anda (3–4 ay döngü), launch aynı anda (Ay 8), dual revenue stagger risk.

---

### Q48: Bağış Match Bütçesi — Platform mi, Sponsor mi?

**Seçenekler:**
- **(A) Sponsor bütçesi** — sponsor CSR KPI artar, bağış verified. "Kullanıcı ₺100 → Sponsor ₺100 → total ₺200."
- **(B) Platform bütçesi (CAC account)** — variable cost, sponsor'lar için cheaper. İlk aylar platform destek.
- **(C) Hybrid** — sponsor preferred, fallback platform (if sponsor budget exhausted)

**Tavsiye:** **(A) Sponsor-led** — CSR integrity, sponsor retention, clear accountability.

---

### Q49: Kupon Expiry — 30 gün standart, override per-sponsor?

**Seçenekler:**
- **(A) Hardcoded 30 gün** — simple, consistent
- **(B) Per-sponsor setting** — Migros talep etse ₺100 kuponu 60 gün mi?
- **(C) Tiered: Bronze 15, Silver 30, Gold 60**

**Tavsiye:** **(A) → (B) migration** — V2.0'da hardcoded 30, V2.1'de per-sponsor override (sponsor admin setting).

---

### Q50: "İyiBiri Elçi" Statüsü — Platform badge mi, STK "Official Ambassador"?

**Seçenekler:**
- **(A) Platform-driven badge** — şeffaf, automatic (10000+ karma → badge unlock)
- **(B) STK onayı gerekli** — exclusive, STK authority
- **(C) Hybrid** — platform badge + STK official variant (notification → approval workflow)

**Tavsiye:** **(C) Hybrid** — platform badge automatic (engagement reward), STK'ya "Elçi X onay et?" notification (1-click approval). STK istersen official badge variant.

---

### Q51: Instagram OG Image Generator — V2'de mi, V2.1'de mi?

**Seçenekler:**
- **(A) V2 Sprint 2** — badge share critical, early differentiation
- **(B) V2.1** — scope defer, focus on core redemption
- **(C) Manual image library** — no generator, sponsor provides per-reward

**Tavsiye:** **(B) → (A) if time** — OG image generator complex (design + image CDN). V2.0'da "manual OG per sponsor", V2.1'de dynamic generator.

---

## 14. Handoff

### UX Researcher
- **Audit:** Mevcut `/dashboard/rewards` V1 heuristic eval
- **Journey:** Ayşe (gönüllü) + Murat (sponsor) journey map (touch point × emotion × JTBD)
- **Mini UX test:** Prototype 3 scenario (katalog → kupon, match redemption, badge share) × 4–5 user (unmoderated, 15 min each)
- **Sponsor focus group:** Migros CSR 2 kişi, 2 saat (dashboard usability + reporting)
- **Deliverables:** `docs/ux/02-journeys/2026-04-25-reward-v2-journey.md` + `docs/ux/03-heuristics/2026-04-25-reward-v2-audit.md`

### UI Designer
- **Reward hub (katalog):** Filter UI (tier pills, sponsor pills, category pills), grid card design, empty state
- **Reward detail modal/bottom sheet:** Sponsor branding (logo placement, color gradient), CTA button, T&C link
- **Redemption flow:** Confirm dialog (karma counter animation), success celebration (confetti trigger), share button
- **Sponsor dashboard:** Campaign list table, analytics card layouts, PDF export preview
- **Badge atomic library:** 5 tier (Bronze–Diamond) × 5 category (kupon, match, deneyim, badge, fiziksel) SVG + animation spec
- **Design tokens:** Sponsor color override (design system compat check)
- **Deliverables:** Figma link (high-fidelity) + motion spec (Framer Motion parameters)

### Frontend Engineer (2 people, parallel)
- **FE-1: Katalog + Redemption Flow**
  - `/dashboard/rewards` page (reusable filter component + grid)
  - `/dashboard/rewards/[id]` detail modal (bottom sheet pattern)
  - Redemption flow (3-step: detail → confirm → success)
  - Email notification template (copy to clipboard, Migros link)
  - **Test:** Storybook + E2E (Cypress: "User redeem kupon" scenario)

- **FE-2: Sponsor Dashboard + Social Share**
  - `/admin/sponsor/[sponsorId]/` routes (new route group)
  - Campaign list UI + analytics card
  - Social share button (OG image pre-render, Instagram link)
  - Leaderboard "friends" tab (if time)
  - **Test:** Storybook + responsive check (mobile/desktop)

### Supabase Backend Engineer
- **Migration 024:** sponsors + campaigns tables + reward_type columns (additive, no breaking)
- **API endpoints:**
  - `GET /rewards` (filter by tier, sponsor, category)
  - `POST /rewards/:id/redeem` (karma deduction + code generation + record creation)
  - `GET /user/reward-history` (list + status)
  - `GET /admin/sponsor/:sponsorId/analytics` (redemption count timeline + segment breakdown)
  - `POST /admin/sponsor/:sponsorId/campaign` (CRUD)
- **Email triggers:** SendGrid template registry + event webhooks (redemption → email)
- **RLS policies:** Public read (rewards), user own (redemptions), admin (sponsor dashboard)
- **Seed script:** Migration sonrası SQL seed (3 sponsor × 10 reward test data)
- **Test:** Postman collection + integration tests (DB state verification)

### Auth / Capacitor
- **Push notification setup:** Firebase Cloud Messaging (FCM key config, APNS cert)
- **Permission handling:** Capacitor PushNotifications plugin (iOS+Android)
- **Sponsor admin auth:** New `sponsor_admin_users` link table (similar ngo_admin_users pattern)
- **Deliverables:** Auth middleware + RLS update

---

## 15. Handoff Log

- 2026-04-25 23:00 — **ui-designer** ✅ — **spec**: `docs/ui/01-specs/2026-04-25-reward-v2-ui-spec.md`. 6 ekran layout (hub + detail + confirm + success + history + sponsor dashboard), 7 component (4 new, 3 extended), Tier-1 reuse (KarmaCounterPro, SuccessCelebration, Vaul), token tablo (0 hardcoded, 3 ADR-TBD tier colors), motion choreography (K5 karma countdown, K3 confirm, K6 success, K10 PDF), a11y baseline (WCAG AA, focus/touch/kontrast/reduced-motion). FE priority 1–7, BE Migration 024 + API spec, DS keeper token ADR. Handoff: frontend-engineer (RewardsHub P0 priority), supabase-backend (schema), design-system-keeper (tier-color).

- 2026-04-25 20:30 — **ux-researcher** ✅ — **audit + journey**: `docs/ux/03-heuristics/2026-04-25-reward-v2-audit.md` + `docs/ux/02-journeys/2026-04-25-reward-ayse-murat-journey.md`. K1-K10 (10 critical findings: dark/peak moments, HEART metrics, motion spec, a11y checklist). Ayşe 10-step + Murat 8-step journeys. Kanıt-altı persona (customer interview pending). Handoff: ui-designer (K1-K8 spec), backend (K9-K10 sponsor dashboard).

---

## 16. Attachment: Açık Karar Detay (Avukat Paketi)

**Teslim:** Avukattan cevap bekleniyor (Strategy memo Bölüm 4.3'teki 5 soru).

1. **Kupon ekonomisi — İyiBiri aracı mı müşteri mi?** → Kontrat yapısını VUK açısından temizle
2. **Deneyim ödülü (konser bileti) piyango mı?** → Kumarbilir Kanunu uyum → ADR-XXX-experience
3. **Sponsor'a user data aggregate bile KVKK mi?** → Consent granularity (double-consent framework hazırla)
4. **Kupon yerine getirme garantisi — platform liability** → Sponsor obligation, fallback mechanism
5. **Yurt dışı sponsor (Booking.com kupon) — vergi + döviz** → Cross-border pricing

---

**Dosya bitişi — Brief hazır, UX research bekleniyor.**

Durum: ✅ Ready for UX Researcher  
Satır Sayısı: ~2200 (bu dokuman)
