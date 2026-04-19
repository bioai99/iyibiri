# İyilik Öncüsü Üyelik Sistemi — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kullanıcıların İyilik Öncülerine tek tıkla veya parametrik form ile üye olabilmesi, üyeliklerin profil ve STK sayfalarında görünmesi.

**Architecture:** `ngo_memberships` tablosu üyelik durumunu tutar. `ngos` tablosuna ek kolonlar STK'nın üyelik ayarlarını (form alanları, açıklama) yönetir. STK profil sayfasında "Üye Ol" butonu, form varsa dinamik form, sonra başarılı ekranı. Profilde "Üyeliklerim" bölümü.

**Tech Stack:** Next.js 14, Supabase, TypeScript, Framer Motion

---

## Dosya Haritası

| Dosya | Aksiyon | Sorumluluk |
|-------|---------|------------|
| `supabase/migrations/008_ngo_memberships.sql` | CREATE | DB migration |
| `lib/supabase/types.ts` | MODIFY | Yeni tipler |
| `app/dashboard/ngos/[id]/page.tsx` | MODIFY | Üyelik verisi fetch |
| `app/dashboard/ngos/[id]/ngo-profile-client.tsx` | MODIFY | Üye ol butonu + durum |
| `app/dashboard/ngos/[id]/membership/page.tsx` | REWRITE | Parametrik form |
| `app/dashboard/ngos/[id]/membership/success/page.tsx` | CREATE | Başarılı ekranı |
| `app/dashboard/profile/profile-client.tsx` | MODIFY | Üyeliklerim bölümü |
| `components/ui/mission-card.tsx` | MODIFY | Üye rozeti |
| `scripts/seed-membership-config.js` | CREATE | STK üyelik ayarları |

---

### Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/008_ngo_memberships.sql`

- [ ] **Step 1: Migration dosyası oluştur**

```sql
-- Üyelik tablosu
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
alter table public.ngo_memberships enable row level security;
create policy "Users can view own memberships" on public.ngo_memberships for select using (auth.uid() = user_id);
create policy "Users can insert own memberships" on public.ngo_memberships for insert with check (auth.uid() = user_id);
create policy "Users can update own memberships" on public.ngo_memberships for update using (auth.uid() = user_id);

-- NGO tablosuna üyelik ayarları
alter table public.ngos
  add column if not exists membership_enabled boolean default true,
  add column if not exists membership_form_fields jsonb default '[]',
  add column if not exists membership_approval_required boolean default false,
  add column if not exists membership_description text,
  add column if not exists membership_terms_url text;
```

- [ ] **Step 2: Migration'ı push et**
```bash
npx supabase db push --linked
```

- [ ] **Step 3: Commit**
```bash
git add supabase/migrations/008_ngo_memberships.sql
git commit -m "feat(db): ngo_memberships table + ngos membership config columns"
```

---

### Task 2: TypeScript Types

**Files:**
- Modify: `lib/supabase/types.ts`

- [ ] **Step 1: Yeni tipleri ekle**

NGO Row/Insert/Update'e ek alanlar:
```typescript
membership_enabled: boolean
membership_form_fields: any
membership_approval_required: boolean
membership_description: string | null
membership_terms_url: string | null
```

Yeni tablo:
```typescript
ngo_memberships: {
  Row: {
    id: string
    user_id: string
    ngo_id: string
    status: 'pending' | 'active' | 'rejected' | 'expired' | 'cancelled'
    tier: 'free' | 'basic' | 'premium'
    form_data: any
    joined_at: string
    expires_at: string | null
  }
  Insert: {
    id?: string
    user_id: string
    ngo_id: string
    status?: 'pending' | 'active' | 'rejected' | 'expired' | 'cancelled'
    tier?: 'free' | 'basic' | 'premium'
    form_data?: any
    joined_at?: string
    expires_at?: string | null
  }
  Update: {
    id?: string
    user_id?: string
    ngo_id?: string
    status?: 'pending' | 'active' | 'rejected' | 'expired' | 'cancelled'
    tier?: 'free' | 'basic' | 'premium'
    form_data?: any
    joined_at?: string
    expires_at?: string | null
  }
  Relationships: []
}
```

Export:
```typescript
export type NgoMembership = Database['public']['Tables']['ngo_memberships']['Row']
```

- [ ] **Step 2: Build doğrula**
- [ ] **Step 3: Commit**

---

### Task 3: Seed Membership Config

**Files:**
- Create: `scripts/seed-membership-config.js`

- [ ] **Step 1: STK'lara üyelik ayarları ekle**

Bazı STK'lara form alanı ekle (gerçekçi senaryolar):

