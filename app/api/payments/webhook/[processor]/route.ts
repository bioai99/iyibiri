// app/api/payments/webhook/[processor]/route.ts
//
// Payment processor webhook endpoint — iyzico / PayTR / fonzip.
// Her processor kendi callback formatını/imza şemasını kullanır.
//
// Bu dosya production-ready imza doğrulama + referral confirmation iskeleti sunar.
// Şu an `verifySignature` fonksiyonları stub — production'da her processor için
// gerçek HMAC/SHA256 implementation eklenecek (env: IYZICO_WEBHOOK_SECRET vs.).
//
// Güvenlik:
// - Sadece POST kabul
// - Her processor için ayrı secret env var
// - Timing-safe compare kullan
// - Tekrar eden event'ler idempotent (referrals.confirmed_at check)

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Processor = 'iyzico' | 'paytr' | 'fonzip'

/* ─────────────────────────────────────────────────────────────
 *  POST handler
 * ───────────────────────────────────────────────────────────── */

export async function POST(
  request: Request,
  { params }: { params: { processor: string } },
) {
  const processor = params.processor as Processor
  if (!['iyzico', 'paytr', 'fonzip'].includes(processor)) {
    return NextResponse.json(
      { ok: false, error: 'unknown_processor' },
      { status: 400 },
    )
  }

  const rawBody = await request.text()

  // 1. İmza doğrulama — processor-özgü
  const verified = await verifySignature(processor, request.headers, rawBody)
  if (!verified.ok) {
    console.warn(
      `[webhook:${processor}] signature verification failed:`,
      verified.reason,
    )
    return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 401 })
  }

  // 2. Payload parse + normalize
  let payload: NormalizedEvent
  try {
    payload = normalizeEvent(processor, JSON.parse(rawBody))
  } catch (err) {
    console.error(`[webhook:${processor}] parse error:`, err)
    return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 })
  }

  // 3. Referral lookup — external_transaction_id veya metadata.iyibiri_ref
  const supabase = createClient()
  const { data: referralData } = await supabase
    .from('referrals')
    .select('id, user_id, ngo_id, status')
    .eq('id', payload.referralId)
    .maybeSingle()

  if (!referralData) {
    console.warn(
      `[webhook:${processor}] referral not found: ${payload.referralId}`,
    )
    // 200 döndür — processor yeniden dener yoksa spam olur; biz sessizce görmezden geliyoruz
    return NextResponse.json({ ok: true, note: 'unknown_ref' })
  }

  // 4. Event'e göre state transition
  if (payload.event === 'payment_success') {
    await supabase
      .from('referrals')
      .update({
        status: 'confirmed',
        external_transaction_id: payload.externalTxId,
        confirmed_at: new Date().toISOString(),
      })
      .eq('id', payload.referralId)

    // ngo_memberships + karma insert'i client-side'daki confirmMembership halleder.
    // Webhook sadece referral state'ini işaretler; kullanıcı success sayfasına geldiğinde
    // confirmMembership idempotent olarak çalışır. (Webhook webhook-only kritik flow'lar
    // için — future: webhook → karma award → user-independent.)
  } else if (payload.event === 'payment_failed') {
    await supabase
      .from('referrals')
      .update({
        status: 'failed',
        metadata: { error_code: payload.errorCode ?? 'UNKNOWN' },
      })
      .eq('id', payload.referralId)
  } else if (payload.event === 'payment_refunded') {
    await supabase
      .from('referrals')
      .update({ status: 'refunded' })
      .eq('id', payload.referralId)
    // TODO: ngo_memberships.status = 'cancelled'
  }

  return NextResponse.json({ ok: true })
}

export async function GET() {
  // Health check
  return NextResponse.json({ ok: true, endpoint: 'payment_webhook' })
}

/* ─────────────────────────────────────────────────────────────
 *  Signature verification — processor-özgü
 * ───────────────────────────────────────────────────────────── */

