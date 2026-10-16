import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ReviewCards from "@/components/ReviewCards";
import { SHOPEE_RATING, SHOPEE_REVIEWS, SHOPEE_REVIEW_SHOTS } from "@/lib/reviews";
import { DEFAULT_OG_IMAGE, INSTAGRAM_HANDLE, INSTAGRAM_URL, MALLS, SHOPEE_URL, SITE_URL, WA_DISPLAY, WA_NUMBER } from "@/lib/constants";

const TITLE = "Tentang & Kontak: Toko Blokees di Tangerang";
const DESCRIPTION =
  "Toko Blokees di Perumahan Citra Raya, Tangerang. Cara ambil di toko, COD Alam Sutera dan Gading Serpong, kirim ke seluruh Indonesia, dan kontak WhatsApp.";
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Citra+Raya+Tangerang";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tentang" },
  openGraph: {
    title: `${TITLE} | ITGabut Toys`,
    description: DESCRIPTION,
    url: "/tentang",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
  },
};

const h2: React.CSSProperties = { fontSize: "clamp(21px,2.6vw,27px)", fontWeight: 800, letterSpacing: "-.4px", margin: "40px 0 12px" };
const body: React.CSSProperties = { margin: "0 0 14px", fontSize: 15.5, lineHeight: 1.75, color: "var(--muted)" };
const list: React.CSSProperties = { ...body, paddingLeft: 22 };

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/tentang`,
    inLanguage: "id-ID",
    mainEntity: { "@id": `${SITE_URL}/#store` },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ITGabut Toys", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Tentang & kontak", item: `${SITE_URL}/tentang` },
    ],
  };

  return (
    <section className="container" style={{ padding: "30px 20px 60px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div style={{ maxWidth: "72ch" }}>
        <h1 className="font-display" style={{ fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 14px" }}>
          Tentang ITGabut Toys
        </h1>
        <p style={{ ...body, fontSize: 16.5 }}>
          ITGabut Toys adalah toko figure di Perumahan Citra Raya, Tangerang, yang fokus jual Blokees dan building block figure lain.
          Awalnya dari hobi ngoleksi, sekarang jadi tempat kolektor cari stok yang jelas dengan harga wajar.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, maxWidth: 760, margin: "24px 0 8px" }}>
        <div className="card" style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", boxShadow: "5px 5px 0 var(--orange)" }}>
          <Image src="/wukong.jpg" alt="Box Blokees Champion Class Herospire Sun Wukong di toko ITGabut Toys, Citra Raya" fill sizes="(max-width: 640px) 100vw, 380px" style={{ objectFit: "cover" }} />
        </div>
        <div className="card" style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", boxShadow: "5px 5px 0 var(--green)" }}>
          <Image src="/ts.jpg" alt="Etalase figure Transformers, Marvel, dan gantungan Toy Story 5 di ITGabut Toys" fill sizes="(max-width: 640px) 100vw, 380px" style={{ objectFit: "cover" }} />
        </div>
      </div>

      <div style={{ maxWidth: "72ch" }}>
        <h2 className="font-display" style={h2}>Apa yang dijual di ITGabut Toys?</h2>
        <p style={body}>
          Kebanyakan Blokees: Transformers, Marvel, Ultraman, Pokemon, Saint Seiya, Star Wars, Evangelion, sampai blind box Blokees Wheels.
          Lininya mulai dari Champion Class, Galaxy Version, Action Edition, Fantastics, sampai Blokees Wheels. Semua barang masih segel.
        </p>
        <p style={body}>
          Semua harga di <Link href="/#katalog" style={{ fontWeight: 700 }}>katalog</Link> ikut list distributor terbaru dan sudah dipotong
          diskon 10%. Stok kami cek ulang lewat WhatsApp sebelum pesanan diproses. Mau titip hunting barang tertentu atau minta harga grosir,
          chat aja.
        </p>

        <h2 className="font-display" style={h2}>Di mana lokasi toko ITGabut Toys?</h2>
        <p style={body}>
          Toko kami ada di Perumahan Citra Raya, Tangerang, Banten. Barang bisa diambil langsung dan kondisi box dicek di tempat. Chat dulu
          lewat WhatsApp sebelum datang supaya barangnya kami siapkan.
        </p>
        <a href={MAPS_URL} target="_blank" rel="noopener" className="btn btn-white" style={{ marginBottom: 14 }}>
          Lihat area Citra Raya di Google Maps
        </a>

        <h2 className="font-display" style={h2}>Bisa COD di mana?</h2>
        <p style={body}>COD by appointment di mall sekitar Tangerang. Jadwalnya kita atur bareng lewat WhatsApp:</p>
        <ul style={list}>
          {MALLS.map((m) => (
            <li key={m}>{m}</li>
          ))}
          <li>dan mall lain di Tangerang sesuai kesepakatan</li>
        </ul>

        <h2 className="font-display" style={h2}>Apakah bisa kirim ke luar kota dan luar pulau?</h2>
        <p style={body}>
          Bisa. Kami kirim ke seluruh Indonesia, termasuk Kalimantan, Sumatera, Sulawesi, dan Papua, lewat JNE, J&amp;T, atau Lion Parcel.
          Barang dipacking dus tebal dan bubble wrap.{" "}
          <Link href="/blog/jual-blokees-kalimantan-sumatera-sulawesi-papua" style={{ fontWeight: 700 }}>
            Baca cara pesan dari luar Jawa
          </Link>
          .
        </p>

        <h2 className="font-display" style={h2}>Area layanan</h2>
        <p style={body}>Citra Raya, Cikupa, Panongan, Alam Sutera, Gading Serpong, BSD, dan pengiriman ke seluruh Indonesia.</p>

      </div>

      <h2 className="font-display" style={h2}>Apa kata pembeli ITGabut Toys?</h2>
      <p style={{ ...body, maxWidth: "72ch" }}>
        Rating toko kami di Shopee {SHOPEE_RATING.score} dari 5, dari {SHOPEE_RATING.count} ulasan pembeli ({SHOPEE_RATING.asOf}). Ini
        sebagian ulasannya, dengan nama pembeli disamarkan.
      </p>
      <ReviewCards reviews={SHOPEE_REVIEWS} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 12, margin: "18px 0 6px" }}>
        {SHOPEE_REVIEW_SHOTS.map((src, i) => (
          <a key={src} href={src} target="_blank" rel="noopener" className="card" style={{ position: "relative", display: "block", aspectRatio: "520/1050", overflow: "hidden", borderRadius: 14 }}>
            <Image src={src} alt={`Screenshot ulasan pembeli ITGabut Toys di Shopee, bagian ${i + 1}`} fill sizes="(max-width: 640px) 50vw, 200px" style={{ objectFit: "cover" }} />
          </a>
        ))}
      </div>
      <p style={{ margin: "0 0 6px", fontSize: 12.5, color: "var(--muted-3)" }}>
        Screenshot halaman ulasan toko Shopee kami. Nama dan foto profil pembeli diburamkan.{" "}
        <a href={SHOPEE_URL} target="_blank" rel="noopener" style={{ fontWeight: 700 }}>
          Lihat semua ulasan di Shopee
        </a>
      </p>

      <div style={{ maxWidth: "72ch" }}>
        <h2 className="font-display" style={h2}>Kontak</h2>
        <ul style={list}>
          <li>
            WhatsApp:{" "}
            <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener" style={{ fontWeight: 700 }}>
              {WA_DISPLAY}
            </a>
          </li>
          <li>
            Instagram:{" "}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener" style={{ fontWeight: 700 }}>
              {INSTAGRAM_HANDLE}
            </a>
          </li>
          <li>
            Shopee:{" "}
            <a href={SHOPEE_URL} target="_blank" rel="noopener" style={{ fontWeight: 700 }}>
              shopee.co.id/itgabut
            </a>
          </li>
        </ul>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
          <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener" className="btn btn-orange">
            Chat WhatsApp
          </a>
          <Link href="/#katalog" className="btn btn-dark">
            Lihat katalog
          </Link>
        </div>
      </div>
    </section>
  );
}
