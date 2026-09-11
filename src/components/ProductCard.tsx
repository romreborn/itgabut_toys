"use client";

import Link from "next/link";
import { DecoratedProduct } from "@/lib/decorate";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

export default function ProductCard({ p }: { p: DecoratedProduct }) {
  const { addToCart } = useCart();
  const { t } = useLanguage();

  return (
    <article
      className="card"
      style={{
        borderRadius: 18,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform .12s, box-shadow .12s",
      }}
    >
      <Link href={`/produk/${p.slug}`} target="_blank" rel="noopener noreferrer" style={{ display: "contents" }}>
        <div style={{ position: "relative", aspectRatio: "1", borderBottom: "2px solid var(--ink)" }}>
          <ProductImage name={p.name} seed={`prod-${p.slug}`} imageUrl={p.imageUrl} />
          {p.hasTag && (
            <div
              style={{
                position: "absolute",
                top: 9,
                right: 9,
                padding: "4px 9px",
                border: "2px solid var(--ink)",
                borderRadius: 999,
                background: "#fff",
                fontSize: 10,
                fontWeight: 800,
                pointerEvents: "none",
              }}
            >
              {p.tagLabel}
            </div>
          )}
        </div>
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: ".7px",
                color: "var(--orange)",
                textTransform: "uppercase",
              }}
            >
              {p.ip}
            </span>
            {p.isBlind && <span className="badge">Blind Box</span>}
          </div>
          <h3
            className="font-display"
            style={{ margin: 0, fontSize: 16, fontWeight: 700, lineHeight: 1.25, letterSpacing: "-.2px", color: "var(--ink)" }}
          >
            {p.name}
          </h3>
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 9, paddingTop: 6 }}>
            <div className="font-display" style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.25, whiteSpace: "nowrap" }}>
              {p.priceLabel}
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              <div
                style={{
                  flex: 1,
                  padding: "10px 10px",
                  border: "2px solid var(--ink)",
                  borderRadius: 11,
                  background: "var(--ink)",
                  color: "var(--bg)",
                  fontSize: 12.5,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                {t.viewDetail}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(p.slug, p.name);
                }}
                title={t.addToCart}
                style={{
                  flex: "0 0 auto",
                  width: 44,
                  height: 41,
                  display: "grid",
                  placeItems: "center",
                  border: "2px solid var(--ink)",
                  borderRadius: 11,
                  background: "var(--yellow)",
                  cursor: "pointer",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2E1A10" strokeWidth={2.1} strokeLinecap="round">
                  <path d="M3 4h2.2l2.3 11h10.2l2-7.5H6.4"></path>
                  <circle cx="9.5" cy="19" r="1.6" fill="#2E1A10" stroke="none"></circle>
                  <circle cx="17" cy="19" r="1.6" fill="#2E1A10" stroke="none"></circle>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
