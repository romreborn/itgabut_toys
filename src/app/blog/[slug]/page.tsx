import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { SITE_URL } from "@/lib/constants";
import ProductImage from "@/components/ProductImage";
import PostBody from "@/components/PostBody";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: "ITGabut Toys" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="container" style={{ maxWidth: 820, padding: "30px 20px 60px" }}>
        <Link
          href="/blog"
          style={{
            display: "inline-block",
            marginBottom: 22,
            padding: "9px 15px",
            border: "2px solid var(--ink)",
            borderRadius: 11,
            background: "#fff",
            fontSize: 13,
            fontWeight: 700,
            boxShadow: "3px 3px 0 var(--ink)",
            color: "var(--ink)",
          }}
        >
          ← Kembali ke blog
        </Link>
        <div
          style={{
            display: "flex",
            gap: 9,
            alignItems: "center",
            flexWrap: "wrap",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: ".5px",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          <span style={{ padding: "4px 9px", border: "2px solid var(--ink)", borderRadius: 7, background: "var(--peach)", color: "var(--orange-dark)" }}>
            {post.cat}
          </span>
          <span style={{ color: "var(--muted-3)" }}>
            {post.date} · {post.read}
          </span>
        </div>
        <h1
          className="font-display"
          style={{ fontSize: "clamp(29px,4.4vw,48px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-1.2px", margin: "0 0 24px" }}
        >
          {post.title}
        </h1>
        <div className="card" style={{ borderRadius: 20, overflow: "hidden", boxShadow: "6px 6px 0 var(--orange)", marginBottom: 30 }}>
          <div style={{ aspectRatio: "16/9" }}>
            <ProductImage name={post.title} seed={"blog-cover-" + post.slug} />
          </div>
        </div>

        <PostBody blocks={post.body} />

        <div style={{ marginTop: 36, paddingTop: 26, borderTop: "2px dashed var(--line)", display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/#katalog" className="btn btn-dark">
            Lihat katalog
          </Link>
          <a href="https://wa.me/6285111043518" target="_blank" rel="noopener" className="btn btn-white">
            Tanya stok via WA
          </a>
        </div>
      </article>
    </>
  );
}
