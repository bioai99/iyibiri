// app/payments/sandbox/page.tsx
//
// Development payment sandbox — prod'da hiç kullanılmaz.
// buildPaymentUrl (lib/membership/actions.ts) dev modda buraya redirect eder.
// 3 modu simüle eder:
//  - embedded / marketplace → iframe içinde render olur, postMessage('payment_success') emit eder
//  - passthrough            → ayrı tab'da render olur, callback URL'ine redirect eder
//
// Prod checklist: `NODE_ENV=production` + `NEXT_PUBLIC_PAYMENTS_SANDBOX` unset → bu sayfa
// kullanılmaz, buildPaymentUrl gerçek processor URL'ini üretir.

import { SandboxClient } from './sandbox-client'

export const metadata = {
  title: 'Ödeme Sandbox — İyiBiri Dev',
  robots: 'noindex,nofollow',
}

interface Params {
  searchParams: {
    ref?: string
    amount?: string
    processor?: string
    mode?: string
    ngo?: string
    callback?: string
  }
}

export default function PaymentSandboxPage({ searchParams }: Params) {
  // Minimum param guard
  const ref = searchParams.ref ?? ''
  const amount = Number(searchParams.amount ?? '0')
  const processor = (searchParams.processor ?? 'iyzico') as
    | 'iyzico'
    | 'paytr'
    | 'fonzip'
    | 'external'
    | 'custom'
    | 'none'
  const mode = (searchParams.mode ?? 'embedded') as
    | 'embedded'
    | 'marketplace'
    | 'passthrough'
  const ngo = searchParams.ngo ?? 'Kuruluş'
  const callback = searchParams.callback ?? '/'

  return (
    <SandboxClient
      ref_={ref}
      amount={amount}
      processor={processor}
      mode={mode}
      ngo={ngo}
      callback={callback}
    />
  )
}
