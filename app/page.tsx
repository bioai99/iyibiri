import Link from "next/link";
import OnboardingRedirect from "@/components/onboarding-redirect";
import WaitlistForm from "@/components/waitlist-form";

const HOW_IT_WORKS = [
  { step: "01", icon: "🎯", title: "Görev Al",       desc: "STK'ların oluşturduğu, sana özel önerilen görevlerden birini seç."    },
  { step: "02", icon: "✅", title: "Tamamla",         desc: "Görevi gerçekleştir, fotoğraf ya da kod ile doğrulat."                },
  { step: "03", icon: "🎁", title: "Ödül Kazan",      desc: "XP biriktir, seviye atla ve sponsor markalardan ödüller al."         },
];

const DOMAINS = [
  { emoji: "❤️",  title: "Finansal Destek",    desc: "Bağış, gıda bankası, maddi destek kampanyaları.",   color: "bg-rose-50    border-rose-100"    },
  { emoji: "📚",  title: "Eğitim & Mentorluk", desc: "Ders verme, mentorluk, burs ve materyal desteği.",  color: "bg-blue-50    border-blue-100"    },
  { emoji: "🌿",  title: "Doğa & Çevre",       desc: "Toplu taşıma, geri dönüşüm, temizlik etkinlikleri.", color: "bg-emerald-50 border-emerald-100" },
  { emoji: "🤝",  title: "Sosyal Sorumluluk",  desc: "Kan bağışı, gönüllülük, komşu dayanışması.",        color: "bg-amber-50   border-amber-100"   },
];

const STATS = [
  { value: "40+",   label: "Aktif Görev"     },
  { value: "15+",   label: "STK Ortağı"      },
  { value: "1.200", label: "Erken Kullanıcı" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <OnboardingRedirect />

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">İ</span>
          </div>
          <span className="font-bold text-foreground">İyiBiri</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Giriş Yap
          </Link>
          <Link href="/auth/signup" className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors">
            Üye Ol
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="px-5 pt-16 pb-20 flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
            <span className="text-xs font-semibold text-primary">✦ Yakında Geliyor</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
            İyilik yapmak<br />
            <span className="text-primary">hiç bu kadar</span><br />
            eğlenceli olmamıştı.
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
            STK'larla ortaklık kurulmuş görevleri tamamla, XP kazan,
            seviye atla — her iyilik seni ödüle bir adım daha yaklaştırır.
          </p>

          <WaitlistForm />

          <p className="text-xs text-muted-foreground">
            Spam yok. İstediğin zaman çıkabilirsin.
          </p>
        </section>

        {/* ── İstatistikler ── */}
        <section className="bg-trust px-5 py-10">
          <div className="max-w-lg mx-auto grid grid-cols-3 gap-4">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 text-center">
                <span className="text-2xl font-bold text-white">{value}</span>
                <span className="text-xs text-white/70">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Nasıl Çalışır ── */}
        <section className="px-5 py-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Nasıl Çalışır?</h2>
          <div className="flex flex-col gap-6">
            {HOW_IT_WORKS.map(({ step, icon, title, desc }) => (
              <div key={step} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-primary mb-0.5">ADIM {step}</p>
                  <p className="text-base font-bold text-foreground mb-1">{title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4 İyilik Alanı ── */}
        <section className="px-5 py-16 bg-muted/40">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground text-center mb-3">4 İyilik Alanı</h2>
            <p className="text-sm text-muted-foreground text-center mb-10">
              Hangi alanda iyilik yapmak istediğini sen seç.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DOMAINS.map(({ emoji, title, desc, color }) => (
                <div key={title} className={`rounded-2xl border p-5 flex gap-4 ${color}`}>
                  <span className="text-3xl flex-shrink-0">{emoji}</span>
                  <div>
                    <p className="font-bold text-foreground mb-1">{title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="px-5 py-20 flex flex-col items-center text-center gap-6 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center shadow-lg">
            <span className="text-primary-foreground text-3xl font-bold">İ</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Fark yaratmaya hazır mısın?
          </h2>
          <p className="text-sm text-muted-foreground">
            Erken erişim listesine katıl, İyiBiri'yi ilk kullananlardan ol.
          </p>
          <WaitlistForm />
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border px-5 py-8">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">İ</span>
            </div>
            <span className="text-sm font-bold text-foreground">İyiBiri</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © 2026 İyiBiri. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-4">
            <Link href="/auth/login"  className="text-xs text-muted-foreground hover:text-foreground">Giriş</Link>
            <Link href="/auth/signup" className="text-xs text-muted-foreground hover:text-foreground">Üye Ol</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
