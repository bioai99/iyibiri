"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitSupport(formData: FormData) {
  const email      = (formData.get("email") as string)?.trim().toLowerCase();
  const message    = (formData.get("message") as string)?.trim();
  const types      = formData.getAll("support_type") as string[];

  if (!message && types.length === 0) return { error: "Lütfen bir mesaj yaz veya destek türü seç." };

  const supabase = createClient();
  const { error } = await supabase.from("support_requests").insert({
    email:        email || null,
    support_type: types,
    message:      message || null,
  });

  if (error) return { error: "Bir hata oluştu, tekrar dene." };
  return { success: true };
}
