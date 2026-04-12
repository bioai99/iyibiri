"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Users, Sparkles, Phone, ArrowRight } from "lucide-react";
import { submitSupport } from "@/app/support-action";
import Logo from "@/components/logo";

const SUPPORT_OPTIONS = [
  {
    id: "feedback",
    icon: MessageSquare,
    title: "Geri Bildirim Paylaş",
    desc: "Görüş ve önerilerin projemizi şekillendirir.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    id: "referral",
    icon: Users,
    title: "STK veya Marka Öner",
    desc: "Ekosistemimize dahil olması gerekenleri bildirin.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

export default function TesekkurlerClient() {
  const params    = useSearchParams();
  const email     = params.get("email") ?? "";
  const fullName  = params.get("name")  ?? "";
  const firstName = fullName.split(" ")[0] || "İyiBiri";

  const [selected,   setSelected]   = useState<string[]>([]);
  const [message,    setMessage]    = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError,  setFormError]  = useState("");

  function toggleOption(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormStatus("loading");
    const fd = new FormData();
    if (email)   fd.append("email", email);
    if (message) fd.append("message", message);
    selected.forEach((s) => fd.append("support_type", s));
    const result = await submitSupport(fd);
    if (result.success) {
      setFormStatus("success");
    } else {
      setFormStatus("error");
      setFormError(result.error ?? "Bir hata oluştu.");
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] font-sans">

      {/* ── Header ── */}
      <header className="px-6 py-5 flex items-center justify-between">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <a
          href="tel:+905312970397"
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          <Phone size={13} />
          +90 531 297 0397
        </a>
      </header>

      <main className="max-w-xl mx-auto px-6 pb-20">

        {/* ── Hero ── */}
        <section className="pt-8 pb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Aramızdasın
          </div>

          {/* Headline */}
          <h1 className="font-headline text-[2.6rem] font-extrabold leading-[1.1] tracking-tight text-gray-900 mb-5">
            Hoş geldin,{" "}
            <span className="italic text-amber-500">{firstName}.</span>
          </h1>

          <p className="text-gray-500 text-base leading-relaxed max-w-sm mb-10">
            İyiBiri olmak için önemli bir adım attın. Uygulama hazır olduğunda
            seni ilk haberdar edeceğiz.
          </p>

          {/* Visual block — quote card */}
          <div className="relative rounded-2xl overflow-hidden h-48 bg-[#1B3A5C]">
            {/* Decorative blobs */}
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-amber-400/20 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/5 blur-xl" />
            {/* Stat strip */}
            <div className="absolute top-5 left-6 right-6 flex items-center gap-5">
              {[
                { val: "1.200+", label: "Erken kullanıcı" },
                { val: "40+",    label: "Aktif görev"     },
                { val: "4",      label: "İyilik Öncüsü"   },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-headline text-xl font-extrabold text-amber-400">{s.val}</p>
                  <p className="text-white/40 text-[10px] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            {/* Quote */}
            <div className="absolute bottom-5 left-6 right-6">
              <p className="font-headline text-white font-bold text-base leading-snug">
                "İyilik, paylaştıkça çoğalan tek hazinedir."
              </p>
            </div>
          </div>
        </section>

        {/* ── Support ── */}
        <section className="mb-10">
          <h2 className="font-headline text-xl font-bold text-gray-900 mb-1">
            Katkıda Bulunmaya Devam Et
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            İyiBiri olmak zaten en büyük destek — ama istersen daha fazlasını da yapabilirsin.
          </p>

          {/* Bento grid */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {SUPPORT_OPTIONS.map((opt) => {
              const active = selected.includes(opt.id);
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleOption(opt.id)}
                  className={`group relative flex flex-col justify-between p-5 rounded-2xl text-left transition-all duration-200 min-h-[156px] border ${
                    active
                      ? "bg-white border-[#1B3A5C] shadow-sm"
                      : "bg-white border-transparent shadow-sm hover:border-gray-200"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${opt.bg} mb-4`}>
                    <Icon size={18} className={opt.color} />
                  </div>
                  <div>
                    <p className={`font-headline font-bold text-sm leading-snug mb-1 ${active ? "text-[#1B3A5C]" : "text-gray-800"}`}>
                      {opt.title}
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">{opt.desc}</p>
                  </div>
                  {active && (
                    <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#1B3A5C] flex items-center justify-center">
                      <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Full-width partnership card */}
          {(() => {
            const active = selected.includes("investment");
            return (
              <button
                type="button"
                onClick={() => toggleOption("investment")}
                className={`w-full flex items-center gap-5 p-5 rounded-2xl text-left transition-all duration-200 border ${
                  active
                    ? "bg-white border-[#1B3A5C] shadow-sm"
                    : "bg-white border-transparent shadow-sm hover:border-gray-200"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#1B3A5C] flex items-center justify-center flex-shrink-0">
                  <Sparkles size={18} className="text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className={`font-headline font-bold text-sm mb-0.5 ${active ? "text-[#1B3A5C]" : "text-gray-800"}`}>
                    Daha Fazla Destek
                  </p>
                  <p className="text-xs text-gray-400">
                    İyiBiri olmak ötesinde katkıda bulunmak istiyorsan konuşalım.
                  </p>
                </div>
                {active ? (
                  <div className="w-5 h-5 rounded-full bg-[#1B3A5C] flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                ) : (
                  <ArrowRight size={16} className="text-gray-300 flex-shrink-0" />
                )}
              </button>
            );
          })()}
        </section>

        {/* ── Message + CTA ── */}
        {formStatus === "success" ? (
          <div className="bg-white rounded-2xl px-6 py-10 text-center shadow-sm mb-8">
            <div className="w-12 h-12 rounded-full bg-[#1B3A5C] flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 20 20" fill="none" className="w-6 h-6">
                <path d="M4 10l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="font-headline font-bold text-gray-800 mb-1">Mesajın alındı</p>
            <p className="text-sm text-gray-400">En kısa sürede seninle iletişime geçeceğim.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-2">
                Mesaj <span className="font-normal normal-case tracking-normal text-gray-300">(isteğe bağlı)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Düşüncelerini veya yönlendirmek istediğin bir bağlantıyı buraya yazabilirsin…"
                rows={3}
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#1B3A5C] resize-none placeholder:text-gray-300 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={formStatus === "loading" || (selected.length === 0 && !message.trim())}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-headline font-bold text-sm text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              style={{ background: "linear-gradient(135deg, #1B3A5C 0%, #2d5a8e 100%)" }}
            >
              {formStatus === "loading" ? "Gönderiliyor…" : (
                <>Devam Et <ArrowRight size={16} /></>
              )}
            </button>

            {formStatus === "error" && (
              <p className="text-xs text-red-500 text-center">{formError}</p>
            )}
          </form>
        )}

        {/* ── Phone ── */}
        <div className="flex flex-col items-center gap-2 py-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">Sorunuz mu var?</p>
          <a
            href="tel:+905312970397"
            className="font-headline font-bold text-[#1B3A5C] text-xl hover:opacity-70 transition-opacity flex items-center gap-2"
          >
            <Phone size={16} />
            +90 531 297 0397
          </a>
          <p className="text-xs text-gray-300">Arama veya WhatsApp</p>
        </div>

        <div className="text-center pt-4">
          <Link href="/" className="text-xs text-gray-300 hover:text-gray-500 transition-colors">
            Ana sayfaya dön
          </Link>
        </div>

      </main>
    </div>
  );
}
