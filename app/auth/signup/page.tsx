import Link from "next/link";
import { Suspense } from "react";
import { signUp } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthFeedback from "@/components/auth-feedback";

export default function SignupPage() {
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
        <h1 className="text-xl font-bold text-foreground mb-1">Aramıza katıl</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Görevler yap, ödüller kazan, fark yarat.
        </p>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fullName">Ad Soyad</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Ada Lovelace"
              required
              autoComplete="name"
            />
          </div>

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
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="En az 8 karakter"
              minLength={8}
              required
              autoComplete="new-password"
            />
          </div>

          <Suspense>
            <AuthFeedback />
          </Suspense>

          <Button formAction={signUp} className="w-full mt-1" size="lg">
            Üye Ol
          </Button>
        </form>

        <p className="mt-4 text-xs text-muted-foreground text-center">
          Üye olarak{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Kullanım Şartları
          </Link>
          'nı kabul etmiş olursunuz.
        </p>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Zaten hesabın var mı?{" "}
        <Link href="/auth/login" className="text-primary font-medium hover:underline">
          Giriş yap
        </Link>
      </p>
    </main>
  );
}
