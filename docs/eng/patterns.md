# Engineering Patterns

İyiBiri'nin gerçek bug'lardan ve mimari kararlardan damıtılmış canlı
pattern kataloğu. Ne kod stil rehberi, ne onboarding tutorial — bu
dosya **iyibiri'de zor yoldan öğrenilmiş, bir daha aynı şekilde
canımızı yakmasın diye yazılmış** hareketleri içerir.

Bakım: her volume retro'sunda güncellenir.
Disiplin: `super-agents/skills/volume-retro/SKILL.md` +
`super-agents/skills/pattern-catalog/SKILL.md`.

## Index

### Database / RLS

- [DB-001](#db-001--rls-admin-write-policies-her-yeni-tabloda) —
  RLS admin write policies, her yeni tabloda

### Frontend

- [FE-001](#fe-001--form-submit-typebutton--onclick-onsubmit-degil) —
  Form submit: `type="button"` + `onClick` (onSubmit değil)
- [FE-002](#fe-002--hidrasyon-mismatch-server-render-vs-client-only-deger) —
  Hidrasyon mismatch: server-render vs client-only değer

---

## Patterns

### DB-001 — RLS admin write policies, her yeni tabloda

**Domain:** Supabase / Postgres RLS
**Seen:** 2 times (BUG-061, BUG-064)
**Status:** Confirmed

**When this applies.** Yeni bir `create table` ifadesi yazıyorsan ve
o tablo NGO admin / sponsor admin / super-admin tarafından
INSERT/UPDATE/DELETE edilecekse. Default Supabase pattern'i SELECT
policy yazmaya teşvik eder ("Anyone can view active …"); WRITE
policy'leri unutmak çok kolay. RLS deny-by-default'tur — policy
yoksa iyi niyet işe yaramaz.

**The move.** Migration 021 (missions tablosu) template'ini birebir
uygula:

```sql
-- Drop existing (idempotent)
drop policy if exists "<role> insert <table>" on public.<table>;
drop policy if exists "<role> update <table>" on public.<table>;
drop policy if exists "<role> delete <table>" on public.<table>;
drop policy if exists "Super admins manage all <table>" on public.<table>;

-- Insert: admin kendi STK'sının kaydını oluşturabilir
create policy "<role> insert <table>" on public.<table>
  for insert
  with check (public.is_<role>(auth.uid(), <fk>));

-- Update: hem using hem with check (mevcut + yeni satır kontrolü)
create policy "<role> update <table>" on public.<table>
  for update
  using (public.is_<role>(auth.uid(), <fk>))
  with check (public.is_<role>(auth.uid(), <fk>));

-- Delete: sadece using
create policy "<role> delete <table>" on public.<table>
  for delete
  using (public.is_<role>(auth.uid(), <fk>));

-- Super-admin override: full bypass
create policy "Super admins manage all <table>" on public.<table>
  for all
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));
```

`<role>`, `<fk>`, `<table>` projektif. Mevcut role'ler:
`is_ngo_admin(uid, ngo_id)`, `is_sponsor_admin(sponsor_id, uid)`,
`is_super_admin(uid)`.

**References.**

- Migration 021 — orijinal template (missions + user_missions)
- Migration 042 — campaigns table fix (BUG-061), commit `335d74e`
- Migration 043 — sponsors + sponsor_admin_users + posts + rewards
  fix (BUG-064), commit `0f15fc5`

**Anti-pattern to watch for.** Sadece `Anyone can view active <table>`
SELECT policy yazıp "admin'ler bir şekilde erişir" varsaymak. RLS
yazılmamış policy = reddedilmiş erişim. Migration 040 (campaigns) ve
Migration 041 (sponsors) bu hatayı arka arkaya yaptı, sırasıyla
Migration 042 ve 043 ile düzeltildi.

**Pre-flight check (yeni migration yazarken).** "Bu tabloya kim
yazabilmeli?" sorusunu **şema yazımının ilk satırından önce** cevapla.
Cevap "sadece SELECT" ise tek policy yeter. Cevap "admin yazabilir"
ise yukarıdaki dört policy şart.

---

### FE-001 — Form submit: `type="button"` + `onClick` (onSubmit değil)

**Domain:** Next.js + React forms
**Seen:** 2 times (Vol-24.6 BUG-055, Vol-25 sistemik refactor)
**Status:** Confirmed

**When this applies.** Bir form yazıyorsan ve submit'i bir async
server action / `useTransition` / fetch çağrısı tetikleyecekse.
Default React pattern `<form onSubmit={...}>` + `<button type="submit">`
mobile + Next.js + framer-motion sayfalarında dağılma yaratıyor:
mobile keyboard accessoryview "Done" tap'i submit tetiklemiyor,
form-içi başka button'lar yanlışlıkla submit'liyor, page transitions
sırasında submit handler hidrate olmadan kullanıcı tıklıyor.

**The move.** Form'ı `<form>` etiketsiz bir `<div>` olarak yaz, ya
da `<form>` kalsın ama submit'i mutlaka bir button'un onClick'ine
bağla, button `type="button"` olsun:

```tsx
// ✗ Yanlış (Vol-24.6 BUG-055 root cause)
<form onSubmit={handleSubmit}>
  <input ... />
  <button type="submit">Gönder</button>
</form>

// ✓ Doğru
<div className="space-y-5">
  <input ... />
  <button type="button" onClick={handleSubmit}>Gönder</button>
</div>
```

State logic (loading, error, validation) zaten React tarafında —
native form submit semantiğine ihtiyaç yok.

**References.**

- Commit `80a7701` — Vol-24.6 hotfix BUG-055 root cause
- Commit `fadd87d` — Vol-25 sistemik refactor (mission form, blog
  form, üyelik, ödeme)
- Sponsor admin form'ları (Vol-32) bu pattern'le yazıldı, sıfır
  submit bug'ı.

**Anti-pattern to watch for.** "Native form semantiği accessibility
için lazım" argümanına kanmak — bizim kullanım profilimizde
keyboard-only kullanıcı için tab order zaten çalışıyor, native
submit'in marjinal değeri yok. Form içine kazara `<button>` koymak
da artık submit tetiklemiyor (`type="button"` default haline geldi).

---

### FE-002 — Hidrasyon mismatch: server-render vs client-only değer

**Domain:** Next.js 14 App Router + framer-motion + locale formatting
**Seen:** 1 time (BUG-063)
**Status:** Hypothesis (ikinci tezahürde Confirmed'e yükselt)

**When this applies.** Bir sayfa veya layout'ta şu kombinasyonlardan
biri varsa server-side HTML ile client-side hidrasyon arasında
mismatch oluşma riski yüksek:

1. `<motion.div initial={{ x: '40%', opacity: 0 }}>` gibi
   framer-motion'un başlangıç state'i — server initial'i renderler,
   client hydrate ederken animation başlatır, pozisyon farkı
   tree'yi yeniden render'a zorlar.
2. `Date.toLocaleString('tr-TR')` veya `toLocaleDateString` — server
   timezone'u client'tan farklıysa string farklı çıkar; #418
   hidrasyon mismatch hatası.
3. `position: fixed` ile tüm sayfayı kaplayan client component'lerin
   non-client child'ları sarması — RSC server-rendered child'ı
   client wrapper içinde re-rendering'e zorlar.

Hidrasyon mismatch'in semptomu zararlı: React tüm tree'yi
client-rendered moda geçirir, **`useState` setter'ları kayboluyor
gibi görünür** (aslında render olmuyor). Form button onClick
handler'ları "hidrate olmuş gibi görünüp" tetiklenmiyor.

**The move.** Üç ayrı yaklaşım, neyin neden olduğuna göre:

1. **framer-motion'lu layout'u proje-spesifik route'lardan izole
   et** — Next.js route group'ları (`(group-name)`) URL'i
   etkilemeden parent layout scope'unu daraltır. BUG-063 fix'i:
   `app/onboarding/(user-flow)/` altına welcome/city/causes/stk
   taşındı; sponsor signup parent layout'tan kurtuldu.
2. **Locale-dependent değerleri client-side mount sonrası render
   et** — `useEffect(() => setMounted(true), [])` + `mounted ?
   formatted : skeleton`. Veya `suppressHydrationWarning` ile React'a
   "burada mismatch normal" işareti.
3. **Client wrapper'ları minimal tut** — `'use client'` dosyada
   sadece interactivity gereken küçük komponenti tut, parent'ı
   server component bırak.

**References.**

- BUG-063 fix: commit `307d1cb` — onboarding layout izolasyonu
- BUG-065 (açık): sponsor-requests-client'taki Date locale +
  Vercel timeout, FE-002 ile bağlantılı

**Anti-pattern to watch for.** Sayfanın render olduğunu görüp
"interactivity de çalışıyordur" varsaymak. Hidrasyon mismatch
sessizdir — server response 200, page görünür, ama event
handler'lar dead. Console'da "Minified React error #418" veya #425
varsa **submit yapan butonları test etmeden production'a almayın**.

**Detection checklist** (yeni client komponenti yazarken):

- Date/time formatting yapıyor musun?
- framer-motion `initial={...}` veya AnimatePresence kullanıyor
  musun?
- `position: fixed` ile tüm sayfayı kaplıyor musun?
- `Math.random()`, `Date.now()`, `crypto.randomUUID()` mı
  çağırıyorsun (initial render'da)?

Bu listenin herhangi birine "evet" ise, deploy öncesi browser
console'a bak — hidrasyon error'u sessizce kaybolma anının
sinyali.

---

## Bakım notları

- Yeni entry eklerken volume retro skill'inin akışını izle:
  bug → categorize → catalog hit/new → agent playbook ref → commit.
- "Hypothesis" → "Confirmed" promosyonu retro'da olur (entry
  yaratımında değil).
- Status değişiklikleri tarih + bug referansı ile birlikte
  kayda alınsın.
- Domain prefix listesi (DB, FE, AUTH, UI, BLD, MOB, RLS, ADMIN, …)
  organik büyür; index başlıklarını domain'e göre grupla.
