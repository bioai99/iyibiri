import { Suspense } from "react";
import TesekkurlerClient from "./tesekkurler-client";

export default function TesekkurlerPage() {
  return (
    <Suspense>
      <TesekkurlerClient />
    </Suspense>
  );
}