```javascript
// Haytap: telefon + motivasyon ister
{ id: 'haytap', membership_description: 'Haytap gönüllüsü olarak sokak hayvanlarına yardım edebilirsin.', membership_form_fields: [
  { key: 'phone', label: 'Telefon', type: 'tel', required: true },
  { key: 'motivation', label: 'Neden gönüllü olmak istiyorsun?', type: 'textarea', required: false }
]}

// İBB: telefon + yaş + deneyim ister
{ id: 'ibb', membership_description: 'İBB Gönüllüleri programına katıl, İstanbul için fark yarat.', membership_form_fields: [
  { key: 'phone', label: 'Telefon', type: 'tel', required: true },
  { key: 'experience', label: 'Daha önce gönüllülük yaptın mı?', type: 'select', options: ['Evet', 'Hayır', 'Kısmen'], required: false }
]}

// TEMA, Kızılay, ÇYDD, Kodluyoruz: direkt üyelik (form yok)
{ id: 'tema', membership_description: 'TEMA gönüllüsü ol, doğayı koru.' }
{ id: 'kizilay', membership_description: 'Kızılay gönüllüsü olarak insani yardıma katkıda bulun.' }
{ id: 'cydd', membership_description: 'ÇYDD gönüllüsü olarak eğitimde fırsat eşitliğine destek ver.' }
{ id: 'kodluyoruz', membership_description: 'Kodluyoruz mentörü ol, geleceği kodla.' }
```

- [ ] **Step 2: Script'i çalıştır**
- [ ] **Step 3: Commit**

---

### Task 4: STK Profil — Üye Ol Butonu + Durum

**Files:**
- Modify: `app/dashboard/ngos/[id]/page.tsx`
- Modify: `app/dashboard/ngos/[id]/ngo-profile-client.tsx`

- [ ] **Step 1: Server component'ta üyelik verisi fetch et**

`page.tsx`'e ekle — mevcut Promise.all'a:
```typescript
const { data: membership } = await supabase
  .from('ngo_memberships')
  .select('*')
  .eq('user_id', user.id)
  .eq('ngo_id', params.id)
  .maybeSingle()
```

`userId` ve `membership` prop'larını client'a geçir.

- [ ] **Step 2: Client component'ta "Üye Ol" butonu ekle**

Cover image'ın altındaki buton grubuna (paylaş/beğen yanına):

```tsx
// Üye değilse
<Link href={`/dashboard/ngos/${ngo.id}/membership`}>
  <button style={{
    height: 40, padding: '0 20px', borderRadius: 12,
    background: c.gold, color: c.ink, border: 'none',
    fontWeight: 700, fontSize: 13, cursor: 'pointer',
  }}>
    Üye Ol
  </button>
</Link>

// Üyeyse
<div style={{
  height: 40, padding: '0 16px', borderRadius: 12,
  background: c.goldSoft, border: `1px solid ${c.goldLine}`,
  display: 'flex', alignItems: 'center', gap: 6,
  fontSize: 13, fontWeight: 600, color: c.gold,
}}>
  ✓ Üyesin
</div>
```

- [ ] **Step 3: Mevcut "Aylık destek" kartını güncelle**

`membership_description` varsa göster, yoksa varsayılan metin. Üye sayısını göster.

- [ ] **Step 4: Build doğrula + commit**

---

### Task 5: Üyelik Formu (Parametrik)

**Files:**
- Rewrite: `app/dashboard/ngos/[id]/membership/page.tsx`

- [ ] **Step 1: Üyelik form sayfasını yeniden yaz**

Server component STK verisini fetch eder, client component formu render eder.

Server:
```typescript
// Fetch NGO with membership config
const { data: ngo } = await supabase
  .from('ngos')
  .select('*')
  .eq('id', params.id)
  .single()

// Check existing membership
const { data: existing } = await supabase
  .from('ngo_memberships')
  .select('id')
  .eq('user_id', user.id)
  .eq('ngo_id', params.id)
  .maybeSingle()

// Already member → redirect to success
if (existing) redirect(`/dashboard/ngos/${params.id}/membership/success`)
```

Client component:
- STK logosu + ad + `membership_description`
- `membership_form_fields` boşsa: direkt "Üye Ol" butonu (tek tıkla)
- `membership_form_fields` doluysa: dinamik form render
  - Her alan tipi için uygun input (text, tel, textarea, select, chips)
  - Required alanlar yıldızlı
- KVKK onay checkbox'ı: "Bilgilerimin [STK adı] ile paylaşılmasını kabul ediyorum"
- `membership_terms_url` varsa: "Üyelik sözleşmesini okudum" checkbox + link
- "Üye Ol" butonu → Supabase'e insert → redirect to success

- [ ] **Step 2: Build doğrula + commit**

---

### Task 6: Başarılı Ekranı

**Files:**
- Create: `app/dashboard/ngos/[id]/membership/success/page.tsx`

- [ ] **Step 1: Başarılı sayfasını oluştur**

