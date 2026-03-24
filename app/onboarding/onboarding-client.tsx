"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: "✦",
    iconBg: "bg-primary",
    iconColor: "text-primary-foreground",
    tag: "Hoş Geldin",
    title: "İyilik\nyapmak\neğlenceli.",
    description:
      "İyiBiri'de sivil toplum kuruluşlarıyla ortaklık kurarak gerçek fark yaratan görevleri tamamlıyor, XP kazanıyor ve ödüller alıyorsun.",
  },
  {
    icon: "◎",
    iconBg: "bg-trust",
    iconColor: "text-trust-foreground",
    tag: "Görevler",
    title: "STK'lardan\ngerçek\ngörevler.",
    description:
      "TEMA Vakfı'ndan ÇYDD'ye, onlarca güvenilir STK'nın oluşturduğu görevleri al. Her görevin arkasında gerçek bir etki var.",
  },
  {
    icon: "★",
    iconBg: "bg-primary",
    iconColor: "text-primary-foreground",
    tag: "Kazan",
    title: "Her iyilik\nXP\nkazandırır.",
    description:
      "Görevi tamamla, XP kazan, seviye atla. Rozetler, özel ödüller ve topluluk sıralamasında yerini al.",
  },
  {
    icon: "❋",
    iconBg: "bg-impact",
    iconColor: "text-impact-foreground",
    tag: "Topluluk",
    title: "Birlikte\ndaha\niyisini.",
    description:
      "Binlerce İyiBiri ile aynı hedef doğrultusunda ilerle. Tek başına küçük olan her iyilik, birlikte büyük bir değişime dönüşür.",
  },
];

export default function OnboardingClient() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [exiting, setExiting] = useState(false);

  // Daha önce onboarding gördüyse direkt anasayfa
  useEffect(() => {
    if (localStorage.getItem("iyibiri_onboarding_done") === "1") {
      router.replace("/");
    }
  }, [router]);

  function finish() {
    localStorage.setItem("iyibiri_onboarding_done", "1");
    router.push("/onboarding/quiz");
  }

  function next() {
    if (current === steps.length - 1) {
      finish();
      return;
    }
    setExiting(true);
    setTimeout(() => {
      setCurrent((c) => c + 1);
      setExiting(false);
    }, 180);
  }

  function skip() {
    finish();
  }

  const step = steps[current];
  const isLast = current === steps.length - 1;

  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* Üst bar */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4">
        {/* İlerleme noktaları */}
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 bg-primary"
                  : i < current
                  ? "w-3 bg-primary/40"
                  : "w-3 bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Atla */}
        {!isLast && (
          <button
            onClick={skip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Atla
          </button>
        )}
      </div>

      {/* İçerik */}
      <div
        className={`flex-1 flex flex-col px-6 pt-10 pb-8 transition-opacity duration-180 ${
          exiting ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* İkon */}
        <div
          className={`w-20 h-20 rounded-3xl ${step.iconBg} flex items-center justify-center shadow-lg mb-8 select-none`}
        >
          <span className={`${step.iconColor} text-4xl`}>{step.icon}</span>
        </div>

        {/* Tag */}
        <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
          {step.tag}
        </span>

        {/* Başlık */}
        <h1 className="text-4xl font-bold text-foreground leading-tight mb-6 whitespace-pre-line">
          {step.title}
        </h1>

        {/* Açıklama */}
        <p className="text-base text-muted-foreground leading-relaxed max-w-xs">
          {step.description}
        </p>
      </div>

      {/* Alt buton */}
      <div className="px-6 pb-12">
        <Button size="lg" className="w-full" onClick={next}>
          {isLast ? "Başlayalım" : "İleri"}
        </Button>

        {isLast && (
          <button
            onClick={() => router.push("/auth/login")}
            className="w-full mt-3 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Zaten hesabım var — Giriş yap
          </button>
        )}
      </div>
    </main>
  );
}
