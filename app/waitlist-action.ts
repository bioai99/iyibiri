"use server";

import { createClient } from "@/lib/supabase-server";

export async function joinWaitlist(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const name  = (formData.get("name")  as string)?.trim();

  if (!email) return { error: "E-posta adresi gerekli." };
  if (!name)  return { error: "Ad soyad gerekli." };

  const supabase = createClient();
  const { error } = await supabase.from("waitlist").insert({ email, name });

  if (error) {
    console.error("Waitlist insert error:", error);
    if (error.code === "23505") return { error: "Bu e-posta zaten kayıtlı." };
    return { error: `Kayıt sırasında hata oluştu: ${error.message}` };
  }

  return { success: true };
}
