# Faz 2 Backlog — Master Plan (V1 Lansman Sonrası)

**Tarih:** 2026-04-25
**Sahip:** product-analyst
**Bağlı dokümanlar:**
- Rekabet analizi: `docs/strategy/02-competitors/2026-04-25-faz2-rekabet-analizi.md`
- Master plan V1: `docs/product/01-workstreams/2026-04-24-v1-improvement-master-plan.md`
- Strateji memoları: `docs/strategy/**`
- STK backoffice: `docs/product/01-workstreams/2026-04-24-stk-backoffice-workstream.md`
- Open kararlar: `docs/product/04-questions/open.md` + `resolved.md`

**Kapsam:** V1 lansman sonrası ilk 6-9 ay — yani Faz 2.1 (Pilot + 1-3 ay) → Faz 2.2 (Genişleme 3-6 ay) → Faz 2.3 (V2 geçiş 6-9 ay).

---

## 1. Yönetim özeti

Rekabet analizi + pilot açılımı + bekleyen ADR'ler üçgenini çakıştırdığımda, **Faz 2'nin 3 ana ekseni** belli oldu:

1. **Çekirdek boşluk kapama (6 hafta)** — Gönüllü matching algoritması + email/push notification + makbuz otomatizasyonu. Bunlar TR STK standartı (fonzip de sunar), İyiBiri V1'de yok. Pilot STK'ların "bu platform mu WordPress mu" değerlendirmesinde kritik.
2. **Moat derinleştirme (8 hafta)** — Karma gamification'ı genişlet (badge + takım + seasonal challenge), sosyal paylaşım + referral tree, fidan/fidye/adak gibi TR-kültürel akışlar. Rakiplerde yok, bizi eşsiz kılan layer.
3. **Platform scale (8 hafta)** — Supabase Storage upload UI polish (V1'de text fallback), admin role management (editor/viewer UI), kurumsal sponsor dashboard (Yıl 2 başlangıç).

Toplam Faz 2 ≈ 5-6 ay aktif dev (2 FE + 1 BE + 0.5 UX paralel). V1.1 lansman ~Ay 4, V1.2 ~Ay 7, V2 geçiş Ay 9+.

## 2. P0 — V1.1 Blocker (Ay 1-2, 6 hafta)

V1 lansmanından **hemen sonra** yapılacak — pilot STK'ların 2. ayında kullanacakları temel boşluklar. Bunlar olmadan retention + conversion zayıf.

| # | Feature | Kaynak | Effort | Impact | Owner |
|---|---|---|---|---|---|
| F2.1 | **Gönüllü matching algoritması** — profil interest + şehir + skill match + recency + featured | Rekabet (VolunteerMatch SmartSort, Benevity), master plan P1 #4 | L (15-20 gün) | +30-50% mission completion rate | be + fe |
| F2.2 | **Email notification pipeline** — yeni görev, doğrulama sonucu, üyelik ödeme, kota uyarısı | Rekabet (fonzip standart), master plan P1 #11 | M (5-7 gün) | KVKK uyumlu makbuz + retention | be + auth |
| F2.3 | **Push notification (iOS/Android)** — Capacitor Push + FCM, görev take confirmation + admin approval sonucu | Master plan P3 #2 Yıl 2'den Faz 2.1'e çekildi, rekabet baskısı | M (4-6 gün) | +20% D7 retention (Duolingo benchmark) | auth + fe |
| F2.4 | **Makbuz otomatik PDF** — bağış + üyelik sonrası email + kullanıcı profilinden indir | Rekabet (fonzip, GlobalGiving), Q21 | M (6-8 gün) | Yıllık özet + yasal uyum | be + fe |
| F2.5 | **STK admin Storage upload polish** — logo/cover/görev/blog/proof için dropzone + progress (V1 fallback text input'tan upgrade) | Storage component zaten yazıldı 2026-04-25 — entegrasyon + polish | S (2-3 gün) | Admin UX +40% (pilot feedback) | fe |
| F2.6 | **Dashboard Sprint B — LeaderboardTeaser Q25 cevabı sonrası** | Dashboard tur 2 spec, Q25 user test | M (4-5 gün) | Sosyal motivasyon, MAKE +15% | fe |
| F2.7 | **Password reset admin self-serve** | V1 super-admin manuel, rekabet + security baseline | S (2-3 gün) | Admin onboard hızlanır | auth |

**Toplam P0:** 38-52 iş günü, paralel FE×BE×Auth ile **~6 hafta**.

### F2.1 — Gönüllü matching algoritması detay

Score formula (ilk iterasyon, A/B test'li):
```
score = 
    profile_interest_match × 3.0
  + city_proximity × 2.0 (km cinsinden tersine)
  + skill_match × 1.5
  + recency_bonus × 1.2 (son 14 gün yayınlananlar)
  + popularity_decay × 0.8 (çok alınan görev için azaltma)
  - already_taken × 10.0 (zaten alınmış görevi öne çıkarma)
```

Supabase Edge Function (Deno) — günde 1x materialized view refresh. İleride ML model swap (V2).

### F2.2 — Email notification altyapısı

Resend veya SendGrid entegrasyonu. Template registry:
- `mission_published_for_interest` — kullanıcıya ilgi alanındaki yeni görev
- `verification_approved` — görev onaylandı + karma
- `verification_rejected` — admin feedback ile
- `membership_payment_receipt` — makbuz PDF ekli
- `weekly_digest_admin` — STK haftalık özet
- `streak_warning` — kullanıcı 2 gün inactive

Unsubscribe + ETİ (Ticari Elektronik İleti) separate consent (kvkk-compliance skill Bölüm 3).

## 3. P1 — Genişleme (Ay 3-5, 8 hafta)

Pilot STK feedback'ı + kullanıcı telemetry'den gelen veriyle. V1.2 hedef.

| # | Feature | Kaynak | Effort | Impact | Owner |
|---|---|---|---|---|---|
| F2.8 | **Fidan/fidye/adak/kurban akışları** (TR-kültürel) — adak seçici, kurban kesim organizasyon, fidan bağışı × STK | Rekabet analizi (hiçbir rakipte yok), TR pazar | L (10-12 gün) | Ramazan/Kurban seasonality +40% | product-analyst + fe + be |
| F2.9 | **Takım gönüllülük (group mission)** — 3-15 kişilik takım + takım lideri + ortak karma | Rekabet (VolunteerMatch + Benevity), Shape Up pitch | L (12-14 gün) | Kurumsal müşteri hazırlığı | fe + be |
| F2.10 | **Sosyal paylaşım + referral tree** — "3 arkadaşını davet et → 200 karma bonus" | Rekabet (standart + growth loop) | M (6-8 gün) | Organic growth +25% | fe |
| F2.11 | **/dashboard/discover blog + kategori** | Master plan P1 #3 | M (4-5 gün) | Content engagement + STK görünürlük | fe |
| F2.12 | **/dashboard/missions taxonomy filter** | Master plan P1 #4 | M (4-5 gün) | Discovery + mission completion | fe |
| F2.13 | **/dashboard/profile Karma log + yıllık özet** | Master plan P1 #8, UX brief hazır | M (5-6 gün) | Kullanıcı retention + yıl sonu paylaşım | fe + be |
| F2.14 | **/dashboard/leaderboard friends tab** | Master plan P1 #10 | M (4-5 gün) | Sosyal motivasyon | fe |
| F2.15 | **/dashboard/notifications read/unread + push sync** | Master plan P1 #11 | S (3-4 gün) | UX housekeeping | fe |
| F2.16 | **STK admin markdown editor toolbar + preview** | V1 gap deferred | S (2-3 gün) | Blog UX | fe |
| F2.17 | **STK admin PDF/CSV rapor export** | V1 gap deferred, rekabet standardı | M (5-6 gün) | Operasyonel rapor | fe + be |
| F2.18 | **STK admin role UI (editor/viewer)** | Master plan P2, pilot feedback bekler | M (5-6 gün) | Multi-admin STK'lar için | fe |

**Toplam P1:** 60-80 iş günü, ~8 hafta (2 FE + 1 BE paralel).

### F2.8 — TR-kültürel akışlar (fidan/fidye/adak/kurban)

ADR gerektirir (ADR-TBD). Her biri ayrı mission_type + seasonal active window:
- Fidan — yıl boyu (TEMA primary STK)
- Adak — yıl boyu, bireysel niyet → mission action
- Fidye — Ramazan (dini takvim trigger)
- Kurban — Kurban Bayramı (7 gün window, logistics complex)

Özel UI: niyet girişi + miktar + STK seçim + paylaşım kartı. Platform moat — global rakiplerde YOK.

## 4. P2 — V1.2 / V2 geçiş (Ay 6-9, 10-12 hafta)

Platform scale + kurumsal genişleme. Pilot kapanış verisi ile priorize.

| # | Feature | Kaynak | Effort | Impact | Owner |
|---|---|---|---|---|---|
| F2.19 | **Kurumsal sponsor dashboard v1** — marka × kampanya × matching employees | Rekabet (Benevity), strateji 03-revenue R1 sponsor gelir kolu | XL (20-25 gün) | Yeni gelir kanalı | full team |
| F2.20 | **Gelişmiş admin analytics** (cohort retention, funnel, çevirimi) | Rekabet (Benevity Analytics), master plan V2 | L (10-12 gün) | STK operasyon veri-odaklı | be + fe |
| F2.21 | **Bulk member messaging (STK → üye kampanya)** | Rekabet (Benevity, fonzip), KVKK consent | M (6-8 gün) | STK retention artırım | be + auth |
| F2.22 | **Design system V2 — semantic token layer + light mode prep** | V1.1 DS-keeper follow-up | L (8-10 gün) | V2 hazırlık | ds-keeper |
| F2.23 | **Görev paylaşım kartı** (Instagram/Twitter story format) | Master plan P2 | M (4-6 gün) | Viral growth | fe + ui |
| F2.24 | **/dashboard/saved polish + import** (Excel'den) | Master plan P2 | M (4-6 gün) | Power user | fe |
| F2.25 | **API key management (STK için)** | Rekabet (Benevity, GlobalGiving), master plan V2 | M (5-7 gün) | 3. parti entegrasyon | be + fe |
| F2.26 | **Görev taxonomy schema expansion** (ADR-007, WS-05) | Master plan P2 | L (8-10 gün) | Görev çeşitliliği | be + analyst |

**Toplam P2:** 80-105 iş günü, ~10-12 hafta.

## 5. Yıl 2+ stratejik büyük projeler

Faz 3 başı, master plan P3 + strateji memolarındaki 5+ yıllık vizyon.

| Proje | Kaynak | Tahmini effort | Gerekçe |
|---|---|---|---|
| **Bağış akışı reaktivasyon** (V2 yönlendirici model, ADR-006) | Strategy 03-revenue + ADR-006 | 6-8 hafta | V1'de mock → V2 aktif, R2-R4 gelir kolu |
| **Arkadaş sistemi** (follow + activity feed) | Master plan P3 #1 | 4-5 hafta | Sosyal graph (FB benzeri değil, gönüllü-odaklı) |
| **Fonzip migration tool** (Q35) | Open.md 2. dalga | 3-4 hafta | Fonzip'teki STK'ları platforma çek (Yol E strateji) |
| **Multi-NGO bundle** (Q18) | Open.md 2. dalga | 4-6 hafta | "Eğitim paketi: 3 STK × 1 ödeme" |
| **Kurumsal bağışçı ayrı akış** (Q14) | Open.md 2. dalga | 6-8 hafta | Corporate giving (sponsor dashboard'un doğal devamı) |
| **Yıllık makbuz özeti** format (Q21) | Open.md 2. dalga | 2-3 hafta | V1'de kısmi, V2'de 1-click downloadable |
| **Muhasebeci entegrasyon** (Q22) | Open.md 2. dalga | 4-5 hafta | STK operasyonel aracı |
| **Kızılay gonulluol deeplink** (Q24) | Open.md 2. dalga | 2-3 hafta | TR'deki en büyük gönüllü portal ile bridge |
| **Sertifikat/eğitim entegrasyonu** | Rekabet (VolunteerMatch + Kızılay), Strategy | 6-8 hafta | STK'ların eğitim modüllerini platforma getir |
| **Vergi beyannamesi opsiyonel checkbox + migration** | Master plan P2 | 2-3 hafta | Stopaj grubu dışı için (Q20, strateji memo) |

## 6. Dependency matrisi — kritik path

```
V1 Lansman (Ay 0)
    ↓
F2.5 Storage upload polish (Ay 1, S)
    ↓
F2.2 Email pipeline + F2.4 Makbuz (Ay 1-2, M+M paralel)
    ↓
F2.3 Push notification (Ay 2, M)
    ↓
F2.1 Matching algoritması (Ay 2-3, L) ← burası en kritik
    ↓
F2.7 Password reset (Ay 3, S)
    ↓
V1.1 Lansman (Ay 3-4)
    ↓
F2.6 Leaderboard Q25 sonrası + F2.8 TR akışları (Ay 4-5, L paralel)
    ↓
F2.9 Team + F2.10 Referral tree (Ay 5-6, L+M paralel)
    ↓
V1.2 Lansman (Ay 6-7)
    ↓
F2.19 Sponsor dashboard (Ay 7-9, XL)
    ↓
V2 geçiş (Ay 9+)
```

**Kritik path:** F2.1 matching algoritması — 3 hafta sürerse Faz 2 genel takvimi geciker. Risk azaltma: V1.1'e "basit version" çıkar (interest match + city proximity), V1.2'de ML model iyileştir.

## 7. Rekabet-bilinçli 3 öncelik

Fonzip + global rakip tarama + İyiBiri'nin durumu:

### Yetişme (F2.1-F2.4) — TR STK standartı olmak
İyiBiri pilot STK'ya "ben WordPress + fonzip yerine neden seni kullanayım" sorusunu matching + notifications + makbuz ile cevaplar. **Ay 1-2 must-do.**

### Ayrışma (F2.8-F2.10) — moat derinleştirme
Karma + gamification + fidan/kurban akışları rakiplerde yok. İyiBiri'nin global Patent-benzeri moat'ı bu. **Ay 4-6 ayrışma hamlesi.**

### Kurumsal açılım (F2.19 sponsor dashboard)
Benevity + JustGiving kurumsal giving'e yönelirken İyiBiri gönüllü-first kalıyor. Faz 3 başında sponsor dashboard, kurumsal brand'lerden (Migros, Garanti BBVA, Turkcell — strategy 03-revenue) gelir kolu açar. **Ay 7-9.**

## 8. Risk + erken sinyal

| Risk | Olasılık | Etki | Erken sinyal | Önlem |
|---|---|---|---|---|
| F2.1 matching algoritma kötü score → low completion | Orta | Yüksek | Pilot 2. hafta completion rate <%20 | A/B test basit vs gelişmiş formül |
| F2.8 fidan/kurban regulatory (kurban kesim lisansı?) | Düşük | Yüksek | Avukat mütalaa gerek | Hukuki mütalaa (ADR-009 chain) |
| F2.19 sponsor dashboard erken — kurumsal hazır değil | Orta | Orta | Pilot 4. ayda 0 kurumsal pipeline | Yıl 2 Q1'e ertele |
| Email/SMS deliverability (spam filter) | Orta | Orta | Açılma oranı <%30 | Resend + domain auth + warm-up |
| Matching privacy (interest exposure) | Düşük | Orta | KVKK uyum check | Aydınlatma metnine ekle |

## 9. ADR aday listesi (Faz 2'de açılacak)

- **ADR-014** — Gönüllü matching algoritma v1 formula + A/B test framework
- **ADR-015** — Email provider seçimi (Resend vs SendGrid vs Postmark)
- **ADR-016** — Push notification provider (FCM direkt vs OneSignal)
- **ADR-017** — Fidan/fidye/adak/kurban mission_type taxonomy + UI pattern
- **ADR-018** — Takım (group) mission schema
- **ADR-019** — Kurumsal sponsor dashboard scope V1 (Yıl 2 başı)
- **ADR-020** — Semantic token layer + light mode design system geçiş

## 10. Başarı kriterleri (ölçülebilir)

### V1.1 (Ay 3-4) çıkış kriterleri
- 5/5 pilot STK aktif haftalık kullanır
- Makbuz + email notification canlı (%95+ deliverability)
- Matching algoritma ilk iterasyon canlı, completion rate ≥%30
- Push notification D7 retention +%15 vs V1

### V1.2 (Ay 6-7) çıkış kriterleri
- 10-15 STK aktif (pilot sonrası genişleme)
- Referral tree organik growth %20+
- TR-kültürel akış (fidan/adak) ≥1 STK kullanıyor
- Takım gönüllülük canlı, 3+ takım

### Yıl 2 Q1 (Ay 9+) hedef
- 30+ STK aktif
- 1. kurumsal sponsor dashboard müşterisi
- Bağış akışı V2 canlı (ADR-006 reactivation)
- MAKE NSM 3x V1 lansman

## 11. Ekip kapasitesi

V1 lansman sonrası aynı kadro Faz 2'yi koşturur (2 FE + 1 BE + 0.5 UX + 0.5 UI). Ek kapasite gereksinimi:
- **Ay 3:** 1 ek FE (matching UI + team feature karmaşık)
- **Ay 6:** 1 operations ekibi üyesi (pilot STK feedback çevirme, onboarding)
- **Ay 9:** 1 kurumsal satış (sponsor dashboard açılımı)

## 12. Next action — bu hafta

1. **Ben (product-analyst) sen döndüğünde:** Bu backlog'u user ile review → F2.1-F2.4 hangi sıra önce (bence F2.2 email + F2.5 storage polish quick-wins önce, F2.1 matching paralel başlar).
2. **Rekabet analizi oku:** `docs/strategy/02-competitors/2026-04-25-faz2-rekabet-analizi.md` — özellikle feature matrisi + 5 alınacak pattern.
3. **ADR kuyruğu:** ADR-014/015 Proposed aç, onay bekle.
4. **Sponsor temas kapısı:** Ay 3'te sponsor dashboard discovery için Migros/Garanti research başlat (strategy agent).

## 13. Handoff log

- 2026-04-25 — **product-analyst (ben, parent session)** ✅ — **Faz 2 master backlog**: bu dosya. Rekabet analizi + master plan + open karar + V1 gap'leri konsolide. 26 feature × P0/P1/P2/Yıl2, 4-6 aylık roadmap, 7 ADR aday, kritik path + risk + success criteria.

---

**Son söz:** Faz 2 önceliği net — **yetişme → ayrışma → kurumsal.** Rekabet bize 6 hafta verir (matching + notifications olmadan pilot STK kaçabilir); moat derinleştirme 2. yarıda ayrıştırır; kurumsal Yıl 2 başında gelir kolu açar. Bu roadmap pilot feedback ile her 4 haftada revize edilir.
