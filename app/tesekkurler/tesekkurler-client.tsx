"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Phone, Share2, MessageCircle } from "lucide-react";
import Logo from "@/components/logo";

export default function TesekkurlerClient() {
  const params    = useSearchParams();
  const email     = params.get("email") ?? "";
  const fullName  = params.get("name")  ?? "";
  const firstName = fullName.split(" ")[0] || "İyiBiri";

  const shareText = encodeURIComponent(
    `İyiBiri'ye katıldım! Türkiye'nin ilk iyilik & Karma platformuna sen de katıl 👉 iyibiri.app`
  );
  const whatsappUrl = `https://wa.me/?text=${shareText}`;

  return (
    <div className="min-h-screen bg-[#fafaf8] font-sans">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-[#fafaf8]/95 backdrop-blur-sm px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <a
          href="tel:+905312970397"
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1.5"
        >
          <Phone size={13} />
          <span className="hidden sm:inline">+90 531 297 0397</span>
          <span className="sm:hidden">Ara</span>
        </a>
      </header>

      <main className="max-w-xl mx-auto px-6 pb-24">

        {/* ── Hero ── */}
        <section className="pt-10 pb-14">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Aramızdasın
          </div>

          {/* Headline */}
          <h1 className="font-headline text-[2.4rem] font-extrabold leading-[1.15] tracking-tight text-gray-900 mb-4">
            Aramıza hoş geldin,{" "}
            <span className="italic text-amber-500">{firstName}.</span>
          </h1>

          <p className="text-gray-500 text-base leading-relaxed max-w-sm mb-2">
            İyiBiri olmak için önemli bir adım attın.
            Uygulama hazır olduğunda seni ilk haberdar edeceğiz.
          </p>
          {email && <p className="text-gray-300 text-sm">{email}</p>}
        </section>

        {/* ── Visual card ── */}
        <div className="relative rounded-2xl overflow-hidden mb-12 bg-[#1B3A5C]" style={{ minHeight: 180 }}>
          <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-amber-400/15 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5 blur-2xl" />

          {/* Stats */}
          <div className="relative px-7 pt-7 pb-6 flex flex-col gap-6">
            <div className="flex items-center gap-8">
              {[
                { val: "1.200+", label: "Erken kullanıcı" },
                { val: "40+",    label: "Aktif görev"     },
                { val: "4",      label: "İyilik Öncüsü"   },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-headline text-2xl font-extrabold text-amber-400 leading-none">{s.val}</p>
                  <p className="text-white/40 text-[10px] mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="font-headline text-white font-bold text-base leading-snug max-w-xs">
              "İyilik, paylaştıkça çoğalan tek hazinedir."
            </p>
          </div>
        </div>

        {/* ── Referral ── */}
        <section className="flex flex-col gap-4 mb-14">
          <h2 className="font-headline text-lg font-bold text-gray-900">
            Çevrenle paylaş
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed -mt-1">
            İyi insanları bir araya getiriyoruz. Değer verdiğin birine ilet.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#25D366] hover:shadow-sm transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
              <MessageCircle size={20} className="text-[#25D366]" />
            </div>
            <div className="flex-1">
              <p className="font-headline font-bold text-sm text-gray-800">WhatsApp ile paylaş</p>
              <p className="text-xs text-gray-400 mt-0.5">Arkadaşlarına iyibiri.app'i ilet</p>
            </div>
            <Share2 size={15} className="text-gray-300 group-hover:text-[#25D366] transition-colors" />
          </a>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: "İyiBiri", text: "İyiBiri'ye katıl!", url: "https://iyibiri.app" });
              } else {
                navigator.clipboard.writeText("https://iyibiri.app");
              }
            }}
            className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 hover:shadow-sm transition-all group text-left"
          >
            <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
              <Share2 size={18} className="text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="font-headline font-bold text-sm text-gray-800">Linki kopyala / paylaş</p>
              <p className="text-xs text-gray-400 mt-0.5">iyibiri.app</p>
            </div>
          </button>
        </section>

        {/* ── Phone ── */}
        <div className="flex flex-col items-center gap-2 py-8 border-t border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Soru & İletişim</p>
          <a
            href="tel:+905312970397"
            className="font-headline font-bold text-[#1B3A5C] text-2xl hover:opacity-70 transition-opacity"
          >
            +90 531 297 0397
          </a>
          <p className="text-xs text-gray-300">Arama veya WhatsApp</p>
        </div>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-gray-300 hover:text-gray-500 transition-colors">
            Ana sayfaya dön
          </Link>
        </div>

      </main>
    </div>
  );
}
