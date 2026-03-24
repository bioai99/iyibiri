import { Bell, Flame } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { MOCK_USER, MISSIONS } from "@/lib/mock-data";
import XpBar from "@/components/xp-bar";
import MissionCard from "@/components/mission-card";

const featured = MISSIONS.filter((m) => m.featured);

const STATS = [
  { label: "Tamamlanan",  value: MOCK_USER.completedMissions,                    unit: "görev" },
  { label: "Seri",        value: MOCK_USER.streak,                                unit: "gün"   },
  { label: "Toplam XP",   value: MOCK_USER.totalXp.toLocaleString("tr"), unit: "xp"    },
];

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const fullName = user?.user_metadata?.full_name as string | undefined;
  const firstName = fullName ? fullName.split(" ")[0] : "Kullanıcı";

  return (
    <div className="flex flex-col">
      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Hoş geldin</p>
          <h1 className="text-base font-bold text-foreground">{firstName} ✦</h1>
        </div>
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-muted hover:bg-secondary transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>
      </header>

      <div className="px-5 py-5 flex flex-col gap-6">
        {/* ── Seviye kartı ── */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <XpBar
            level={MOCK_USER.level}
            xp={MOCK_USER.xp}
            xpToNext={MOCK_USER.xpToNext}
          />
        </div>

        {/* ── İstatistikler ── */}
        <div className="grid grid-cols-3 gap-3">
          {STATS.map(({ label, value, unit }) => (
            <div key={label} className="bg-card rounded-2xl border border-border p-3 flex flex-col gap-0.5">
              <span className="text-lg font-bold text-foreground leading-tight">{value}</span>
              <span className="text-[10px] text-muted-foreground leading-tight">{unit}</span>
              <span className="text-[10px] font-medium text-foreground/60 mt-1">{label}</span>
            </div>
          ))}
        </div>

        {/* ── Seri banner ── */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl px-4 py-3 flex items-center gap-3">
          <Flame size={22} className="text-primary flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-foreground">{MOCK_USER.streak} günlük seri!</p>
            <p className="text-xs text-muted-foreground">Bugün bir görev yap, seriyi koru.</p>
          </div>
        </div>

        {/* ── Öne çıkan görevler ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground">Öne Çıkan Görevler</h2>
            <Link href="/dashboard/missions" className="text-xs text-primary font-medium hover:underline">
              Tümü →
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {featured.map((m) => (
              <MissionCard key={m.id} mission={m} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
