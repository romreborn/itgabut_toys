import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import type { Product } from "@/lib/productShared";
import { KIND_STYLE, MONTHS_ID, formatEventDate, isMonthOnly, todayJakarta, upcomingEvents } from "@/lib/releases";

/** Homepage teaser for /jadwal-rilis: the next few releases, server-rendered (no client JS of its own). */
export default function UpcomingReleases({ products }: { products: Product[] }) {
  const events = upcomingEvents(todayJakarta(), 4);
  if (!events.length) return null;
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  return (
    <section className="container" style={{ padding: "34px 20px 10px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 18, flexWrap: "wrap", marginBottom: 18 }}>
        <h2 className="font-display" style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.5px", margin: 0 }}>
          Rilis Blokees terdekat
        </h2>
        <Link
          href="/jadwal-rilis"
          style={{ padding: "11px 17px", border: "2px solid var(--ink)", borderRadius: 12, background: "#fff", fontSize: 13, fontWeight: 700, boxShadow: "3px 3px 0 var(--ink)", color: "var(--ink)" }}
        >
          Lihat kalender rilis →
        </Link>
      </div>
      <div className="rc-upcoming">
        {events.map((e) => {
          const prod = e.productSlugs?.map((s) => bySlug.get(s)).find(Boolean);
          const [, m, d] = e.date.split("-").map(Number);
          return (
            <Link key={e.id} href={`/jadwal-rilis#ev-${e.id}`} className="card" style={{ display: "flex", flexDirection: "column", overflow: "hidden", color: "var(--ink)" }}>
              <div style={{ position: "relative", aspectRatio: "16/10", borderBottom: "2px solid var(--ink)", background: KIND_STYLE[e.kind].bg }}>
                {prod && <ProductImage name={e.title} seed={e.id} imageUrl={prod.imageUrl} sizes="(max-width: 640px) 100vw, 300px" />}
                <div
                  style={{ position: "absolute", top: 10, left: 10, background: "var(--white)", border: "2px solid var(--ink)", borderRadius: 12, padding: "4px 10px", textAlign: "center", lineHeight: 1.1, boxShadow: "2px 2px 0 var(--ink)" }}
                >
                  <div className="font-display" style={{ fontSize: 20, fontWeight: 800 }}>{isMonthOnly(e) ? "TBC" : d}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-2)" }}>{MONTHS_ID[m - 1].slice(0, 3)}</div>
                </div>
              </div>
              <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span className="rc-badge" style={{ background: KIND_STYLE[e.kind].bg, color: KIND_STYLE[e.kind].fg }}>{KIND_STYLE[e.kind].label}</span>
                  {!e.confirmed && <span className="rc-badge" style={{ background: "#FFF3C4", color: "#7A5A00" }}>TBC</span>}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{e.title}</div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--muted-2)" }}>{formatEventDate(e)}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
