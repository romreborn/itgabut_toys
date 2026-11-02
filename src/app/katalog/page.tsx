import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { groupByCategory } from "@/lib/categories";
import { rupiah, salePrice } from "@/lib/format";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/constants";
import ProductImage from "@/components/ProductImage";

export const revalidate = 60;

const TITLE = "Katalog Blokees per Seri";
const DESCRIPTION =
  "Katalog Blokees per seri di ITGabut Toys: Transformers, Marvel, Pokemon, Saint Seiya, Ultraman, Star Wars, dan lainnya. Ambil di Citra Raya, COD, atau kirim.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/katalog" },
  openGraph: { title: `${TITLE} | ITGabut Toys`, description: DESCRIPTION, url: "/katalog", type: "website", images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }] },
};

export default async function CatalogIndexPage() {
  const products = await getAllProducts();
  const cats = groupByCategory(products);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    url: `${SITE_URL}/katalog`,
    inLanguage: "id-ID",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: cats.length,
      itemListElement: cats.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/katalog/${c.slug}`, name: c.label })),
    },
  };

  return (
    <section className="container" style={{ padding: "26px 20px 60px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" style={{ fontSize: 13, fontWeight: 600, color: "var(--muted-2)", marginBottom: 14 }}>
        <Link href="/">Beranda</Link> / <span style={{ color: "var(--ink)" }}>Katalog</span>
      </nav>
      <h1 className="font-display" style={{ fontSize: "clamp(28px,3.8vw,46px)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 12px" }}>
        {TITLE}
      </h1>
      <p style={{ margin: "0 0 10px", fontSize: 15.5, lineHeight: 1.7, color: "var(--muted)", maxWidth: "70ch" }}>
        ITGabut Toys menjual {products.length} produk Blokees dari {cats.length} seri. Pilih seri untuk melihat semua produknya,
        lengkap dengan harga dan status stok.
      </p>
      <h2 className="font-display" style={{ fontSize: "clamp(18px,2.2vw,22px)", fontWeight: 800, margin: "26px 0 14px" }}>
        Seri Blokees apa saja yang dijual di ITGabut Toys?
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
        {cats.map((c) => {
          const cover = c.products.find((p) => p.imageUrl);
          const min = Math.min(...c.products.map((p) => salePrice(p.price)));
          return (
            <Link key={c.slug} href={`/katalog/${c.slug}`} className="card" style={{ display: "flex", flexDirection: "column", overflow: "hidden", color: "var(--ink)" }}>
              <div style={{ aspectRatio: "4/3", borderBottom: "2px solid var(--ink)" }}>
                <ProductImage name={c.label} seed={`cat-${c.slug}`} imageUrl={cover?.imageUrl ?? null} />
              </div>
              <div style={{ padding: 14 }}>
                <div className="font-display" style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>
                  {c.label}
                </div>
                <div style={{ marginTop: 6, fontSize: 13, fontWeight: 600, color: "var(--muted-2)" }}>
                  {c.products.length} produk · mulai {rupiah(min)}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
