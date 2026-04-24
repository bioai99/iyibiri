---
name: react-server-component-patterns
description: React Server Components (RSC) mental model ve Next.js 14 App Router best practices. Server vs. Client component boundary, 'use client' directive, waterfall prevention, data fetching patterns (server action vs. client query), Suspense + streaming, serialization rules. İyiBiri dashboard-client.tsx + page.tsx pattern örneği. Kaynaklar — Dan Abramov, Vercel docs, Josh Comeau, Lee Robinson.
---

# React Server Components — Mental Model + Next.js 14 Patterns

> **Kritik:** RSC mental model serverside default + client boundary kurallarına uymazsanız: N+1 waterfall, exponential bundle growth, veri leakage (sensitif API key client'a sızması). Bu skill N. 1 önemli frontend performance pattern.

Kaynaklar: [Dan Abramov — Overreacted](https://overreacted.io/making-sense-of-react-server-components/) · [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components) · [Josh Comeau — RSC Deep Dive](https://www.joshwcomeau.com/react/server-components/) · [Lee Robinson — React Server Components Primer](https://vercel.com/blog/understanding-react-server-components) · [Vercel — Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

## 1. RSC Mental Model — Server is Default

**Kural:** Next.js 14 App Router'da **varsayılan her component server component'tir.**

```tsx
// ✅ DOĞRU — page.tsx server component
export default async function DashboardPage() {
  const missions = await fetchMissions();  // server'da çalışır
  return (
    <div>
      <h1>{missions.length} Misyon</h1>
      <MissionList missions={missions} />
    </div>
  );
}

// ❌ YANLIŞ — client component'e data fetching (waterfall)
'use client';
export default function DashboardPage() {
  const [missions, setMissions] = useState([]);
  useEffect(() => {
    fetch('/api/missions').then(...);  // client'ta delay + spinner
  }, []);
  return ...;
}
```

**Neden?** Server component'te fetch → data hazır → client'a string/JSX gelir. Client component'te fetch → client ağ gecikme → boş state → veri gelene kadar spinner.

---

## 2. Server vs. Client Component — Karar Ağacı

| Senaryo | Default | Neden | Örnek |
|---------|---------|-------|--------|
| Static UI (read-only page) | Server | Database query güvenli, bundle small | `/dashboard/profile` — profilini oku |
| Real-time event (WebSocket, Realtime sub) | Client | Server'da long-polling eksik | Realtime mission update (live counter) |
| Browser API (localStorage, geolocation) | Client | Server'da window yok | Dil seçimi (localStorage dari) |
| User state (input focus, hover) | Client | Interactivity gerekli | Filter dropdown state |
| Sensitive data (API key, password) | Server | Client'a asla geçmesin | Ödeme token'ı validation |
| Heavy lib (chart, map) | Client | Tree-shake etmek için | Dashboard chart (e.g., Recharts) |

---

## 3. 'use client' Directive — Doğru Kullanım

**'use client' kullanma kuralları:**

1. **Dosya başında "use client" string yazılır:**
   ```tsx
   'use client';
   import { useState } from 'react';
   
   export default function InteractiveButton() {
     const [count, setCount] = useState(0);
     return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
   }
   ```

2. **"use client" dosyadaki component'leri server parent'ından çağırırsan → client boundary kuralına uyar:**
   ```tsx
   // app/page.tsx — server
   import InteractiveButton from '@/components/interactive-button';  // client
   
   export default async function Page() {
     const data = await fetchData();  // server'da fetch
     return (
       <div>
         <h1>{data.title}</h1>
         <InteractiveButton />  {/* client boundary — OK */}
       </div>
     );
   }
   ```

3. **"use client" içinden server action çağırma — async function pattern:**
   ```tsx
   // @/lib/actions.ts
   'use server';
   
   export async function updateMission(id: string) {
     await db.missions.update(id, { status: 'completed' });
     revalidatePath('/dashboard');
   }
   
   // @/components/mission-button.tsx
   'use client';
   import { updateMission } from '@/lib/actions';
   
   export function MissionButton({ missionId }: { missionId: string }) {
     return (
       <button onClick={() => updateMission(missionId)}>
         Tamamla
       </button>
     );
   }
   ```

**Hata:** `'use client'` dosya içinde server function tanımlamak → build error.

---

## 4. Waterfall Prevention — Paralel Data Fetching

**Waterfall:** Sorgu 1 → bekle → Sorgu 2 → bekle... → Toplam gecikme = Sorgu1 + Sorgu2 + ...

```tsx
// ❌ WATERFALL — seri istekler
export default async function Dashboard() {
  const user = await fetchUser();  // 200ms
  const missions = await fetchMissions(user.id);  // 200ms (user'a bağlı)
  const rewards = await fetchRewards(user.id);  // 200ms (user'a bağlı)
  // Toplam: 600ms
  return ...;
}

// ✅ PARALEL — Promise.all
export default async function Dashboard() {
  const user = await fetchUser();  // 200ms
  const [missions, rewards] = await Promise.all([
    fetchMissions(user.id),  // 200ms (parallel)
    fetchRewards(user.id),   // 200ms (parallel)
  ]);
  // Toplam: ~400ms (user wait + parallel missions+rewards)
  return ...;
}

// ✅ BEST — Sorgu'lar user'dan bağımsızsa ilk baştan paralel
export default async function Dashboard() {
  const [user, missions, rewards] = await Promise.all([
    fetchUser(),
    fetchMissions(),  // user.id'yi SQL'de join et
    fetchRewards(),
  ]);
  // Toplam: ~200ms (hepsi paralel)
  return ...;
}
```

---

## 5. Streaming + Suspense — Progressive Rendering

Sayfayı parçalara böl. Bölüm 1 (header) 200ms, Bölüm 2 (misyon listesi) 2000ms → user header'ı hemen görsün.

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Hızlı load — Suspense boundary yok */}
      <Profile />
      
      {/* Yavaş — Suspense boundary ile fallback */}
      <Suspense fallback={<MissionListSkeleton />}>
        <MissionList />
      </Suspense>
      
      <Suspense fallback={<RewardsSkeleton />}>
        <RewardsWidget />
      </Suspense>
    </div>
  );
}

