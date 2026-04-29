import { SponsorSignupForm } from './sponsor-signup-form'

export default function SponsorOnboardingPage() {
  return (
    <main className="min-h-screen bg-ink-900 text-cream py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-gold">
          SPONSOR BAŞVURUSU
        </p>
        <h1 className="text-4xl font-display mt-2 mb-3">
          iyibiri sponsor markası ol
        </h1>
        <p className="text-ink-300 mb-8 leading-relaxed">
          Sürdürülebilirlik, eğitim, hayvan hakları gibi alanlarda iyibiri
          kullanıcılarına ulaşın. Marka bloğunuzla içerik paylaşın, karma
          karşılığı ödüller tanımlayın. Başvurunuz iyibiri ekibi tarafından
          incelendikten sonra paneliniz açılır.
        </p>
        <SponsorSignupForm />
      </div>
    </main>
  )
}
