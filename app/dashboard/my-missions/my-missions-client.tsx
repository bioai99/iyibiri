"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Zap, ChevronRight, CheckCircle2, Target } from "lucide-react";
import { MISSIONS, NGO_BASE_MISSIONS, CATEGORY_COLORS } from "@/lib/mock-data";

const ALL_MISSIONS = [...MISSIONS, ...NGO_BASE_MISSIONS];

export default function MyMissionsClient() {
  const [activeIds, setActiveIds]       = useState<string[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [tab, setTab]                   = useState<"active" | "completed">("active");

  useEffect(() => {
    setActiveIds(JSON.parse(localStorage.getItem("iyibiri_active_missions") || "[]"));
    setCompletedIds(JSON.parse(localStorage.getItem("iyibiri_completed_missions") || "[]"));
  }, []);

  const activeMissions    = ALL_MISSIONS.filter((m) => activeIds.includes(m.id));
  const completedMissions = ALL_MISSIONS.filter((m) => completedIds.includes(m.id));

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border px-5 pt-12 pb-0">
        <h1 className="text-xl font-headline font-bold text-foreground mb-3">Benimkiler</h1>
        {/* Tabs */}
        <div className="flex">
          {(["active", "completed"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 pb-2.5 text-sm font-semibold transition-colors border-b-2 ${
                tab === t
                  ? "text-foreground border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {t === "active" ? `Aktif Görevler` : "Tamamlananlar"}
              {t === "active" && activeMissions.length > 0 && (
                <span className="ml-1.5 text-[10px] bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                  {activeMissions.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 py-5">
        {tab === "active" ? (
          activeMissions.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 gap-5">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Target size={36} className="text-primary" strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <p className="font-headline font-bold text-lg text-foreground">Henüz Görev Almadın</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Gönüllü olmak için bir görev seç ve etki yaratmaya başla!
                </p>
              </div>
              <div className="w-full bg-card border border-border rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <Zap size={18} className="text-primary fill-primary/20 shrink-0" />
                  <p className="text-sm font-medium text-foreground">Her görev Karma kazandırır</p>
                  <ChevronRight size={14} className="text-muted-foreground ml-auto shrink-0" />
                </div>
              </div>
              <Link
                href="/dashboard/missions"
                className="w-full bg-primary text-primary-foreground font-bold text-sm py-3.5 rounded-2xl text-center block"
                style={{ boxShadow: "0 4px 20px rgba(242,183,5,0.35)" }}
              >
                Görevleri Keşfet
              </Link>
              <p className="text-xs text-muted-foreground">Sana özel {MISSIONS.length} görev seni bekliyor</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {activeMissions.map((m) => (
                <Link key={m.id} href={`/dashboard/missions/${m.id}/complete`}>
                  <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3 active:scale-[0.99] transition-transform">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-trust">{m.ngo}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${CATEGORY_COLORS[m.category]}`}>
                          {m.category}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-foreground leading-snug">{m.title}</p>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock size={11} /> {m.duration}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                          <Zap size={11} className="fill-primary" /> +{m.karma} Karma
                        </span>
                      </div>
                    </div>
                    <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-xl shrink-0">
                      Tamamla →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          completedMissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <CheckCircle2 size={48} className="text-muted-foreground/30" strokeWidth={1.2} />
              <p className="text-sm font-semibold text-foreground">Henüz tamamlanan görev yok</p>
              <p className="text-xs text-muted-foreground text-center">Aktif görevlerini tamamlayarak buraya taşı.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {completedMissions.map((m) => (
                <div key={m.id} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3 opacity-75">
                  <CheckCircle2 size={20} className="text-impact shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{m.title}</p>
                    <span className="flex items-center gap-1 text-xs font-semibold text-impact">
                      <Zap size={11} /> +{m.karma} Karma kazanıldı
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
