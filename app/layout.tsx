import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-headline", weight: ["400","500","600","700","800"] });

export const metadata: Metadata = {
  title: "İyiBiri",
  description: "İyiBiri — İyi insanlarla bağlantı kur",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "İyiBiri",
  },
};

export const viewport: Viewport = {
  themeColor: "#F2B705",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={cn("font-sans", inter.variable, jakarta.variable)}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
