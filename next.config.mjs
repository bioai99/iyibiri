/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.tema.org.tr" },
      { protocol: "https", hostname: "www.tog.org.tr" },
      { protocol: "https", hostname: "www.cydd.org.tr" },
      { protocol: "https", hostname: "www.haytap.org" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
};

export default nextConfig;
