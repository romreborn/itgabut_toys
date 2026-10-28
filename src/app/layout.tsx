import type { Metadata } from "next";
import { Baloo_2, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import DisableRightClick from "@/components/DisableRightClick";
import PageViewTracker from "@/components/PageViewTracker";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { DEFAULT_OG_IMAGE, INSTAGRAM_URL, SHOPEE_URL, SITE_URL, GA_MEASUREMENT_ID } from "@/lib/constants";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Jual Blokees Tangerang, Figure & Blind Box | ITGabut Toys",
    template: "%s | ITGabut Toys",
  },
  description:
    "Jual Blokees online dan di Citra Raya, Tangerang: Transformers, Marvel, Ultraman, Star Wars. Diskon 10%, COD Alam Sutera & Gading Serpong, kirim se-Indonesia.",
  keywords: [
    "Blokees",
    "jual Blokees",
    "jual Blokees Tangerang",
    "jual Blokees online",
    "beli Blokees online",
    "jual figure Blokees Tangerang",
    "Blokees Indonesia",
    "action figure Citra Raya",
    "action figure Alam Sutera",
    "action figure Gading Serpong",
    "blind box Tangerang",
    "kirim Blokees luar pulau",
    "ITGabut Toys",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "ITGabut Toys",
    title: "Jual Blokees Tangerang, Figure & Blind Box | ITGabut Toys",
    description:
      "Jual Blokees online dari Citra Raya, Tangerang. Ambil di toko, COD Alam Sutera dan Gading Serpong, atau kirim ke seluruh Indonesia sampai luar pulau.",
    url: SITE_URL,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "ITGabut Toys, jual Blokees Tangerang" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jual Blokees Tangerang, Figure & Blind Box | ITGabut Toys",
    description: "Jual Blokees online dari Citra Raya, Tangerang. Ambil di toko, COD Alam Sutera dan Gading Serpong, atau kirim ke seluruh Indonesia.",
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/logo.png",
  },
};

// One graph for the whole site: the website, the brand (with logo) and the physical store.
// Every node links by @id so search and AI engines read them as a single entity.
const ORG_ID = `${SITE_URL}/#organization`;
const STORE_ID = `${SITE_URL}/#store`;
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "ITGabut Toys",
      inLanguage: "id-ID",
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "ITGabut Toys",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
      sameAs: [INSTAGRAM_URL, SHOPEE_URL],
    },
    {
      "@type": "ToyStore",
      "@id": STORE_ID,
      name: "ITGabut Toys",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
      description:
        "Jual Blokees online dan di toko Citra Raya, Tangerang. Ambil di toko, COD Alam Sutera dan Gading Serpong, atau kirim ke seluruh Indonesia termasuk luar pulau, dipacking dus tebal dan bubble wrap.",
      telephone: "+6285111043518",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Perumahan Citra Raya",
        addressLocality: "Tangerang",
        addressRegion: "Banten",
        addressCountry: "ID",
      },
      hasMap: "https://www.google.com/maps/search/?api=1&query=Citra+Raya+Tangerang",
      areaServed: ["Citra Raya", "Alam Sutera", "Gading Serpong", "Tangerang", "Indonesia"],
      parentOrganization: { "@id": ORG_ID },
      sameAs: [INSTAGRAM_URL, SHOPEE_URL],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${baloo.variable} ${jakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Langsung ke konten
        </a>
        <DisableRightClick />
        <PageViewTracker />
        <LanguageProvider>
          <CartProvider>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <Toast />
          </CartProvider>
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics id={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
