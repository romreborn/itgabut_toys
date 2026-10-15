import type { Metadata } from "next";
import { Baloo_2, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
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
import { SITE_URL, GA_MEASUREMENT_ID } from "@/lib/constants";

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
    "Jual Blokees di Citra Raya, Tangerang: Transformers, Marvel, Ultraman, Star Wars, blind box. Diskon 10%, COD Alam Sutera & Gading Serpong, kirim se-Indonesia.",
  keywords: [
    "Blokees",
    "jual Blokees",
    "jual Blokees Tangerang",
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
      "Toko Blokees di Citra Raya, Tangerang. Ambil di toko, COD Alam Sutera dan Gading Serpong, atau kirim ke seluruh Indonesia sampai luar pulau.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Jual Blokees Tangerang, Figure & Blind Box | ITGabut Toys",
    description: "Toko Blokees di Citra Raya, Tangerang. Ambil di toko, COD Alam Sutera dan Gading Serpong, atau kirim ke seluruh Indonesia.",
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ToyStore",
  name: "ITGabut Toys",
  description:
    "Toko Blokees dan action figure di Citra Raya, Tangerang. Ambil di toko, COD Alam Sutera dan Gading Serpong, atau kirim ke seluruh Indonesia termasuk luar pulau, dipacking dus tebal dan bubble wrap.",
  telephone: "+6285111043518",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Perumahan Citra Raya",
    addressLocality: "Tangerang",
    addressRegion: "Banten",
    addressCountry: "ID",
  },
  areaServed: ["Citra Raya", "Alam Sutera", "Gading Serpong", "Tangerang", "Indonesia"],
  sameAs: ["https://instagram.com/itgabut.hobby", "https://shopee.co.id/itgabut"],
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
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
