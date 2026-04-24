# Heuristik Audit — Mission Detail State Machine

**Tarih:** 2026-04-24
**Owner:** ux-researcher
**Sayfa kapsamı:** `/dashboard/missions/[id]` + `/dashboard/missions/[id]/complete`
**İlgili P0:** V1 Improvement Master Plan — P0 #3
**Referans kod:** `app/dashboard/missions/[id]/page.tsx` + `mission-detail-client.tsx` (648 satır) + `states-client.tsx` (714 satır) + `complete/verification-client.tsx` (236 satır) + `take-mission.tsx` (23 satır) = **1709 satır toplam**

> **Skill ritüeli (Adım 0)** — Bu audit öncesi 3 skill okundu:
> - `.claude/skills/ux-heuristics/SKILL.md` — Nielsen 10 + İyiBiri 6 özel
> - `.claude/skills/user-journey-mapping/SKILL.md` — emotion curve + dark/peak moment
> - `.claude/skills/mobile-app-polish-standards/SKILL.md` — tier-1 benchmark + motion + haptic

---

## 0. Özet Bulgu

Mevcut mission detail akışı **state-makinesiz 3 ayrı client dosyasıyla** yönetiliyor. Kullanıcı aynı "görev" bağlamında 3 farklı kod yolu görüyor:

1. **Keşif** (`mission-detail-client.tsx`) — dark tema, Premium × Warm
2. **Alındı / Tamamlandı** (`states-client.tsx`) — yine dark tema
3. **Doğrulama** (`complete/verification-client.tsx`) — ❗ **eski light tema Tailwind sınıfları** (`bg-white`, `text-text-primary`, `bg-primary/10`). Görsel olarak **başka bir App** izlenimi veriyor.

Bu audit **3 büyük yapısal probleme** odaklanıyor:

- **State coverage** — bugün 3 state (`idle` / `taken` / `completed`) tanımlı, **5 state eksik** (`full`, `expired`, `failed_verification`, `cancelled`, `re_access`).
- **Visual system split** — tek ekran yolunun ortasında tema değişiyor. Bu tek başına "tier-1 app hissi"ni öldürüyor.
- **Karma race condition** — `user_missions.completed` set edildikten sonra `karma_transactions` insert fail ederse kullanıcı "tamamlandı ama Karma yok" durumunda sıkışıyor. Manuel destek bilgisi yok.

**Kritik 5 bulgu (P0), Yüksek 4 bulgu (P1), Orta 3 bulgu (P2).**

---

## 1. Metod

**Çerçeve:**
- **Nielsen 10 heuristics** (1990) — visibility of system status, user control, error prevention, recognition over recall, etc.
- **İyiBiri 6 özel heuristics** (İ1-İ6) — TR dil/ton, KVKK, yasal sığlık, tier-1 polish, micro-signals, dark mode rigor
- **Jeff Patton story mapping** — lifecycle journey (keşif → başvuru → hazırlık → tamamla → kanıt → Karma)
- **Benchmark 3 tier-1 app:**
  - **Duolingo lesson complete** — state-machine clarity + streak feedback
  - **Strava activity finish** — "upload → enrich → publish" çok-state progress
  - **Apple Fitness workout** — "in progress → complete → ring awarded" celebration

**Değerlendirme skalası:**
- **Kritik (P0)** — lansman blocker. Kullanıcı App'i terk eder, para kaybı riski, yasal risk.
- **Yüksek (P1)** — deneyimi belirgin bozuyor, post-launch hemen düzelt.
- **Orta (P2)** — polish gap, tier-1 hissi için önemli ama lansmanı beklemez.

---

## 2. State Envanteri — Bugün vs Olması Gereken

### Bugün tanımlı

| State | Trigger | Client | UX durumu |
|---|---|---|---|
| `idle` | `userMission === null` | `mission-detail-client` | ✅ En iyi tasarlanmış state |
| `taken` | `userMission.status === 'taken'` | `states-client` | ⚠️ Detaya geri dönüş zor |
| `completed` | `userMission.status === 'completed'` | `states-client` | ⚠️ Kanıt fotoğrafı/kod re-access yok |

### Olması gereken (8 state)

