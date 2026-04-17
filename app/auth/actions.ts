"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
    let msg = error.message;
    if (error.message.includes("already registered") || error.message.includes("User already registered")) {
      msg = "Bu e-posta adresi zaten kayıtlı.";
    }
    redirect(`/auth/signup?error=${encodeURIComponent(msg)}`);
  }

  redirect("/auth/signup?success=1");
}

export async function signIn(formData: FormData) {
  const supabase = createClient();
  const email    = formData.get("email")    as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    let msg = "E-posta veya şifre hatalı.";
    if (error.message.includes("Email not confirmed")) {
      msg = "E-postanı henüz doğrulamadın. Gelen kutunu kontrol et.";
    }
    redirect(`/auth/login?error=${encodeURIComponent(msg)}`);
  }

  redirect("/dashboard");
}

export async function signInWithGoogle() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${SITE_URL}/auth/callback`,
      queryParams: { prompt: "select_account" },
    },
  });

  if (error || !data.url) {
    redirect(`/auth/login?error=${encodeURIComponent("Google girişi başlatılamadı.")}`);
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
