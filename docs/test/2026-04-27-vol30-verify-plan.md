# Vol-30 Verify Plan — IA changes + Vol-29 tier-up

> **Tarih:** 2026-04-27
> **Kapsam:** Vol-30.1 → Vol-30.5 dashboard IA değişikliği + Vol-29 tier-up overlay verify
> **Kullanıcı:** t5 (bahadiroylumluu+t5)

## A) Bottom nav — 5 item

- [ ] `/dashboard` aç → bottom nav 5 item: **Ana / Görevler / Kelebek / Ödüller / Profil**
- [ ] "Keşfet" entry'si KAYBOLMUŞ olmalı
- [ ] "Kelebek" tıkla → `/dashboard/tiers` açılır (Vol-28 tier journey)
- [ ] Ödüller tıkla → `/dashboard/rewards` açılır, sponsor markalar listesi
- [ ] Profil tıkla → `/dashboard/profile`

## B) Dashboard yeni IA

- [ ] **Header**: tarih (`27 NİSAN · PAZARTESİ` formatı) + saat bazlı greeting (Günaydın/İyi günler/İyi akşamlar/İyi geceler) + tema toggle (☀/☾) + avatar (Fraunces initial)
  - [ ] Daily goal ring YOK
- [ ] **HeroCard**: TierButterfly background sağ üstte + karma count-up animasyonu (1.2s) + tier eyebrow ("Seviye X · Tier Adı") + 64px Fraunces karma + opsiyonel "+X bu hafta" satırı + tier progress bar + 3 StatPill (Aktif/Tamamlanan/Tüm seviyeler X/5)
  - [ ] Streak ≥ 1 ise sağ üstte 🔥 X gün rozet
- [ ] **MissionTabs**: Senin için (count) / Katıldıkların (count) pill toggle + sticky scroll + sağda "TÜMÜ →" link
- [ ] **MissionListCard**: 84×84 thumbnail + NGO color stripe (3px üstte) + NGO short_name eyebrow + 2-satır title + 1-satır italic Fraunces "why" + 📍 lokasyon · ⏱ süre + +karma pill
- [ ] **NGO Posts Rail** (ÖNCÜLERDEN · Haberler): 280×140 kart, kategori badge sol üst, ÜYE rozet sağ üstte (subscribed NGO'lar gold border)
- [ ] **Sponsor Posts Rail** (SPONSORLARDAN · Sosyal Sorumluluk): 240×110, brand color overlay + brand 3-harf badge + brand ismi
  - [ ] Patagonia ve Eczacıbaşı kartları görünmeli
- [ ] **NGO Rail**: Üye olduğun (varsa) + İyiliğin öncüleri (keşfet); 110px kart + accent renk avatar + N aktif görev
- [ ] **Impact Strip**: "2026 İZİN · X görevde, Y kişiye dokundun" + tier 3 kelebek arkaplan (paused, 0.15 opacity)

## C) Vol-29 tier-up overlay (FIDAN2026)

**Önkoşul:** t5 karma'sı 425 olmalı (425 + 80 = 505 → Tier 1 → Tier 2 trigger).

```sql
-- Karma kontrol:
select karma_total from public.profiles where id = (
  select id from auth.users where email = 'bahadiroylumluu+t5@gmail.com'
);
-- Beklenen: 425. Değilse fixture insert:
-- insert into karma_transactions (user_id, amount, type, description)
-- values ((select id from auth.users where email='bahadiroylumluu+t5@gmail.com'),
--         425 - <mevcut>, 'mission_complete', 'Vol-29 fixture');
```

**Akış:**
1. [ ] Login (t5) → dashboard'da hero karma 425 görünür, Tier "İyi Biri", progress %85, "75 → İyi Yürekli"
2. [ ] m-tema-fidan görevini al (yoksa önce tıkla "Bu göreve katıl")
3. [ ] `/dashboard/missions/m-tema-fidan/complete` → "Doğrulama Kodu" alanına `FIDAN2026` yaz, Tamamla
4. [ ] **TierUpOverlay** aktive olur:
   - Aura glow (Tier 2 turuncu) + "YENİ SEVİYE" badge
   - Metamorphosis animasyonu (~5s) — kelebek dönüşümü
   - 3.8s sonra CTA: "İyi Yürekli" başlık + tier desc + "Devam Et" butonu
5. [ ] "Devam Et" tıkla → CelebrationOverlay (konfeti + karma sayacı 425 → 505) → /dashboard
6. [ ] Hero kart: karma 505, Tier 2 "İyi Yürekli", İyi Yürekli kelebeği görünür

## D) Migrasyon doğrulama (Migration 037 + 038)

```sql
-- 037: Sponsors entity
select count(*) from public.sponsors;
-- Beklenen: ≥ 8 (6 backfill + Patagonia + Eczacıbaşı)

select count(*) from public.rewards where sponsor_id is null;
-- Beklenen: 0

-- 038: Sponsor postları
select author_type, count(*) from public.posts group by author_type;
-- Beklenen: ngo: N, sponsor: 2

-- XOR check işliyor mu (manuel test):
-- insert into posts (author_type, sponsor_id, ngo_id, title) values ('sponsor', null, 'tema', 'X');
-- Beklenen: posts_author_xor check violation
```

## E) Regression — Vol-30.1 sonrası bozulmadığını doğrula

- [ ] `/dashboard/rewards` listesi 6 reward gösteriyor (Starbucks/Migros/Trendyol/Cinemaximum/Nike/Garanti BBVA)
- [ ] `/dashboard/discover` postlar açılıyor (NGO + sponsor karışık)
- [ ] `/dashboard/missions` listesi açılıyor
- [ ] `/dashboard/profile` çalışıyor, ad doğru
- [ ] `/admin/[ngoId]/blog` (TEMA admin) post create/edit çalışıyor (author_type default 'ngo' otomatik)

## F) Bilinen scope-out

- Sponsor admin backoffice (Vol-31)
- Sponsor self-signup (Vol-31)
- Public sponsor profile (Vol-31)
- TodayThree carousel (HeroMission + PeekTile) — Vol-30 IA'da MissionListCard ile basitleştirildi, carousel kaldı v2-scroll'da. Eğer carousel istenirse Vol-30.6 olarak ek paket.
