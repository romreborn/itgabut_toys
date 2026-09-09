import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import BlogCard from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "Blog & update",
  description: "Panduan Blokees, info restock, dan catatan dari toko ITGabut Toys.",
  alternates: { canonical: "/blog" },
};

export const revalidate = 60;

export default async function BlogListPage() {
  const posts = await getAllPosts();

  return (
    <section className="container" style={{ padding: "30px 20px 60px" }}>
      <h1
        className="font-display"
        style={{ fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 8px" }}
      >
        Blog &amp; update
      </h1>
      <p style={{ margin: "0 0 28px", fontSize: 15, color: "var(--muted)", maxWidth: "62ch" }}>
        Panduan Blokees, info restock, dan catatan dari toko.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 20 }}>
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
