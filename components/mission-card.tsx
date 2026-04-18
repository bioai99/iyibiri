import Link from "next/link";
import { Clock, Users, Zap } from "lucide-react";
import type { Mission } from "@/lib/mock-data";
import { CATEGORY_COLORS, CATEGORY_PHOTOS, DIFFICULTY_COLORS } from "@/lib/mock-data";

interface MissionCardProps {
  mission: Mission;
}

export default function MissionCard({ mission }: MissionCardProps) {
  const photo = CATEGORY_PHOTOS[mission.category];

  return (
    <Link href={`/dashboard/missions/${mission.id}`}>
      <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow active:scale-[0.99]">
        {/* Photo header */}
        <div className="relative h-24 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-2.5 left-3 flex items-center gap-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm ${CATEGORY_COLORS[mission.category]}`}>
              {mission.category}
            </span>
            <span className="text-[10px] font-medium text-white/80">{mission.ngo}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2.5">
          <h3 className="text-sm font-bold text-foreground leading-snug">
            {mission.title}
          </h3>

          {mission.impactStatement && (
            <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-primary/40 pl-2.5">
              {mission.impactStatement}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock size={11} />
                {mission.duration}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users size={11} />
                {mission.participants.toLocaleString("tr-TR")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[mission.difficulty]}`}>
                {mission.difficulty}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-primary">
                <Zap size={11} className="fill-primary" />
                +{mission.karma}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
