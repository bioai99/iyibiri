import { ArrowLeft, Leaf, BookOpen, Heart, Utensils, Users, Star, Activity, Palette, Building2, PawPrint } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

const CATEGORIES: { name: string; icon: LucideIcon; count: number; selected: boolean }[] = [
  { name: "Çevre & Doğa",     icon: Leaf,      count: 12, selected: true  },
  { name: "Eğitim",           icon: BookOpen,  count: 8,  selected: true  },
  { name: "Hayvan Hakları",   icon: PawPrint,  count: 5,  selected: true  },
  { name: "Gıda Güvenliği",   icon: Utensils,  count: 4,  selected: false },
  { name: "Engelli Hakları",  icon: Users,     count: 3,  selected: false },
  { name: "Yaşlı Bakımı",     icon: Heart,     count: 6,  selected: false },
  { name: "Çocuk Hakları",    icon: Star,      count: 7,  selected: false },
  { name: "Sağlık",           icon: Activity,  count: 9,  selected: false },
  { name: "Kültür & Sanat",   icon: Palette,   count: 5,  selected: false },
  { name: "Toplum Kalkınma",  icon: Building2, count: 11, selected: false },
];

export default function InterestsPage() {
  const selected = CATEGORIES.filter((c) => c.selected);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border px-5 py-4 flex items-center gap-3">
        <Link href="/dashboard/profile" className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-sm font-bold text-foreground flex-1">İlgi Alanlarım</h1>
        <button className="text-sm font-semibold text-primary">Kaydet</button>
      </header>

      <div className="px-5 py-5 flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Seçtiğin alanlara göre görevler önerilir. En az 2 alan seç.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className={`relative rounded-2xl p-4 flex flex-col items-center gap-2 border-2 transition-colors ${
                  cat.selected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                {cat.selected && (
                  <div className="absolute top-2.5 right-2.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-[8px] text-primary-foreground font-bold leading-none">✓</span>
                  </div>
                )}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  cat.selected ? "bg-primary/10" : "bg-secondary"
                }`}>
                  <Icon size={18} className={cat.selected ? "text-primary" : "text-muted-foreground"} strokeWidth={1.5} />
                </div>
                <p className="text-xs font-semibold text-foreground text-center leading-tight">{cat.name}</p>
                <p className="text-[10px] text-muted-foreground">{cat.count} görev</p>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          {selected.length} alan seçildi
        </p>
      </div>
    </div>
  );
}
