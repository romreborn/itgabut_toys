"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import BlogCard, { type BlogCardPost } from "@/components/BlogCard";

export interface SearchablePost extends BlogCardPost {
  /** Extra text to match on (headings, linked products), built on the server so post bodies stay out of the bundle. */
  keywords: string;
}

const ALL = "Semua";
/** Shown when nothing matches, so the visitor always has a next step. */
const SUGGESTIONS = ["Transformers", "Ultraman", "Miku", "Star Wars", "Terraventure", "Champion Class"];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export default function BlogSearch({ posts }: { posts: SearchablePost[] }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState(ALL);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const statusId = useId();

  // Read ?q= / ?kategori= once, so a search can be shared as a link.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q");
      const k = params.get("kategori");
      if (q) setQuery(q);
      if (k) setCat(k);
    } catch {
      /* ignore */
    }
  }, []);

  // Keep the URL in sync without adding history entries on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const url = new URL(window.location.href);
        if (query.trim()) url.searchParams.set("q", query.trim());
        else url.searchParams.delete("q");
        if (cat !== ALL) url.searchParams.set("kategori", cat);
        else url.searchParams.delete("kategori");
        window.history.replaceState(null, "", url.pathname + url.search);
      } catch {
        /* ignore */
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query, cat]);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of posts) counts.set(p.cat, (counts.get(p.cat) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name);
  }, [posts]);

  const index = useMemo(
    () => posts.map((p) => ({ post: p, text: normalize([p.title, p.excerpt, p.cat, p.keywords].join(" ")) })),
    [posts]
  );

  const terms = normalize(query).split(" ").filter(Boolean);
  const results = index
    .filter((x) => (cat === ALL || x.post.cat === cat) && terms.every((t) => x.text.includes(t)))
    .map((x) => x.post);
  const filtering = terms.length > 0 || cat !== ALL;

  const pick = (s: string) => {
    setQuery(s);
    setCat(ALL);
    inputRef.current?.focus();
  };

  return (
    <>
      <div className="blog-search">
        <label htmlFor={inputId} className="sr-only">
          Cari artikel blog
        </label>
        <div className="blog-search-box">
          <svg className="blog-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
          <input
            ref={inputRef}
            id={inputId}
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            placeholder="Cari artikel, mis. Miku, Optimus, TS04"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setQuery("");
            }}
            aria-describedby={statusId}
          />
          {query && (
            <button type="button" className="blog-search-clear" onClick={() => { setQuery(""); inputRef.current?.focus(); }} aria-label="Hapus pencarian">
              ×
            </button>
          )}
        </div>

        <div className="blog-search-chips" role="group" aria-label="Filter kategori">
          {[ALL, ...categories].map((c) => (
            <button key={c} type="button" className="blog-chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>

        <p id={statusId} className="blog-search-status" aria-live="polite">
          {filtering
            ? `${results.length} artikel${terms.length ? ` untuk "${query.trim()}"` : ""}${cat !== ALL ? ` di ${cat}` : ""}`
            : `${posts.length} artikel`}
        </p>
      </div>

      {results.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 20 }}>
          {results.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: "28px 22px", textAlign: "center" }}>
          <p className="font-display" style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 700 }}>
            Belum ada artikel yang cocok
          </p>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--muted)" }}>
            Coba kata kunci lain, atau pilih topik populer:
          </p>
          <div className="blog-search-chips" style={{ justifyContent: "center", flexWrap: "wrap" }}>
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" className="blog-chip" onClick={() => pick(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
