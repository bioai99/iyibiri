# İyiBiri — Plan 1: Veritabanı Şeması & Seed

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Supabase'de tam veritabanı şemasını oluşturmak, mock-data.ts'i seed etmek ve TypeScript tip katmanını hazırlamak.

**Architecture:** Supabase PostgreSQL. RLS her tablo için aktif. Karma toplamı trigger ile otomatik güncellenir. Seed script mock-data.ts'i okur, Supabase'e yazar.

**Tech Stack:** Supabase CLI, TypeScript, supabase-js

---

### Task 1: Supabase Migration Dosyası

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`

- [ ] **Step 1: Migrations klasörünü oluştur**

```bash
mkdir -p /Users/bahadiroylumlu/Desktop/iyibiri/supabase/migrations
```

- [ ] **Step 2: SQL migration dosyasını yaz**

`supabase/migrations/001_initial_schema.sql`:

```sql
-- profiles: auth.users extend
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  avatar_url text,
  karma_total integer not null default 0,
  level integer not null default 1,
  streak integer not null default 0,
  last_active date,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Auth trigger: yeni kullanıcı kaydında profil oluştur
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ngos
create table public.ngos (
  id text primary key,
  name text not null,
  short_name text,
  tagline text,
  description text,
  category text,
  color_accent text,
  logo_url text,
  website text,
  member_count integer default 0,
  volunteer_count integer default 0,
  founded integer
);
alter table public.ngos enable row level security;
create policy "Anyone can view ngos" on public.ngos for select using (true);

-- missions
create table public.missions (
  id text primary key,
  title text not null,
  description text,
  long_description text,
  ngo_id text references public.ngos,
  category text,
  difficulty text check (difficulty in ('easy','medium','hard')),
  karma integer not null default 50,
  duration text,
  domain text check (domain in ('nature','education','social','financial')),
  style text check (style in ('remote','outside','both')),
  verify_method text not null check (verify_method in ('auto','code','photo','qr')),
  verify_code text,
  verify_hint text,
  featured boolean default false,
  active boolean default true,
  steps jsonb default '[]',
  impact_statement text,
  qr_code_data text,
  participants integer default 0
);
alter table public.missions enable row level security;
create policy "Anyone can view active missions" on public.missions for select using (active = true);

-- rewards
create table public.rewards (
  id text primary key,
  title text not null,
  brand text not null,
  brand_logo text,
  description text,
  karma_required integer not null,
  category text,
  active boolean default true
);
alter table public.rewards enable row level security;
create policy "Anyone can view active rewards" on public.rewards for select using (active = true);

-- user_missions
create table public.user_missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  mission_id text references public.missions not null,
  status text not null default 'taken' check (status in ('taken','completed')),
  taken_at timestamptz not null default now(),
  completed_at timestamptz,
  verification_data jsonb,
  karma_awarded integer,
  unique(user_id, mission_id)
);
alter table public.user_missions enable row level security;
create policy "Users can view own missions" on public.user_missions for select using (auth.uid() = user_id);
create policy "Users can insert own missions" on public.user_missions for insert with check (auth.uid() = user_id);
create policy "Users can update own missions" on public.user_missions for update using (auth.uid() = user_id);

-- karma_transactions
create table public.karma_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  amount integer not null,
  type text not null check (type in ('mission_complete','reward_redemption')),
  reference_id text,
  description text,
  created_at timestamptz not null default now()
);
alter table public.karma_transactions enable row level security;
create policy "Users can view own karma" on public.karma_transactions for select using (auth.uid() = user_id);
create policy "Users can insert own karma" on public.karma_transactions for insert with check (auth.uid() = user_id);

-- karma trigger: karma_total otomatik güncelle
create or replace function public.update_karma_total()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.profiles
  set karma_total = karma_total + new.amount
  where id = new.user_id;
  return new;
end;
$$;
create trigger on_karma_transaction
  after insert on public.karma_transactions
  for each row execute procedure public.update_karma_total();

