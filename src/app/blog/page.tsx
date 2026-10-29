import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/constants";
import BlogSearch, { type SearchablePost } from "@/components/BlogSearch";

const TITLE = "Blog Blokees: Rilis, Bocoran & Panduan";
const DESCRIPTION =
  "Info rilis dan bocoran lineup Blokees terbaru, dari Transformers, Saint Seiya, Ultraman sampai Star Wars, plus panduan belanja dari ITGabut Toys Tangerang.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `${TITLE} | ITGabut Toys`,
    description: DESCRIPTION,
    url: "/blog",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
  },
};

export const revalidate = 60;

export default async function BlogListPage() {
  const posts = await getAllPosts();

  // Slim, search-ready list for the client: card fields plus headings and linked product slugs
  // (so "TS04" or "Gomora" finds the right post) without sending whole article bodies.
  const searchable: SearchablePost[] = posts.map((p) => ({
    slug: p.slug,
    cat: p.cat,
    date: p.date,
    title: p.title,
    excerpt: p.excerpt,
    coverImageUrl: p.coverImageUrl,
    keywords: [
      p.seoTitle ?? "",
      ...p.body.flatMap((b) =>
        b.t === "h" ? [b.text] : b.t === "products" ? b.productSlugs.map((s) => s.replace(/-/g, " ")) : []
      ),
    ]
      .join(" ")
      .slice(0, 800),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/blog`,
    inLanguage: "id-ID",
    publisher: { "@id": `${SITE_URL}/#organization` },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: /(Z|[+-]\d\d:\d\d)$/.test(p.publishedAt) ? p.publishedAt : `${p.publishedAt}Z`,
    })),
  };

  return (
    <section className="container" style={{ padding: "30px 20px 60px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1
        className="font-display"
        style={{ fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 8px" }}
      >
        Blog Blokees &amp; update
      </h1>
      <p style={{ margin: "0 0 28px", fontSize: 15, color: "var(--muted)", maxWidth: "62ch" }}>
        Info rilis, bocoran lineup, dan panduan belanja Blokees dari toko kami di Citra Raya, Tangerang.
      </p>
      <BlogSearch posts={searchable} />
    </section>
  );
}
