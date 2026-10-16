import type { ShopeeReview } from "@/lib/reviews";

function Stars({ n }: { n: number }) {
  return (
    <span aria-label={`${n} dari 5 bintang`} style={{ color: "#F5A623", fontSize: 15, letterSpacing: 1 }}>
      {"★".repeat(n)}
      <span style={{ color: "var(--line)" }}>{"★".repeat(5 - n)}</span>
    </span>
  );
}

/** Plain review cards (no hooks), shared by the homepage section and /tentang. */
export default function ReviewCards({ reviews }: { reviews: ShopeeReview[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 14 }}>
      {reviews.map((r, i) => (
        <figure key={i} className="card" style={{ margin: 0, padding: 18, borderRadius: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <Stars n={r.rating} />
            {r.date && <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--muted-3)" }}>{r.date}</span>}
          </div>
          {r.text && (
            <blockquote style={{ margin: 0, fontSize: 15.5, fontWeight: 700, lineHeight: 1.45, color: "var(--ink)" }}>
              &ldquo;{r.text}&rdquo;
            </blockquote>
          )}
          {(r.product || r.variant) && (
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--muted)" }}>
              {r.product}
              {r.product && r.variant ? " · " : ""}
              {r.variant && <span style={{ color: "var(--muted-3)" }}>Variasi: {r.variant}</span>}
            </p>
          )}
          <figcaption style={{ marginTop: "auto", fontSize: 12, fontWeight: 700, color: "var(--muted-2)" }}>{r.name} · pembeli Shopee</figcaption>
        </figure>
      ))}
    </div>
  );
}
