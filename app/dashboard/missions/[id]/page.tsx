import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Users, Zap, CheckCircle } from "lucide-react";
import { MISSIONS, CATEGORY_COLORS, DIFFICULTY_COLORS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import TakeMission from "./take-mission";


export default function MissionDetailPage({ params }: { params: { id: string } }) {
  const mission = MISSIONS.find((m) => m.id === params.id);
  if (!mission) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border px-5 py-4 flex items-center gap-3">
        <Link href="/dashboard/missions" className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-sm font-bold text-foreground flex-1 truncate">{mission.title}</h1>
      </header>

      <div className="flex-1 px-5 py-5 flex flex-col gap-5 pb-32">
        {/* STK + Kategori */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-trust">{mission.ngo}</span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[mission.category]}`}>
            {mission.category}
          </span>
        </div>

        {/* Başlık */}
        <h2 className="text-xl font-bold text-foreground leading-snug">{mission.title}</h2>

        {/* Meta */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock size={14} /> {mission.duration}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users size={14} /> {mission.participants} kişi yaptı
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[mission.difficulty]}`}>
            {mission.difficulty}
          </span>
        </div>

        {/* Karma */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl px-4 py-3 flex items-center gap-3">
          <Zap size={20} className="text-primary fill-primary/30" />
          <div>
            <p className="text-sm font-bold text-foreground">+{mission.karma} Karma kazanacaksın</p>
            <p className="text-xs text-muted-foreground">Görev onaylandıktan sonra hesabına geçer</p>
          </div>
        </div>

        {/* Açıklama */}
        <div>
          <h3 className="text-sm font-bold text-foreground mb-2">Görev Hakkında</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{mission.longDescription}</p>
        </div>

        {/* Adımlar */}
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3">Nasıl Yapılır?</h3>
          <div className="flex flex-col gap-2">
            {mission.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <p className="text-sm text-foreground leading-snug pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Doğrulama yöntemi */}
        <div className="bg-muted rounded-2xl px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={14} className="text-impact" />
            <span className="text-xs font-bold text-foreground">Nasıl doğrulanır?</span>
          </div>
          <p className="text-xs text-muted-foreground">{mission.verifyHint}</p>
        </div>
      </div>

      {/* Sabit alt buton */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-5 py-4">
        <TakeMission missionId={mission.id} />
      </div>
    </div>
  );
}
