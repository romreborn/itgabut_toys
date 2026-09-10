import type { Metadata } from "next";
import { Baloo_2, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import DisableRightClick from "@/components/DisableRightClick";
import { SITE_URL } from "@/lib/constants";

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
    default: "ITGabut Toys — Jual Blokees, Action Figure & Blind Box | Citra Raya, Alam Sutera, Gading Serpong",
    template: "%s | ITGabut Toys",
  },
  description:
    "ITGabut Toys: reseller Blokees di Perumahan Citra Raya, Tangerang. Blokees Transformers, Marvel, Ultraman, Pokemon, Saint Seiya, Star Wars. COD Citra Raya, Alam Sutera, Gading Serpong. WA 085111043518.",
  keywords: [
    "Blokees",
    "jual Blokees",
    "Blokees Indonesia",
    "action figure Citra Raya",
    "action figure Alam Sutera",
    "action figure Gading Serpong",
    "blind box Tangerang",
    "ITGabut Toys",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "ITGabut Toys",
    title: "ITGabut Toys — Jual Blokees, Action Figure & Blind Box",
    description:
      "Reseller Blokees dan action figure di Citra Raya, Tangerang. COD Alam Sutera dan Gading Serpong.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "ITGabut Toys — Jual Blokees, Action Figure & Blind Box",
    description: "Reseller Blokees dan action figure di Citra Raya, Tangerang.",
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
  description: "Reseller Blokees dan action figure. COD Citra Raya, Alam Sutera, Gading Serpong.",
  telephone: "+6285111043518",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Perumahan Citra Raya",
    addressLocality: "Tangerang",
    addressRegion: "Banten",
    addressCountry: "ID",
  },
  areaServed: ["Citra Raya", "Alam Sutera", "Gading Serpong", "Tangerang"],
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
        <LanguageProvider>
          <CartProvider>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <Toast />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
