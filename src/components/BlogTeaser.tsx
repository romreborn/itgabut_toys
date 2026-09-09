"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Post } from "@/lib/posts";
import BlogCard from "@/components/BlogCard";

export default function BlogTeaser({ posts }: { posts: Post[] }) {
  const { t } = useLanguage();

  return (
    <section className="container" style={{ padding: "64px 20px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 18, flexWrap: "wrap", marginBottom: 20 }}>
        <h2 className="font-display" style={{ fontSize: "clamp(28px,3.4vw,42px)", fontWeight: 800, letterSpacing: "-1px", margin: 0 }}>
          {t.updates}
        </h2>
        <Link
          href="/blog"
          style={{
            padding: "11px 17px",
            border: "2px solid var(--ink)",
            borderRadius: 12,
            background: "#fff",
            fontSize: 13,
            fontWeight: 700,
            boxShadow: "3px 3px 0 var(--ink)",
            color: "var(--ink)",
          }}
        >
          {t.allPosts} →
        </Link>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 18 }}>
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
