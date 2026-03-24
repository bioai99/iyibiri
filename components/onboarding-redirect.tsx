"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Ana sayfaya ilk kez gelen kullanıcıyı onboarding'e yönlendirir.
export default function OnboardingRedirect() {
  const router = useRouter();

  useEffect(() => {
    const done = localStorage.getItem("iyibiri_onboarding_done");
    if (!done) {
      router.replace("/onboarding");
    }
  }, [router]);

  return null;
}
