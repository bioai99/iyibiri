/** @type {import('next').NextConfig} */
const nextConfig = {
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
