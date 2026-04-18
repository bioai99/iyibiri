import { getTierName } from "@/lib/mock-data";

interface KarmaBarProps {
  level: number;
  karma: number;
  karmaToNext: number;
}

export default function KarmaBar({ level, karma, karmaToNext }: KarmaBarProps) {
  const pct = Math.min((karma / karmaToNext) * 100, 100);
  const tierName = getTierName(level);
  const nextTierName = getTierName(level + 1);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-foreground">{tierName}</span>
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
      {nextTierName !== tierName && (
        <p className="text-[10px] text-muted-foreground">
          {(karmaToNext - karma).toLocaleString("tr")} Karma daha → {nextTierName}
        </p>
      )}
    </div>
  );
}