-- reward_redemptions
create table public.reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  reward_id text references public.rewards not null,
  karma_spent integer not null,
  status text not null default 'pending' check (status in ('pending','completed')),
  created_at timestamptz not null default now()
);
alter table public.reward_redemptions enable row level security;
create policy "Users can view own redemptions" on public.reward_redemptions for select using (auth.uid() = user_id);
create policy "Users can insert own redemptions" on public.reward_redemptions for insert with check (auth.uid() = user_id);
```

- [ ] **Step 3: Supabase dashboard'dan SQL'i çalıştır**

Supabase dashboard → SQL Editor → yukarıdaki SQL'i yapıştır → Run.

Expected: "Success. No rows returned" mesajı.

- [ ] **Step 4: Tabloların oluştuğunu doğrula**

Supabase dashboard → Table Editor'da şu tabloların göründüğünü kontrol et:
`profiles`, `ngos`, `missions`, `rewards`, `user_missions`, `karma_transactions`, `reward_redemptions`

- [ ] **Step 5: Commit**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
git add supabase/migrations/001_initial_schema.sql
git commit -m "feat: add supabase database schema with RLS and triggers"
```

---

### Task 2: Supabase Storage Bucket

**Files:** Supabase dashboard konfigürasyonu

- [ ] **Step 1: Storage bucket oluştur**

Supabase dashboard → Storage → New bucket:
- Name: `verification-photos`
- Public: **kapalı** (private)
- Click "Create bucket"

- [ ] **Step 2: Bucket policy ekle**

Supabase dashboard → Storage → verification-photos → Policies → New policy:

