"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const supabase = createClient();
  const email    = formData.get("email")    as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    const msg = encodeURIComponent(
      error.message.includes("already registered")
        ? "Bu e-posta adresi zaten kayıtlı."
        : error.message
    );
    redirect(`/auth/signup?error=${msg}`);
  }

  redirect("/auth/signup?success=1");
}

export async function signIn(formData: FormData) {
  const supabase = createClient();
  const email    = formData.get("email")    as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/auth/login?error=E-posta+veya+%C5%9Fifre+hatal%C4%B1.");
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
