export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      {/* Logo / İkon */}
      <div className="w-24 h-24 rounded-3xl bg-[#F2B705] flex items-center justify-center shadow-lg mb-8">
        <span className="text-white text-5xl font-bold select-none">İ</span>
      </div>

      {/* Başlık */}
      <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
        İyiBiri
      </h1>
      <p className="text-lg text-gray-500 text-center mb-12 max-w-xs">
        İyi insanlarla bağlantı kur. Birlikte daha iyisini yap.
      </p>

      {/* Butonlar */}
      <div className="w-full max-w-xs flex flex-col gap-4">
        <button className="w-full py-4 rounded-2xl bg-[#F2B705] text-white font-semibold text-lg shadow-md hover:bg-yellow-500 transition-colors">
          Başla
        </button>
        <button className="w-full py-4 rounded-2xl border-2 border-[#F2B705] text-[#F2B705] font-semibold text-lg hover:bg-yellow-50 transition-colors">
          Giriş Yap
        </button>
      </div>

      {/* Alt bilgi */}
      <p className="mt-12 text-xs text-gray-400">
        © 2026 İyiBiri. Tüm hakları saklıdır.
      </p>
    </main>
  );
}