async function MissionList() {
  const missions = await fetchMissions();  // 2000ms
  return (
    <ul>
      {missions.map(m => <li key={m.id}>{m.title}</li>)}
    </ul>
  );
}

function MissionListSkeleton() {
  return <div className="animate-pulse h-64 bg-gray-200"></div>;
}
```

**Network + Suspense = Progressive HTML** → İlk load HTML (<50KB), sonra streaming chunks (bölüm bölüm).

---

## 6. Data Fetching Patterns — Server Action vs. Client Query

### A. Server Action (Form submission, mutation)

```tsx
// @/lib/actions.ts
'use server';

export async function createMission(formData: FormData) {
  const title = formData.get('title') as string;
  
  // ✅ DB erişim server'da (secure)
  const mission = await db.missions.create({ title });
  
  // ✅ Revalidate → cache invalidate
  revalidatePath('/dashboard');
  
  // ✅ Success sonrası redirect
  redirect(`/missions/${mission.id}`);
}

// @/components/mission-form.tsx
'use client';

export function MissionForm() {
  return (
    <form action={createMission}>
      <input name="title" required />
      <button type="submit">Ekle</button>
    </form>
  );
}
```

### B. Client Query (Real-time read, filtering)

```tsx
// @/lib/supabase/queries.ts
export async function getMissionsFiltered(status: string) {
  const { data } = await supabase
    .from('missions')
    .select('*')
    .eq('status', status);
  return data;
}

// @/components/mission-filter.tsx
'use client';

export function MissionFilter() {
  const [status, setStatus] = useState('active');
  const [missions, setMissions] = useState([]);
  
  useEffect(() => {
    getMissionsFiltered(status).then(setMissions);
  }, [status]);
  
  return (
    <div>
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="active">Aktif</option>
        <option value="completed">Tamamlanan</option>
      </select>
      <ul>
        {missions.map(m => <li key={m.id}>{m.title}</li>)}
      </ul>
    </div>
  );
}
```

**Seç:** Server action mutasyon + page revalidation için, Client query sürekli state değişimi için.

---

## 7. Serialization Kuralı — Server Props

Server component'ten client component'e geçen prop'lar **JSON serializable** olmalı.

```tsx
// ❌ YANLIŞ — Date object client prop'a gidiyor
export default async function Dashboard() {
  const data = await fetchData();
  return <ClientComponent createdAt={data.createdAt} />;  // Date object!
}

