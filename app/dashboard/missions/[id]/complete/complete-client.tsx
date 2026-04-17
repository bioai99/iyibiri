"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Zap, CheckCircle, Camera } from "lucide-react";
import type { Mission } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

const VERIFY_LABELS: Record<string, string> = {
  photo: "Fotoğraf Yükle",
  code:  "Onay Kodunu Gir",
  qr:    "QR Kodu Tara",
  auto:  "Otomatik Doğrulanıyor",
};

export default function CompleteClient({ mission }: { mission: Mission }) {
  const router = useRouter();
  const [code, setCode]         = useState("");
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    // Görevi aktiflerden kaldır, tamamlananlar listesine ekle
    const active: string[] = JSON.parse(localStorage.getItem("iyibiri_active_missions") || "[]");
    localStorage.setItem("iyibiri_active_missions", JSON.stringify(active.filter((id) => id !== mission.id)));
    const done: string[] = JSON.parse(localStorage.getItem("iyibiri_done_missions") || "[]");
    localStorage.setItem("iyibiri_done_missions", JSON.stringify([...done, mission.id]));
    setSubmitted(true);
  }

  // ── Başarı ekranı ──
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center gap-6">
        <div className="w-24 h-24 rounded-3xl bg-impact/10 flex items-center justify-center">
          <CheckCircle size={44} className="text-impact" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-2xl font-headline font-bold text-foreground mb-2">Görev tamamlandı.</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Doğrulaman incelemeye alındı.<br />
            Onaylandığında <span className="font-bold text-primary">+{mission.karma} Karma</span> hesabına geçer.
          </p>
        </div>
        {mission.impactStatement && (
          <div className="bg-secondary border border-border rounded-2xl px-4 py-3 w-full max-w-xs">
            <p className="text-xs text-muted-foreground text-center leading-relaxed italic">{mission.impactStatement}</p>
          </div>
        )}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl px-5 py-4 flex items-center gap-3 w-full max-w-xs">
          <Zap size={22} className="text-primary fill-primary/20 flex-shrink-0" />
          <div className="text-left">
            <p className="text-sm font-bold text-foreground">+{mission.karma} Karma geliyor</p>
            <p className="text-xs text-muted-foreground">STK onayı bekleniyor</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button size="lg" className="w-full" onClick={() => router.push("/dashboard")}>
            Ana Sayfaya Dön
          </Button>
          <Link href="/dashboard/missions" className="text-sm text-center text-primary font-medium hover:underline">
            Yeni Görev Bul
          </Link>
        </div>
      </div>
    );
  }

  // ── Tamamlama formu ──
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border px-5 py-4 flex items-center gap-3">
        <Link href={`/dashboard/missions/${mission.id}`} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-sm font-bold text-foreground">Görevi Tamamla</h1>
      </header>

      <div className="flex-1 px-5 py-5 flex flex-col gap-5 pb-32">
        {/* Görev özeti */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <p className="text-xs text-trust font-semibold mb-1">{mission.ngo}</p>
          <p className="text-sm font-bold text-foreground">{mission.title}</p>
        </div>

        {/* Doğrulama yöntemi başlığı */}
        <div>
          <h2 className="text-base font-bold text-foreground mb-1">
            {VERIFY_LABELS[mission.verifyMethod]}
          </h2>
          <p className="text-sm text-muted-foreground">{mission.verifyHint}</p>
        </div>

        {/* Doğrulama inputu */}
        {mission.verifyMethod === "photo" && (
          <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border rounded-2xl p-8 cursor-pointer hover:border-primary/50 transition-colors bg-muted/30">
            <Upload size={28} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {fileName || "Fotoğraf seç veya sürükle"}
            </span>
            <span className="text-xs text-muted-foreground">JPG, PNG — max 10MB</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
            />
          </label>
        )}

        {mission.verifyMethod === "code" && (
          <input
            type="text"
            placeholder="Onay kodunu gir"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={8}
            className="w-full bg-card border border-border rounded-2xl px-4 py-4 text-center text-lg font-bold tracking-[0.3em] outline-none focus:border-primary placeholder:text-muted-foreground placeholder:tracking-normal placeholder:text-base placeholder:font-normal"
          />
        )}

        {mission.verifyMethod === "qr" && (
          <div className="flex flex-col items-center gap-4 bg-card border border-border rounded-2xl p-8">
            <div className="w-32 h-32 bg-muted rounded-2xl flex items-center justify-center">
              <Camera size={36} className="text-muted-foreground" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Kamera ile etkinlik QR kodunu tara
            </p>
            <Button variant="outline" size="lg" className="w-full">
              Kamerayı Aç
            </Button>
          </div>
        )}

        {mission.verifyMethod === "auto" && (
          <div className="bg-impact/10 border border-impact/20 rounded-2xl px-4 py-4 text-center">
            <p className="text-sm font-bold text-impact mb-1">Otomatik doğrulanacak</p>
            <p className="text-xs text-muted-foreground">
              Bağışın açıklamasında <span className="font-mono font-bold">#iyibiri</span> varsa sistem otomatik algılar. Doğrulama 24 saat içinde tamamlanır.
            </p>
          </div>
        )}
      </div>

      {/* Alt buton */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-5 py-4">
        <Button
          size="lg"
          className="w-full"
          onClick={handleSubmit}
          disabled={
            (mission.verifyMethod === "code" && code.length < 4) ||
            (mission.verifyMethod === "photo" && !fileName)
          }
        >
          Gönder
        </Button>
      </div>
    </div>
  );
}