| # | State | Açıklama | Bugün mü? |
|---|---|---|---|
| 1 | `idle` | Henüz almadı, kontenjan var, tarih uygun | ✅ |
| 2 | `full` | Kontenjan 0 — "başvurular kapalı" | ❌ (spots_left zaten 0 ama buton aktif kalıyor) |
| 3 | `expired` | Görev tarihi geçti, yeni alım yok | ❌ |
| 4 | `requires_membership` | Kullanıcı STK üyesi değil, shortcut KVKK göster | ⚠️ (var ama paralı üyeliği bypass ediyor) |
| 5 | `taken` | Aktif, henüz tamamlamadı | ✅ |
| 6 | `verifying` | Doğrulama sayfasında, transient | ⚠️ (var ama temaları uyumsuz) |
| 7 | `completed` | Tamamlandı, Karma alındı | ✅ (ama re-access eksik) |
| 8 | `failed_verification` | Admin fotoğrafı reddetti, yeniden gönder | ❌ |
| 9 | `cancelled` | Admin görevi iptal etti, Karma geri alındı veya garanti | ❌ |

**P0 — 5 eksik state (2, 3, 8, 9 + re-access detay).**

---

## 3. Nielsen 10 × Mevcut Durum

### N1 — Visibility of System Status ⚠️ Kritik

**Gözlem:**
- `handleJoinAndTakeMission` 2 ayrı Supabase çağrısı (membership + user_mission) yapıyor ama kullanıcıya sadece "Kaydediliyor..." tek metin gösteriliyor. Arada hangi adım başarılı hangi başarısız belirsiz.
- Fotoğraf upload'u `handlePhoto` içinde "Yükleniyor..." diyor ama progress bar yok. Büyük dosya → kullanıcı bir süre ne olduğunu bilmiyor.

**Etki:** Kullanıcı belirsizlikte 2-5 saniye kalıyor, iptal edip terk edebilir.

**Öneri:** 2-step progress (üye olunuyor ✓ → göreve ekleniyor ✓). Fotoğraf için progress bar + "%45" numeric.

---

### N2 — Match Between System and Real World ✅ İyi

**Gözlem:** Mission detail içi copywriting sade TR, "Gönüllü ol ve katıl", "Kazanacağın +50 Karma" — doğal. `verification-client.tsx` "Görevi Tamamla" başlığı tamam.

---

### N3 — User Control and Freedom ❌ Kritik

**Gözlem:**
- `handleJoinAndTakeMission` kullanıcıyı **2 kritik karar ile aynı anda** bağlıyor: (a) STK üyeliği kaydı oluşuyor (b) görev alınıyor. Tek butonda geri alınamaz.
- `completed` state — fotoğraf/kod/QR verilerini tekrar göremez. "Ben ne gönderdim?" diye soramaz.
- Doğrulama esnasında "bu görevden vazgeç" butonu yok. Sadece geri.

**Etki:** Kullanıcı yanlışlıkla STK'ya üye oluyor, bunu gerçekten istediğinden emin olamıyor. Cayma hakkı belirsiz.

**Öneri:**
- "Gönüllü ol ve katıl" butonunu kaldır, `/dashboard/ngos/[id]/membership` parametrik akışına yönlendir (artık hazır, P0 #2 bitti).
- Completed state'te "Kanıtını gör" CTA + fotoğraf/kod readonly.
- `taken` state'te "Bu görevden vazgeç" + Karma kaybı uyarısı.

---

### N4 — Consistency and Standards ❌ Kritik (İ4 ile aynı)

**Gözlem:**
- `verification-client.tsx` eski Tailwind tema (`bg-background`, `bg-white`, `text-text-primary`, `text-text-muted`, `text-danger`, `bg-primary/10`). Proje 2 ay önce Premium × Warm dark tema'ya geçti (ADR-004); bu dosya güncellenmedi.
- Mission detail dark, verification light — **aynı akışın 2 ekranında 2 farklı dünya**.
- `rounded-2xl` + `rounded-xl` + `rounded-16` karışık kullanım. Token ihlali.

**Etki:** Tier-1 app hissi tamamen kırılıyor. Arc/Linear/Things benchmark'ına karşı kaybediyoruz.

**Öneri:** `verification-client.tsx` Premium × Warm dark temaya refactor. Token sadece `useTheme()` + `@/lib/theme`'den. Radius sadece `--radius: 1rem` (16px).

---

### N5 — Error Prevention ❌ Yüksek

**Gözlem:**
- Bir görev tarihi geçmişse bile `idle` state gösteriliyor → kullanıcı alıp "ama tarih 15 gün önceydi" durumunda kalıyor.
- Kontenjan 0 — `spots_left` FactCard'da "0 yer" + `urgent` flag ama buton halen aktif. Kullanıcı tıklar, RLS/unique constraint fail eder, "Görev alınamadı, tekrar dene" generic error.
- `code` verification — user büyük/küçük harf yanılgısı. Şu an `.toUpperCase()` yapılıyor ✓ ama TR `i/İ` bug'ı var (`'IYIBIRI'.toLowerCase()` = `'ıyıbırı'` Türkçe locale'de).

