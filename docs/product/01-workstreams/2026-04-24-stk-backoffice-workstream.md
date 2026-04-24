# Workstream — STK Backoffice (ADR-010 Min+ 10 Sayfa)

**Tarih:** 2026-04-24
**Sahip:** product-analyst (scope + karar), strategy-consultant (referans)
**Master plan ref:** `docs/product/01-workstreams/2026-04-24-v1-improvement-master-plan.md` P0 #9
**Bağlı ADR'ler:** ADR-010 (Min+ 10 sayfa scope), ADR-007 (parametric fee), ADR-008 (payment routing), ADR-001 (NSM = MAKE)
**Durum:** in_progress — 2026-04-24 başlatıldı
**Effort:** ~2-2.5 hafta (1 FE) / ~1.5 hafta (FE + BE paralel)

---

## 1. Özet

STK admin (backoffice) — STK yetkililerinin kendi STK'larına ait **görev yayınlama, üye yönetimi, doğrulama kuyruğu, üyelik ayarları, blog, profil, ödeme** işlemlerini yapabilmeleri için 10 sayfalık admin panel. **Kritik şart:** Backoffice'te yapılan her değişiklik (görev oluştur, üyelik config düzenle, profil güncelle) **user app'te anında yansır** — aynı DB tabloları, RLS ile admin yazma + user okuma.

## 2. MECE kapsam

### In scope (V1 Min+ 10 sayfa)

