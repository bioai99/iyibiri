import { notFound } from "next/navigation";
import CompleteClient from "./complete-client";
import { MISSIONS } from "@/lib/mock-data";

export default function CompleteMissionPage({ params }: { params: { id: string } }) {
  const mission = MISSIONS.find((m) => m.id === params.id);
  if (!mission) notFound();
  return <CompleteClient mission={mission} />;
}
