import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const fullName  = user?.user_metadata?.full_name as string | undefined;
  const firstName = fullName ? fullName.split(" ")[0] : "Kullanıcı";

  return (
    <div className="flex flex-col">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Hoş geldin</p>
          <h1 className="text-base font-bold text-foreground leading-tight">{firstName}</h1>
        </div>
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-muted hover:bg-secondary transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>
      </header>

      <DashboardClient firstName={firstName} />
    </div>
  );
}
