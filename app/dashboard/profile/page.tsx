import { createClient } from "@/lib/supabase-server";
import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const fullName = user?.user_metadata?.full_name as string | undefined;
  const email    = user?.email ?? "";

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border px-5 py-4">
        <h1 className="text-base font-bold text-foreground">Profil</h1>
      </header>

      <div className="px-5 py-6 flex flex-col gap-4">
        {/* Kullanıcı bilgileri */}
        <div className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground text-xl font-bold">
              {fullName ? fullName[0].toUpperCase() : "?"}
            </span>
          </div>
          <div>
            <p className="font-bold text-foreground">{fullName ?? "İsimsiz"}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>

        {/* Çıkış */}
        <form>
          <Button
            formAction={signOut}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Çıkış Yap
          </Button>
        </form>
      </div>
    </div>
  );
}
