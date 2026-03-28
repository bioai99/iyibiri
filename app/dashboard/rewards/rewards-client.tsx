"use client";

import { useState } from "react";
import { Zap, Lock } from "lucide-react";
import { REWARDS, MOCK_USER } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

type RewardFilter = "all" | "unlocked" | "locked";

export default function RewardsClient() {
  const userKarma = MOCK_USER.totalKarma;
  const [filter, setFilter] = useState<RewardFilter>("all");
  const [redeemedId, setRedeemedId] = useState<string | null>(null);

  const filtered = REWARDS.filter((r) => {
    if (filter === "unlocked") return userKarma >= r.karmaRequired;
    if (filter === "locked")   return userKarma < r.karmaRequired;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border px-5 py-4">
        <h1 className="text-base font-bold text-foreground">Ödüller</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Toplam Karman:{" "}
          <span className="font-bold text-primary">{userKarma.toLocaleString("tr")} Karma</span>
        </p>
      </header>

      {/* Filtreler */}
      <div className="flex gap-2 px-5 py-4">
        {(["all", "unlocked", "locked"] as RewardFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-secondary"
            }`}
          >
            {f === "all" ? "Tümü" : f === "unlocked" ? "✅ Alınabilir" : "🔒 Kilitli"}
          </button>
        ))}
      </div>

      {/* Ödül listesi */}
      <div className="px-5 flex flex-col gap-3">
        {filtered.map((reward) => {
          const unlocked = userKarma >= reward.karmaRequired;
          const redeemed = redeemedId === reward.id;

          return (
            <div
              key={reward.id}
              className={`bg-card rounded-2xl border p-4 flex gap-4 transition-opacity ${
                unlocked ? "border-border" : "border-border opacity-60"
              }`}
            >
              {/* Emoji */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${
                unlocked ? "bg-primary/10" : "bg-muted"
              }`}>
                {reward.emoji}
              </div>

              {/* İçerik */}
              <div className="flex-1 flex flex-col gap-1">
                <p className="text-xs text-trust font-semibold">{reward.brand}</p>
                <p className="text-sm font-bold text-foreground leading-snug">{reward.title}</p>
                <p className="text-xs text-muted-foreground">{reward.description}</p>

                <div className="flex items-center justify-between mt-2">
                  <span className="flex items-center gap-1 text-xs font-bold text-primary">
                    <Zap size={12} className="fill-primary" />
                    {reward.karmaRequired.toLocaleString("tr")} Karma
                  </span>

                  {unlocked ? (
                    redeemed ? (
                      <span className="text-xs font-bold text-impact bg-impact/10 px-3 py-1.5 rounded-xl">
                        Alındı ✓
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setRedeemedId(reward.id)}
                        className="h-8 px-3 text-xs"
                      >
                        Kodu Al
                      </Button>
                    )
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Lock size={11} />
                      {(reward.karmaRequired - userKarma).toLocaleString("tr")} Karma eksik
                    </span>
                  )}
                </div>

                {/* Kod gösterimi */}
                {redeemed && (
                  <div className="mt-2 bg-muted rounded-xl px-3 py-2 text-center">
                    <p className="text-xs text-muted-foreground mb-0.5">İndirim Kodun</p>
                    <p className="font-mono font-bold text-foreground tracking-widest">
                      IYIBIRI-{reward.id.toUpperCase()}2026
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
