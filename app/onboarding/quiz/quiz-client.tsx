"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export type QuizAnswers = {
  ageGroup: string;
  domain: string;
  availability: string;
  style: string;
};

const QUESTIONS = [
  {
    key: "ageGroup",
    question: "Kaç yaşındasın?",
    subtitle: "Sana uygun görevleri belirlemek için.",
    options: [
      { value: "18-25", label: "18 – 25" },
      { value: "26-35", label: "26 – 35" },
      { value: "36-50", label: "36 – 50" },
      { value: "50+",   label: "50 +"    },
    ],
  },
  {
    key: "domain",
    question: "Sana göre en anlamlı iyilik hangisi?",
    subtitle: "İstediğin zaman değiştirebilirsin.",
    options: [
      { value: "financial", label: "❤️  Finansal Destek"     },
      { value: "education", label: "📚  Eğitim & Mentorluk"  },
      { value: "nature",    label: "🌿  Doğa & Çevre"        },
      { value: "social",    label: "🤝  Sosyal Sorumluluk"   },
    ],
  },
  {
    key: "availability",
    question: "Haftada ne kadar vaktin var?",
    subtitle: "Görev sürelerini buna göre ayarlayacağız.",
    options: [
      { value: "micro",  label: "⚡  15 dakika — hızlı görevler" },
      { value: "hour",   label: "🕐  1 saat"                     },
      { value: "half",   label: "☀️  Yarım gün veya daha fazlası" },
    ],
  },
  {
    key: "style",
    question: "Nasıl iyilik yapmak istersin?",
    subtitle: "Her ikisi de mümkün, sadece tercihini öğrenmek istiyoruz.",
    options: [
      { value: "remote",  label: "💻  Evden / dijital" },
      { value: "outside", label: "🚶  Dışarı çıkarak"  },
      { value: "both",    label: "✌️  İkisi de olur"   },
    ],
  },
];

export default function QuizClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [exiting, setExiting] = useState(false);

  const q = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  function choose(value: string) {
    setSelected(value);
  }

  function next() {
    if (!selected) return;
    const updated = { ...answers, [q.key]: selected };
    setAnswers(updated);

    if (isLast) {
      localStorage.setItem("iyibiri_quiz", JSON.stringify(updated));
      router.push("/auth/signup");
      return;
    }

    setExiting(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setSelected(null);
      setExiting(false);
    }, 180);
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* Üst bar */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground font-medium">
            {step + 1} / {QUESTIONS.length}
          </span>
          <button
            onClick={() => router.push("/auth/signup")}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Atla
          </button>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* İçerik */}
      <div
        className={`flex-1 px-6 flex flex-col transition-opacity duration-180 ${
          exiting ? "opacity-0" : "opacity-100"
        }`}
      >
        <h1 className="text-2xl font-bold text-foreground mb-1 leading-snug">
          {q.question}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">{q.subtitle}</p>

        <div className="flex flex-col gap-3">
          {q.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => choose(opt.value)}
              className={`w-full text-left px-4 py-4 rounded-2xl border-2 transition-all font-medium text-sm ${
                selected === opt.value
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alt buton */}
      <div className="px-6 pb-12 pt-6">
        <Button
          size="lg"
          className="w-full"
          disabled={!selected}
          onClick={next}
        >
          {isLast ? "Profili Oluştur" : "Devam Et"}
        </Button>
      </div>
    </main>
  );
}
