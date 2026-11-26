import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabaseClient";
import { SITE_URL } from "@/lib/constants";
import { categorySlug } from "@/lib/categories";
import { collectPostImages, type PostBlock } from "@/lib/posts";

/** DB timestamps are UTC without an offset. */
function utc(ts: string | null): Date | undefined {
  if (!ts) return undefined;
  return new Date(/(Z|[+-]\d\d:\d\d)$/.test(ts) ? ts : `${ts}Z`);
}

/** Absolute, XML-safe URL for <image:loc> (Next writes sitemap image values as-is). */
function imageLoc(u: string): string {
  return encodeURI(u.startsWith("http") ? u : `${SITE_URL}${u}`).replace(/&/g, "&amp;");
}

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Queried directly (not via getAllProducts/getAllPosts) so <lastmod> can come from updatedAt.
  const [productsRes, postsRes] = await Promise.all([
    supabase.from("products").select("slug,ip,updatedAt,imageUrl").eq("isActive", true).order("sortOrder", { ascending: false }),
    supabase.from("blog_posts").select("slug,updatedAt,coverImageUrl,body").eq("isPublished", true).order("publishedAt", { ascending: false }),
  ]);
  const products = (productsRes.data ?? []) as { slug: string; ip: string; updatedAt: string | null; imageUrl: string | null }[];
  const posts = (postsRes.data ?? []) as { slug: string; updatedAt: string | null; coverImageUrl: string | null; body: PostBlock[] | null }[];

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
    { url: `${SITE_URL}/jadwal-rilis`, lastModified: latestAny, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/tentang`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/games`, changeFrequency: "weekly", priority: 0.8 },
  ];

  // One page per catalog category; lastmod = newest product update in that category.
  const byCat = new Map<string, { slug: string; updatedAt: string | null }[]>();
  for (const p of products) byCat.set(categorySlug(p.ip), [...(byCat.get(categorySlug(p.ip)) ?? []), p]);
  const categoryRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/katalog`, lastModified: latestProduct, changeFrequency: "daily", priority: 0.8 },
    ...[...byCat.entries()].map(([slug, rows]) => ({
      url: `${SITE_URL}/katalog/${slug}`,
      lastModified: newest(rows),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];

  // Image entries help Google Images and photo thumbnails in search results find each page's photos.
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/produk/${p.slug}`,
    lastModified: utc(p.updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
    ...(p.imageUrl && { images: [imageLoc(p.imageUrl)] }),
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: utc(p.updatedAt),
    changeFrequency: "monthly",
    priority: 0.5,
    images: collectPostImages(p.coverImageUrl, p.body ?? []).map(imageLoc),
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...postRoutes];
}
