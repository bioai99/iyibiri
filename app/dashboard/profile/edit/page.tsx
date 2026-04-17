import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

export default async function ProfileEditPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? "";
  const phone    = user?.phone ?? "";
  const email    = user?.email ?? "";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border px-5 py-4 flex items-center gap-3">
        <Link href="/dashboard/profile" className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-sm font-bold text-foreground flex-1">Hesap Bilgileri</h1>
      </header>

      <div className="px-5 py-5 flex flex-col gap-4">
        <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
          {[
            { label: "Ad Soyad",  value: fullName,  editable: true  },
            { label: "Telefon",   value: phone || "—", editable: false },
            { label: "E-posta",  value: email || "—", editable: true  },
          ].map(({ label, value, editable }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3.5">
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
                <p className={`text-sm ${editable ? "text-foreground" : "text-muted-foreground"}`}>{value}</p>
              </div>
              {!editable && <Lock size={13} className="text-muted-foreground shrink-0" />}
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center px-4">
          Hesap düzenleme özelliği yakında aktif olacak.
        </p>
      </div>
    </div>
  );
}
