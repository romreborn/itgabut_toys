import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProducts } from "@/lib/products";
import { getAllPosts } from "@/lib/posts";
import { categoryIntro, categoryPostMatcher, groupByCategory, type Category } from "@/lib/categories";
import { summarizeLines } from "@/lib/productLines";
import { rupiah, salePrice, DISCOUNT_RATE } from "@/lib/format";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/constants";
import { fitTitle } from "@/lib/seo";
import CategoryGrid from "@/components/CategoryGrid";

export const revalidate = 60;

async function load(seri: string): Promise<{ cat: Category; all: Category[] } | null> {
  const all = groupByCategory(await getAllProducts());
  const cat = all.find((c) => c.slug === seri);
  return cat ? { cat, all } : null;
}

export async function generateStaticParams() {
  return groupByCategory(await getAllProducts()).map((c) => ({ seri: c.slug }));
}

function facts(cat: Category) {
  const prices = cat.products.map((p) => salePrice(p.price));
  return {
    n: cat.products.length,
    ready: cat.products.filter((p) => p.avail === "ready").length,
    pre: cat.products.filter((p) => p.avail === "preorder").length,
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:]$/, "") + "…";
}

function absoluteImage(url: string | null): string | null {
  if (!url) return null;
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

export async function generateMetadata({ params }: { params: Promise<{ seri: string }> }): Promise<Metadata> {
  const { seri } = await params;
  const data = await load(seri);
  if (!data) return {};
  const { cat } = data;
  const f = facts(cat);
  const { title, text } = fitTitle([
    { text: `Jual ${cat.label} di Tangerang & Online`, brand: true },
    { text: `Jual ${cat.label}`, brand: true },
    { text: cat.label, brand: false },
  ]);
  const description = clip(
    `${f.n} produk ${cat.label} di ITGabut Toys, harga ${rupiah(f.min)} sampai ${rupiah(f.max)} setelah diskon ${Math.round(DISCOUNT_RATE * 100)}%. Ambil di Citra Raya, COD, atau kirim ke seluruh Indonesia.`,
    158
  );
  const image = absoluteImage(cat.products.find((p) => p.imageUrl)?.imageUrl ?? null) ?? `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  return {
    title,
    description,
    alternates: { canonical: `/katalog/${cat.slug}` },
    openGraph: { title: text, description, url: `${SITE_URL}/katalog/${cat.slug}`, type: "website", images: [{ url: image, alt: cat.label }] },
  };
}

const h2 = { fontSize: "clamp(20px,2.4vw,26px)", fontWeight: 800, letterSpacing: "-.5px", margin: "40px 0 12px" } as const;
const pStyle = { margin: "0 0 14px", fontSize: 15.5, lineHeight: 1.7, color: "var(--muted)", maxWidth: "72ch" } as const;

export default async function CategoryPage({ params }: { params: Promise<{ seri: string }> }) {
  const { seri } = await params;
  const data = await load(seri);
  if (!data) notFound();
  const { cat, all } = data;
  const f = facts(cat);
  const lines = summarizeLines(cat.products);
  const intro = categoryIntro(cat.ip);
  const matcher = categoryPostMatcher(cat.ip);
  const posts = (await getAllPosts()).filter((p) => matcher.test(p.title)).slice(0, 6);
  const url = `${SITE_URL}/katalog/${cat.slug}`;

  const stockSentence =
    f.ready && f.pre
      ? `${f.ready} produk ready stock dan ${f.pre} produk pre-order.`
      : f.pre
      ? `Semuanya berstatus pre-order.`
      : `Semuanya ready stock.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Jual ${cat.label}`,
    url,
    inLanguage: "id-ID",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: f.n,
      itemListElement: cat.products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/produk/${p.slug}`,
        name: p.name,
      })),
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ITGabut Toys", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Katalog", item: `${SITE_URL}/katalog` },
      { "@type": "ListItem", position: 3, name: cat.label, item: url },
    ],
  };

  return (
    <section className="container" style={{ padding: "26px 20px 60px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav aria-label="Breadcrumb" style={{ fontSize: 13, fontWeight: 600, color: "var(--muted-2)", marginBottom: 14 }}>
        <Link href="/">Beranda</Link> / <Link href="/katalog">Katalog</Link> / <span style={{ color: "var(--ink)" }}>{cat.label}</span>
      </nav>

      <h1 className="font-display" style={{ fontSize: "clamp(28px,3.8vw,46px)", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, margin: "0 0 14px" }}>
        Jual {cat.label}
      </h1>
      {intro && <p style={pStyle}>{intro}</p>}
      <p style={{ ...pStyle, color: "var(--ink)", fontWeight: 600 }}>
        Di ITGabut Toys ada {f.n} produk {cat.label}. {stockSentence} Harganya {rupiah(f.min)}
        {f.max !== f.min ? ` sampai ${rupiah(f.max)}` : ""} setelah diskon {Math.round(DISCOUNT_RATE * 100)}%.
      </p>

      <div style={{ marginTop: 22 }}>
        <CategoryGrid products={cat.products} />
      </div>

      <h2 className="font-display" style={h2}>
        Berapa harga {cat.label}?
      </h2>
      <p style={pStyle}>
        Harga {cat.label} di katalog ITGabut Toys mulai {rupiah(f.min)}
        {f.max !== f.min ? ` sampai ${rupiah(f.max)}` : ""}, sudah termasuk diskon {Math.round(DISCOUNT_RATE * 100)}%.
        {lines.length > 0 ? " Rinciannya per lini:" : ""}
      </p>
      {lines.length > 0 && (
        <ul style={{ margin: "0 0 14px", paddingLeft: 22, fontSize: 15.5, lineHeight: 1.8, color: "#3F2A1D" }}>
          {lines.map((l) => (
            <li key={l.name}>
              {l.name}: {l.count} produk, {rupiah(l.min)}
              {l.max !== l.min ? ` sampai ${rupiah(l.max)}` : ""}
              {l.format === "blind" ? " (blind box)" : l.format === "nonblind" ? " (satuan)" : ""}
            </li>
          ))}
        </ul>
      )}

      <h2 className="font-display" style={h2}>
        Di mana beli {cat.label}?
      </h2>
      <p style={pStyle}>
        ITGabut Toys menjual {cat.label} dari toko di Perumahan Citra Raya, Tangerang. Barang bisa diambil di toko, COD di mall
        sekitar Tangerang, atau dikirim ke seluruh Indonesia. Pesan lewat keranjang di situs ini atau langsung chat WhatsApp.
      </p>

      {posts.length > 0 && (
        <>
          <h2 className="font-display" style={h2}>
            Artikel tentang {cat.label}
          </h2>
          <ul style={{ margin: 0, paddingLeft: 22, fontSize: 15.5, lineHeight: 1.9 }}>
            {posts.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} style={{ fontWeight: 700 }}>
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2 className="font-display" style={h2}>
        Seri Blokees lainnya
      </h2>
      <div className="blog-search-chips" style={{ marginTop: 6 }}>
        {all
          .filter((c) => c.slug !== cat.slug)
          .map((c) => (
            <Link key={c.slug} href={`/katalog/${c.slug}`} className="blog-chip">
              {c.label} ({c.products.length})
            </Link>
          ))}
      </div>
    </section>
  );
}