**Öneri:**
- Server-side pre-check: `spots_left <= 0` → state `full`, CTA disabled + "Maalesef kontenjan doldu" mesaj.
- Tarih geçmiş → state `expired`, "Bu görev artık mevcut değil, benzer görevler ↓" öner.
- `code` compare TR-safe: `code.trim().toLocaleUpperCase('tr-TR') === expected.toLocaleUpperCase('tr-TR')`.

---

### N6 — Recognition Over Recall ⚠️ Yüksek

**Gözlem:**
- Verification screen'de "Doğrulama kodunu gir" placeholder + `verify_hint` altta küçük metin. Kullanıcı "kodu nereden aldım?" için hint'e odaklanmalı ama visual hierarchy zayıf — hint çok soluk.
- Photo verification — "Fotoğraf seç veya çek" tek CTA. Kullanıcı "hangi fotoğraf?" sorusu için `verify_hint`'e bakmalı. Image gösterilmiyor.

**Öneri:**
- `verify_hint` büyütülsün, info-card içinde ikon + metin. "Nasıl doğrularım?" detaylı açıklama.
- Photo verification — yanında "örnek fotoğraf" thumbnail (görev detayındaki `photo_url` referans).

---

### N7 — Flexibility and Efficiency of Use ⚠️ Orta

**Gözlem:**
- QR scanner varsa çok hızlı. Code manual girişte ise keyboard autocomplete yok.
- Expert user için "Tamamladım ✓" auto mode harika — tek tık ama verify-photo ve code için keyboard shortcut yok.

**Öneri:** Code input'ta `autoComplete="off"` + `inputMode="text"` + 6-hane preset + enter-to-submit.

---

### N8 — Aesthetic and Minimalist Design ⚠️ Orta

**Gözlem:**
- Mission detail sayfası 6 bölüm (photo / NGO / facts / impact / karma / participants) + 3 koşullu bölüm (membership / success / error) + sticky CTA. 9+ element. Kullanıcı skimleme zor.
- `participants` section "X kişi katıldı" — değer düşükse (5 kişi katıldı) güçsüz sinyal veriyor.

**Öneri:**
- "Katılanlar" section'ı — 0-5 arası gizle veya avatar stack göster (mini görsel).
- Impact quote + description ikisi varsa quote'u ön plana al, description collapse "daha fazla göster" patent.

---

### N9 — Help Users Recognize, Diagnose, Recover from Errors ❌ Yüksek

**Gözlem:**
- `takeError = 'Görev alınamadı, tekrar dene'` — kullanıcı **neden** olduğunu bilmiyor (kontenjan mı, ağ mı, duplicate mı).
- `'Kod hatalı, tekrar dene'` — üst üste 3 hatada kullanıcı pes ediyor, "yardım" yok.
- Photo upload fail — generic error, dosya boyut limitini bilmiyor, dosya tipi yanlışsa ipucu yok.

