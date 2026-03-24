"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { MISSIONS, type Category } from "@/lib/mock-data";
import MissionCard from "@/components/mission-card";

const CATEGORIES: Category[] = ["Hepsi", "Çevre", "Eğitim", "Sağlık", "Hayvanlar", "Kültür"];

export default function MissionsClient() {
  const [active, setActive] = useState<Category>("Hepsi");
  const [query, setQuery] = useState("");

  const filtered = MISSIONS.filter((m) => {
    const matchCat = active === "Hepsi" || m.category === active;
    const matchQ = m.title.toLowerCase().includes(query.toLowerCase()) ||
                   m.ngo.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <>
      {/* Arama */}
      <div className="px-5 pt-4 pb-2">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Görev veya STK ara…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-ring placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Kategori filtresi */}
      <div className="flex gap-2 px-5 pb-4 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`flex-shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors ${
              active === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-secondary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Görev listesi */}
      <div className="px-5 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            Bu kategoride görev bulunamadı.
          </div>
        ) : (
          filtered.map((m) => <MissionCard key={m.id} mission={m} />)
        )}
      </div>
    </>
  );
}
