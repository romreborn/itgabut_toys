import { supabase } from "@/lib/supabaseClient";

export type PostBlock =
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "img"; id: string; caption: string; url?: string }
  | { t: "gallery"; caption?: string; images: { url: string; alt: string }[] }
  | { t: "products"; label: string; productSlugs: string[] }
  | { t: "link"; url: string; label: string };

export interface Post {
  slug: string;
  cat: string;
  date: string;
  read: string;
  title: string;
  excerpt: string;
  body: PostBlock[];
}

interface PostRow {
  slug: string;
  category: string;
  dateLabel: string;
  readTime: string;
  title: string;
  excerpt: string;
  body: PostBlock[];
}

const POST_COLUMNS = "slug,category,dateLabel,readTime,title,excerpt,body";

function fromRow(r: PostRow): Post {
  return {
    slug: r.slug,
    cat: r.category,
    date: r.dateLabel,
    read: r.readTime,
    title: r.title,
    excerpt: r.excerpt,
    body: r.body,
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
