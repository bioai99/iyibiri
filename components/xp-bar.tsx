interface XpBarProps {
  level: number;
  xp: number;
  xpToNext: number;
}

export default function XpBar({ level, xp, xpToNext }: XpBarProps) {
  const pct = Math.min((xp / xpToNext) * 100, 100);

  return (
    <div className="flex items-center gap-3">
      {/* Seviye rozeti */}
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
        <span className="text-primary-foreground text-xs font-bold leading-none">
          Sv<br />{level}
        </span>
      </div>

      {/* Bar */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-foreground">Seviye {level}</span>
          <span className="text-xs text-muted-foreground">{xp.toLocaleString("tr")} / {xpToNext.toLocaleString("tr")} XP</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
