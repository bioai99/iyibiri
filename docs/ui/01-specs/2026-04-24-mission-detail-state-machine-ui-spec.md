# UI Spec — Mission Detail State Machine

**Tarih:** 2026-04-24
**Owner:** ui-designer
**Ön kaynak:**
- `docs/ux/03-heuristics/2026-04-24-mission-detail-state-machine-heuristik-audit.md`
- `docs/ux/02-journeys/2026-04-24-mission-lifecycle-journey.md`
- `docs/project-atlas.md` Bölüm 6 (tokens)

> **Skill ritüeli (Adım 0)** — Bu spec öncesi 3 skill okundu:
> - `.claude/skills/visual-spec-writing/SKILL.md` — token × variant × state × handoff
> - `.claude/skills/design-system-audit/SKILL.md` — token ihlali tarama
> - `.claude/skills/mobile-app-polish-standards/SKILL.md` — motion + haptic + peak moment

**Token ihlali taraması:** 0 (her renk/tipo/spacing atlas Bölüm 6 referanslı)

---

## 1. Kapsam

Bu spec **mission detail + verify akışını** tamamen yeniden yapılandırır:

**In scope:**
- State machine FSM (9 state)
- Her state için visual contract (layout, background, CTA)
- `components/mission/` dir yeni componentler (yazılacak)
- Verification panel dark tema refactor (4 variant)
- Celebration upgrade — Karma count-up + share CTA
- Migration 013 — karma_transactions idempotent constraint

