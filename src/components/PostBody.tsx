import Link from "next/link";
import { PostBlock } from "@/lib/posts";
import { getProductsBySlugs } from "@/lib/products";
import { rupiah } from "@/lib/format";
import ProductImage from "@/components/ProductImage";
import GalleryImage from "@/components/GalleryImage";
import { LightboxProvider, type LightboxImage } from "@/components/Lightbox";

/** Flattens every real photo in the post (in document order) into one lightbox-navigable list. */
function collectLightboxImages(blocks: PostBlock[]): { list: LightboxImage[]; indexOf: Map<string, number> } {
  const list: LightboxImage[] = [];
  const indexOf = new Map<string, number>();
  blocks.forEach((b, n) => {
    if (b.t === "img" && b.url) {
      indexOf.set(`img-${n}`, list.length);
      list.push({ url: b.url, alt: b.caption });
    }
    if (b.t === "gallery") {
      b.images.forEach((img, i) => {
        indexOf.set(`gallery-${n}-${i}`, list.length);
        list.push({ url: img.url, alt: img.alt });
      });
    }
  });
  return { list, indexOf };
}

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
            target="_blank"
            rel="noopener noreferrer"
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
  const { list: lightboxImages, indexOf } = collectLightboxImages(blocks);
  return (
    <LightboxProvider images={lightboxImages}>
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
              <p
                key={n}
                style={{ margin: "0 0 22px", fontSize: 16.5, lineHeight: 1.78, color: "#3F2A1D", whiteSpace: "pre-line" }}
              >
                {b.text}
              </p>
            );
          }
          if (b.t === "img") {
            const idx = b.url ? indexOf.get(`img-${n}`) : undefined;
            return (
              <figure key={n} style={{ margin: "0 0 22px" }}>
                <div className="card" style={{ borderRadius: 16, overflow: "hidden", boxShadow: "4px 4px 0 var(--ink)" }}>
                  <div style={{ aspectRatio: "16/9" }}>
                    {idx !== undefined ? (
                      <GalleryImage index={idx} name={b.caption} seed={b.id} imageUrl={b.url!} />
                    ) : (
                      <ProductImage name={b.caption} seed={b.id} imageUrl={null} />
                    )}
                  </div>
                </div>
                <figcaption style={{ marginTop: 9, fontSize: 12.5, fontWeight: 600, color: "var(--muted-3)" }}>
                  {b.caption}
                </figcaption>
              </figure>
            );
          }
          if (b.t === "gallery") {
            return (
              <figure key={n} style={{ margin: "0 0 22px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 12,
                  }}
                >
                  {b.images.map((img, i) => (
                    <div
                      key={i}
                      className="card"
                      style={{ borderRadius: 16, overflow: "hidden", boxShadow: "4px 4px 0 var(--ink)" }}
                    >
                      <div style={{ aspectRatio: "4/5" }}>
                        <GalleryImage
                          index={indexOf.get(`gallery-${n}-${i}`)!}
                          name={img.alt}
                          seed={`gallery-${n}-${i}`}
                          imageUrl={img.url}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {b.caption && (
                  <figcaption style={{ marginTop: 9, fontSize: 12.5, fontWeight: 600, color: "var(--muted-3)" }}>
                    {b.caption}
                  </figcaption>
                )}
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
          if (b.t === "faq") {
            return (
              <div key={n} style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
                {b.items.map((item, i) => (
                  <details
                    key={i}
                    className="card"
                    style={{ borderRadius: 14, padding: "14px 16px" }}
                  >
                    <summary
                      style={{
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: 15.5,
                        color: "var(--ink)",
                        listStyle: "none",
                      }}
                    >
                      {item.q}
                    </summary>
                    <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.7, color: "#3F2A1D", whiteSpace: "pre-line" }}>
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            );
          }
          return null;
        })
      )}
    </LightboxProvider>
  );
}
