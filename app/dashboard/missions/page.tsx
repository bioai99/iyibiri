import MissionsClient from "./missions-client";

export default function MissionsPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border px-5 py-4">
        <h1 className="text-base font-bold text-foreground">Görevler</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{8} görev seni bekliyor</p>
      </header>

      <MissionsClient />
    </div>
  );
}
