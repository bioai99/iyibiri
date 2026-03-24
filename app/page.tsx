import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OnboardingRedirect from "@/components/onboarding-redirect";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-12">
      <OnboardingRedirect />

      {/* Logo */}
      <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center shadow-lg mb-6">
        <span className="text-primary-foreground text-5xl font-bold select-none">İ</span>
      </div>

      <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">İyiBiri</h1>
      <p className="text-muted-foreground text-center mb-10 max-w-xs">
        Görevler yap, ödüller kazan, fark yarat.
      </p>

      {/* Badge'ler */}
      <div className="flex gap-2 mb-10">
        <Badge>Gamification</Badge>
        <Badge variant="secondary">STK Ortaklıkları</Badge>
        <Badge variant="outline">Beta</Badge>
      </div>

      {/* Özellik kartları */}
      <div className="grid grid-cols-1 gap-4 w-full max-w-sm mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gerçek Görevler</CardTitle>
            <CardDescription>
              STK'larla ortaklık kurulmuş, gerçek etki yaratan görevler.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">40+ aktif görev</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kazan & İlerle</CardTitle>
            <CardDescription>
              Her görev XP ve ödül kazandırır. Seviye atla, rozetler topla.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">1.240 aktif kullanıcı</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Butonlar */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        <Link href="/auth/signup" className="w-full">
          <Button size="lg" className="w-full">Üye Ol</Button>
        </Link>
        <Link href="/auth/login" className="w-full">
          <Button size="lg" variant="outline" className="w-full">Giriş Yap</Button>
        </Link>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">© 2026 İyiBiri. Tüm hakları saklıdır.</p>
    </main>
  );
}
