import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import UspSection from "@/components/UspSection";
import CatalogClient from "@/components/CatalogClient";
import PriceGuideSection from "@/components/PriceGuideSection";
import BlogTeaser from "@/components/BlogTeaser";
import UpcomingReleases from "@/components/UpcomingReleases";
import LocationSection from "@/components/LocationSection";
import AboutSection from "@/components/AboutSection";
import ReviewSection from "@/components/ReviewSection";
import { getAllProducts } from "@/lib/products";
import { getAllPosts } from "@/lib/posts";
import { summarizeLines } from "@/lib/productLines";
import { SITE_URL } from "@/lib/constants";
import { salePrice } from "@/lib/format";
import { groupByCategory } from "@/lib/categories";
import Link from "next/link";

// Re-fetch from Supabase at most once a minute — catalog/blog edits made in
// the Supabase dashboard show up here without a full redeploy.
export const revalidate = 60;

export default async function HomePage() {
  const [products, posts] = await Promise.all([getAllProducts(), getAllPosts()]);
  const lines = summarizeLines(products);
  const categories = groupByCategory(products);
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
      {/* The grid never shows long copy, so don't ship every product's description/links in the page payload. */}
      <CatalogClient products={products.map((p) => ({ ...p, description: null, seoTitle: null, shopeeUrl: null }))} />
      {/* Server-rendered links to every category page, so crawlers reach all products (the grid above paginates client-side). */}
      <section className="container" style={{ padding: "8px 20px 30px" }}>
        <h2 className="font-display" style={{ fontSize: "clamp(20px,2.4vw,26px)", fontWeight: 800, margin: "0 0 12px" }}>
          Belanja Blokees per seri
        </h2>
        <div className="blog-search-chips">
          {categories.map((c) => (
            <Link key={c.slug} href={`/katalog/${c.slug}`} className="blog-chip">
              {c.label} ({c.products.length})
            </Link>
          ))}
          <Link href="/katalog" className="blog-chip" style={{ background: "var(--ink)", color: "var(--white)" }}>
            Semua seri
          </Link>
        </div>
      </section>
      <UpcomingReleases products={products} />
      <PriceGuideSection lines={lines} range={range} />
      <BlogTeaser posts={posts.slice(0, 3)} />
      <LocationSection />
      <ReviewSection />
      <AboutSection />
    </div>
  );
}
