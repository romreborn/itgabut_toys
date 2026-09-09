"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/products";
import { decorate } from "@/lib/decorate";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";
import { SHOPEE_URL } from "@/lib/constants";

export default function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const p = decorate(product, t);
  const relatedDecorated = related.map((r) => decorate(r, t));

  return (
    <section className="container" style={{ padding: "26px 20px 10px" }}>
      <Link
        href="/#katalog"
        style={{
          display: "inline-block",
          marginBottom: 18,
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
        ← {t.back}
      </Link>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 30, alignItems: "flex-start" }}>
        <div className="card" style={{ flex: "1 1 340px", minWidth: 0, borderRadius: 20, boxShadow: "6px 6px 0 var(--ink)", overflow: "hidden" }}>
          <div style={{ aspectRatio: "1" }}>
            <ProductImage name={p.name} seed={`prod-${p.slug}`} imageUrl={p.imageUrl} priority />
          </div>
        </div>
        <div style={{ flex: "1 1 380px", minWidth: 0 }}>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}>
            <span className="pill" style={{ background: "var(--peach)" }}>{p.ip}</span>
            <span className="pill">{p.typeLabel}</span>
          </div>
          <h1
            className="font-display"
            style={{ fontSize: "clamp(26px,3.6vw,40px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.8px", margin: "0 0 16px" }}
          >
            {p.name}
          </h1>
          <div className="font-display" style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.2, color: "var(--orange-dark)", whiteSpace: "nowrap", marginBottom: 6 }}>
            {p.priceLabel}
          </div>
          <p style={{ margin: "0 0 4px", fontSize: 13, color: "var(--muted-2)", fontWeight: 600 }}>{t.priceNote}</p>
          {p.hasOld && (
            <p style={{ margin: "0 0 20px", fontSize: 12.5, color: "var(--muted-3)", fontWeight: 600 }}>
              {t.oldPriceNote} {p.oldLabel}
            </p>
          )}

          <div className="card" style={{ borderRadius: 16, overflow: "hidden", marginBottom: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "12px 16px", borderBottom: "1px solid var(--line)", fontSize: 13.5 }}>
              <span style={{ fontWeight: 600, color: "var(--muted-2)", flex: "0 0 auto" }}>{t.specIp}</span>
              <span style={{ fontWeight: 700, textAlign: "right", flex: "1 1 auto", minWidth: 0 }}>{p.ip}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "12px 16px", borderBottom: "1px solid var(--line)", fontSize: 13.5 }}>
              <span style={{ fontWeight: 600, color: "var(--muted-2)", flex: "0 0 auto" }}>{t.specType}</span>
              <span style={{ fontWeight: 700, textAlign: "right", flex: "1 1 auto", minWidth: 0 }}>{p.typeLabel}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "12px 16px", fontSize: 13.5 }}>
              <span style={{ fontWeight: 600, color: "var(--muted-2)", flex: "0 0 auto" }}>{t.specPack}</span>
              <span style={{ fontWeight: 700, textAlign: "right", flex: "1 1 auto", minWidth: 0 }}>{p.pack}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
            <button
              onClick={() => addToCart(p.slug, p.name)}
              className="btn btn-yellow"
              style={{ flex: "1 1 200px" }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#2E1A10" strokeWidth={2.1} strokeLinecap="round">
                <path d="M3 4h2.2l2.3 11h10.2l2-7.5H6.4"></path>
                <circle cx="9.5" cy="19" r="1.6" fill="#2E1A10" stroke="none"></circle>
                <circle cx="17" cy="19" r="1.6" fill="#2E1A10" stroke="none"></circle>
              </svg>
              {t.addToCart}
            </button>
            <a href={p.waOrderLink} target="_blank" rel="noopener" className="btn btn-orange" style={{ flex: "1 1 200px", textAlign: "center" }}>
              {t.orderWa}
            </a>
            <a href={SHOPEE_URL} target="_blank" rel="noopener" className="btn btn-white" style={{ flex: "1 1 160px", textAlign: "center" }}>
              {t.buyShopee}
            </a>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: "var(--muted)" }}>{t.detailPickup}</p>
        </div>
      </div>

      {relatedDecorated.length > 0 && (
        <div style={{ marginTop: 46 }}>
          <h2 className="font-display" style={{ fontSize: 24, fontWeight: 800, margin: "0 0 16px" }}>
            {t.related}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            {relatedDecorated.map((r) => (
              <ProductCard key={r.slug} p={r} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
