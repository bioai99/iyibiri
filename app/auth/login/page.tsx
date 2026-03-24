import Link from "next/link";
import { Suspense } from "react";
import { signIn } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthFeedback from "@/components/auth-feedback";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      {/* Logo */}
      <Link href="/" className="flex flex-col items-center gap-2 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-md">
          <span className="text-primary-foreground text-2xl font-bold">İ</span>
        </div>
        <span className="text-xl font-bold text-foreground">İyiBiri</span>
      </Link>

      {/* Kart */}
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-sm border border-border p-6">
        <h1 className="text-xl font-bold text-foreground mb-1">Tekrar hoş geldin</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Görevlerin seni bekliyor.
        </p>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="ad@ornek.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Şifre</Label>
              <Link
                href="/auth/reset-password"
                className="text-xs text-primary hover:underline"
              >
                Şifremi unuttum
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <Suspense>
            <AuthFeedback />
          </Suspense>

          <Button formAction={signIn} className="w-full mt-1" size="lg">
            Giriş Yap
          </Button>
        </form>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Hesabın yok mu?{" "}
        <Link href="/auth/signup" className="text-primary font-medium hover:underline">
          Üye ol
        </Link>
      </p>
    </main>
  );
}
