# Pattern: Payment Production Stubs (V1.5 lansman blocker)

**Tarih:** 2026-04-26
**Tespit eden:** system-architect (v2 baseline audit)
**Severity:** 🔴 (production unimplemented)
**Audit ref:** [`docs/audit/2026-04-26-eng-arch-baseline-audit.md`](../../audit/2026-04-26-eng-arch-baseline-audit.md) Bölüm 3 S-005, Bölüm 6 TD-013/TD-017

## Etkilenen entry'ler

- TD-013 🔴 — Ödeme webhook + initiator production stub
- TD-015 🟡 — `lib/membership/actions.ts` 530 satır + stub'lar iç içe
- TD-017 🟡 — 9 TODO/FIXME marker (5'i payment, 1'i sertifika PDF, 1'i refund logic)

## Production blocker konumları

### A. Webhook imza doğrulaması (her zaman fail döner)

`app/api/payments/webhook/[processor]/route.ts:135-152`:

```ts
async function verifySignature(processor: Processor, headers: Headers, rawBody: string): Promise<VerifyResult> {
  // Dev mode bypass
  if (process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_PAYMENTS_SANDBOX === '1') {
    return { ok: true }
  }
  switch (processor) {
    case 'iyzico': {
      // TODO(prod): IYZICO_WEBHOOK_SECRET env + crypto.createHmac doğrulaması
      const sig = headers.get('x-iyz-signature')
      if (!sig) return { ok: false, reason: 'missing_header' }
      return { ok: false, reason: 'iyzico_hmac_unimplemented' }  // ← her zaman fail
    }
    case 'paytr': {
      // TODO(prod): PAYTR_MERCHANT_KEY + PAYTR_MERCHANT_SALT env
      return { ok: false, reason: 'paytr_hash_unimplemented' }  // ← her zaman fail
    }
    case 'fonzip': {
      // TODO(prod): özel kurulum sonrası güncellenecek
      return { ok: false, reason: 'fonzip_webhook_unimplemented' }  // ← her zaman fail
    }
  }
}
```

**Sonuç:** Production'da gerçek processor webhook gelirse 401 döner; processor bunu "callback failed" olarak işaretler; retry'lar başlar; sonunda webhook devre dışı kalır.

### B. Membership initiate marketplace mode (exception fırlatır)

`lib/membership/actions.ts:472`:
```ts
// Mode 1: marketplace — iyzico Checkout Form
if (input.mode === 'marketplace' && input.processor === 'iyzico') {
  if (useSandbox) {
    return buildSandboxUrl(...)  // sandbox OK ✅
  }
  // TODO(prod): iyzico Checkout Form initialize — server-side SDK call
  throw new Error('iyzico marketplace production entegrasyonu eksik')
}
```

**Sonuç:** Production'da `payment_mode = 'marketplace'` aktive edilirse `initiateMembership` exception atar; üyelik akışı kırılır.

### C. Membership initiate embedded PayTR (exception fırlatır)

`lib/membership/actions.ts:489`:
```ts
if (input.processor === 'paytr') {
  // TODO(prod): PayTR token + iframe URL
  throw new Error('PayTR production entegrasyonu eksik')
}
```

### D. Membership refund logic (TODO)

`lib/membership/actions.ts:384`:
```ts
// TODO: processor refund API (iyzico/PayTR cancel endpoint)
```

### E. Webhook refund handling (TODO)

`app/api/payments/webhook/[processor]/route.ts:102`:
```ts
} else if (payload.event === 'payment_refunded') {
  await supabase.from('referrals').update({ status: 'refunded' })...
  // TODO: ngo_memberships.status = 'cancelled'
}
```

### F. Sertifika PDF üretim (üyelik success)

`app/dashboard/ngos/[id]/membership/success/celebration-client.tsx:215`:
```ts
// TODO: sertifika PDF üretim route'u (app/api/members/[id]/certificate/route.ts)
```

## Çalışan modlar (production'da hazır)

✅ **Sandbox mode** — `NEXT_PUBLIC_PAYMENTS_SANDBOX=1` ile her flow simulate edilir; webhook bypass.
✅ **Embedded mode + fonzip processor** — `lib/membership/actions.ts:492-496` fonzip embed URL pattern (`?ref=...&embed=1`); fonzip widget HTML render edilir.
✅ **Passthrough mode** — STK URL'ye redirect (`?iyibiri_ref=&iyibiri_callback=`); processor'sız.

## V1 / V1.5 / V2 yol haritası önerisi (ADR-008 v3)

| Lansman | Mode'lar | Processor'lar | Stub'lar |
|---|---|---|---|
| **V1 (Mayıs)** | Embedded (fonzip) + Passthrough | fonzip + custom STK URL | Hiç çalışmıyor değil — **bu mode'lar zaten production-ready ✅** |
| **V1.5 (Haziran)** | + Marketplace | + iyzico | iyzico Checkout Form initialize + HMAC-SHA1 webhook |
| **V2 (Temmuz/Ağustos)** | Tüm 3 mode | + PayTR | PayTR token + iframe + HMAC-SHA256 webhook |

## Önerilen sistemik fix (TD-013, ADR-008 v3 kapsamında)

### Faz 1 — Adapter pattern (TD-015, 1 hafta)

`lib/membership/actions.ts` (530 satır) → adapter'lara böl:
```
lib/membership/
├── actions.ts                    # orchestration (initiate/confirm/cancel/refund)
├── fee-config.ts                 # zaten var ✅
├── types.ts                      # interfaces (zaten dosya başında ✅)
└── payment-adapters/
    ├── sandbox.ts               # mevcut buildSandboxUrl
    ├── fonzip.ts                # mevcut fonzip embed URL
    ├── iyzico.ts                # YENİ — Checkout Form + HMAC verify
    ├── paytr.ts                 # YENİ — token + HMAC verify
    └── custom.ts                # passthrough STK URL
```

### Faz 2 — iyzico SDK entegrasyonu (V1.5, 1-2 hafta)

```bash
npm i iyzipay
```

`lib/membership/payment-adapters/iyzico.ts`:
```ts
import Iyzipay from 'iyzipay'

const iyzico = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY!,
  secretKey: process.env.IYZICO_SECRET_KEY!,
  uri: process.env.IYZICO_BASE_URL ?? 'https://api.iyzipay.com',
})

export async function initializeCheckoutForm(input: {
  conversationId: string  // referralId
  amount: number          // TRY
  buyer: { id: string; name: string; surname: string; email: string }
  callbackUrl: string
}) {
  return new Promise<{ token: string; iframeUrl: string }>((resolve, reject) => {
    iyzico.checkoutFormInitialize.create({
      locale: 'tr',
      conversationId: input.conversationId,
      price: input.amount.toFixed(2),
      paidPrice: input.amount.toFixed(2),
      currency: 'TRY',
      callbackUrl: input.callbackUrl,
      buyer: input.buyer,
      // ... shipping/billing addresses
    }, (err, result) => {
      if (err) return reject(err)
      resolve({ token: result.token, iframeUrl: result.paymentPageUrl })
    })
  })
}

export function verifyWebhook(rawBody: string, signature: string): boolean {
  // HMAC-SHA1 base64 verify
  const secret = process.env.IYZICO_WEBHOOK_SECRET!
  const expected = crypto.createHmac('sha1', secret).update(rawBody).digest('base64')
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}
```

### Faz 3 — PayTR adapter (V2, 1-2 hafta)

`lib/membership/payment-adapters/paytr.ts`:
```ts
export async function initializeIframe(input: {
  merchantOid: string  // `iyibiri_${referralId}`
  amount: number       // TRY × 100 (kuruş)
  email: string
  ...
}) {
  // PayTR token endpoint çağrısı
  // Iframe URL döner
}

export function verifyWebhook(payload: { merchant_oid: string; status: string; total_amount: number; hash: string }): boolean {
  // HMAC-SHA256: merchant_oid + status + total_amount + salt
  const secret = process.env.PAYTR_MERCHANT_SALT!
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${payload.merchant_oid}${payload.status}${payload.total_amount}${process.env.PAYTR_MERCHANT_KEY}`)
    .digest('hex')
  return crypto.timingSafeEqual(Buffer.from(payload.hash), Buffer.from(expected))
}
```

### Faz 4 — Refund logic (V1.5)

`lib/membership/actions.ts:384` TODO + webhook `payment_refunded` → `ngo_memberships.status = 'cancelled'` + Karma claw-back (gerekirse).

### Faz 5 — Env vars + Supabase Vault

```env
# .env.production
IYZICO_API_KEY=xxx
IYZICO_SECRET_KEY=xxx
IYZICO_WEBHOOK_SECRET=xxx
IYZICO_BASE_URL=https://api.iyzipay.com  # sandbox: https://sandbox-api.iyzipay.com
PAYTR_MERCHANT_ID=xxx
PAYTR_MERCHANT_KEY=xxx
PAYTR_MERCHANT_SALT=xxx
FONZIP_API_KEY=xxx  # gerekirse
```

Supabase Vault tercih (env değil) — DB-yönetimli secret rotation. Reference:
```sql
select decrypted_secret from vault.decrypted_secrets where name = 'iyzico_secret_key';
```

### Faz 6 — Sertifika PDF (TD-017 alt-task, 1 hafta — V1.5)

`app/api/members/[id]/certificate/route.ts` — react-pdf veya pdf-lib ile sertifika üretimi. STK admin tarafında preview + bulk send.

## Routing

| Bulgu | Sahip | Effort | Sprint |
|---|---|---|---|
| TD-013 webhook + initiator (iyzico) | supabase-backend + frontend-engineer | L (2 hafta) | Mayıs sonu - Haziran (V1.5) |
| TD-013 PayTR adapter | supabase-backend | M (1-2 hafta) | Temmuz (V2) |
| TD-013 fonzip webhook (custom) | supabase-backend + product-analyst (fonzip team) | M | V1.5 |
| TD-015 Adapter pattern split | supabase-backend | M (1 hafta) | TD-013 ile birleşik |
| TD-017 Sertifika PDF | frontend-engineer | M (1 hafta) | V1.5 |
| TD-017 Refund logic | supabase-backend | S (2-3 gün) | V1.5 |

## Bağlı ADR'ler

- **ADR-008 v3 revize Proposed** — Payment routing roadmap (fonzip-V1, iyzico-V1.5, PayTR-V2 priority).
- **ADR-002** — iyzico karar (kalır).
- **ADR-006 v2 revize** — V1 bağış akışı statüsü (donate route'lar canlı mı sorusu paralel).

## V1 lansman risk değerlendirmesi

**V1 fonzip-only ile çıkılırsa risk düşük:**
- ✅ Embedded mode + fonzip + sandbox bypass çalışıyor.
- ✅ Pilot 3 STK (TEMA + TEGV + HAYTAP) muhtemelen fonzip kullanıyor (atlas Bölüm 3).
- ⚠️ Yeni STK (HAYTAP gibi) iyzico kullanıyorsa V1.5'e kadar bekler.

**V1'de iyzico/PayTR aktive edilirse risk yüksek:**
- ❌ initiateMembership exception → form submit kırılır.
- ❌ Webhook 401 → ödeme onayı UI'a yansımaz; user "kaydedildi mi" şüphesinde.

**Karar:** V1'de `payment_mode = 'embedded' + processor = 'fonzip'` only; iyzico marketplace + PayTR feature flag'lerle kapalı.

## Handoff log

- 2026-04-26 20:15 — **system-architect** 📥 — Pattern memo açıldı. Routing: supabase-backend (adapter + iyzico SDK) + frontend-engineer (sertifika PDF + UI) + product-analyst (ADR-008 v3 revize). User onayı bekleniyor.
- ⏸ Pending — V1 lansman fonzip-only güvenli; V1.5 lansman öncesi iyzico tamamlanmalı; ADR-008 v3 revize Proposed kuyruğa girdi.
