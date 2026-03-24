"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Zap, ChevronRight } from "lucide-react";
import { MISSIONS, DIFFICULTY_COLORS, CATEGORY_COLORS } from "@/lib/mock-data";

export default function MyMissionsClient() {
  const [activeIds, setActiveIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("iyibiri_active_missions") || "[]");
    setActiveIds(stored);
  }, []);

  const activeMissions = MISSIONS.filter((m) => activeIds.includes(m.id));

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border px-5 py-4 flex items-center gap-3">
        <Link href="/dashboard" className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-sm font-bold text-foreground">Aktif Görevlerim</h1>
          {activeMissions.length > 0 && (
            <p className="text-xs text-muted-foreground">{activeMissions.length} görev devam ediyor</p>
          )}
        </div>
      </header>

      <div className="px-5 py-5">
        {activeMissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="text-5xl">📋</span>
            <p className="text-sm font-semibold text-foreground">Henüz aktif görevin yok</p>
            <p className="text-xs text-muted-foreground text-center">
              Görev listesinden sana uygun birini seç ve başla.
            </p>
            <Link href="/dashboard/missions" className="text-sm font-semibold text-primary hover:underline">
              Görevleri İncele →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {activeMissions.map((m) => (
              <Link key={m.id} href={`/dashboard/missions/${m.id}/complete`}>
                <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-trust">{m.ngo}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[m.category]}`}>
                        {m.category}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-foreground leading-snug">{m.title}</p>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock size={11} /> {m.duration}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                        <Zap size={11} className="fill-primary" /> +{m.xp} XP
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-xl">
                      Tamamla
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
