# Deploy Adımları — 2026-04-24 oturumu

> **Kimden:** Claude (Cowork sandbox)
> **Kime:** Bahadır — kendi terminalinden çalıştırılacak
> **Ne için:** 179 dosyalık mega commit'i (9dfc712) zip dosyaları temizlenmiş haliyle GitHub'a push + Supabase migrate

---

## 1. Terminalini aç, repo'ya geç

```bash
cd /path/to/iyibiri    # (kendi path'in)
```

---

## 2. Zip'leri commit'ten çıkar + amend

Cowork sandbox'tan benim yaptığım commit 2 adet zip dosyası içerdi (.gitignore Unicode pattern'i match edemedi). Düzeltmek için:

```bash
# zip'leri tracking'den çıkar (dosyalar diskte kalır, sadece git ignorlar)
git rm --cached $'I\314\207yiBiri Design System.zip' $'I\314\207yiBiri Design System with auth.zip'

# .gitignore benim tarafımdan güncellenmişti (*.zip artık geniş pattern) — zaten stage'de
# Son commit'e dahil et (yeni commit yaratmaz, sadece mevcutu günceller)
git commit --amend --no-edit
```

---

## 3. Push

```bash
git push origin main
```

Vercel otomatik algılayıp deploy eder (1-2 dakika).

---

## 4. Supabase SQL editor'de migration'lar

Supabase dashboard'da SQL editor aç. `supabase/migrations/` klasöründeki 11 migration'u **sırayla** çalıştır:

| Sıra | Dosya | Ne yapar |
|---|---|---|
| 1 | `009_parametric_ngo_fee.sql` | NGO fee config jsonb şema |
| 2 | `010_payment_routing.sql` | 3-mode payment (embedded/passthrough/marketplace) + referrals |
| 3 | `011_make_analytics_views.sql` | 5 analytics view (MAKE NSM) |
| 4 | `012_membership_karma_type.sql` | karma_transactions type enum'una ngo_membership eklenmesi |
| 5 | `013_mission_lifecycle.sql` | Mission state + karma idempotent index |
| 6 | `014_ngos_missions_seed.sql` | **5 NGO + 12 mission seed** (⚠️ bu olmadan pilot STK'lar boş) |
| 7 | `015_mission_access_level.sql` | Per-mission visibility (Yol D) |
| 8 | `016_ngo_documents_verify_simplify.sql` | NGO yasal doküman URL'leri |
| 9 | `017_mission_cancel_guardrail.sql` | Trigger: tamamlanmış görev iptal edilemez |
| 10 | `018_mission_domain_expansion.sql` | Domain 4 → 10 + seed re-map |
| 11 | `019_ngo_admin_role.sql` | STK admin rol + RLS |

Her migration idempotent — tekrar apply edilebilir, hata vermez.

**Kontrol query** (apply sonrası):

```sql
-- NGO ve mission sayıları
select
  (select count(*) from public.ngos) as ngos,
  (select count(*) from public.missions) as missions,
  (select count(*) from public.ngos where membership_fee_config is not null) as ngos_with_fee_config;
-- Beklenen: ngos=5, missions=12, ngos_with_fee_config=5

-- Trigger var mı
select tgname from pg_trigger where tgname = 'tg_prevent_completed_mission_cancel';
-- Beklenen: 1 row

-- Karma idempotent index
select indexname from pg_indexes where indexname = 'karma_transactions_mission_unique';
-- Beklenen: 1 row
```

---

## 5. Test — dev fixtures + TestFlight

### 5.1 Env değişkenleri (Vercel dashboard)

Projemin Environment Variables'ına:

```
NEXT_PUBLIC_APP_URL = https://<senin-vercel-domain>
NEXT_PUBLIC_PAYMENTS_SANDBOX = 1
```

Production'da `NEXT_PUBLIC_PAYMENTS_SANDBOX` set edilmezse gerçek payment URL'leri üretir (şu an stub, bir süre daha 1 kalmalı).

### 5.2 Dev fixtures + ilk akış

1. TestFlight app'i aç + login ol
2. Browser'dan `/admin/devtools` aç
3. Migration sağlık paneli yeşil olmalı (NGO 5/5, Mission 12/12)
4. "🌱 Seed fixtures" butonuna bas
5. Dashboard'a dön + mission detail akışını test et

### 5.3 Özellikle test edilmeli

- **`/dashboard`** — yeni hero card v2 (gold glow breathing + Karma count-up)
- **`/dashboard/missions/m-tema-fidan`** — idle state (Yol D public), hafif KVKK onayı
- **`/dashboard/missions/m-tegv-okuma`** — **members_only** state, Yol D doğru çalışıyor mu (üye olmadan banner → "Önce üye ol")
- **`/dashboard/missions/m-haytap-mama/complete`** — dark tema verification panel + confetti + Karma count-up + share CTA
- **`/dashboard/ngos/tema/membership`** — parametric tier seçim akışı
- **`/admin/devtools`** — dev helper

---

## 6. Tekrar eden bir şey yaparken (non-English chars var)

İleride commit yaparken TR karakterli (İ, ç, ğ, vs.) dosya/klasör adıyla gitignore'u check et. Güvenli pattern:

```gitignore
# Non-ASCII normalizasyon sorunu → geniş pattern kullan
*.zip
[Ii]*yi[Bb]iri*.zip
```

veya direkt dosya yerine klasöre koy:

```
exports/*.zip
```

---

## Referans: commit içeriği

Commit: `9dfc712` (feat(v1))
179 dosya, 28,435 satır eklendi, 732 satır değişti.

10 ana workstream (detaylı `git log -1` ile):
1. Multi-agent docs + strategy infrastructure
2. Supabase migrations 009-019
3. NGO membership parametric (full stack)
4. Mission state machine (FSM + components)
5. Dashboard v2 (hero + daily mission + Karma count-up)
6. Sistemik state library
7. Admin + dev tooling
8. Auth extensions (forgot-password, reset-password)
9. Celebration upgrade (dark + count-up + share + haptic)
10. Types + housekeeping

---

## Git lock warning'leri (Cowork sandbox artifact'i)

Commit sırasında çok sayıda `unable to unlink '.git/objects/*/tmp_obj_*'` warning'i görünebilir. Sandbox'ın write-but-no-delete permission'ı nedeniyle — **commit'i etkilemiyor**. Kendi terminalinde bu warning'ler olmayacak.

Eğer `.git/index.lock` veya `.git/HEAD.lock` kalıntı görürsen:

```bash
rm -f .git/index.lock .git/HEAD.lock
```

Sonra normal git komutlarına devam.
