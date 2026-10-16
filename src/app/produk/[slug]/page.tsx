import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/products";
import { getPostsMentioningProduct } from "@/lib/posts";
import { decorate, type DecoratedProduct } from "@/lib/decorate";
import { DISCOUNT_RATE } from "@/lib/format";
import { T } from "@/lib/i18n";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/constants";
import ProductDetail from "@/components/ProductDetail";

// New products added in Supabase after the last build still render (ISR),
// and existing pages pick up price/stock/photo edits within 60s.
export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

function absoluteImage(url: string | null): string | undefined {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

function clip(text: string, max: number): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:]$/, "") + "…";
}

/** The product's own copy when it has some, otherwise a sentence built from its catalog fields. */
function metaDescription(p: DecoratedProduct): string {
  if (p.description) return clip(p.description, 158);
  const status = p.avail === "preorder" ? `Pre-order${p.cond ? ` (${p.cond})` : ""}` : p.availLabel;
  return clip(
    `Beli ${p.name} (${p.ip}, ${p.typeLabel}) di ITGabut Toys. ${p.priceLabel}, diskon ${Math.round(
      DISCOUNT_RATE * 100
    )}% dari ${p.listLabel}. ${status}. Ambil di Citra Raya Tangerang, COD, atau kirim ke seluruh Indonesia.`,
    158
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const p = decorate(product, T.id);
  const title = `${p.name} — ${p.avail === "preorder" ? "Pre-order " : ""}${p.priceLabel}`;
  const description = metaDescription(p);
  const url = `${SITE_URL}/produk/${p.slug}`;
  // Products without a photo still get a share image so links never preview blank.
  const image = absoluteImage(p.imageUrl) ?? `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  return {
    title,
    description,
    alternates: { canonical: `/produk/${p.slug}` },
    openGraph: { title, description, url, type: "website", images: [{ url: image, alt: p.name }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, posts] = await Promise.all([getRelatedProducts(product, 4), getPostsMentioningProduct(product.slug)]);
  const p = decorate(product, T.id);
  const url = `${SITE_URL}/produk/${p.slug}`;
  const image = absoluteImage(p.imageUrl);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.slug,
    description: metaDescription(p),
    ...(image && { image: [image] }),
    brand: { "@type": "Brand", name: product.ip },
    category: product.type,
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: p.salePrice,
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.avail === "ready"
          ? "https://schema.org/InStock"
          : product.avail === "preorder"
          ? "https://schema.org/PreOrder"
          : "https://schema.org/OutOfStock",
      url,
      seller: { "@type": "Organization", name: "ITGabut Toys", url: SITE_URL },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ITGabut Toys", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: product.ip, item: `${SITE_URL}/#katalog` },
      { "@type": "ListItem", position: 3, name: product.name, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ProductDetail product={product} related={related} posts={posts} />
    </>
  );
}
