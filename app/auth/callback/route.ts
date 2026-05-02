import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

// Supabase e-posta doğrulama ve OAuth callback'lerini işler.
// Doğrulama linkine tıklanınca Supabase buraya yönlendirir,
// code → session token'a çevrilir, kullanıcı dashboard'a gönderilir.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code  = searchParams.get("code");
  const next  = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Vol-56-A: Apple/Google OAuth için defansif profile sync.
      // Migration 053 trigger'ı çoğu zaman halleder ama Apple bazen meta'yı
      // gecikmeli yazıyor — burada user.user_metadata'dan first_name çıkarıp
      // profile'da boşsa direkt yaz. handle_user_meta_update trigger'ı zaten
      // tekrar tetiklenmez çünkü meta UPDATE yapmıyoruz.
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const meta = (user.user_metadata ?? {}) as Record<string, unknown> & {
            name?: string | { firstName?: string; lastName?: string };
          };
          const apple = typeof meta.name === 'object' ? meta.name : null;
          const fullName =
            (typeof meta.full_name === 'string' && meta.full_name) ||
            (typeof meta.name === 'string' && meta.name) ||
            (apple ? `${apple.firstName ?? ''} ${apple.lastName ?? ''}`.trim() : '') ||
            (typeof meta.given_name === 'string' && typeof meta.family_name === 'string'
              ? `${meta.given_name} ${meta.family_name}`.trim()
              : '') ||
            '';
          const firstName =
            (typeof meta.first_name === 'string' && meta.first_name) ||
            (typeof meta.given_name === 'string' && meta.given_name) ||
            apple?.firstName ||
            (fullName.split(/\s+/)[0] ?? '');

          if (firstName || fullName) {
            // Sadece NULL/boşsa yaz — manuel düzenlemeyi ezme
            const { data: existing } = await supabase
              .from('profiles')
              .select('first_name, full_name')
              .eq('id', user.id)
              .maybeSingle();
            const updates: Record<string, string> = {};
            if (firstName && (!existing?.first_name || existing.first_name === '')) {
              updates.first_name = firstName;
            }
            if (fullName && (!existing?.full_name || existing.full_name === '')) {
              updates.full_name = fullName;
            }
            if (Object.keys(updates).length > 0) {
              await supabase.from('profiles').update(updates).eq('id', user.id);
            }
          }
        }
      } catch (syncErr) {
        // Sessizce yut — auth flow'u kırma. Trigger fallback'ı zaten devrede.
        console.error('[auth-callback] OAuth profile sync failed:', syncErr);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Hata durumunda login'e gönder
  return NextResponse.redirect(`${origin}/auth/login?error=Doğrulama+başarısız.`);
}
