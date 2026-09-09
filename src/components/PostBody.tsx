import Link from "next/link";
import { PostBlock } from "@/lib/posts";
import { getProductsBySlugs } from "@/lib/products";
import { rupiah } from "@/lib/format";
import ProductImage from "@/components/ProductImage";

async function ProductsBlock({ label, productSlugs }: { label: string; productSlugs: string[] }) {
  const items = await getProductsBySlugs(productSlugs);
  if (items.length === 0) return null;
  return (
    <div className="card" style={{ borderRadius: 18, padding: 18, marginBottom: 22 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "1.1px",
          textTransform: "uppercase",
          color: "var(--orange)",
          marginBottom: 12,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((p) => (
          <Link
            key={p.slug}
            href={`/produk/${p.slug}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "12px 14px",
              border: "2px solid var(--ink)",
              borderRadius: 12,
              background: "var(--bg)",
              color: "var(--ink)",
            }}
          >
            <span style={{ minWidth: 0, fontSize: 13.5, fontWeight: 700 }}>{p.name}</span>
            <span
              style={{
                flex: "0 0 auto",
                fontFamily: "var(--font-display)",
                fontSize: 15,
                fontWeight: 800,
                whiteSpace: "nowrap",
                color: "var(--orange-dark)",
              }}
            >
              {rupiah(p.price)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function PostBody({ blocks }: { blocks: PostBlock[] }) {
  return (
    <>
      {await Promise.all(
        blocks.map(async (b, n) => {
          if (b.t === "h") {
            return (
              <h2
                key={n}
                className="font-display"
                style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.5px", margin: "32px 0 12px" }}
              >
                {b.text}
              </h2>
            );
          }
          if (b.t === "p") {
            return (
              <p key={n} style={{ margin: "0 0 22px", fontSize: 16.5, lineHeight: 1.78, color: "#3F2A1D" }}>
                {b.text}
              </p>
            );
          }
          if (b.t === "img") {
            return (
              <figure key={n} style={{ margin: "0 0 22px" }}>
                <div className="card" style={{ borderRadius: 16, overflow: "hidden", boxShadow: "4px 4px 0 var(--ink)" }}>
                  <div style={{ aspectRatio: "16/9" }}>
                    <ProductImage name={b.caption} seed={b.id} />
                  </div>
                </div>
                <figcaption style={{ marginTop: 9, fontSize: 12.5, fontWeight: 600, color: "var(--muted-3)" }}>
                  {b.caption}
                </figcaption>
              </figure>
            );
          }
          if (b.t === "products") {
            return <ProductsBlock key={n} label={b.label} productSlugs={b.productSlugs} />;
          }
          if (b.t === "link") {
            return (
              <a
                key={n}
                href={b.url}
                target="_blank"
                rel="noopener"
                className="btn btn-yellow"
                style={{ marginBottom: 22, boxShadow: "3px 3px 0 var(--ink)" }}
              >
                {b.label} ↗
              </a>
            );
          }
          return null;
        })
      )}
    </>
  );
}
