# 010. STK Admin UI V1 — Min+ Scope (10 Sayfa)

**Tarih:** 2026-04-24
**Durum:** **Accepted (2026-04-24)** ✅
**Önerici:** product-analyst (Q17 çözümü — karar kuyruğu 2026-04-24)
**Onaylayan:** Bahadır (kurucu)

## Bağlam

P0 #9 V1 Master Plan'da "STK admin UI V0" başlığı var — ancak kapsam boyutu net değildi. 3 seviye değerlendirildi:

- **Min (MVP, 4-5 sayfa):** En temel — görev yayınla, üye listesi, ay raporu
- **Orta (8-10 sayfa):** CRM light, analytics expansion, sponsor observation
- **Tam (15+ sayfa):** B2B self-service, multi-user, API access

Bahadır "iş planına almak kritik" uyarısıyla kapsamı **Min+ 10 sayfa** olarak genişletti. Eklemeler:
- Görev görseli upload
- Blog yazma alanı (posts tablosu)
- STK profil yönetimi (logo, cover, tagline)
- Üyelik form alanı yönetimi (membership_form_fields jsonb editör)
- **Yasal doküman upload** (KVKK + Üyelik Sözleşmesi + Gönüllülük Sözleşmesi PDF — migration 016 ile)
- Ödeme bağlantıları self-serve (fonzip URL) + read-only status (iyzico/PayTR)

## Karar

### 10 sayfa STK Admin UI V1 scope

1. **Dashboard overview** — Bu ayın özeti (Karma dağılımı, yeni üye, onay bekleyen)
2. **Görev yayınla/düzenle** — Form (başlık, domain, difficulty, duration, verify_method [QR/Code/Auto], Karma [formül öneri, override esnek V1'de], kontenjan, access_level [public/members_only — ADR-012]) + **görev görseli upload** (Supabase Storage)
3. **Görevlerim listesi** — Status toggle (active/cancelled/draft) + edit + state-aware "İptal et" → "Tamamlandı işaretle" (ADR-013 trigger ile)
4. **Üye listesi** — Ad, e-posta, şehir, tier, üyelik tarihi + CSV export
5. **Doğrulama kuyruğu** — Photo/code/QR pending (V1'de photo V1.1 için) → approve/reject + admin_feedback + TEGV pre-screening kuyruğu (membership_approval_required)
6. **Aylık rapor** — Karşılaştırma (geçen ay vs bu ay), Karma dağılımı, yeni üye, tamamlanmış görev sayısı
7. **Blog yazma** — `posts` tablosu CRUD (per-STK: `ngo_id` filter), `published` toggle, cover image, kategori
8. **STK profil** — Logo, cover image, tagline, description, iletişim bilgileri, tax_exempt toggle
9. **Üyelik ayarları** — `membership_fee_config` jsonb editör (tier'lar, amount, age_min/max, impact_statement) + `membership_form_fields` editör (TC kimlik, telefon vb. alan ekle/kaldır) + `cooling_off_days` + **yasal dokümanlar** (KVKK PDF upload, Üyelik Sözleşmesi PDF, Gönüllülük Sözleşmesi PDF)
10. **Ödeme bağlantıları** — fonzip kullanıyorsa `donation_url` + `membership_url` text fields self-serve + iyzico/PayTR merchant onboarding durumu **read-only** (platform elle kurar, STK sadece görür)

### Ödeme onboarding ayrımı (ADR-008 uyumlu)

| Alan | STK self-serve | Platform manuel |
|---|---|---|
| fonzip `donation_url`/`membership_url` | ✅ Text field | — |
| Fee config (tier'lar) | ✅ jsonb editör | — |
| `membership_form_fields` | ✅ jsonb editör | — |
| Yasal dokümanlar (PDF) | ✅ Upload | — |
| `payment_mode` / `payment_processor` | Read-only | 🔒 Pilot ekibi elle doldurur |
| iyzico sub-merchant onboarding | — | 🔒 KYC + API key + Supabase Vault (1 STK başı 2-4 saat + iyzico 3-7 iş günü onay) |
| PayTR merchant onboarding | — | 🔒 Benzer manuel süreç |

Gerekçe: iyzico/PayTR onboarding STK'nın **tüzel kişiliğine** (vakıf/dernek) açılıyor — KYC + imza yetkisi + vergi sorumluluğu gerekli. Text field'a ad yazmakla halledilemez. Pilot 3-5 STK için operasyon ekibi manuel kurar; V2+ programatik partner API.

### Effort

- Frontend: ~10 gün (5 base CRUD + 1.5 blog + 1 profil+image + 2 fee config + 0.5 ödeme view)
- Backend: ~4.5 gün (RLS policy + admin role + ngo_admin middleware + jsonb validation RPC)
- **Toplam:** ~2-2.5 hafta (1 FE) veya 1.5 hafta (FE+BE paralel)

Zaman planı pilot Mayıs ortası için yetişir.

### Auth + RLS

Migration ayrı (sonraki): `ngo_admin` rol + `ngo_admin_users` link table (user_id × ngo_id × permissions). Middleware zaten ADMIN_SECRET cookie pattern'i var, genişletilecek.

## Sonuçlar

**Pozitif:**
- Pilot STK gerçekten kullanılabilir — blog, doküman, görev yönetimi hepsi kendi elinde
- Yasal doküman upload → avukat onayı sonrası pilot başlar, compliance garantili
- Ödeme onboarding platform elinde → iyzico/PayTR karmaşıklığı STK'ya geçmez, güven verir
- Blog per-STK → STK kendi topluluğunu besler, İyiBiri editöryel yük almaz

**Negatif:**
- 10 sayfa 5'ten 2 hafta fazla geliştirme → lansman 2 hafta geç
- Platform elle iyzico onboarding yapıyor → pilot sayısı 5-10 ile sınırlı (operasyon bottleneck)
- "V1.5'te tam self-serve" geliştirme borcu

**Riskler:**
- STK admin UI kullanım azlığı → yatırım geri dönmeyebilir (ama pilot için doğru scope)
- Photo verification V1'de gizli (ADR-011 paketi) → HAYTAP gibi STK "fotoğraf isteriz" derse V1.1 beklenecek

## Referanslar

- Q17 karar: `docs/_decisions-queue.md` (2026-04-24 Bahadır onayı)
- V1 Master Plan P0 #9: `docs/product/01-workstreams/2026-04-24-v1-improvement-master-plan.md`
- ADR-007 (parametric fee), ADR-008 (payment routing) — fee + payment infra bu ADR'ye dayanak
- Migration 016 (doküman kolonları) — yasal doküman upload infra

## Sonraki adım

1. ux-researcher — STK admin UI için UX brief (TEMA/TEGV/LÖSEV pilot personaları ile)
2. ui-designer — UI spec (10 sayfa wireframe + token × variant × state)
3. frontend-engineer — component scaffold + page implementation
4. supabase-backend — migration (ngo_admin role, RLS policies, ngo_admin_users table)
5. auth-capacitor — ngo_admin middleware genişletmesi
