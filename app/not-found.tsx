import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="text-4xl">🔍</p>
      <h2 className="text-lg font-bold text-foreground">Sayfa bulunamadı</h2>
      <Link href="/" className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-xl">
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
