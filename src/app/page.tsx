import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import UspSection from "@/components/UspSection";
import CatalogClient from "@/components/CatalogClient";
import BlogTeaser from "@/components/BlogTeaser";
import LocationSection from "@/components/LocationSection";
import AboutSection from "@/components/AboutSection";
import { getAllProducts } from "@/lib/products";
import { getAllPosts } from "@/lib/posts";

// Re-fetch from Supabase at most once a minute — catalog/blog edits made in
// the Supabase dashboard show up here without a full redeploy.
export const revalidate = 60;

export default async function HomePage() {
  const [products, posts] = await Promise.all([getAllProducts(), getAllPosts()]);

  return (
    <div id="top">
      <Hero />
      <Ticker />
      <UspSection />
      <CatalogClient products={products} />
      <BlogTeaser posts={posts.slice(0, 3)} />
      <LocationSection />
      <AboutSection />
    </div>
  );
}
