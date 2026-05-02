/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vol-56-G: Next.js 14.2'de staleTimes.dynamic default 0 → dinamik sayfalar
  // (dashboard/missions/donate/profile vs.) bottom nav'dan dönüşte ALWAYS
  // fresh server-fetch yapıyor, 1 sn skeleton flicker user'ı yıpratıyordu.
  // staleTimes.dynamic = 60 sn → tab switch'leri seamless (router cache aktif).
  // Gerçek güncel data isteyen sayfalar (mission take sonrası vb.) zaten
  // router.refresh() ile cache invalidate edebilir.
  // Static (çoğu liste sayfası) 5 dk → daha uzun seamless cache.
  experimental: {
    staleTimes: {
      dynamic: 60,
      static: 300,
    },
  },
  images: {
    // Faz 1 (2026-04-26 perf-eng): Unsplash + Supabase Storage + AVIF/WebP eklendi.
    // Mission cover (Unsplash full-size 850ms) → Next Image Optimization API üzerinden
    // sized + WebP/AVIF dönüşüm ile -%80 transfer hedefi.
    remotePatterns: [
      { protocol: "https", hostname: "www.tema.org.tr" },
      { protocol: "https", hostname: "www.tog.org.tr" },
      { protocol: "https", hostname: "www.cydd.org.tr" },
      { protocol: "https", hostname: "www.haytap.org" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Vol-43: Clearbit Logo API — public/free brand logo CDN (sponsor logoları)
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 420, 640, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
};

// Faz 7 (2026-05-02 perf-eng): @next/bundle-analyzer opsiyonel entegrasyon.
// `npm run analyze` → ANALYZE=true next build → .next/analyze/*.html.
// ANALYZE=true değilse paket import edilmiyor — bu sayede `npm install`
// öncesi prod build'leri kırılmaz.
let configWithAnalyzer = nextConfig;
if (process.env.ANALYZE === "true") {
  const bundleAnalyzer = (await import("@next/bundle-analyzer")).default({
    enabled: true,
  });
  configWithAnalyzer = bundleAnalyzer(nextConfig);
}

export default configWithAnalyzer;
