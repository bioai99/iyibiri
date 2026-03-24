import { createBrowserClient } from "@supabase/ssr";

// Client component'lerde kullanılan Supabase client'ı.
// Session'ı otomatik cookie'de tutar.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
