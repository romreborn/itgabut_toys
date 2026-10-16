import { supabase } from "@/lib/supabaseClient";

export type PostBlock =
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "img"; id: string; caption: string; url?: string }
  | { t: "gallery"; caption?: string; images: { url: string; alt: string }[] }
  | { t: "products"; label: string; productSlugs: string[] }
  | { t: "link"; url: string; label: string }
  | { t: "faq"; items: { q: string; a: string }[] }
  /** Rendered as a real <ul>/<ol> so search engines can lift it as a list snippet. */
  | { t: "list"; ordered?: boolean; items: string[] }
  | { t: "table"; caption?: string; headers: string[]; rows: string[][] };

/** Pulls out every FAQ item across all "faq" blocks in a post, for FAQPage JSON-LD. */
export function collectFaqItems(body: PostBlock[]): { q: string; a: string }[] {
  return body.filter((b): b is Extract<PostBlock, { t: "faq" }> => b.t === "faq").flatMap((b) => b.items);
}

export interface Post {
  slug: string;
  cat: string;
  date: string;
  read: string;
  title: string;
  excerpt: string;
  body: PostBlock[];
  /** Cover photo shown on blog cards (homepage teaser + /blog listing). */
  coverImageUrl: string | null;
  /** ISO timestamps for structured data; `date` is the human-readable label. */
  publishedAt: string;
  updatedAt: string;
  /** Optional search-result overrides; fall back to title / excerpt. */
  seoTitle: string | null;
  seoDescription: string | null;
}

interface PostRow {
  slug: string;
  category: string;
  dateLabel: string;
  readTime: string;
  title: string;
  excerpt: string;
  body: PostBlock[];
  coverImageUrl: string | null;
  publishedAt: string;
  updatedAt: string;
  seoTitle: string | null;
  seoDescription: string | null;
}

const POST_COLUMNS = "slug,category,dateLabel,readTime,title,excerpt,body,coverImageUrl,publishedAt,updatedAt,seoTitle,seoDescription";

function fromRow(r: PostRow): Post {
  return {
    slug: r.slug,
    cat: r.category,
    date: r.dateLabel,
    read: r.readTime,
    title: r.title,
    excerpt: r.excerpt,
    body: r.body,
    coverImageUrl: r.coverImageUrl,
    publishedAt: r.publishedAt,
    updatedAt: r.updatedAt,
    seoTitle: r.seoTitle,
    seoDescription: r.seoDescription,
  };
}

export async function getAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(POST_COLUMNS)
    .eq("isPublished", true)
    .order("publishedAt", { ascending: false });
  if (error) {
    console.error("getAllPosts:", error.message);
    return [];
  }
  return (data as PostRow[]).map(fromRow);
}

/** Published posts whose "products" blocks link this product, for the product page's related-articles list. */
export async function getPostsMentioningProduct(
  productSlug: string,
  limit = 3
): Promise<{ slug: string; title: string; date: string }[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug,title,dateLabel")
    .eq("isPublished", true)
    // jsonb containment: some block in the body array has productSlugs including this slug.
    .contains("body", JSON.stringify([{ productSlugs: [productSlug] }]))
    .order("publishedAt", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("getPostsMentioningProduct:", error.message);
    return [];
  }
  return (data as { slug: string; title: string; dateLabel: string }[]).map((r) => ({ slug: r.slug, title: r.title, date: r.dateLabel }));
}

/** Title + date for a fixed set of slugs (guide links on product pages), in the given order. */
export async function getPostSummaries(slugs: string[]): Promise<{ slug: string; title: string; date: string }[]> {
  if (slugs.length === 0) return [];
  const { data, error } = await supabase.from("blog_posts").select("slug,title,dateLabel").eq("isPublished", true).in("slug", slugs);
  if (error) {
    console.error("getPostSummaries:", error.message);
    return [];
  }
  const rows = (data as { slug: string; title: string; dateLabel: string }[]).map((r) => ({ slug: r.slug, title: r.title, date: r.dateLabel }));
  return slugs.map((s) => rows.find((r) => r.slug === s)).filter((r): r is NonNullable<typeof r> => !!r);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(POST_COLUMNS)
    .eq("isPublished", true)
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error("getPostBySlug:", error.message);
    return null;
  }
  return data ? fromRow(data as PostRow) : null;
}
