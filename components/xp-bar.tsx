import { getTierName } from "@/lib/mock-data";

interface KarmaBarProps {
  level: number;
  karma: number;
  karmaToNext: number;
}

export default function KarmaBar({ level, karma, karmaToNext }: KarmaBarProps) {
  const pct = Math.min((karma / karmaToNext) * 100, 100);
  const tierName = getTierName(level);

  return (
    <div className="flex items-center gap-3">
      {/* Tier rozeti */}
      <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
        <span className="text-primary-foreground text-[10px] font-bold leading-tight text-center px-1">
          ⚡<br />{level}
        </span>
      </div>

      {/* Bar */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold text-foreground">{tierName}</span>
          <span className="text-xs text-muted-foreground">
            {karma.toLocaleString("tr")} / {karmaToNext.toLocaleString("tr")} Karma
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          {karmaToNext - karma} Karma daha → {getTierName(level + 1) !== tierName ? getTierName(level + 1) : "Sonraki seviye"}
        </p>
      </div>
    </div>
  );
}
