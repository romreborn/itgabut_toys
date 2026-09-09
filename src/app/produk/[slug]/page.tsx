import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/products";
import { decorate } from "@/lib/decorate";
import { T } from "@/lib/i18n";
import { SITE_URL } from "@/lib/constants";
import ProductDetail from "@/components/ProductDetail";

// New products added in Supabase after the last build still render (ISR),
// and existing pages pick up price/stock/photo edits within 60s.
export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
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
  const title = `${p.name} — ${p.priceLabel}`;
  const description = `${p.name} (${p.ip}, ${p.typeLabel}) ${p.priceLabel}. ${T.id.detailPickup}`;
  const url = `${SITE_URL}/produk/${p.slug}`;
  return {
    title,
    description,
    alternates: { canonical: `/produk/${p.slug}` },
    openGraph: { title, description, url, type: "website" },
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

  const related = await getRelatedProducts(product, 4);
  const p = decorate(product, T.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.ip },
    category: product.type,
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: product.price,
      availability:
        product.avail === "ready"
          ? "https://schema.org/InStock"
          : product.avail === "preorder"
          ? "https://schema.org/PreOrder"
          : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/produk/${p.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={product} related={related} />
    </>
  );
}
