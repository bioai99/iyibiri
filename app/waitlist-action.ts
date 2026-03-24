"use server";

import { createClient } from "@/lib/supabase-server";

export async function joinWaitlist(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) return { error: "E-posta adresi gerekli." };

  const supabase = createClient();
  const { error } = await supabase.from("waitlist").insert({ email });

  if (error) {
    if (error.code === "23505") return { error: "Bu e-posta zaten kayıtlı." };
    return { error: "Bir hata oluştu, tekrar dene." };
  }

  return { success: true };
}
