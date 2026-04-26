'use server'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { NgoSignupForm } from './signup-form'

// Vol-26 BUG-044 fix: Public STK self-signup MVP
// Ankete benzer form: STK'ları teşvik etmek için friendly + minimum scope
export default async function StkSignupPage() {
  return (
    <div className="min-h-screen bg-stone-900 text-cream">
      {/* Header */}
      <header className="border-b border-ink-700 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-ink-300 hover:text-cream text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Admin Girişi
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="font-display font-bold text-4xl text-cream mb-3">
            STK&apos;nızı iyiBiri&apos;ye Davet Edin
          </h1>
          <p className="text-ink-300 text-base leading-relaxed max-w-2xl">
            Türkiye&apos;nin gönüllülük platformuna katılın. Görevlerinizi yayınlayın,
            yeni gönüllüler bulun, KVKK uyumlu üyelik akışı kurun. Başvurunuzu
            inceledikten sonra 5 iş günü içinde dönüş yaparız.
          </p>
        </div>

        {/* What you get */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-ink-800 border border-ink-700 rounded-2xl p-5">
            <div className="text-gold text-2xl mb-2">📋</div>
            <h3 className="font-semibold text-cream mb-1">Görev Yönetimi</h3>
            <p className="text-xs text-ink-300 leading-relaxed">
              Etkinlikleri yayınlayın, QR doğrulama, karma puanı, katılımcı listesi.
            </p>
          </div>
          <div className="bg-ink-800 border border-ink-700 rounded-2xl p-5">
            <div className="text-gold text-2xl mb-2">🤝</div>
            <h3 className="font-semibold text-cream mb-1">Üye Yönetimi</h3>
            <p className="text-xs text-ink-300 leading-relaxed">
              KVKK uyumlu üye toplama, fee config (yaş tabanlı / aylık / bağış).
            </p>
          </div>
          <div className="bg-ink-800 border border-ink-700 rounded-2xl p-5">
            <div className="text-gold text-2xl mb-2">💳</div>
            <h3 className="font-semibold text-cream mb-1">Ödeme Esnekliği</h3>
            <p className="text-xs text-ink-300 leading-relaxed">
              Embedded / Passthrough / Marketplace — mevcut altyapınıza saygı.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-ink-800 border border-ink-700 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-cream mb-6">Başvuru Formu</h2>
          <NgoSignupForm />
        </div>

        {/* Footer */}
        <p className="text-xs text-ink-400 text-center mt-8 leading-relaxed">
          Başvurunuz incelenirken{' '}
          <a href="mailto:onboarding@iyibiri.app" className="text-gold hover:underline">
            onboarding@iyibiri.app
          </a>{' '}
          ile iletişime geçebilirsiniz. Verileriniz{' '}
          <Link href="/legal/kvkk" className="text-gold hover:underline">
            KVKK Aydınlatma Metni
          </Link>{' '}
          uyarınca işlenir.
        </p>
      </main>
    </div>
  )
}
