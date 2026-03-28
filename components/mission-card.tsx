import Link from "next/link";
import { Clock, Users, Zap } from "lucide-react";
import type { Mission } from "@/lib/mock-data";
import { CATEGORY_COLORS, DIFFICULTY_COLORS } from "@/lib/mock-data";

interface MissionCardProps {
  mission: Mission;
}

export default function MissionCard({ mission }: MissionCardProps) {
  return (
    <Link href={`/dashboard/missions/${mission.id}`}>
      <div className="bg-card rounded-2xl border border-border p-4 flex flex-col gap-3 hover:shadow-md transition-shadow active:scale-[0.99]">
        {/* Üst: NGO + kategori */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-trust">{mission.ngo}</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[mission.category]}`}>
            {mission.category}
          </span>
        </div>

        {/* Başlık */}
        <h3 className="text-sm font-bold text-foreground leading-snug">
          {mission.title}
        </h3>

        {/* Açıklama */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {mission.description}
        </p>

        {/* Alt: meta bilgiler */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={12} />
              {mission.duration}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users size={12} />
              {mission.participants}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[mission.difficulty]}`}>
              {mission.difficulty}
            </span>
            <span className="flex items-center gap-0.5 text-xs font-bold text-primary">
              <Zap size={12} className="fill-primary" />
              +{mission.karma} Karma
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
