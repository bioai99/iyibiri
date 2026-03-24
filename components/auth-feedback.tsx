"use client";

import { useSearchParams } from "next/navigation";

// Giriş/üyelik formlarında hata ve başarı mesajlarını gösterir.
// Server Action redirect'ten gelen ?error= veya ?success=1 param'larını okur.
export default function AuthFeedback() {
  const params = useSearchParams();
  const error = params.get("error");
  const success = params.get("success");

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
        {decodeURIComponent(error)}
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-lg bg-impact/10 border border-impact/20 px-4 py-3 text-sm text-impact">
        E-postanı kontrol et — doğrulama bağlantısı gönderdik.
      </div>
    );
  }

  return null;
}
