"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function TakeMission({ missionId }: { missionId: string }) {
  const router = useRouter();

  function handleTake() {
    // Aktif görevleri localStorage'da tutuyoruz (Supabase entegrasyonuna kadar)
    const active: string[] = JSON.parse(localStorage.getItem("iyibiri_active_missions") || "[]");
    if (!active.includes(missionId)) {
      localStorage.setItem("iyibiri_active_missions", JSON.stringify([...active, missionId]));
    }
    router.push("/dashboard/my-missions");
  }

  return (
    <Button size="lg" className="w-full" onClick={handleTake}>
      Görevi Al
    </Button>
  );
}