**Öneri:** TR error code mapping (tıpkı NGO membership payment-embed'deki gibi): `KONTENJAN_DOLU` → "Maalesef kontenjan doldu, benzer görevlere bak ↓", `NETWORK` → "İnternet sorunu, tekrar dene", `CODE_3X_FAIL` → "Kod bulma konusunda yardım: STK ile iletişime geç ↓".

---

### N10 — Help and Documentation ⚠️ Orta

**Gözlem:** Görev alma akışında hiçbir yerde "nasıl çalışır" açıklaması yok. İlk kullanıcı "aldım sonra ne olacak?" sorusuyla sıkışıyor.

**Öneri:** `idle` state'te "Bu göreve katılırsan" küçük 3-adım mini-info (Başvur → Katıl → Kanıt gönder → Karma kazan). İlk kullanıcıya özel, 2. seferde gizle.

---

## 4. İyiBiri 6 Özel Heuristics

### İ1 — TR dil/ton/locale ⚠️ Yüksek

- `code` verify TR-locale bug (`i/İ`) — bkz. N5.
- Photo file name gösterimi `{photoFile.name}` ham. Türkçe karakterli dosya adı + uzun path → taşma riski.
- Tarih format — `date_label` ham (`"22 Nisan 2026, Cumartesi 14:00"`). Lokale göre mesafeli ("2 gün içinde" vs "geçmiş") yok.

**Öneri:** `Intl.DateTimeFormat('tr-TR')` veya `date-fns` TR locale. Relative time "3 gün sonra" + absolute "22 Nis 14:00".

---

### İ2 — KVKK + yasal zorunluluk ❌ Kritik

- Non-member mission take akışında KVKK tek onay (checkbox), 14-gün cayma hakkı banner YOK, üyelik sözleşmesi onayı YOK, aydınlatma metni detay linki YOK.
- Bu akış STK üyeliği kaydı oluşturuyor (`ngo_memberships.insert(... status: 'active')`) → para ödenmese bile **yasal olarak üyesin**. NGO membership parametric flow'daki KVKK çifte onay + cayma standardına uymuyor.

**Karar gerekli:** Q40 — "Mission-only volunteer" kavramı var mı?
- **Yol A:** Mission-only volunteer = paralı üyelik değil, hafif `mission_participant` rolü. Yeni enum + RLS.
- **Yol B:** "Gönüllü ol ve katıl" shortcut'ı kaldır; kullanıcıyı önce `/membership` akışına yönlendir. Mission sayfası "Önce üye ol" CTA ile engel koyar.

Strateji memosuyla tutarlı olan **Yol B** (tek üyelik tipi, yasal basitlik). Yol A daha esnek ama KVKK × çift kayıt karmaşıklığı getiriyor.

---

### İ3 — Yasal metin şeffaflığı ⚠️ Yüksek (N9 + İ2 ile bağlantılı)

- Takelim sözleşme linki, cayma linki, aydınlatma metni hiçbir yerde yok.

---

### İ4 — Tier-1 polish ❌ Kritik (N4 ile aynı)

Verification screen tema bozuk. Başlı başına tier-1 hissi öldürüyor.

---

### İ5 — Micro-signals ⚠️ Orta

- "Bu göreve katıl" tıklandığında haptic feedback yok.
- Fotoğraf upload success — sadece "tamamlandı" metin, emoji ✅ ham.
- Code verify success — CelebrationOverlay tetikleniyor ✓ iyi ama **öncesinde** "kod doğru ✓" mikro feedback yok (500ms buffer). Birden confetti başlıyor → aniden.

**Öneri:**
- Tap → haptic light
- Code doğru → field borderi yeşil + check ikon (600ms) → sonra celebration
- Fotoğraf yüklendi → upload progress dolu → 200ms "✓ Yüklendi" → sonra celebration
- Capacitor `Haptics.notification({type:'SUCCESS'})` celebration mount'ta

---

### İ6 — Dark mode rigor ⚠️ Yüksek

- Mission detail ✓ (dark doğru)
- Verification ❌ (light tema)
- States client ✓ (dark)

Tek tutarsızlık verification-client.tsx'ten geliyor. Aynı audit N4.

---

## 5. Benchmark Karşılaştırma (3 tier-1 app)

### Duolingo — Lesson Complete Pattern

| Özellik | Duolingo | İyiBiri Bugün | Ne ekleyelim |
|---|---|---|---|
| State machine netliği | Perfect clear states (lesson → correct/incorrect → streak → reward) | 3 state fragmente | 8 state formal FSM |
| Progress indicator | Top bar her soruda dolduruyor | Yok | Mission steps varsa step progress bar (verify method'a bağlı) |
| Streak feedback | "5 day streak!" celebration peak | Celebration overlay var ✓ | Karma count-up + streak chip ekle |
| Error recovery | Yanlış cevap → canlı feedback + ipucu | `'Kod hatalı'` generic | Context-aware help + "help" CTA |

### Strava — Activity Finish Pattern

| Özellik | Strava | İyiBiri | Ne |
|---|---|---|---|
| Multi-step save | "Save → Enrich → Publish → Share" 4 adım progress | Tek `markComplete` monolith | Verify → Upload → Confirm 3-step state machine |
| Post-complete edit | "Değişiklik yap" — fotoğraf ekle, notlar düzenle | Yok | `completed` state'te "Kanıtımı güncelle" (admin onayı şart değilse) |
| Share CTA | Büyük, renkli, post-celebration | Yok | Celebration sonrası "Paylaş" CTA (iOS share sheet) |

### Apple Fitness — Workout Complete

| Özellik | Apple Fitness | İyiBiri | Ne |
|---|---|---|---|
| Ring close animation | Activity ring animate dolar, peak moment | Confetti var ✓ | Karma count-up + streak ring ekle |
| Summary card | Tamamlanan activity sonrası "summary card" kalıcı | Dashboard'a geri → detay kayboluyor | Completed state'te summary card "1 Mart'ta tamamlandı, +50 Karma" |
| History access | Tap → aynı activity'yi tekrar gör | Admin panel YOK, user kendi kanıtını göremez | Completed state'e "Kanıtımı gör" access |

---

## 6. Kritik 5 — P0 Aksiyon Listesi

### K1 — State machine formalize et (FSM)

**Problem:** 3 client, 3 state. Olması gereken 8-9 state + transitions.

**Aksiyon:** XState tarzı tek `useMissionState` hook + state derive fonksiyonu. `lib/missions/state.ts`.

**Çıktı:**
```
states: { idle, full, expired, requires_membership, taken, verifying, completed, failed_verification, cancelled }
transitions: server-action-driven
```

---

### K2 — Verification-client dark temaya refactor

**Problem:** `bg-white`, `text-text-primary`, `bg-primary/10` — eski tema. Tier-1 hissini öldüren tek kritik bug.

**Aksiyon:** `useTheme` + semantic token, `@/lib/theme` renk reference, motion.button, no Tailwind color utilities. `components/mission/verification-panel.tsx` yeniden yaz.

---

### K3 — "Gönüllü ol ve katıl" shortcut'ı kaldır (Yol B)

**Problem:** Shortcut yasal basitliği bozuyor, paralı üyelik × ücretsiz mission çakışması yaratıyor.

**Aksiyon:**
- `handleJoinAndTakeMission` sil
- `requires_membership` state'te CTA → "Üye olmak için devam et" → `/dashboard/ngos/[id]/membership` redirect
- Post-membership success → mission detail'e auto-return + auto-take opsiyonu

---

### K4 — Karma race condition çöz (transaction/idempotent)

**Problem:** `user_missions.status='completed'` set edildikten sonra `karma_transactions` insert fail ederse: mission tamamlandı ama Karma yok. Kullanıcı yardım istemek zorunda.

**Aksiyon:**
- Server action `completeMission(userMissionId, verificationData)` — Supabase RPC veya tek transaction
- `karma_transactions` insert FIRST (unique constraint: `user_id + mission_id + type`)
- SONRA `user_missions.status='completed'` update
- Trigger `update_karma_total` zaten profiles.karma_total artırıyor
- İdempotent — tekrar çağrılırsa unique constraint koruma

**Migration:** `013_mission_karma_idempotent.sql` — `karma_transactions` unique `(user_id, reference_id, type)` WHERE `type='mission_complete'`.

---

### K5 — 5 eksik state UI + data

**Problem:** Full, expired, failed_verification, cancelled, re-access state'leri yok.

**Aksiyon:** UI spec'te her state için net visual contract. Migration'a `missions.status` + `user_missions.admin_review_status` kolonları (eğer yoksa).

---

## 7. Yüksek 4 — P1 Aksiyon

- **Y1** Error code TR mapping (benzer NGO payment-embed pattern)
- **Y2** Verify hint visual hierarchy + "örnek fotoğraf" thumbnail
- **Y3** `taken` state "vazgeç" CTA + uyarı dialog
- **Y4** Post-complete "Paylaş" CTA (iOS/Android native share)

---

## 8. Orta 3 — P2 Polish

- **O1** "Katılanlar" avatar stack (0-5 gizle, 6+ mini görsel)
- **O2** Description "daha fazla göster" truncate
- **O3** TR relative time ("3 gün sonra" vs "yarın")

---

## 9. Risk ve Etki

| Risk | Olasılık | Etki | Azaltma |
|---|---|---|---|
| FSM refactor'u büyük, release geç kalır | Orta | Büyük | Faz 2'ye böl — faz 1 temel 5 state, faz 2 advanced states |
| Verification tema refactor regression | Düşük | Orta | Side-by-side screenshot QA (frontend-engineer) |
| Karma race condition geçmiş verileri | Yüksek | Orta | Audit script yaz — `user_missions.completed AND NOT EXISTS karma_transactions` → manual fix |
| "Gönüllü ol ve katıl" çıkarınca conversion düşer | Yüksek | Yüksek | A/B test — shortcut vs parametric akış. Metric: MAKE + membership rate |

---

## 10. Quality Self-Check (mobile-app-polish-standards Bölüm 12)

- [x] Nielsen 10 maddesi tek tek denendi
- [x] İyiBiri 6 özel heuristic denendi
- [x] 3 tier-1 benchmark app ile karşılaştırıldı
- [x] State envanteri MECE (9 state, overlap yok)
- [x] Kritik × Yüksek × Orta etiketleme + aksiyon sayısı
- [x] Risk matrix + azaltma
- [x] Skill referansı (ux-heuristics + user-journey-mapping + mobile-app-polish-standards)
- [x] Copywriting TR + empathic
- [x] Kod referansı dosya:satır bazlı (`mission-detail-client.tsx`, `verification-client.tsx`)
- [x] Açık karar işaretli (Q40 mission-only volunteer)
- [x] Migration gerekliliği işaretli (013)
- [x] Handoff noktası ui-designer için net

---

## 11. Handoff → ui-designer

**Sonraki iş:** `docs/ui/01-specs/2026-04-24-mission-detail-state-machine-ui-spec.md`

**Zorunlu içerik:**
1. **Her 9 state için ASCII wireframe + visual contract** (background, CTA variant, sticky footer behavior)
2. **FSM diyagram** — state × transition × server action
3. **Verification panel redesign** — dark tema, 4 variant (auto, code, photo, qr)
4. **Loading/empty/error state** her state için
5. **Motion choreography** — state transition animate, peak moment
6. **Migration 013 şeması** — karma_transactions unique constraint
7. **Component hierarchy** — `components/mission/` dir listesi

**Önceliklendirme spec'e taşı:**
- K1-K5 = P0 spec section
- Y1-Y4 = P1 spec section (ayrı bölümler)
- O1-O3 = P2 backlog notları

---

## 12. Açık Sorular (analist için)

- **Q40:** Mission-only volunteer (Yol A) vs paralı üyelik-only (Yol B)? Bu audit Yol B öneriyor.
- **Q41:** `admin_review_status` kolonu — photo verify admin moderasyonu zorunlu mu? Yoksa trust-first (photo verify → direkt Karma, flag edilirse sonradan revoke)?
- **Q42:** Karma geri alma — cancelled mission Karma'sını geri alıyor muyuz? (strateji: hayır, kullanıcı cezalandırılmasın; STK'nın iptali)

---

**Audit sonucu:** ⚠️ Partial — temel iyi, yapısal refactor + 5 eksik state + tema reconciliation + Karma transaction → lansman blocker. UI spec tamamlandığında frontend-engineer 8-12 saatlik iş.

## Handoff log

Bu audit'i alıp üreten agent'ların zinciri. Protokol: `.claude/skills/agent-communication-protocol/SKILL.md` Katman A.

- 2026-04-24 09:30 — **ui-designer** ✅ — **spec**: `docs/ui/01-specs/2026-04-24-mission-detail-state-machine-ui-spec.md`. K1-K5 → Bölüm 2-10. Race condition K4 → migration 013 önerisi. *(retroactive)*
- 2026-04-24 11:00 — **frontend-engineer** ✅ — **FSM implementation canlı**. Audit K2 (tema debt) çözüldü: dark rewrite. *(retroactive)*
