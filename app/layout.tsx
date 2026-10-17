import type { Metadata, Viewport } from "next";
import { Caveat, Inter, Poppins } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";
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

/** Only the founder's note is set in this — it is the one place on the site
 *  where a person is talking, so it is written by hand. */
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-hand",
  display: "swap",
});

/** The name first, then what it is — "Click Again" plus "agency" is the
 *  search we most need to win, and a title is read left to right. */
const homeTitle = `${site.name} — Digital Marketing Agency in Madurai`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: homeTitle,
    template: `%s | ${site.name}`,
  },
  description:
    "Click Again is a digital marketing agency in Madurai — strategy, creative, websites, social, ads and retention. We get you customers, and keep them coming back.",
  keywords: [
    "marketing agency",
    "digital marketing",
    "brand strategy",
    "Click Again",
    "clickagain.in",
  ],
  openGraph: {
    title: homeTitle,
    description:
      "Click Again is a digital marketing agency in Madurai — strategy, creative, websites, social, ads and retention. We find what your business actually needs.",
    url: site.url,
    siteName: site.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: "One click is a sale. Click again is a business.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  // the peach ground, so the phone's browser chrome matches the page
  themeColor: "#fff6f0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      className={`${poppins.variable} ${inter.variable} ${caveat.variable}`}
    >
      <body>
        {/* the business and the site, stated once for every page below */}
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        {children}
      </body>
    </html>
  );
}
