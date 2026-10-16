import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import UspSection from "@/components/UspSection";
import CatalogClient from "@/components/CatalogClient";
import PriceGuideSection from "@/components/PriceGuideSection";
import BlogTeaser from "@/components/BlogTeaser";
import LocationSection from "@/components/LocationSection";
import AboutSection from "@/components/AboutSection";
import ReviewSection from "@/components/ReviewSection";
import { getAllProducts } from "@/lib/products";
import { getAllPosts } from "@/lib/posts";
import { summarizeLines } from "@/lib/productLines";
import { SITE_URL } from "@/lib/constants";
import { salePrice } from "@/lib/format";

// Re-fetch from Supabase at most once a minute — catalog/blog edits made in
// the Supabase dashboard show up here without a full redeploy.
export const revalidate = 60;

export default async function HomePage() {
  const [products, posts] = await Promise.all([getAllProducts(), getAllPosts()]);
  const lines = summarizeLines(products);
  const sale = products.map((p) => salePrice(p.price));
  const range = { min: Math.min(...sale), max: Math.max(...sale) };

  // Newest products as an ItemList, so crawlers see the current catalog without running the client-side grid.
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Produk terbaru di ITGabut Toys",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: Math.min(products.length, 24),
    itemListElement: products.slice(0, 24).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/produk/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <div id="top">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <Hero />
      <Ticker />
      <UspSection />
      <CatalogClient products={products} />
      <PriceGuideSection lines={lines} range={range} />
      <BlogTeaser posts={posts.slice(0, 3)} />
      <LocationSection />
      <ReviewSection />
      <AboutSection />
    </div>
  );
}
