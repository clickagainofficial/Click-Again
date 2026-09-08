import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { site } from "@/site.config";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Marketing that makes them come back`,
    template: `%s | ${site.name}`,
  },
  description:
    "One click is a sale. Click again is a business. We create marketing that makes people connect with your brand — and come back to it. Launching soon.",
  keywords: [
    "marketing agency",
    "digital marketing",
    "brand strategy",
    "Click Again",
    "clickagain.in",
  ],
  openGraph: {
    title: `${site.name} — Coming Soon`,
    description:
      "We don't sell fixed marketing packages. We find what your business actually needs.",
    url: site.url,
    siteName: site.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Coming Soon`,
    description: "One click is a sale. Click again is a business.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f2f1ec",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