```tsx
// Server: fetch ngo data
// Client: konfeti + üyelik kartı

// Konfeti patlaması
import('canvas-confetti').then(mod => {
  mod.default({ particleCount: 80, spread: 70, ... })
})

// İçerik:
// - STK logosu büyük (64px)
// - "[STK adı]'na hoş geldin!" başlık
// - Üyelik kartı (tarih + tier)
// - "Görevleri keşfet" CTA → /dashboard/ngos/[id]
// - "Profilime git" secondary → /dashboard/profile
```

- [ ] **Step 2: Build doğrula + commit**

---

### Task 7: Profil — Üyeliklerim Bölümü

**Files:**
- Modify: `app/dashboard/profile/page.tsx` (server — fetch memberships)
- Modify: `app/dashboard/profile/profile-client.tsx` (client — render)

- [ ] **Step 1: Server'da üyelikleri fetch et**

```typescript
const { data: memberships } = await supabase
  .from('ngo_memberships')
  .select('*, ngos:ngo_id(id, name, short_name, logo_url, color_accent)')
  .eq('user_id', user.id)
  .eq('status', 'active')
```

`memberships` prop'unu client'a geçir.

- [ ] **Step 2: Client'ta "Üyeliklerim" bölümü ekle**

Kaydedilenler linkinin altına, achievements'ın üstüne:

```tsx
{/* Üyeliklerim */}
{memberships.length > 0 && (
  <div style={{ padding: '24px 20px 0' }}>
    <h2 style={{ fontFamily: displayFont, fontSize: 20, fontWeight: 500, color: c.cream, margin: '0 0 12px' }}>
      Üyeliklerim
    </h2>
    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
      {memberships.map(m => (
        <Link key={m.id} href={`/dashboard/ngos/${m.ngo_id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'white', border: `2px solid ${c.goldLine}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {m.ngos?.logo_url ? (
                <img src={m.ngos.logo_url} alt={m.ngos.name} style={{ width: '65%', height: '65%', objectFit: 'contain' }} />
              ) : (
                <span style={{ fontSize: 18, fontWeight: 700, color: m.ngos?.color_accent ?? c.gold }}>
                  {(m.ngos?.short_name ?? '?')[0]}
                </span>
              )}
            </div>
            <span style={{ fontSize: 11, color: c.ink300, textAlign: 'center', lineHeight: 1.2 }}>
              {m.ngos?.short_name ?? m.ngos?.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  </div>
)}
```

- [ ] **Step 3: Build doğrula + commit**

---

### Task 8: Görev Kartı — Üye Rozeti

**Files:**
- Modify: `components/ui/mission-card.tsx`
- Modify: `app/dashboard/dashboard-client.tsx`
- Modify: `app/dashboard/page.tsx`

- [ ] **Step 1: MissionCard'a `isMember` prop ekle**

```typescript
interface MissionCardProps {
  mission: MissionWithNGO
  onClick?: () => void
  isSaved?: boolean
  userId?: string
  isMember?: boolean  // YENİ
}
```

Görselin altında, body başında küçük bir rozet:
```tsx
{isMember && (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    background: c.goldSoft, border: `1px solid ${c.goldLine}`,
    borderRadius: 999, padding: '3px 8px', marginBottom: 8,
    fontSize: 10, fontWeight: 600, color: c.gold,
  }}>
    ✓ Üyesin
  </div>
)}
```

- [ ] **Step 2: Dashboard'dan memberNgoIds geçir**

`page.tsx`'de:
```typescript
const { data: memberships } = await supabase
  .from('ngo_memberships')
  .select('ngo_id')
  .eq('user_id', user.id)
  .eq('status', 'active')
const memberNgoIds = (memberships ?? []).map(m => m.ngo_id)
```

`dashboard-client.tsx`'de:
```typescript
<MissionCard
  mission={mission}
  isSaved={savedMissionIds.includes(mission.id)}
  isMember={memberNgoIds.includes(mission.ngo_id ?? '')}
  userId={profile.id}
/>
```

- [ ] **Step 3: Build doğrula + commit**

---

### Task 9: Final Build + Push

- [ ] **Step 1: Full build**
```bash
npx next build
```

- [ ] **Step 2: Push**
```bash
git push origin main
```

---

## Test Senaryoları

| Senaryo | Beklenen |
|---------|----------|
| Form alanı olmayan STK'ya üye ol (TEMA) | Tek tıkla → başarılı ekranı |
| Form alanı olan STK'ya üye ol (Haytap) | Form → doldur → başarılı |
| Zaten üye olduğun STK'yı ziyaret et | "Üyesin ✓" badge görünür |
| Profilde üyeliklerini gör | Logo grid, tıklanabilir |
| Görev kartında üye rozeti | Üye olduğun STK'nın görevlerinde "✓ Üyesin" |
| KVKK checkbox onaylamadan üye ol | Buton disabled |