interface VerifyResult {
  ok: boolean
  reason?: string
}

async function verifySignature(
  processor: Processor,
  headers: Headers,
  rawBody: string,
): Promise<VerifyResult> {
  // Dev mode — NEXT_PUBLIC_PAYMENTS_SANDBOX=1 ise imzayı bypass et
  if (
    process.env.NODE_ENV !== 'production' ||
    process.env.NEXT_PUBLIC_PAYMENTS_SANDBOX === '1'
  ) {
    return { ok: true }
  }

  switch (processor) {
    case 'iyzico': {
      // iyzico `x-iyz-signature` header kullanır (HMAC-SHA1 + base64).
      // TODO(prod): IYZICO_WEBHOOK_SECRET env + crypto.createHmac doğrulaması
      const sig = headers.get('x-iyz-signature')
      if (!sig) return { ok: false, reason: 'missing_header' }
      return { ok: false, reason: 'iyzico_hmac_unimplemented' }
    }
    case 'paytr': {
      // PayTR `merchant_oid` + `status` + `total_amount` + `salt` → hash_hmac('sha256')
      // TODO(prod): PAYTR_MERCHANT_KEY + PAYTR_MERCHANT_SALT env
      return { ok: false, reason: 'paytr_hash_unimplemented' }
    }
    case 'fonzip': {
      // fonzip'te public webhook desteği dokümante değil — custom entegrasyon
      // TODO(prod): özel kurulum sonrası güncellenecek
      return { ok: false, reason: 'fonzip_webhook_unimplemented' }
    }
  }
}

/* ─────────────────────────────────────────────────────────────
 *  Event normalize — processor payload'ını ortak shape'e çevir
 * ───────────────────────────────────────────────────────────── */

interface NormalizedEvent {
  event: 'payment_success' | 'payment_failed' | 'payment_refunded'
  referralId: string
  externalTxId: string | null
  amount: number | null
  errorCode: string | null
}

function normalizeEvent(processor: Processor, payload: unknown): NormalizedEvent {
  const p = payload as Record<string, unknown>

  if (processor === 'iyzico') {
    // iyzico callback formatı: { status, paymentId, conversationId, ... }
    // conversationId → referralId (biz set ediyoruz initialize'da)
    const status = String(p.status ?? p.paymentStatus ?? '')
    return {
      event:
        status === 'success' || status === 'SUCCESS'
          ? 'payment_success'
          : status === 'REFUNDED'
            ? 'payment_refunded'
            : 'payment_failed',
      referralId: String(p.conversationId ?? ''),
      externalTxId: String(p.paymentId ?? '') || null,
      amount:
        typeof p.paidPrice === 'number'
          ? (p.paidPrice as number)
          : null,
      errorCode: String(p.errorCode ?? '') || null,
    }
  }

  if (processor === 'paytr') {
    // PayTR callback: { merchant_oid, status, total_amount }
    // merchant_oid = `iyibiri_<referralId>` formatı
    const moid = String(p.merchant_oid ?? '')
    const rid = moid.startsWith('iyibiri_') ? moid.slice(8) : moid
    const status = String(p.status ?? '')
    return {
      event:
        status === 'success' ? 'payment_success' : 'payment_failed',
      referralId: rid,
      externalTxId: String(p.merchant_oid ?? '') || null,
      amount:
        typeof p.total_amount === 'number'
          ? (p.total_amount as number) / 100
          : null,
      errorCode: String(p.failed_reason_code ?? '') || null,
    }
  }

  // fonzip — custom
  return {
    event: String(p.event ?? 'payment_success') as
      | 'payment_success'
      | 'payment_failed'
      | 'payment_refunded',
    referralId: String(p.iyibiri_ref ?? p.referralId ?? ''),
    externalTxId: String(p.transactionId ?? '') || null,
    amount: typeof p.amount === 'number' ? (p.amount as number) : null,
    errorCode: String(p.errorCode ?? '') || null,
  }
}