| # | Sayfa | Rota | Birincil iş | Effort |
|---|---|---|---|---|
| 1 | Dashboard overview | `/admin/[ngoId]/` | Bu ayın karması, yeni üye sayısı, onay bekleyen doğrulama, trend | S |
| 2 | Görev yayınla/düzenle | `/admin/[ngoId]/missions/new` + `/missions/[id]/edit` | CRUD + görsel upload + domain/kategori/tarih/karma editor + draft→published toggle | L |
| 3 | Görevlerim listesi | `/admin/[ngoId]/missions` | Filter (status), bulk action (publish/unpublish/cancel), search, export | M |
| 4 | Üye listesi | `/admin/[ngoId]/members` | Tam liste + tier + başlama tarihi + CSV export + KVKK-uyumlu alan gösterimi | M |
| 5 | Doğrulama kuyruğu | `/admin/[ngoId]/verifications` | Bekleyen `user_missions` (photo/code/QR) approve/reject + `admin_feedback` text | L |
| 6 | Aylık rapor | `/admin/[ngoId]/reports` | Son 12 ay: görev sayısı, tamamlama oranı, karma dağılım, üye artışı | M |
| 7 | Blog yazma | `/admin/[ngoId]/blog` + `/blog/new` + `/blog/[id]/edit` | Per-STK yazı (`ngo_id` filter), draft/published, markdown + cover image | M |
| 8 | STK profil | `/admin/[ngoId]/profile` | Logo + cover + tagline + description + iletişim (email/telefon/website/sosyal) | S |
| 9 | Üyelik ayarları | `/admin/[ngoId]/membership-config` | Fee config jsonb editör (tier'lar) + membership form fields + cooling_off_days + yasal doküman upload (KVKK + üyelik sözleşmesi + gönüllülük sözleşmesi PDF) | L |
| 10 | Ödeme bağlantıları | `/admin/[ngoId]/payments` | fonzip URL self-serve text input + iyzico/PayTR read-only status | S |

### Out of scope (V1'de YOK — V1.1+)

- Çoklu admin role management (şu an admin + editor + viewer rolleri ngo_admin_users'ta, UI V1.1'de)
- Gelişmiş analytics (cohort retention, funnel — V2)
- Bulk member messaging (V2)
- API key management (V2)
- Sponsor dashboard (ayrı workstream)

## 3. Data sync mapping — admin ↔ app

Her admin yazma işleminin hangi tablo(ları) etkilediği + user app'te nerede görünür:

| Admin işlemi | DB tablo | Sütun(lar) | User app'te görünür |
|---|---|---|---|
| Görev oluştur/düzenle | `missions` | title, description, domain, karma_points, event_date, image_url, status, access_level, prep_checklist | `/dashboard/missions`, `/dashboard`, `/dashboard/missions/[id]` |
| Görev status toggle | `missions` | status (draft/published/cancelled) | Discover feed'de draft/cancelled saklı |
| Doğrulama approve | `user_missions` | admin_review_status, admin_feedback, karma_awarded | User `/my-missions` completed sekmesinde + celebration |
| Doğrulama reject | `user_missions` | admin_review_status='rejected', admin_feedback | User mission detail'de ⚠️ + admin mesajı |
| Üyelik config | `ngos` | membership_fee_config (jsonb), membership_form_fields, cooling_off_days | `/dashboard/ngos/[id]/membership` flow formu |
| Yasal doküman upload | `ngo_documents` | kvkk_url, uyelik_url, gonullu_url | Membership flow KVKK onay adımında link |
| STK profil | `ngos` | name, short_name, tagline, description, logo_url, cover_url, email, phone, website, social_* | `/dashboard/ngos/[id]` |
| Blog yazı | `blog_posts` | title, slug, content, cover_image, status, ngo_id | `/dashboard/discover` blog section |
| Ödeme bağlantıları | `ngos` | donation_url, membership_url, payment_mode, processor | Bağış/üyelik CTA URL yönlendirmesi |

**Kural:** Admin sadece kendi STK'sına ait kayıtları yazabilir (RLS — `is_ngo_admin(auth.uid(), ngos.id)` policy). User okuma public (veya user-own RLS).

## 4. Test data plan — 5 STK × admin user

Migration 014'te 5 STK seed edildi. Her biri için:

| STK | STK ID | Admin user email (mock) | Password | Mock config |
|---|---|---|---|---|
| TEMA Vakfı | `tema` | `admin@tema.dev` | `TemaAdmin2026!` | age_tiered fee config (18- ₺50, 18-28 ₺120, 29-45 ₺240, 46+ ₺360), 3 görev seed (fidan dikimi, okuma, erozyon eğitimi) |
| TEGV | `tegv` | `admin@tegv.dev` | `TegvAdmin2026!` | min_threshold donation (₺100+), 2 görev (çocuk okuma desteği, yaz kampı gönüllü) |
| LÖSEV | `losev` | `admin@losev.dev` | `LosevAdmin2026!` | donation_based (serbest miktar min ₺50), 2 görev (saç bağışı, çocuk ziyaret) |
| HAYTAP | `haytap` | `admin@haytap.dev` | `HaytapAdmin2026!` | monthly ₺30, 2 görev (mama dağıtımı, barınak temizlik) |
| Kodluyoruz | `kodluyoruz` | `admin@kodluyoruz.dev` | `KodluyorAdmin2026!` | custom — sadece gönüllü (ücretsiz), 3 görev (online dijital okuryazarlık, kod kampı asistanı, mentor) |

**Her admin user için:**
- Supabase auth user (email + password)
- `profiles` kaydı (is_ngo_admin user, name = "{STK Adı} Admin")
- `ngo_admin_users` link table entry (user_id × ngo_id × role='admin')
- STK'nın konfigürasyonu backoffice'te **düzenlenebilir** durumda (yani mock DB'de kayıtlı)
- 2-3 görev zaten seed'li, admin ekleyip yayınlayabilir

**Seed script:** `lib/dev/ngo-admin-fixtures.ts` — idempotent, `NODE_ENV !== production` OR allowlist guard. `/admin/devtools` sayfasından "Seed NGO admin fixtures" butonu.

## 5. Auth strategi — ADMIN_SECRET → ngo_admin_users

### Mevcut (yetersiz)

```ts
// middleware.ts
if (request.nextUrl.pathname.startsWith('/admin')) {
  const adminCookie = request.cookies.get('iyibiri_admin')
  if (adminCookie?.value !== process.env.ADMIN_SECRET) {
    redirect('/admin/login')
  }
}
```

**Sorun:** Tek global ADMIN_SECRET — tüm admin aynı yetkiye sahip. TEMA admini TEGV görevlerini düzenleyebilir. Pilot için acil çözüm (V1 blocker).

### Yeni (ngo_admin_users based)

```ts
// middleware.ts (upgrade)
if (request.nextUrl.pathname.startsWith('/admin') && !path.startsWith('/admin/login')) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')
  
  // Path'ten ngo_id çıkar: /admin/tema/missions → 'tema'
  const ngoIdMatch = path.match(/^\/admin\/([^/]+)/)
  if (ngoIdMatch && ngoIdMatch[1] !== 'login' && ngoIdMatch[1] !== 'devtools') {
    const { data: isAdmin } = await supabase.rpc('is_ngo_admin', {
      u: user.id,
      n: ngoIdMatch[1]
    })
    if (!isAdmin) redirect('/admin/login?error=unauthorized')
  }
}
```

### Super-admin (platform ekibi)

- `ngo_admin_users`'tan bağımsız
- ENV var `SUPER_ADMIN_EMAILS` (virgül ayrılmış) — bu email'lere tüm STK erişimi
- Migration 021'de `is_super_admin(user_id)` helper
- Sadece Bahadır + platform ekibi (V1 pilot)

## 6. Walking skeleton — uçtan uca kesit

**Minimum demonstrable chain:**
1. Admin `admin@tema.dev` olarak login.
2. `/admin/tema/missions` açar.
3. "Yeni görev" butonuna tıklar, form doldurur (başlık, açıklama, domain, karma, tarih, görsel).
4. "Yayınla" butonuna basar → `status='published'` save.
5. Başka tarayıcıda user app → `/dashboard/missions` → yeni görev görünür.
6. User görevi alır → `user_missions` insert (taken).
7. User görevi tamamlar + foto yükler → `admin_review_status='pending'`.
8. Admin `/admin/tema/verifications` → pending list → approve butonuna basar → user'a karma award.
9. User app `/my-missions` → completed sekmesinde + karma count-up.

**Bu chain çalıştığında V1 Min+ "ready for pilot".**

## 7. Fonksiyon × Kullanıcı değeri (JTBD)

**Admin persona Ayşe** (TEMA saha koordinatörü, 35, 8 yıl STK deneyimi):

- **JTBD 1:** "Yeni fidan dikim etkinliği yayınladığımda 5 dakikada 100+ gönüllüye ulaştırmak istiyorum" → görev yayınla flow.
- **JTBD 2:** "Bu ayın üyelik yenileme durumunu görüp eksik olanlara bilgi vermek istiyorum" → üye listesi + filter.
- **JTBD 3:** "Gönüllüler görev tamamladığında fotolarını hızlıca onaylayabilmek istiyorum" → doğrulama kuyruğu.
- **JTBD 4:** "STK blog postu yayınlayıp hikayemi topluluğa anlatmak istiyorum" → blog yazma.
- **JTBD 5:** "Yıllık rapor için son 12 ayın datası istiyorum" → aylık rapor + export.

## 8. Başarı kriteri (ölçülebilir)

- **4 hafta sonra:** 5 pilot STK admin'i haftada en az 1x backoffice kullanır (login + CRUD).
- **8 hafta sonra:** Yayınlanan görevlerin %60+'ı backoffice'ten (mock'tan değil) gelmiş olur.
- **Pilot 12. hafta:** STK admin NPS ≥50 (anket), görev yayınla → app'te görünme latency <5 sn.
- **V1 lansman blocker:** chain 6. adım (admin görev yayınlar, user app'te görür) end-to-end test ✅.

## 9. Bağımlılıklar

**Teknik:**
- ngo_admin_users link table (✅ migration 019)
- is_ngo_admin() helper (✅ migration 019)
- blog_posts tablo (✅ migration 007)
- ngo_documents tablo (✅ migration 016)
- missions + user_missions (✅ migration 013 + 015 + 016 + 017 + 018)
- RLS admin policies (⚠️ migration 021 gerek — admin write policy'leri eklenecek)
- Supabase Storage bucket (⚠️ `ngo-assets` bucket + policies gerekecek — logo/cover/görev görseli)

**Operasyonel:**
- Super-admin ENV setup (SUPER_ADMIN_EMAILS)
- Devtools seed entry ("Seed NGO admin fixtures" butonu)
- Admin email confirmation (Supabase auth — dev'de skip, prod'da zorunlu)

**Yasal:**
- KVKK compliance (kvkk-compliance skill Bölüm 5 DPA kontrol) — admin CSV export'unda PII minimization
- Aydınlatma metni admin dashboard'da footer link (admin kullanıcı da KVKK tabi)

## 10. Risk

| Risk | Olasılık | Etki | Önlem |
|---|---|---|---|
| RLS bypass (admin başka STK verisi görür) | Düşük | Kritik | Her query `is_ngo_admin(user_id, ngo_id)` guard + unit test |
| Görsel upload XSS/malware | Orta | Orta | Supabase Storage + MIME type allowlist + image size limit |
| CSV export PII leak | Orta | Kritik | Sadece admin role, KVKK aydınlatma banner + column minimization |
| fee_config jsonb editor karmaşası | Yüksek | Orta | Tier-based UI wizard (raw JSON değil); validator schema |
| Super-admin ENV leak | Düşük | Kritik | Server-side ENV only, client bundle'a girmez |
| Blog Markdown XSS | Düşük | Orta | Markdown sanitizer (DOMPurify veya rehype-sanitize) |

## 11. Açık karar

- **Q44 (yeni):** Admin user password reset flow — standard Supabase reset mi, sadece super-admin reset mi? (Pilot için super-admin yeterli, V1.1'de self-serve)
- **Q45 (yeni):** Blog yazısında embed iframe (YouTube, vs.) izin verilecek mi? (Güvenlik + scope etkisi)
- **Q46 (yeni):** Doğrulama kuyruğunda QR doğrulama — QR generator STK'da mı yoksa platform'da mı üretilir? (Operasyonel karar)

## 12. Sprint breakdown

### Sprint S0 — Discovery + Foundation (2-3 gün)
- product-analyst brief ✅ (bu tur)
- ux-researcher audit + Ayşe journey
- ui-designer admin layout + 3 sayfa UI spec (dashboard + missions)
- supabase-backend migration 021 (admin RLS policies + seed prep)
- auth-capacitor middleware upgrade plan
- **Deliverable:** plan ready, foundation migration hazır

### Sprint S1 — Batch A: Auth + Layout + Dashboard + Görev (3-4 gün)
- frontend-engineer: `/admin/layout.tsx` (admin-role aware sidebar) + `/admin/[ngoId]/` (dashboard overview) + `/admin/[ngoId]/missions` (liste + filter) + `/missions/new` + `/missions/[id]/edit`
- supabase-backend: seed script + test fixtures + migration 022 (eksik kolonlar varsa)
- auth-capacitor: middleware upgrade canlı
- **Deliverable:** admin login → görev yayınla → user app'te görünür (walking skeleton)

### Sprint S2 — Batch B: Doğrulama + Üyeler + Rapor (2-3 gün)
- frontend-engineer: `/admin/[ngoId]/verifications` + `/members` + `/reports`
- **Deliverable:** doğrulama iş akışı + üye listesi CSV + temel rapor

### Sprint S3 — Batch C: Blog + Profil + Üyelik + Ödeme (3-4 gün)
- frontend-engineer: `/admin/[ngoId]/blog` + `/profile` + `/membership-config` + `/payments`
- Storage bucket setup (logo/cover/blog cover)
- ADR-007 fee config editor (tier-based wizard)
- **Deliverable:** 10 sayfa tamam

### Sprint S4 — Verification + Polish (2-3 gün)
- End-to-end QA (5 STK × 3-4 flow)
- UI designer visual QA
- Accessibility full pass
- Regression test
- **Deliverable:** V1 Min+ pilot ready

**Toplam:** ~12-17 iş günü (3 hafta FE + BE + Auth paralel).

## 13. Handoff plan

- **ux-researcher** ← bu brief'ten heuristik audit + Ayşe journey yaz.

---

## Handoff log

Bu workstream'i alıp üreten agent'ların zinciri. Her downstream agent kendi çıktısını üretince aşağıya 1 satır ekler.

- 2026-04-24 21:15 — **auth-capacitor** ✅ — **middleware upgrade + admin login**: `middleware.ts` (per-NGO auth, is_ngo_admin RPC) + `app/admin/login/page.tsx` (Supabase email/password form) + `app/admin/login/actions.ts` (signInAdmin + signOutAdmin). ADMIN_SECRET deprecated, SUPER_ADMIN_EMAILS env setup. Bölüm 5 auth strategi implementasyonu complete. Next: fe admin hub + logout button + devtools button.
- **ui-designer** ← audit sonrası 10 sayfa UI spec yaz (Sprint S0).
- **supabase-backend** ← paralel migration 021 yaz (admin RLS + seed prep) + seed script Sprint S1.
- **auth-capacitor** ← paralel middleware upgrade + admin login refactor Sprint S1.
- **frontend-engineer** ← S1 Batch A implementation (auth + layout + 3 sayfa).
- **design-system-keeper** ← admin datatable + form pattern component library (paralel — admin'e özel reusable).
- **product-analyst (self-audit)** ← S0 sonunda brief'leri 05-reviews kontrol.
- **strategy-consultant (dış bakış)** ← Sprint S4 sonunda admin UX'in STK pilot ikna gücünü değerlendirir.

## 14. Handoff log

Bu workstream dosyasına agent'lar çıktılarını ekler.

- 2026-04-24 10:45 — **product-analyst** ✅ — **brief**: `docs/product/02-briefs/ux/2026-04-24-stk-admin-ui-min-plus.md` — 10 sayfalık detaylı UX brief (10 sayfa × JTBD + outcome + must/should/won't + başarı kriteri + benchmark + varsayım + OST + 4-risk + Shape Up appetite + LNO + handoff plan)
- 2026-04-24 20:30 — **supabase-backend** ✅ — **migration 021 + seed script**: `supabase/migrations/021_ngo_admin_rls_policies.sql` + `lib/dev/ngo-admin-fixtures.ts` + `lib/supabase/types.ts` güncelleme — 8 RLS policy (missions/user_missions/ngos/posts/ngo_memberships/ngo_admin_users × admin writes + super-admin bypass), 5 eksik ngos kolon (email/phone/cover_image_url/social_instagram/twitter/linkedin), is_super_admin(user_id) helper, 5 STK admin seed (idempotent, dev-only, devtools entegrasyon ready).
- 2026-04-24 23:45 — **ux-researcher** ✅ — **audit + journey**: `docs/ux/03-heuristics/2026-04-24-stk-admin-audit.md` + `docs/ux/02-journeys/2026-04-24-stk-admin-ayse-journey.md` — 10 sayfa heuristik matrisi (K1-K8), 5 tier-1 benchmark, admin-özel 4 heuristik, Ayşe 10-step journey + 3 persona spektrumu. Handoff: ui-designer.
- 2026-04-24 HH:MM — **ui-designer** ✅ — **UI spec**: `docs/ui/01-specs/2026-04-24-stk-admin-ui-spec.md`. 10 sayfa wireframe + 20 component + token + motion + a11y. K1-K8 çözümü.
- 2026-04-24 HH:MM — **auth-capacitor** [sonra dolacak] — **middleware upgrade**: `[dosya]`
- 2026-04-25 03:30 — **supabase-backend + frontend-engineer** ✅ — **gap fix (V1 pilot)**: Migration 022 user_missions proof columns + Migration 023 ngo-assets Storage bucket RLS + verifications page real data wire (mock → query) + verifications-actions karma idempotent. TSC 0 hata. `supabase/migrations/022_user_missions_proof_columns.sql` + `023_storage_ngo_assets.sql` + `lib/supabase/types.ts` proof_type/proof_url/submitted_at + `app/admin/[ngoId]/verifications/page.tsx` real query + `lib/admin/verifications-actions.ts` karma distribution. Storage upload UI V1.1'e ertelendi (text URL input yeterli pilot için). Next: Sprint A auth + layout.
- 2026-04-24 HH:MM — **frontend-engineer** [sonra dolacak] — **Sprint A implementation**: `[dosyalar]`

---

**Son söz:** Bu workstream İyiBiri'nin operasyonel bel kemiği. Admin panel kötü olursa STK pilot başarısız olur — mock data değil, gerçek STK ekipleri kullanacak. Pilot 5 STK'nın 4 aylık koşusu **bu backoffice'in kalitesinden geçer.**
