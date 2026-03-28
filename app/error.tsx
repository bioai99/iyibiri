"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="text-4xl">😕</p>
      <h2 className="text-lg font-bold text-foreground">Bir şeyler ters gitti</h2>
      <button
        onClick={reset}
        className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-xl"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
