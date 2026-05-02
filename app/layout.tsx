import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { CommandProvider } from "@/components/ui/command-provider";
import { ThemeProvider } from "@/lib/theme";
import { WebVitals } from "./web-vitals";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "İyiBiri",
  description: "Gönüllü ol, Karma biriktir, fark yarat.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "İyiBiri — İyilik biriktirilir.",
    description: "Gönüllü ol, Karma biriktir, fark yarat.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
    locale: "tr_TR",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "İyiBiri",
  },
};

export const viewport: Viewport = {
  themeColor: "#E8C268",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={cn(jakarta.variable, fraunces.variable)}
    >
      <head>
        {/*
          Faz 7 (2026-05-02 perf-eng) — DNS preconnect / preconnect resource hints.
          Tarayıcıya kritik 3rd-party domain'lere TLS handshake'i image fetch'inden
          ÖNCE yapmasını söylüyor. /missions ve /dashboard 5+ Unsplash image yüklüyor —
          ilk image request'in TTFB'sinden 50-150ms tıraş. Sıfır UX riski.
        */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
          <>
            <link
              rel="preconnect"
              href={new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin}
              crossOrigin="anonymous"
            />
            <link
              rel="dns-prefetch"
              href={new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin}
            />
          </>
        ) : null}
      </head>
      <body className="font-sans">
        <WebVitals />
        <ThemeProvider initial="dark">
          <CommandProvider>
            {children}
            <Toaster />
          </CommandProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