// ✅ DOĞRU — stringify
export default async function Dashboard() {
  const data = await fetchData();
  return (
    <ClientComponent 
      createdAt={data.createdAt.toISOString()} 
    />
  );
}

// ✅ DOĞRU — server component'te format
export default async function Dashboard() {
  const data = await fetchData();
  const formatted = formatDate(data.createdAt);
  return <ClientComponent createdAt={formatted} />;
}
```

Nedeni: Client'a JSON stringify edilerek gönderilir. `Date()` constructor'u serializable değil.

---

## 8. İyiBiri Pattern — dashboard-client.tsx + page.tsx

Mevcut proje pattern'i:

```tsx
// app/dashboard/page.tsx — SERVER
export default async function DashboardPage() {
  // ✅ Server'da sensitive data (API key, user ID)
  const auth = await getServerSession();
  const missions = await fetchUserMissions(auth.user.id);
  const stats = await fetchKarmaStats(auth.user.id);
  
  return (
    <div className="dark">
      <h1>Hoşgeldin, {missions.length > 0 ? '🎯' : '👋'}</h1>
      
      {/* ✅ Data server'da, JSX string olarak client'a */}
      <DashboardClient 
        missions={missions}
        stats={stats}
      />
    </div>
  );
}

// components/dashboard-client.tsx — CLIENT
'use client';

export function DashboardClient({ missions, stats }) {
  const [filter, setFilter] = useState('all');
  
  // ✅ Client state + UI interaction sadece burada
  const filtered = missions.filter(m => 
    filter === 'all' || m.status === filter
  );
  
  return (
    <div>
      <select value={filter} onChange={e => setFilter(e.target.value)}>
        <option value="all">Tümü</option>
        <option value="active">Aktif</option>
      </select>
      <MissionList missions={filtered} />
    </div>
  );
}
```

**Faydalar:**
- Large bundle split → dashboard-client sadece UI code
- Server side rendering → SEO + fast paint
- Data fetch parallelization → waterfall yok

---

## 9. Common Pitfalls + Fixes

| Hata | Semptom | Fix |
|------|---------|-----|
| **Client component'te DB query** | API route yazılır, client'tan fetch → waterfall | Query'yi server component'e taşı |
| **"use client" parent'den server component çağır** | Build error (`cannot import server component`) | Server component'i prop geçmek yerine server parent'tan döndür |
| **Serialization error (Date, Function)** | Runtime error: `Cannot serialize...` | prop'ları JSON-compatible types'a stringify et |
| **API key client'da** | Security breach | Tüm API key'leri `.env.local` + server-only kullan |
| **Suspense boundary yok long query** | Full page spinner | Suspense boundary ekle + fallback |
| **Promise.all yerine sequential fetch** | Waterfall cascading delay | Promise.all ile parallelization |

---

## 10. Karar Ağacı — Server vs. Client

```
Component geliştirir
    │
    ▼
Interactivity (state, event listener) gerekli mi?
    │
    ├─ EVET → 'use client'
    │         │
    │         ▼
    │      Data server'dan mı, client query mi?
    │         ├─ Server → server component'ten prop geç
    │         └─ Client → useEffect + useState ile fetch
    │
    └─ HAYIR → Server component default
              │
              ▼
           Data gerekli mi?
              ├─ EVET → async/await ile fetch
              └─ HAYIR → Static JSX
```

---

## 11. Performance Checklist

- [ ] Server component'ten data fetch parallel (Promise.all)
- [ ] Waterfall sorgu yok (database query 1 sonra 2 değil)
- [ ] 'use client' sadece interactivity gerekli component'lerde
- [ ] Server action mutation'lar formdan çağrılıyor
- [ ] Suspense boundary yavaş query'ler için
- [ ] Serialization kuralı (Date/Function client'a gitmez)
- [ ] API key'ler `.env.local` + server-only

---

## 12. Anti-Pattern

- **Her component 'use client'** — bundle size explosion.
- **Server action'da fetch + client re-fetch** — duplicate request.
- **Suspense'siz 5s query** — full page spinner.
- **Date prop client'a** — serialization crash.
- **API key env public'e** — security leak.
- **N+1 query (fetch user → loop user.id'ler → fetch missions)** — waterfall.
