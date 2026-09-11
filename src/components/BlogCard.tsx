import Link from "next/link";
import { Post } from "@/lib/posts";
import ProductImage from "@/components/ProductImage";

export default function BlogCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ display: "contents" }}>
      <article
        className="card"
        style={{ borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column" }}
      >
        <div style={{ aspectRatio: "16/9", borderBottom: "2px solid var(--ink)" }}>
          <ProductImage name={post.title} seed={"blog-cover-" + post.slug} imageUrl={post.coverImageUrl} />
        </div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 10.5, fontWeight: 800, letterSpacing: ".5px", textTransform: "uppercase" }}>
            <span style={{ padding: "3px 8px", borderRadius: 6, background: "var(--peach)", color: "var(--orange-dark)" }}>{post.cat}</span>
            <span style={{ color: "var(--muted-3)" }}>{post.date}</span>
          </div>
          <h3 className="font-display" style={{ margin: 0, fontSize: 18, fontWeight: 700, lineHeight: 1.25, color: "var(--ink)" }}>
            {post.title}
          </h3>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "var(--muted)" }}>{post.excerpt}</p>
          <div style={{ marginTop: "auto", paddingTop: 8, fontSize: 13, fontWeight: 800, color: "var(--orange)" }}>Baca →</div>
        </div>
      </article>
    </Link>
  );
}
