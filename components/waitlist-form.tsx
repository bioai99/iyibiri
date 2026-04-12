"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinWaitlist } from "@/app/waitlist-action";
import { Button } from "@/components/ui/button";

export default function WaitlistForm() {
  const router  = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error,  setError]  = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const name  = (formData.get("name")  as string)?.trim();
    const result = await joinWaitlist(formData);
    if (result.success) {
      router.push(`/tesekkurler?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`);
    } else {
      setStatus("error");
      setError(result.error ?? "Bir hata oluştu.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md">
      <input
        name="name"
        type="text"
        required
        placeholder="Adın Soyadın"
        className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground"
      />
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          name="email"
          type="email"
          required
          placeholder="e-posta adresin"
          className="flex-1 bg-white border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground"
        />
        <Button
          type="submit"
          size="lg"
          disabled={status === "loading"}
          className="whitespace-nowrap"
        >
          {status === "loading" ? "Kaydediliyor…" : "Katıl"}
        </Button>
      </div>
      {status === "error" && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </form>
  );
}
