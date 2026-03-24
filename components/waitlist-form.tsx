"use client";

import { useState } from "react";
import { joinWaitlist } from "@/app/waitlist-action";
import { Button } from "@/components/ui/button";

export default function WaitlistForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const formData = new FormData(e.currentTarget);
    const result = await joinWaitlist(formData);
    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setMessage(result.error ?? "Bir hata oluştu.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <span className="text-3xl">🎉</span>
        <p className="font-bold text-foreground">Listeye alındın!</p>
        <p className="text-sm text-muted-foreground text-center">
          İyiBiri hazır olduğunda seni ilk haberdar edeceğiz.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
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
        {status === "loading" ? "Kaydediliyor…" : "Erken Erişime Katıl"}
      </Button>
      {status === "error" && (
        <p className="text-xs text-destructive w-full">{message}</p>
      )}
    </form>
  );
}
