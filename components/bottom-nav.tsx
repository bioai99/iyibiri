"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Target, Trophy, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard",          icon: Home,   label: "Ana Sayfa" },
  { href: "/dashboard/missions", icon: Target, label: "Görevler"  },
  { href: "/dashboard/rewards",  icon: Trophy, label: "Ödüller"   },
  { href: "/dashboard/profile",  icon: User,   label: "Profil"    },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-colors ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                className={active ? "fill-primary/10" : ""}
              />
              <span className={`text-[10px] font-medium ${active ? "font-semibold" : ""}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
