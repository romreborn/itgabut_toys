import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabaseClient";
import { SITE_URL } from "@/lib/constants";

/** DB timestamps are UTC without an offset. */
function utc(ts: string | null): Date | undefined {
  if (!ts) return undefined;
  return new Date(/(Z|[+-]\d\d:\d\d)$/.test(ts) ? ts : `${ts}Z`);
}

export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Queried directly (not via getAllProducts/getAllPosts) so <lastmod> can come from updatedAt.
  const [productsRes, postsRes] = await Promise.all([
    supabase.from("products").select("slug,updatedAt").eq("isActive", true).order("sortOrder", { ascending: false }),
    supabase.from("blog_posts").select("slug,updatedAt").eq("isPublished", true).order("publishedAt", { ascending: false }),
  ]);
  const products = (productsRes.data ?? []) as { slug: string; updatedAt: string | null }[];
  const posts = (postsRes.data ?? []) as { slug: string; updatedAt: string | null }[];

  const newest = (rows: { updatedAt: string | null }[]) =>
    rows.reduce<Date | undefined>((max, r) => {
      const d = utc(r.updatedAt);
      return d && (!max || d > max) ? d : max;
    }, undefined);
  const latestProduct = newest(products);
  const latestPost = newest(posts);
  const latestAny = latestProduct && latestPost ? (latestProduct > latestPost ? latestProduct : latestPost) : latestProduct ?? latestPost;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: latestAny, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: latestPost, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/tentang`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/games`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/produk/${p.slug}`,
    lastModified: utc(p.updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: utc(p.updatedAt),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...productRoutes, ...postRoutes];
}