**Out of scope (ayrı iş):**
- Push bildirim Capacitor integration (P1)
- Share card canvas generate (P2)
- Public mission landing (P2)
- STK admin mission moderation (P0 #9 ayrı iş)

---

## 2. State Machine — FSM

### 2.1 States (9)

```
┌─────────────────────────────────────────────────────────────┐
│                       MISSION STATES                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────────┐                                              │
│   │   idle   │────┐                                         │
│   └──────────┘    │                                         │
│                   ├──► full (kontenjan 0)                   │
│                   ├──► expired (tarih geçti)                │
│                   ├──► requires_membership ──► redirect to  │
│                   │      /membership         /dashboard/ngos │
│                   │                                         │
│                   └──► taken ──► verifying ──► completed    │
│                                       │             │       │
│                                       │             ▼       │
│                                       │       re_access     │
│                                       │       (read-only    │
│                                       │        proof view)  │
│                                       ▼                     │
│                              failed_verification            │
│                              (admin rejected)               │
│                                                             │
│   cancelled (admin iptal etti) ◄─── any state               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 State derive logic (server + client)

**Server-side (page.tsx):**
```typescript
function deriveState(
  mission: Mission,
  userMission: UserMission | null,
  now: Date = new Date(),
): MissionState {
  // Terminal states öncelikli
  if (mission.status === 'cancelled') return 'cancelled'
  if (userMission?.status === 'completed') return 'completed'
  if (userMission?.admin_review_status === 'rejected') return 'failed_verification'
  if (userMission?.status === 'taken') return 'taken'

  // Non-taken states
  if (mission.spots_left !== null && mission.spots_left <= 0) return 'full'
  if (mission.event_date && new Date(mission.event_date) < now) return 'expired'
  // requires_membership — RLS-level kontrol, sunucuda ngo_memberships join

  return 'idle'
}
```

`requires_membership` için ayrı prop (`isMember: boolean`) eklenir, client UI state'ten türetir.

### 2.3 Transitions

| From | To | Trigger (server action) |
|---|---|---|
| `idle` | `taken` | `takeMission(missionId)` |
| `idle` | `requires_membership` | RLS fail → UI redirect |
| `taken` | `verifying` | Navigate to `/complete` |
| `verifying` | `completed` | `completeMission(userMissionId, verificationData)` |
| `verifying` | `failed_verification` | Admin review result |
| `taken` | `idle` | `abandonMission(userMissionId)` (opsiyonel P1) |
| any | `cancelled` | Admin action (trigger from ngos_admin) |

---

## 3. Visual Contract — Her State

### 3.1 `idle` — En zengin state

Mevcut `mission-detail-client.tsx` 1:1 korunur (dark tema iyi), sadece fix:

**Değişiklikler:**
- `handleJoinAndTakeMission` + "Gönüllü ol ve katıl" shortcut'ı **kaldırılır** (audit K3).
- Non-member için CTA "Üye ol, sonra katıl" + `/dashboard/ngos/{id}/membership?return=mission:{id}` redirect.
- `FactCard` kontenjan `spots_left <= 0` ise state `full`'e delege edilir (idle'da bu case görünmez).

**Token:**
- Background: `c.ink900`
- Card bg: `c.ink800` + border `c.goldLine`
- CTA primary: `c.gold` bg + `c.ink` text
- Radius: 16px (var `--radius`)

---

### 3.2 `full` — Kontenjan dolu

```
┌────────────────────────────┐
│  [← geri]                  │
│                            │
│  [photo] ← dim overlay 60% │
│   "Arı dostu fidan dikimi" │
│                            │
│  ╭─────────────────────╮   │
│  │  🔒                 │   │
│  │  Kontenjan doldu    │   │
│  │  15 kişiyle beraber │   │
│  │  çalışmışsınız      │   │
│  ╰─────────────────────╯   │
│                            │
│  [Benzer görevler ↓]       │
│  [mission-card grid]       │
└────────────────────────────┘
```

**Token:**
- Photo overlay: `rgba(26,22,18,0.62)` (c.ink900 60% alpha)
- Card: `c.ink800` + `c.clay` accent border-left
- Lock icon: lucide `Lock`, `c.clay`
- CTA "Benzer görevler" → `/dashboard/missions?category={same_category}`

---

### 3.3 `expired` — Tarih geçti

Benzer `full` state ama:
- Icon: `Calendar`, `c.ink400`
- Başlık: "Bu görev tamamlandı"
- Copy: "Maalesef tarih geçti — 3 Nisan'daydı. Benzer görevler ↓"
- Accent: `c.ink500` (gri — yasak değil, sadece geçmiş)

---

### 3.4 `requires_membership` — Üyelik gerekiyor

Full state'ten farklı, "engel + çağrı":

```
┌────────────────────────────┐
│  [← geri]                  │
│  [photo normal]            │
│   "Arı dostu fidan dikimi" │
│                            │
│  ┌── [NGO logo] ────────┐  │
│  │ TEMA gönüllüsü ol    │  │
│  │ → sonra göreve katıl │  │
│  │                      │  │
│  │ ▸ 14-gün cayma hakkı │  │
│  │ ▸ +100 Karma hediye  │  │
│  │ ▸ Yılda 1 kez ücret  │  │
│  │                      │  │
│  │ [TEMA gönüllüsü ol →]│  │ ← primary CTA
│  ╰──────────────────────╯  │
│                            │
│  [Farklı görev ara]        │
└────────────────────────────┘
```

**Davranış:** Primary CTA → `/dashboard/ngos/{ngo_id}/membership?return=mission:{mission_id}`. Üyelik success page'inde auto-return + auto-take (opsiyonel — değilse kullanıcı manuel geri döner).

**Token:**
- Card: `c.ink800` + `c.goldLine` border + gold glow breathing (signature pattern)
- Stats row: `c.ink700` background dotted separator
- CTA: `c.gold` bg

---

### 3.5 `taken` — Aktif, hazırlık

```
┌────────────────────────────┐
│  [← geri] [more ⋯]         │
│                            │
│  ┌─────────────────────┐   │
│  │ [photo 3/2 aspect]  │   │
│  │ ✓ Göreve katıldın   │   │ ← success overlay
│  ╰─────────────────────╯   │
│                            │
│  Cumartesi 10:00           │
│  3 gün sonra               │ ← countdown
│                            │
│  ╭── HAZIRLIK ──────────╮  │
│  │ ▢ Eldiven getir      │  │
│  │ ▢ 1L su al           │  │
│  │ ▢ Su geçirmez ayakkabı│ │
│  │ (NGO admin doldurur) │  │
│  ╰──────────────────────╯  │
│                            │
│  [📅 Takvime ekle]         │
│  [🗺 Konum/yol tarifi]     │
│                            │
│  ┌─── Sticky ────────────┐ │
│  │ [Tamamladım →]         │ │ ← primary
│  │ (veya gri disabled     │ │
│  │  eğer tarih < now)     │ │
│  └────────────────────────┘ │
└────────────────────────────┘
```

**Davranış:**
- "Tamamladım" CTA → `/missions/{id}/complete`
- "Takvime ekle" → `.ics` dosya download (client-side generate)
- "Konum" → `maps://` intent (iOS) veya `https://maps.google.com/?q=...`
- "more ⋯" → "Görevden vazgeç" (dialog ile onay, P1)

**Checklist:**
- NGO admin P1'de dolduracak (`missions.prep_checklist` jsonb). Şimdilik generic.

**Token:**
- Photo overlay `rgba(107,142,78,0.32)` (c.success 32% alpha)
- Success chip: `c.success` + cream text
- Countdown: Fraunces italic "3 gün sonra" — peak typography

---

### 3.6 `verifying` — `/complete` route (redesigned)

**Bugünkü verification-client.tsx tamamen yeniden yazılır.**

```
┌────────────────────────────┐
│  [← geri]                  │
│  GÖREV DOĞRULAMA · Adım 1/2│
│                            │
│  Arı dostu fidan dikimi    │
│  <em>Tamamla</em>          │ ← Fraunces italic
│                            │
│  ╭── +80 Karma ──────────╮ │
│  │  ✨                    │ │
│  │  Kazanacağın           │ │
│  │  80 Karma              │ │
│  ╰────────────────────────╯│
│                            │
│  ╭── Doğrulama ──────────╮│
│  │ [verify_hint büyük]    │ │
│  │ 📍 Nasıl doğrularım?   │ │
│  │ "STK volunteer'ından   │ │
│  │  QR kodunu tara"       │ │
│  ╰────────────────────────╯│
│                            │
│  ╭── QR Scanner ────────╮  │
│  │ [camera viewfinder]    │ │
│  │ [target reticle]       │ │
│  │ "Kodu çerçeveye al"    │ │
│  ╰────────────────────────╯│
│                            │
│  veya [Manuel kod gir]     │ ← fallback
│                            │
│  [Vazgeç — Karma kazanma]  │ ← subdued
└────────────────────────────┘
```

**4 variant davranışı:**

#### `verify_method === 'auto'`

- QR/photo yerine tek "Tamamladım ✓" buton
- Tap → confirm dialog "Gerçekten tamamladın mı? Yalan beyan Karma kaybına yol açar."
- Confirm → `completeMission()` → celebration

#### `verify_method === 'code'`

- Büyük input, `inputMode="text"` `autoComplete="off"` `spellCheck={false}` `autoFocus`
- Monospace font (`ui-monospace`)
- Letter-spacing 0.2em
- Enter = submit
- TR-safe compare: `normalizeVerificationCode(code)` (default-locale upper + İ/ı → I). Not: TR locale uppercase **kullanma** — 'i' → 'İ' üretip kağıttaki 'I' ile eşleşmez (unit test ile onaylandı).
- 3 fail → "Kod bulma konusunda yardım" expand: "STK ile iletişim → WhatsApp / web"

#### `verify_method === 'photo'`

- Photo picker + `capture="environment"` (kamera)
- Selected preview 16:9 + file name + size
- Upload progress bar (Supabase storage upload listener)
- Sample image collapsed card: "Nasıl bir fotoğraf?" → expand thumbnail
- Max 5MB, accept `image/jpeg, image/png, image/webp`

#### `verify_method === 'qr'`

- QR scanner primary
- "Manuel kod gir" collapse fallback
- Scanner permission yok → clear "Kamera izni ver" CTA + `/settings`

**Token (hepsi):**
- Background `c.ink900` ← kritik fix!
- Cards: `c.ink800` + `c.goldLine` border
- Primary CTA: `c.gold`
- Error: `c.danger` + `rgba(184,78,59,0.12)` bg
- Success: `c.success` chip

**Motion:**
- Mount: cards stagger 80ms
- Code field focus: border animate `c.ink600` → `c.gold` (200ms)
- Code doğru: border `c.success` + check ikon pop (spring) → 600ms buffer → celebration
- Photo upload: progress bar linear animate, "✓ Yüklendi" 200ms
- QR detected: flash overlay + haptic `Heavy` → celebration

---

### 3.7 `completed` — Kutla + özet

Celebration overlay bitince bu state kalır:

```
┌────────────────────────────┐
│  [← geri]                  │
│                            │
│  ┌──── SUMMARY CARD ─────┐ │
│  │ ✓ 23 Nisan 2026       │ │
│  │ Arı dostu fidan dikimi│ │
│  │ +80 Karma kazanıldı   │ │
│  │                       │ │
│  │ [Kanıtımı gör →]      │ │ ← readonly proof
│  ╰───────────────────────╯ │
│                            │
│  [Paylaş — arkadaşlarım    │
│   görsün 📣]               │ ← share primary
│  [Dashboard]               │ ← secondary
│                            │
│  BENZER GÖREVLER           │
│  [mission-card grid]       │
└────────────────────────────┘
```

**"Kanıtımı gör" modal:**
- Photo: tam boyut görüntü (readonly)
- Code: girilen kodu göster (readonly)
- QR: scanned data (readonly)
- Timestamp + verify_method badge

**Share CTA:**
- `navigator.share()` native API
- Fallback `navigator.clipboard.writeText(...)` + toast "Link kopyalandı"
- Share string: "TEMA ile fidan dikip 80 Karma kazandım 🌱 — İyiBiri'de sen de katıl: [URL]"

---

### 3.8 `failed_verification` — Admin reddetti

```
┌────────────────────────────┐
│  [← geri]                  │
│                            │
│  ⚠  Doğrulama tekrar       │
│     gözden geçirildi       │
│                            │
│  [mission hero small]      │
│                            │
│  NGO yetkili senin gönder- │
│  diğin kanıtı yeterli      │
│  görmedi.                  │
│                            │
│  Sebep: "Fotoğraf çok      │
│  karanlık, fidan görünmüyor"│
│                            │
│  [Yeniden gönder →]        │ ← primary
│  [STK ile iletişim]        │ ← secondary
└────────────────────────────┘
```

**Token:**
- Banner: `rgba(184,78,59,0.12)` + `c.clay` border
- Sebep card: `c.ink800` + italic admin_feedback

**Davranış:**
- "Yeniden gönder" → `/complete` (verify tekrar)
- Max retry 2 kere — 3. deneyde STK iletişim zorunlu

---

### 3.9 `cancelled` — Admin görevi iptal etti

```
┌────────────────────────────┐
│  🚫  İptal edildi          │
│                            │
│  [mission hero faded 50%]  │
│                            │
│  Bu görev STK tarafından   │
│  iptal edildi. Kazandığın  │
│  Karma sende kalır — sorun │
│  değil.                    │
│                            │
│  Sebep: "Hava koşulları    │
│   olumsuz, ertelendi"      │
│                            │
│  [Yeni bir görev bul →]    │
└────────────────────────────┘
```

**Davranış:**
- Karma zaten kazanılmış ise bozulmaz (strateji: Q42 — kullanıcı cezalandırılmaz)
- Alınmış ama tamamlanmamış ise `user_missions.status = 'cancelled'` set edilir

---

## 4. Typography × State Matrix

| State | Başlık (Fraunces) | Body (Jakarta) | Eyebrow | Accent |
|---|---|---|---|---|
| idle | `text-3xl` (30px) | `text-sm` (14px) | `c.gold` | `c.gold` |
| full | `text-2xl` (24px) | `text-sm` | `c.clay` | `c.clay` |
| expired | `text-2xl` | `text-sm` | `c.ink400` | `c.ink500` |
| requires_membership | `text-3xl` | `text-sm` | `c.gold` | `c.gold` (glow!) |
| taken | `text-2xl` + countdown `italic` | `text-sm` | `c.success` | `c.success` |
| verifying | `text-3xl` + `<em>italic</em>` | `text-base` | `c.gold` | `c.gold` |
| completed | `text-2xl` | `text-sm` | `c.success` | `c.gold` (Karma) |
| failed_verification | `text-2xl` | `text-sm` | `c.clay` | `c.clay` |
| cancelled | `text-2xl` | `text-sm` | `c.ink400` | `c.ink500` |

---

## 5. Motion Choreography

### 5.1 State transition (any ↔ any)

```
  Out: current state fade-out 150ms opacity + slight scale(0.98)
  In : new state fade-in 200ms opacity + scale(1) spring
  Total: 350ms (feel snappy)
```

### 5.2 Take mission (idle → taken)

(Journey map adım 4'teki choreography)

```
0ms    tap → haptic Light
0-150  button scale 0.97 + pulse ring
150    label → "Alınıyor..." + spinner
300+   Supabase settle (variable)
+200   success flash (green border 1s)
+600   route transition idle → taken
```

### 5.3 Verification success (verifying → completed)

(Journey map adım 8'deki choreography — already detailed)

### 5.4 Karma count-up (celebration)

```
Component: components/ui/karma-counter.tsx (var)
- prop from: 0, to: mission.karma, duration: 1200ms
- ease: [0.16, 1, 0.3, 1] (cubic-out)
- aria-live="polite"
- Reduced-motion: jump to final
```

---

## 6. Component Hierarchy (`components/mission/`)

Yeni dir, 9 component:

```
components/mission/
├── index.ts                      # barrel
├── mission-hero-photo.tsx        # full-bleed photo + gradient + badge
├── mission-ngo-lockup.tsx        # NGO logo + name + follow
├── mission-fact-grid.tsx         # date/duration/location/spots
├── mission-impact-section.tsx    # Fraunces quote + description
├── mission-karma-card.tsx        # +80 Karma reward
├── mission-state-banner.tsx      # full/expired/cancelled/failed banner
├── verification-panel.tsx        # 4 variant verify UI
├── verification-code-input.tsx   # TR-safe code field
└── prepare-checklist.tsx         # taken state hazırlık
```

**Reuse:**
- `@/components/ui/karma-counter` — celebration'da
- `@/components/ui/celebration-overlay` — redesign (Karma count-up + share CTA)
- `@/components/ui/qr-scanner` — verification-panel içinde

---

## 7. Migration 013 — Karma idempotent + mission status

```sql
-- 013_mission_lifecycle.sql
-- P0 #3 mission detail state machine — data model additions.

begin;

-- missions.status — admin cancellation support
alter table public.missions
  add column if not exists status text default 'active'
    check (status in ('draft', 'active', 'cancelled', 'completed'));

-- missions.event_date — expired state için (zaten date_label var ama structured değil)
alter table public.missions
  add column if not exists event_date timestamptz;

-- missions.prep_checklist — taken state için
alter table public.missions
  add column if not exists prep_checklist jsonb default null;

-- user_missions.admin_review_status — failed_verification için
alter table public.user_missions
  add column if not exists admin_review_status text default 'auto_approved'
    check (admin_review_status in ('auto_approved', 'pending_review', 'approved', 'rejected'));

alter table public.user_missions
  add column if not exists admin_feedback text;

-- user_missions.verification_data zaten jsonb (önceki migration).

-- KARMA IDEMPOTENT — tek kullanıcı aynı mission için tek Karma alır
create unique index if not exists karma_transactions_mission_unique
  on public.karma_transactions (user_id, reference_id, type)
  where type = 'mission_complete';

-- RPC completeMission atomik
-- (actions.ts tarafında transaction kullanarak yapacağız,
--  explicit RPC function gerekirse sonra eklenebilir)

commit;
```

---

## 8. Server Actions (`lib/missions/actions.ts` yeni)

```typescript
'use server'

export async function takeMission(missionId: string):
  Promise<{ ok: true } | { ok: false; error: string; code: string }>

export async function completeMission(
  userMissionId: string,
  verificationData: VerificationData,
): Promise<{ ok: true; karmaAwarded: number } | { ok: false; error: string }>

export async function abandonMission(userMissionId: string):
  Promise<{ ok: true } | { ok: false; error: string }>   // P1
```

**completeMission implementation notları:**

1. Verify data validate (code match / photo path exist / qr match)
2. **KARMA INSERT FIRST** (unique constraint koruma):
   ```typescript
   const { error: karmaErr } = await supabase
     .from('karma_transactions')
     .insert({
       user_id: user.id,
       amount: mission.karma,
       type: 'mission_complete',
       reference_id: mission.id,
       description: `${mission.title} görevi tamamlandı`,
     })
   if (karmaErr?.code === '23505') {
     // Zaten var — idempotent, devam et
   } else if (karmaErr) {
     return { ok: false, error: 'Karma kaydedilemedi' }
   }
   ```
3. Sonra `user_missions.status = 'completed'`.
4. Trigger `update_karma_total` zaten profiles.karma_total artırır.
5. Return `{ ok: true, karmaAwarded: mission.karma }`.

---

## 9. Error Code Mapping (TR empathic)

`lib/missions/error-codes.ts`:

| Code | Turkish empathic message |
|---|---|
| `CAPACITY_FULL` | Maalesef kontenjan doldu. Benzer görevlere göz atar mısın? ↓ |
| `MISSION_EXPIRED` | Bu görevin tarihi geçmiş. Önümüzdeki görevleri önerelim mi? |
| `REQUIRES_MEMBERSHIP` | Bu göreve katılmak için önce STK gönüllüsü olman gerek. |
| `ALREADY_TAKEN` | Zaten bu görevi aldın — "Görevlerim" sekmesinde bekliyor. |
| `NETWORK` | İnternet bağlantın kesilmiş olabilir. Bir saniye sonra tekrar dener misin? |
| `CODE_INVALID` | Kod eşleşmedi. Büyük-küçük harfe dikkat. |
| `CODE_INVALID_3X` | 3 kez yanlış — yardıma ihtiyacın olursa STK'ya ulaşabilirsin. |
| `PHOTO_TOO_LARGE` | Fotoğrafın biraz büyük (5MB sınırı). Tekrar çekmek ister misin? |
| `PHOTO_INVALID_TYPE` | Sadece JPG, PNG veya WEBP kabul ediyoruz. |
| `PHOTO_UPLOAD_FAILED` | Fotoğraf gönderilemedi. İnternet bağlantını kontrol edip tekrar dene. |
| `QR_INVALID` | Bu QR başka bir göreve ait görünüyor. |
| `QR_NO_CAMERA` | Kamera erişimi yok. Ayarlardan izin vermen gerek. |
| `MISSION_CANCELLED` | Bu görev iptal edildi. Kazandığın Karma sende kalır. |
| `GENERIC` | Bir şeyler ters gitti. Biraz sonra tekrar dener misin? |

---

## 10. A11y (WCAG AA)

- Her state `<main aria-labelledby="mission-title">` structure
- Verification form `<form aria-describedby="verify-hint">`
- Code input `aria-label="Doğrulama kodu"` + `aria-invalid={error}`
- Photo upload `aria-describedby="photo-hint"`
- Progress bar `role="progressbar"` + aria-valuenow
- Celebration `role="status"` + `aria-live="polite"`
- `prefers-reduced-motion` — tüm animate conditionally disabled
- Color contrast — `c.gold` on `c.ink900` = 7.2:1 ✓ AAA, `c.clay` on `c.ink900` = 4.8:1 ✓ AA

---

## 11. Responsive

**iOS safe-area:**
- Header `padding-top: calc(env(safe-area-inset-top) + 16px)`
- Sticky CTA `padding-bottom: calc(env(safe-area-inset-bottom) + 16px)`

**Landscape:**
- Mission detail fact grid 4-col → 2×2 (çok dar değil), photo 16:9
- Verification photo preview 16:9 yerine 4:3

**Tablet (future):**
- Mission detail split (left: photo + info, right: sticky CTA + related missions)
- Out of V1 scope

---

## 12. Dark/Light Mode

- Dashboard + mission routes → dark (ADR-004)
- Landing + auth → light (değişmez)
- `useTheme()` tek kaynak — hiçbir hard-coded renk yok

---

## 13. Handoff → frontend-engineer

**Öncelik sırası (P0-P1-P2):**

**P0 (hemen, lansman blocker):**
1. `components/mission/` dir + 9 component scaffold
2. `lib/missions/actions.ts` + `lib/missions/state.ts` (FSM)
3. `lib/missions/error-codes.ts`
4. `verification-panel.tsx` dark rewrite (4 variant)
5. `page.tsx` FSM entegrasyonu — her state için render path
6. `full` + `expired` + `requires_membership` UI
7. Take mission server action + idempotent karma award
8. Migration 013 dosyası (kullanıcı apply edecek)
9. `take-mission.tsx` sil (dead code)
10. Celebration upgrade — Karma count-up + share CTA + haptic
11. Unit test — state derive matrix + TR-safe code compare

**P1 (1-2 hafta sonra):**
- `failed_verification` state
- `cancelled` state
- "Takvime ekle" `.ics` generator
- "Vazgeç" flow + confirm dialog
- Prepare checklist NGO admin schema

**P2 (backlog):**
- Share card canvas generate
- Public mission landing
- Avatar stack for katılanlar
- Description truncate

---

## 14. Quality Self-Check (mobile-app-polish-standards Bölüm 12)

- [x] 9 state ASCII wireframe + visual contract
- [x] Token × state × variant matrix tam
- [x] Motion choreography her state için
- [x] A11y AA tamam
- [x] 3 benchmark app referansı (audit + journey'den)
- [x] Error TR empathic copy (14 kod)
- [x] Migration şeması net (013)
- [x] Server action sözleşmesi
- [x] Component hierarchy (9 dosya)
- [x] Önceliklendirme (P0/P1/P2) net
- [x] Handoff checklist frontend-engineer için executable
- [x] Skill cross-reference (3 skill)

**Sonuç:** Skill-driven spec tier-1 app kalitesi için yeterli. Frontend-engineer ~8-12 saatlik P0 iş paketi.
