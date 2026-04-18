import { ArrowLeft, Lock, Footprints, Leaf, BookOpen, Flame, TreePine, Star, Shield, Calendar, Trophy } from "lucide-react";
import Link from "next/link";
import { MOCK_USER } from "@/lib/mock-data";
import type { LucideIcon } from "lucide-react";

const BADGES: { id: string; name: string; icon: LucideIcon; desc: string; earned: boolean }[] = [
  { id: "1", name: "İlk Adım",       icon: Footprints, desc: "İlk görevini tamamla",         earned: true  },
  { id: "2", name: "Çevre Dostu",    icon: Leaf,       desc: "İlk doğa görevi",               earned: true  },
  { id: "3", name: "Eğitim Elçisi",  icon: BookOpen,   desc: "İlk eğitim görevi",             earned: true  },
  { id: "4", name: "3 Aylık Seri",   icon: Flame,      desc: "3 ay üst üste görev tamamla",  earned: true  },
  { id: "5", name: "TEMA Destekçisi",icon: TreePine,   desc: "TEMA ile 3 görev tamamla",      earned: true  },
  { id: "6", name: "5 Görev",        icon: Star,       desc: "5 görev tamamla",               earned: true  },
  { id: "7", name: "Süper Gönüllü", icon: Shield,     desc: "20 görev tamamla",              earned: false },
  { id: "8", name: "Yıl Boyu",       icon: Calendar,   desc: "12 aylık seri yap",             earned: false },
  { id: "9", name: "100 Görev",      icon: Trophy,     desc: "100 görev tamamla",             earned: false },
];

const earned = BADGES.filter((b) => b.earned);
const locked = BADGES.filter((b) => !b.earned);

export default function BadgesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border px-5 py-4 flex items-center gap-3">
        <Link href="/dashboard/profile" className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-sm font-bold text-foreground flex-1">Rozetlerim</h1>
      </header>

      <div className="px-5 py-5 flex flex-col gap-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: String(earned.length), label: "Kazanılan", color: "text-primary"  },
            { value: "3",                    label: "Bu Ay",     color: "text-trust"    },
            { value: `${MOCK_USER.streak}`, label: "Aylık Seri", color: "text-impact"  },
          ].map(({ value, label, color }) => (
            <div key={label} className="bg-card border border-border rounded-2xl p-3 text-center">
              <p className={`font-bold text-lg ${color}`}>{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Kazanılan */}
        <section>
          <h2 className="text-sm font-bold text-foreground mb-3">Kazanılan Rozetler</h2>
          <div className="grid grid-cols-3 gap-3">
            {earned.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.id} className="bg-card border-2 border-primary/30 rounded-2xl p-3 flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon size={20} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <p className="text-[11px] font-semibold text-foreground text-center leading-tight">{b.name}</p>
                  <p className="text-[10px] text-muted-foreground text-center leading-tight">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Kilitli */}
        <section>
          <h2 className="text-sm font-bold text-foreground mb-3">Kilitli Rozetler</h2>
          <div className="grid grid-cols-3 gap-3">
            {locked.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.id} className="bg-card border border-border rounded-2xl p-3 flex flex-col items-center gap-1.5 opacity-50">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <Icon size={20} className="text-muted-foreground" strokeWidth={1.5} />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-muted-foreground rounded-full flex items-center justify-center">
                      <Lock size={8} className="text-background" />
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold text-foreground text-center leading-tight">{b.name}</p>
                  <p className="text-[10px] text-muted-foreground text-center leading-tight">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Progress teaser */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} className="text-trust" strokeWidth={1.5} />
            <p className="text-sm font-semibold text-foreground">
              Süper Gönüllü rozetine yaklaşıyorsun
            </p>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-1.5">
            <div className="h-full bg-impact rounded-full" style={{ width: `${(MOCK_USER.completedMissions / 20) * 100}%` }} />
          </div>
          <p className="text-xs text-muted-foreground">
            {MOCK_USER.completedMissions} / 20 görev tamamlandı
          </p>
        </div>
      </div>
    </div>
  );
}
