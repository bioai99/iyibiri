# 012. Mission Access Level — Per-Mission Visibility (Yol D)

**Tarih:** 2026-04-24
**Durum:** **Accepted (2026-04-24)** ✅
**Önerici:** ux-researcher flag (mission state machine audit K3) + Bahadır'ın yaklaşım sezgisi
**Onaylayan:** Bahadır

## Bağlam

UX audit 2026-04-24 (mission detail state machine) **K3** kritik bulgusu:

> Mevcut mission detail'de "Gönüllü ol ve katıl" shortcut'ı var. Kullanıcı KVKK onayı verip `ngo_memberships.insert(... status: 'active')` oluşturuyor — **para ödemeden**. Yasal olarak üye oluyor ama ücret yok.

Bu durum yasal karmaşıklık (KVKK × çift kayıt tipi) ve NGO membership parametric flow'unu (ADR-007) bypass eden ikinci bir yol yaratıyor.

**3 çözüm değerlendirildi:**

- **Yol A (mission-only volunteer):** Yeni rol + enum. Yasal karmaşıklık, iki-sınıf kullanıcı
- **Yol B (paralı üyelik only):** Her görev üyelik gerektirir, shortcut kaldır. Yüksek friction
- **Yol C (free tier):** Fee_config'e ₺0 tier ekleme, hala tek flow. Düşük friction

Bahadır'ın **ek sezgisi**:

> "Bu STK'ların karar vereceği bir şey bunu görev bazlı da yönetebilirler — bu görev sadece üyelere özel, buna herkes katılabilir gibi."

## Karar — Yol D: Per-Mission Visibility

Her görevin `access_level` flag'i olur:

- **`public`** (default) — Herkes katılabilir, hafif KVKK onayı yeterli
- **`members_only`** — Sadece o NGO'nun aktif üyesi (`ngo_memberships.status='active'`)

**Schema** (migration 015):

```sql
alter table public.missions
  add column if not exists access_level text default 'public'
    check (access_level in ('public', 'members_only'));

create index if not exists missions_access_level_idx
  on public.missions(access_level);
```

**FSM değişikliği** (`lib/missions/state.ts`):

```typescript
// requires_membership sadece access_level='members_only' ve üye değilse tetiklenir
if (
  mission.ngo_id &&
  mission.access_level === 'members_only' &&
  !isMember
) {
  return 'requires_membership'
}
```

**STK admin UI** (ADR-010 kapsamında): Görev yayınla formunda tek toggle — ☐ "Sadece üyelerime özel göster". Default kapalı (public).

**Seed düzeltmesi** (migration 015):
- TEGV okuma atölyesi (m-tegv-okuma) → `members_only` (çocukla 1:1 etkileşim, pre-screening uygun)
- Diğer 11 mission → `public` (default)

## Sonuçlar

**Pozitif:**
- STK kontrolü **per-mission** — her STK kendi gerçekliğini yansıtır. TEMA sahil temizliği public, Orman Bekçileri eğitimi members_only; HAYTAP mama dağıtımı public, barınak içi bakım members_only
- Tek veri modeli korunur — yeni enum/rol yok
- KVKK rejimi iki kategoride ayrışır: public için hafif inline (ADR-009), members_only için tam flow
- UX doğal — "önce üye ol" banner sadece gerçekten gereken görevlerde çıkıyor
- Pitch (Gamma deck, TEMA pitch) güçlenir: "İyiBiri, STK'nın üyelik politikasına saygı duyar"

**Negatif:**
- Public mission için `ngo_memberships` kaydı oluşmaz → STK "gönüllü listesi" iki farklı yerden (üye + görev katılımcısı) derlenmeli. Admin UI listelerde "Üye" vs "Katılımcı" filter/tag
- Mevcut "Gönüllü ol ve katıl" shortcut silinecek (mission-detail-client.tsx refactor) — P0 #3 backlog item

**Riskler:**
- STK'lar ilk açılışta nasıl ayarlayacaklarını bilmez → onboarding yardım + default `public` doğru başlangıç
- "Bu görev members_only" rozeti UI'da belirgin olmalı → kullanıcı beklentisi yönetimi

## Implementation durumu

**Kod canlı (2026-04-24):**
- ✅ Migration 015 — access_level kolon + check + index + seed (TEGV members_only)
- ✅ `lib/supabase/types.ts` — `access_level: 'public' | 'members_only'`
- ✅ `lib/missions/state.ts` — `deriveMissionState()` güncelleme
- ✅ Unit test — 2 yeni case (public+non-member → idle, members_only+non-member → requires_membership)
- ⏳ Admin UI toggle (ADR-010 kapsamında)
- ⏳ Mission detail idle state hafif KVKK UI (ADR-009 kapsamında, avukat onayı sonrası)
- ⏳ "Gönüllü ol ve katıl" shortcut temizliği (mission-detail-client.tsx refactor)

## Referanslar

- Karar kuyruğu Q40-UX: `docs/_decisions-queue.md`
- UX audit K3: `docs/ux/03-heuristics/2026-04-24-mission-detail-state-machine-heuristik-audit.md`
- Migration 015: `supabase/migrations/015_mission_access_level.sql`
- FSM: `lib/missions/state.ts`
- ADR-009 (KVKK hafif onay public mission için), ADR-010 (admin UI toggle)

## Sonraki adım

1. ADR-010 scope'unda admin UI #2 (Görev yayınla) form'unda access_level toggle
2. ADR-009 accepted olduktan sonra mission detail idle state'te hafif KVKK component
3. mission-detail-client.tsx'te "Gönüllü ol ve katıl" shortcut kaldır → `requires_membership` state'in `/membership` akışına redirect
