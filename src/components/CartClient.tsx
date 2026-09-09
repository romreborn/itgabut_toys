"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useCartLines } from "@/lib/useCartLines";
import ProductImage from "@/components/ProductImage";
import { rupiah } from "@/lib/format";

export default function CartClient() {
  const { t } = useLanguage();
  const { lines, subtotal, discount, grand, cartReady, patchLine, removeLine } = useCartLines();

  return (
    <section className="container" style={{ padding: "30px 20px 60px" }}>
      <Link
        href="/"
        style={{
          display: "inline-block",
          marginBottom: 20,
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
        ← {t.keepShopping}
      </Link>
      <h1 className="font-display" style={{ fontSize: "clamp(28px,3.6vw,42px)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 22px" }}>
        {t.cartTitle}
      </h1>

      {lines.length === 0 && (
        <div style={{ border: "2px dashed var(--muted-3)", borderRadius: 18, padding: "52px 24px", textAlign: "center", background: "#fff" }}>
          <p style={{ margin: "0 0 18px", fontSize: 15, color: "var(--muted)" }}>{t.cartEmpty}</p>
          <Link
            href="/#katalog"
            style={{
              display: "inline-block",
              padding: "13px 22px",
              border: "2px solid var(--ink)",
              borderRadius: 12,
              background: "var(--orange)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              boxShadow: "3px 3px 0 var(--ink)",
            }}
          >
            {t.cartEmptyCta}
          </Link>
        </div>
      )}

      {lines.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
          <div style={{ flex: "1 1 420px", minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            {lines.map((l) => (
              <div
                key={l.slug}
                className="card"
                style={{ borderRadius: 18, padding: 16, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}
              >
                <div style={{ flex: "0 0 92px", width: 92, height: 92, border: "2px solid var(--ink)", borderRadius: 12, overflow: "hidden" }}>
                  <ProductImage name={l.name} seed={`prod-${l.slug}`} imageUrl={l.imageUrl} />
                </div>
                <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".7px", color: "var(--orange)", textTransform: "uppercase", marginBottom: 4 }}>
                    {l.ip}
                  </div>
                  <div className="font-display" style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.25, marginBottom: 4 }}>
                    {l.name}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--muted-2)", marginBottom: 12 }}>
                    {l.priceLabel} / {t.qtyUnit}
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "flex-end" }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-2)", marginBottom: 5 }}>{t.qtyLabel}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={l.qty}
                          onChange={(e) => patchLine(l.slug, { qty: e.target.value.replace(/[^0-9]/g, "") })}
                          placeholder="0"
                          style={{
                            width: 66,
                            padding: 10,
                            border: "2px solid var(--ink)",
                            borderRadius: 11,
                            background: "var(--bg)",
                            fontSize: 14,
                            fontWeight: 700,
                            textAlign: "center",
                            color: "var(--ink)",
                          }}
                        />
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>{t.qtyUnit}</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-2)", marginBottom: 5 }}>{t.variant}</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => patchLine(l.slug, { variant: "single" })}
                          style={{
                            padding: "10px 13px",
                            border: "2px solid var(--ink)",
                            borderRadius: 11,
                            fontSize: 12.5,
                            fontWeight: 700,
                            cursor: "pointer",
                            background: l.variant === "set" && l.isBlind ? "#fff" : "var(--orange)",
                            color: l.variant === "set" && l.isBlind ? "var(--ink)" : "#fff",
                          }}
                        >
                          {t.vSingle}
                        </button>
                        {l.isBlind && (
                          <button
                            onClick={() => patchLine(l.slug, { variant: "set" })}
                            style={{
                              padding: "10px 13px",
                              border: "2px solid var(--ink)",
                              borderRadius: 11,
                              fontSize: 12.5,
                              fontWeight: 700,
                              cursor: "pointer",
                              background: l.variant === "set" ? "var(--orange)" : "#fff",
                              color: l.variant === "set" ? "#fff" : "var(--ink)",
                            }}
                          >
                            {t.vSet}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, marginLeft: "auto" }}>
                  <div className="font-display" style={{ fontSize: 19, fontWeight: 800, whiteSpace: "nowrap" }}>
                    {l.lineLabel}
                  </div>
                  <button
                    onClick={() => removeLine(l.slug)}
                    style={{
                      padding: "7px 11px",
                      border: "2px solid var(--line-2)",
                      borderRadius: 10,
                      background: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--muted-2)",
                      cursor: "pointer",
                    }}
                  >
                    {t.remove}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside
            className="card"
            style={{ flex: "0 1 320px", minWidth: 270, position: "sticky", top: 92, borderRadius: 20, boxShadow: "6px 6px 0 var(--orange)", padding: 22 }}
          >
            <div className="font-display" style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>
              {t.orderSummary}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14, fontWeight: 600, marginBottom: 9 }}>
              <span style={{ color: "var(--muted-2)" }}>{t.subtotal}</span>
              <span>{rupiah(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14, fontWeight: 700, marginBottom: 14, color: "var(--green-dark)" }}>
              <span>{t.discount}</span>
              <span>-{rupiah(discount)}</span>
            </div>
            <div style={{ borderTop: "2px dashed var(--line)", paddingTop: 14, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted-2)" }}>{t.estTotal}</span>
              <span className="font-display" style={{ fontSize: 26, fontWeight: 800, color: "var(--orange-dark)", whiteSpace: "nowrap" }}>
                {rupiah(grand)}
              </span>
            </div>
            <p style={{ margin: "0 0 18px", fontSize: 12, lineHeight: 1.6, color: "var(--muted-3)" }}>{t.estNote}</p>
            {!cartReady && (
              <p
                style={{
                  margin: "0 0 14px",
                  padding: "11px 13px",
                  border: "2px solid var(--yellow)",
                  borderRadius: 12,
                  background: "#FFF7E4",
                  fontSize: 12.5,
                  fontWeight: 600,
                  lineHeight: 1.55,
                  color: "var(--muted)",
                }}
              >
                {t.needQty}
              </p>
            )}
            {cartReady && (
              <Link
                href="/checkout"
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                  padding: 15,
                  border: "2px solid var(--ink)",
                  borderRadius: 14,
                  background: "var(--orange)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  boxShadow: "4px 4px 0 var(--ink)",
                }}
              >
                {t.proceed} →
              </Link>
            )}
          </aside>
        </div>
      )}
    </section>
  );
}