```sql
-- Kullanıcılar kendi klasörlerine yükleyebilir
create policy "Users can upload own photos"
on storage.objects for insert
with check (
  bucket_id = 'verification-photos' and
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Kullanıcılar kendi fotoğraflarını görebilir
create policy "Users can view own photos"
on storage.objects for select
using (
  bucket_id = 'verification-photos' and
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

### Task 3: TypeScript Tip Katmanı

**Files:**
- Create: `lib/supabase/types.ts`
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Modify: mevcut `lib/supabase.ts` → silinecek
- Modify: mevcut `lib/supabase-server.ts` → silinecek

- [ ] **Step 1: lib/supabase klasörünü oluştur**

```bash
mkdir -p /Users/bahadiroylumlu/Desktop/iyibiri/lib/supabase
```

- [ ] **Step 2: types.ts yaz**

`lib/supabase/types.ts`:

```typescript
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          avatar_url: string | null
          karma_total: number
          level: number
          streak: number
          last_active: string | null
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          avatar_url?: string | null
          karma_total?: number
          level?: number
          streak?: number
          last_active?: string | null
          created_at?: string
        }
        Update: {
          name?: string | null
          avatar_url?: string | null
          karma_total?: number
          level?: number
          streak?: number
          last_active?: string | null
        }
      }
      ngos: {
        Row: {
          id: string
          name: string
          short_name: string | null
          tagline: string | null
          description: string | null
          category: string | null
          color_accent: string | null
          logo_url: string | null
          website: string | null
          member_count: number
          volunteer_count: number
          founded: number | null
        }
        Insert: Omit<Database['public']['Tables']['ngos']['Row'], never>
        Update: Partial<Database['public']['Tables']['ngos']['Row']>
      }
      missions: {
        Row: {
          id: string
          title: string
          description: string | null
          long_description: string | null
          ngo_id: string | null
          category: string | null
          difficulty: 'easy' | 'medium' | 'hard' | null
          karma: number
          duration: string | null
          domain: 'nature' | 'education' | 'social' | 'financial' | null
          style: 'remote' | 'outside' | 'both' | null
          verify_method: 'auto' | 'code' | 'photo' | 'qr'
          verify_code: string | null
          verify_hint: string | null
          featured: boolean
          active: boolean
          steps: Json
          impact_statement: string | null
          qr_code_data: string | null
          participants: number
        }
        Insert: Omit<Database['public']['Tables']['missions']['Row'], 'featured' | 'active' | 'steps' | 'participants'> & {
          featured?: boolean
          active?: boolean
          steps?: Json
          participants?: number
        }
        Update: Partial<Database['public']['Tables']['missions']['Row']>
      }
      rewards: {
        Row: {
          id: string
          title: string
          brand: string
          brand_logo: string | null
          description: string | null
          karma_required: number
          category: string | null
          active: boolean
        }
        Insert: Omit<Database['public']['Tables']['rewards']['Row'], 'active'> & { active?: boolean }
        Update: Partial<Database['public']['Tables']['rewards']['Row']>
      }
      user_missions: {
        Row: {
          id: string
          user_id: string
          mission_id: string
          status: 'taken' | 'completed'
          taken_at: string
          completed_at: string | null
          verification_data: Json | null
          karma_awarded: number | null
        }
        Insert: {
          user_id: string
          mission_id: string
          status?: 'taken' | 'completed'
          taken_at?: string
          completed_at?: string | null
          verification_data?: Json | null
          karma_awarded?: number | null
        }
        Update: {
          status?: 'taken' | 'completed'
          completed_at?: string | null
          verification_data?: Json | null
          karma_awarded?: number | null
        }
      }
      karma_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: 'mission_complete' | 'reward_redemption'
          reference_id: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          amount: number
          type: 'mission_complete' | 'reward_redemption'
          reference_id?: string | null
          description?: string | null
          created_at?: string
        }
        Update: never
      }
      reward_redemptions: {
        Row: {
          id: string
          user_id: string
          reward_id: string
          karma_spent: number
          status: 'pending' | 'completed'
          created_at: string
        }
        Insert: {
          user_id: string
          reward_id: string
          karma_spent: number
          status?: 'pending' | 'completed'
          created_at?: string
        }
        Update: {
          status?: 'pending' | 'completed'
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type NGO = Database['public']['Tables']['ngos']['Row']
export type Mission = Database['public']['Tables']['missions']['Row']
export type Reward = Database['public']['Tables']['rewards']['Row']
export type UserMission = Database['public']['Tables']['user_missions']['Row']
export type KarmaTransaction = Database['public']['Tables']['karma_transactions']['Row']
export type RewardRedemption = Database['public']['Tables']['reward_redemptions']['Row']
```

- [ ] **Step 3: lib/supabase/client.ts yaz**

`lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 4: lib/supabase/server.ts yaz**

`lib/supabase/server.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

- [ ] **Step 5: Eski dosyaları sil**

```bash
rm /Users/bahadiroylumlu/Desktop/iyibiri/lib/supabase.ts
rm /Users/bahadiroylumlu/Desktop/iyibiri/lib/supabase-server.ts
```

- [ ] **Step 6: middleware.ts'i yeni import path'e güncelle**

`middleware.ts` içinde:
```typescript
// ESKİ:
import { createServerClient } from '@supabase/ssr'
// YENİ — middleware kendi client'ını oluşturuyor, değişiklik yok ama
// supabase import'larını lib/supabase/server'dan almaya devam et
```

middleware.ts içindeki Supabase client oluşturma kodu aynı kalabilir (zaten inline).

- [ ] **Step 7: Build kontrol**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
npm_config_cache=/Users/bahadiroylumlu/tmp_npm_cache npm run build 2>&1 | tail -20
```

Expected: TypeScript hataları dışında build geçmeli (henüz eski import'lar var, sonraki tasklarda düzelir).

- [ ] **Step 8: Commit**

```bash
git add lib/supabase/
git commit -m "feat: add supabase typescript types and client helpers"
```

---

### Task 4: Seed Script

**Files:**
- Create: `scripts/seed.ts`
- Create: `package.json` script güncellemesi

- [ ] **Step 1: scripts klasörünü oluştur**

```bash
mkdir -p /Users/bahadiroylumlu/Desktop/iyibiri/scripts
```

- [ ] **Step 2: seed.ts yaz**

`scripts/seed.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // service role key — bypass RLS
)

const ngos = [
  {
    id: 'tema',
    name: 'TEMA Vakfı',
    short_name: 'TEMA',
    tagline: 'Doğayı ve toprağı koruyoruz',
    description: 'Türkiye Erozyonla Mücadele, Ağaçlandırma ve Doğal Kaynakları Koruma Vakfı',
    category: 'nature',
    color_accent: '#10B981',
    logo_url: 'https://logo.clearbit.com/tema.org.tr',
    website: 'https://tema.org.tr',
    member_count: 800000,
    volunteer_count: 12000,
    founded: 1992,
  },
  {
    id: 'cydd',
    name: 'ÇYDD',
    short_name: 'ÇYDD',
    tagline: 'Eğitimde fırsat eşitliği için',
    description: 'Çağdaş Yaşamı Destekleme Derneği — eğitim bursları ve kadın hakları',
    category: 'education',
    color_accent: '#3B82F6',
    logo_url: 'https://logo.clearbit.com/cydd.org.tr',
    website: 'https://cydd.org.tr',
    member_count: 120000,
    volunteer_count: 8000,
    founded: 1989,
  },
  {
    id: 'haytap',
    name: 'Haytap',
    short_name: 'Haytap',
    tagline: 'Hayvan hakları için mücadele',
    description: 'Hayvan Hakları Federasyonu — sokak hayvanlarının korunması',
    category: 'animals',
    color_accent: '#F59E0B',
    logo_url: 'https://logo.clearbit.com/haytap.org',
    website: 'https://haytap.org',
    member_count: 45000,
    volunteer_count: 3500,
    founded: 2006,
  },
  {
    id: 'kodluyoruz',
    name: 'Kodluyoruz',
    short_name: 'Kodluyoruz',
    tagline: 'Teknolojiyle geleceği kodluyoruz',
    description: 'Dezavantajlı bireylere ücretsiz yazılım eğitimi',
    category: 'education',
    color_accent: '#8B5CF6',
    logo_url: 'https://logo.clearbit.com/kodluyoruz.org',
    website: 'https://kodluyoruz.org',
    member_count: 25000,
    volunteer_count: 2000,
    founded: 2019,
  },
  {
    id: 'kizilay',
    name: 'Kızılay',
    short_name: 'Kızılay',
    tagline: 'İnsanlık adına',
    description: 'Türk Kızılay — insani yardım ve kan bağışı',
    category: 'health',
    color_accent: '#EF4444',
    logo_url: 'https://logo.clearbit.com/kizilay.org.tr',
    website: 'https://kizilay.org.tr',
    member_count: 1200000,
    volunteer_count: 45000,
    founded: 1868,
  },
]

const missions = [
  {
    id: 'beach-cleanup',
    title: 'Sahil Temizliği',
    description: 'En yakın sahilde 2 saatlik temizlik etkinliğine katıl',
    long_description: 'TEMA gönüllüleriyle birlikte sahil temizliği yaparak deniz ekosistemini koru. Etkinlik alanında sana atık torbası ve eldiven verilecek.',
    ngo_id: 'tema',
    category: 'nature',
    difficulty: 'medium',
    karma: 200,
    duration: '2 saat',
    domain: 'nature',
    style: 'outside',
    verify_method: 'qr',
    verify_code: 'TEMA2026',
    verify_hint: 'Etkinlik alanındaki TEMA standında QR kodu tara',
    featured: true,
    steps: JSON.stringify(['Etkinlik alanına git', 'TEMA standından materyal al', 'Temizlik yap', 'QR kodu tara']),
    impact_statement: 'Her 1 kg atık denizden 100 deniz canlısını kurtarır',
    participants: 342,
  },
  {
    id: 'reading-support',
    title: 'Okuma Desteği',
    description: 'İlkokul öğrencisine online okuma desteği ver',
    long_description: 'ÇYDD platformu üzerinden bir ilkokul öğrencisiyle haftalık 1 saatlik online okuma seansı yap.',
    ngo_id: 'cydd',
    category: 'education',
    difficulty: 'medium',
    karma: 250,
    duration: '1 saat/hafta',
    domain: 'education',
    style: 'remote',
    verify_method: 'code',
    verify_code: 'CYDD-READ-2026',
    verify_hint: 'ÇYDD platformundan aldığın seans tamamlama kodunu gir',
    featured: true,
    steps: JSON.stringify(['ÇYDD platformuna kayıt ol', 'Öğrenci eşleşmesini bekle', 'Seansı tamamla', 'Kod al ve gir']),
    impact_statement: 'Okuma desteği alan öğrencilerin %78\'i okul başarısını artırıyor',
    participants: 128,
  },
  {
    id: 'shelter-donation',
    title: 'Barınak Bağışı',
    description: 'Hayvan barınağına mama veya malzeme bağışı yap',
    long_description: 'En yakın Haytap destekli barınağa mama, oyuncak veya temizlik malzemesi götür.',
    ngo_id: 'haytap',
    category: 'animals',
    difficulty: 'easy',
    karma: 100,
    duration: '30 dakika',
    domain: 'social',
    style: 'outside',
    verify_method: 'photo',
    verify_hint: 'Barınakta bağışını teslim ederken fotoğraf çek',
    featured: false,
    steps: JSON.stringify(['Barınak adresini bul', 'Bağışını hazırla', 'Barınağa götür', 'Fotoğraf çek ve yükle']),
    impact_statement: 'Her bağış bir hayvanın 1 haftalık beslenmesini karşılıyor',
    participants: 89,
  },
  {
    id: 'code-mentoring',
    title: 'Kod Mentorluğu',
    description: 'Kodluyoruz öğrencisine 1 saatlik online mentorluk yap',
    long_description: 'Kodluyoruz bootcamp öğrencisine yazılım geliştirme konusunda birebir mentorluk ver.',
    ngo_id: 'kodluyoruz',
    category: 'education',
    difficulty: 'hard',
    karma: 400,
    duration: '1 saat',
    domain: 'education',
    style: 'remote',
    verify_method: 'code',
    verify_code: 'KODL-MENTOR-26',
    verify_hint: 'Mentorluk platformundan tamamlama kodunu al',
    featured: true,
    steps: JSON.stringify(['Kodluyoruz mentor platformuna başvur', 'Öğrenci eşleşmesini al', 'Seansı tamamla', 'Kod gir']),
    impact_statement: 'Mentorluk alan öğrencilerin %85\'i işe yerleşiyor',
    participants: 67,
  },
  {
    id: 'blood-donation',
    title: 'Kan Bağışı',
    description: 'En yakın Kızılay merkezinde kan bağışı yap',
    long_description: 'Kızılay kan bağışı merkezine giderek kan ver. Her bağış 3 kişinin hayatını kurtarabilir.',
    ngo_id: 'kizilay',
    category: 'health',
    difficulty: 'easy',
    karma: 300,
    duration: '45 dakika',
    domain: 'social',
    style: 'outside',
    verify_method: 'qr',
    verify_code: 'KIZL-KAN-2026',
    verify_hint: 'Kan bağışı sonrası verilen sertifikadaki QR kodu tara',
    featured: true,
    steps: JSON.stringify(['Kızılay merkezine git', 'Kayıt ol', 'Kan ver', 'Sertifikadaki QR\'ı tara']),
    impact_statement: 'Bir ünite kan 3 kişinin hayatını kurtarır',
    participants: 521,
  },
  {
    id: 'tree-planting',
    title: 'Fidan Dikimi',
    description: 'TEMA fidan dikimi etkinliğine katıl',
    long_description: 'TEMA\'nın düzenlediği toplu fidan dikimi etkinliğine katılarak ormansızlaşmaya karşı dur.',
    ngo_id: 'tema',
    category: 'nature',
    difficulty: 'easy',
    karma: 150,
    duration: '3 saat',
    domain: 'nature',
    style: 'outside',
    verify_method: 'auto',
    verify_hint: 'Etkinliğe katılımın otomatik olarak doğrulanır',
    featured: false,
    steps: JSON.stringify(['Etkinliğe kayıt ol', 'Etkinlik alanına git', 'Fidan dik']),
    impact_statement: 'Her fidan 20 yılda 1 ton CO2 emer',
    participants: 203,
  },
]

const rewards = [
  {
    id: 'starbucks-coffee',
    title: 'Ücretsiz Kahve',
    brand: 'Starbucks',
    brand_logo: 'https://logo.clearbit.com/starbucks.com',
    description: 'Herhangi bir Starbucks\'ta grande boy içecek',
    karma_required: 500,
    category: 'food',
  },
  {
    id: 'migros-voucher',
    title: '50 TL Alışveriş Kuponu',
    brand: 'Migros',
    brand_logo: 'https://logo.clearbit.com/migros.com.tr',
    description: 'Migros mağazalarında geçerli 50 TL indirim kuponu',
    karma_required: 750,
    category: 'shopping',
  },
  {
    id: 'trendyol-discount',
    title: '%20 İndirim Kodu',
    brand: 'Trendyol',
    brand_logo: 'https://logo.clearbit.com/trendyol.com',
    description: 'Trendyol\'da tüm alışverişte %20 indirim',
    karma_required: 600,
    category: 'shopping',
  },
  {
    id: 'cinema-ticket',
    title: 'Film Bileti',
    brand: 'Cinemaximum',
    brand_logo: 'https://logo.clearbit.com/cinemaximum.com',
    description: 'Herhangi bir Cinemaximum sinemasında 1 film bileti',
    karma_required: 400,
    category: 'culture',
  },
  {
    id: 'nike-discount',
    title: '%15 İndirim',
    brand: 'Nike',
    brand_logo: 'https://logo.clearbit.com/nike.com',
    description: 'Nike.com\'da geçerli %15 indirim kodu',
    karma_required: 1000,
    category: 'shopping',
  },
  {
    id: 'garanti-cashback',
    title: '25 TL Cashback',
    brand: 'Garanti BBVA',
    brand_logo: 'https://logo.clearbit.com/garantibbva.com.tr',
    description: 'Garanti BBVA kartına 25 TL para iadesi',
    karma_required: 800,
    category: 'financial',
  },
]

async function seed() {
  console.log('🌱 Seeding NGOs...')
  const { error: ngoError } = await supabase.from('ngos').upsert(ngos)
  if (ngoError) throw ngoError
  console.log(`✅ ${ngos.length} NGOs seeded`)

  console.log('🌱 Seeding missions...')
  const { error: missionError } = await supabase.from('missions').upsert(missions)
  if (missionError) throw missionError
  console.log(`✅ ${missions.length} missions seeded`)

  console.log('🌱 Seeding rewards...')
  const { error: rewardError } = await supabase.from('rewards').upsert(rewards)
  if (rewardError) throw rewardError
  console.log(`✅ ${rewards.length} rewards seeded`)

  console.log('🎉 Seed complete!')
}

seed().catch(console.error)
```

- [ ] **Step 3: package.json'a seed script ekle ve ts-node kur**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
npm_config_cache=/Users/bahadiroylumlu/tmp_npm_cache npm install --save-dev ts-node dotenv
```

`package.json` scripts bölümüne ekle:
```json
"seed": "ts-node --project tsconfig.json scripts/seed.ts"
```

- [ ] **Step 4: SUPABASE_SERVICE_ROLE_KEY'i .env.local'a ekle**

Supabase dashboard → Settings → API → `service_role` key'i kopyala.

`.env.local`'a ekle:
```
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

- [ ] **Step 5: Seed'i çalıştır**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
npm_config_cache=/Users/bahadiroylumlu/tmp_npm_cache npm run seed
```

Expected:
```
🌱 Seeding NGOs...
✅ 5 NGOs seeded
🌱 Seeding missions...
✅ 6 missions seeded
🌱 Seeding rewards...
✅ 6 rewards seeded
🎉 Seed complete!
```

- [ ] **Step 6: Supabase dashboard'dan verify et**

Table Editor → missions → 6 satır görünüyor mu?
Table Editor → ngos → 5 satır görünüyor mu?
Table Editor → rewards → 6 satır görünüyor mu?

- [ ] **Step 7: Commit**

```bash
git add scripts/seed.ts package.json
git commit -m "feat: add database seed script with NGOs, missions, and rewards"
```

---

### Task 5: Query Katmanı

**Files:**
- Create: `lib/supabase/queries/missions.ts`
- Create: `lib/supabase/queries/profiles.ts`
- Create: `lib/supabase/queries/rewards.ts`
- Create: `lib/supabase/queries/karma.ts`

- [ ] **Step 1: queries klasörünü oluştur**

```bash
mkdir -p /Users/bahadiroylumlu/Desktop/iyibiri/lib/supabase/queries
```

- [ ] **Step 2: missions.ts yaz**

`lib/supabase/queries/missions.ts`:

```typescript
import { createClient } from '../server'
import type { Mission, UserMission } from '../types'

export async function getAllMissions(): Promise<Mission[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('active', true)
    .order('featured', { ascending: false })
  if (error) throw error
  return data
}

export async function getMissionById(id: string): Promise<Mission | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('missions')
    .select('*, ngos(*)')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function getUserMissions(userId: string): Promise<UserMission[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_missions')
    .select('*, missions(*)')
    .eq('user_id', userId)
    .order('taken_at', { ascending: false })
  if (error) throw error
  return data
}

export async function takeMission(userId: string, missionId: string): Promise<UserMission> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_missions')
    .insert({ user_id: userId, mission_id: missionId, status: 'taken' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function completeMission(
  userMissionId: string,
  verificationData: Record<string, unknown>
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('user_missions')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      verification_data: verificationData,
    })
    .eq('id', userMissionId)
  if (error) throw error
}
```

- [ ] **Step 3: profiles.ts yaz**

`lib/supabase/queries/profiles.ts`:

```typescript
import { createClient } from '../server'
import type { Profile } from '../types'

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

export async function updateProfile(
  userId: string,
  updates: { name?: string; avatar_url?: string }
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
  if (error) throw error
}

export function getKarmaLevel(karma: number): { level: number; title: string; nextThreshold: number } {
  if (karma < 500) return { level: 1, title: 'İyi Biri', nextThreshold: 500 }
  if (karma < 1500) return { level: 2, title: 'Çok İyi Biri', nextThreshold: 1500 }
  if (karma < 3000) return { level: 3, title: 'Gerçekten İyi Biri', nextThreshold: 3000 }
  return { level: 4, title: 'İyiliğin Öncüsü', nextThreshold: Infinity }
}
```

- [ ] **Step 4: rewards.ts yaz**

`lib/supabase/queries/rewards.ts`:

```typescript
import { createClient } from '../server'
import type { Reward, RewardRedemption } from '../types'

export async function getAllRewards(): Promise<Reward[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('active', true)
    .order('karma_required', { ascending: true })
  if (error) throw error
  return data
}

export async function getUserRedemptions(userId: string): Promise<RewardRedemption[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('reward_redemptions')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error
  return data
}
```

- [ ] **Step 5: karma.ts yaz**

`lib/supabase/queries/karma.ts`:

```typescript
import { createClient } from '../server'
import type { KarmaTransaction } from '../types'

export async function addKarmaTransaction(
  userId: string,
  amount: number,
  type: 'mission_complete' | 'reward_redemption',
  referenceId: string,
  description: string
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('karma_transactions')
    .insert({ user_id: userId, amount, type, reference_id: referenceId, description })
  if (error) throw error
}

export async function getKarmaHistory(userId: string): Promise<KarmaTransaction[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('karma_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) throw error
  return data
}

export async function redeemReward(
  userId: string,
  rewardId: string,
  karmaRequired: number,
  currentKarma: number
): Promise<{ success: boolean; error?: string }> {
  if (currentKarma < karmaRequired) {
    return { success: false, error: 'Yeterli karma yok' }
  }
  const supabase = createClient()

  // Redemption kaydı oluştur
  const { error: redemptionError } = await supabase
    .from('reward_redemptions')
    .insert({ user_id: userId, reward_id: rewardId, karma_spent: karmaRequired })
  if (redemptionError) return { success: false, error: redemptionError.message }

  // Negatif karma transaction ekle
  const { error: karmaError } = await supabase
    .from('karma_transactions')
    .insert({
      user_id: userId,
      amount: -karmaRequired,
      type: 'reward_redemption',
      reference_id: rewardId,
      description: 'Ödül kullanımı',
    })
  if (karmaError) return { success: false, error: karmaError.message }

  return { success: true }
}
```

- [ ] **Step 6: Build kontrol**

```bash
cd /Users/bahadiroylumlu/Desktop/iyibiri
npm_config_cache=/Users/bahadiroylumlu/tmp_npm_cache npm run build 2>&1 | grep -E "error|Error" | head -20
```

Expected: Query katmanına ait TypeScript hatası olmamalı.

- [ ] **Step 7: Commit**

```bash
git add lib/supabase/
git commit -m "feat: add supabase query layer for missions, profiles, rewards, karma"
```
