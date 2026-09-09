"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useCartLines } from "@/lib/useCartLines";
import { rupiah } from "@/lib/format";
import { MALLS, waLink } from "@/lib/constants";

type Method = "" | "pickup" | "cod" | "ship";

export default function CheckoutClient() {
  const { t } = useLanguage();
  const { lines, subtotal, discount, grand, cartReady } = useCartLines();
  const [method, setMethod] = useState<Method>("");
  const [mall, setMall] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", prov: "", city: "", addr: "" });
  const [confirm, setConfirm] = useState(false);

  const contactOk = form.name.trim() !== "" && form.phone.trim() !== "";
  const shipOk = contactOk && form.prov.trim() !== "" && form.city.trim() !== "" && form.addr.trim() !== "";
  const canSubmit =
    cartReady && contactOk && (method === "pickup" || (method === "cod" && !!mall) || (method === "ship" && shipOk));

  const methodMeta: Record<Exclude<Method, "">, [string, string]> = {
    pickup: [t.mPickup, t.mPickupDesc],
    cod: [t.mCod, t.mCodDesc],
    ship: [t.mShip, t.mShipDesc],
  };

  const methodText = method === "cod" ? `${t.waCod} ${mall}` : method === "ship" ? t.waShip : t.waPickup;

  const waMsg = useMemo(() => {
    const itemsText = lines
      .map((l, n) => `${n + 1}. ${l.name} — ${parseInt(l.qty, 10) || 0} ${t.qtyUnit} (${l.variantLabel}) — ${l.lineLabel}`)
      .join("\n");
    const header = [
      `${t.waIntro} (${methodText}).`,
      `${t.waRecipient}: ${form.name}`,
      `${t.waPhone}: ${form.phone}`,
      method === "ship" ? `${t.waAddress}: ${form.addr}, ${form.city}, ${form.prov}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    return (
      header +
      "\n\n" +
      [`${t.waItems}:`, itemsText].join("\n") +
      "\n\n" +
      [`${t.subtotal}: ${rupiah(subtotal)}`, `${t.discount}: -${rupiah(discount)}`, `${t.estTotal}: ${rupiah(grand)}`].join("\n")
    );
  }, [lines, form, method, mall, methodText, subtotal, discount, grand, t]);

  const link = waLink(waMsg);

  const sendOrder = () => {
    window.open(link, "_blank");
    setConfirm(false);
  };

  return (
    <section className="container" style={{ padding: "30px 20px 60px" }}>
      <Link
        href="/keranjang"
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
        ← {t.backToCart}
      </Link>
      <h1 className="font-display" style={{ fontSize: "clamp(28px,3.6vw,42px)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 6px" }}>
        {t.coTitle}
      </h1>
      <p style={{ margin: "0 0 24px", fontSize: 15, color: "var(--muted)" }}>{t.coSub}</p>

      {lines.length === 0 ? (
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
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
          <div style={{ flex: "1 1 420px", minWidth: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 22 }}>
              {(["pickup", "cod", "ship"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setMethod(k)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    textAlign: "left",
                    padding: 18,
                    border: `2px solid ${method === k ? "var(--orange)" : "var(--ink)"}`,
                    borderRadius: 16,
                    background: method === k ? "#FFF3E9" : "#fff",
                    cursor: "pointer",
                    boxShadow: "4px 4px 0 var(--ink)",
                  }}
                >
                  <span
                    style={{
                      flex: "0 0 auto",
                      width: 20,
                      height: 20,
                      border: "2px solid var(--ink)",
                      borderRadius: "50%",
                      background: method === k ? "var(--orange)" : "var(--bg)",
                    }}
                  />
                  <span style={{ display: "block" }}>
                    <span className="font-display" style={{ display: "block", fontSize: 18, fontWeight: 800, color: "var(--ink)" }}>
                      {methodMeta[k][0]}
                    </span>
                    <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>{methodMeta[k][1]}</span>
                  </span>
                </button>
              ))}
            </div>

            {method === "cod" && (
              <div className="card" style={{ borderRadius: 18, padding: 20, marginBottom: 22 }}>
                <div className="font-display" style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>
                  {t.mCodDesc}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {MALLS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMall(m)}
                      style={{
                        padding: "12px 15px",
                        border: "2px solid var(--ink)",
                        borderRadius: 12,
                        fontSize: 13.5,
                        fontWeight: 700,
                        cursor: "pointer",
                        background: mall === m ? "var(--orange)" : "#fff",
                        color: mall === m ? "#fff" : "var(--ink)",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!!method && (
              <div
                className="card"
                style={{
                  borderRadius: 18,
                  padding: 20,
                  marginBottom: 22,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                  gap: 14,
                }}
              >
                <label style={{ display: "block" }}>
                  <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted-2)", marginBottom: 6 }}>{t.fName}</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    style={{ width: "100%", padding: 12, border: "2px solid var(--ink)", borderRadius: 11, background: "var(--bg)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}
                  />
                </label>
                <label style={{ display: "block" }}>
                  <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted-2)", marginBottom: 6 }}>{t.fPhone}</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    style={{ width: "100%", padding: 12, border: "2px solid var(--ink)", borderRadius: 11, background: "var(--bg)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}
                  />
                </label>
              </div>
            )}

            {method === "ship" && (
              <div
                className="card"
                style={{
                  borderRadius: 18,
                  padding: 20,
                  marginBottom: 22,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                  gap: 14,
                }}
              >
                <label style={{ display: "block" }}>
                  <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted-2)", marginBottom: 6 }}>{t.fProv}</span>
                  <input
                    type="text"
                    value={form.prov}
                    onChange={(e) => setForm((f) => ({ ...f, prov: e.target.value }))}
                    style={{ width: "100%", padding: 12, border: "2px solid var(--ink)", borderRadius: 11, background: "var(--bg)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}
                  />
                </label>
                <label style={{ display: "block" }}>
                  <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted-2)", marginBottom: 6 }}>{t.fCity}</span>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    style={{ width: "100%", padding: 12, border: "2px solid var(--ink)", borderRadius: 11, background: "var(--bg)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}
                  />
                </label>
                <label style={{ display: "block", gridColumn: "1/-1" }}>
                  <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted-2)", marginBottom: 6 }}>{t.fAddr}</span>
                  <textarea
                    rows={3}
                    value={form.addr}
                    onChange={(e) => setForm((f) => ({ ...f, addr: e.target.value }))}
                    style={{ width: "100%", padding: 12, border: "2px solid var(--ink)", borderRadius: 11, background: "var(--bg)", fontSize: 14, fontWeight: 600, color: "var(--ink)", resize: "vertical", fontFamily: "inherit" }}
                  />
                </label>
              </div>
            )}
          </div>

          <aside
            className="card"
            style={{ flex: "0 1 320px", minWidth: 270, position: "sticky", top: 92, borderRadius: 20, boxShadow: "6px 6px 0 var(--orange)", padding: 22 }}
          >
            <div className="font-display" style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>
              {t.orderSummary}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 14 }}>
              {lines.map((l) => (
                <div key={l.slug} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13, fontWeight: 600 }}>
                  <span style={{ minWidth: 0, color: "var(--muted)" }}>{l.name}</span>
                  <span style={{ flex: "0 0 auto", whiteSpace: "nowrap" }}>
                    {l.qty} {t.qtyUnit}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "2px dashed var(--line)", paddingTop: 14, display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14, fontWeight: 600, marginBottom: 9 }}>
              <span style={{ color: "var(--muted-2)" }}>{t.subtotal}</span>
              <span>{rupiah(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14, fontWeight: 700, marginBottom: 14, color: "var(--green-dark)" }}>
              <span>{t.discount}</span>
              <span>-{rupiah(discount)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", marginBottom: 18 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted-2)" }}>{t.estTotal}</span>
              <span className="font-display" style={{ fontSize: 26, fontWeight: 800, color: "var(--orange-dark)", whiteSpace: "nowrap" }}>
                {rupiah(grand)}
              </span>
            </div>
            {!canSubmit && (
              <p style={{ margin: 0, padding: "11px 13px", border: "2px solid var(--yellow)", borderRadius: 12, background: "#FFF7E4", fontSize: 12.5, fontWeight: 600, lineHeight: 1.55, color: "var(--muted)" }}>
                {t.coFillFirst}
              </p>
            )}
            {canSubmit && (
              <button
                onClick={() => setConfirm(true)}
                style={{
                  width: "100%",
                  padding: 15,
                  border: "2px solid var(--ink)",
                  borderRadius: 14,
                  background: "var(--orange)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "4px 4px 0 var(--ink)",
                }}
              >
                {t.review} →
              </button>
            )}
          </aside>
        </div>
      )}

      {confirm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(46,26,16,.6)", display: "grid", placeItems: "center", padding: 20 }}>
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              maxHeight: "86vh",
              overflow: "auto",
              border: "2px solid var(--ink)",
              borderRadius: 22,
              background: "var(--bg)",
              boxShadow: "8px 8px 0 var(--ink)",
              padding: 26,
            }}
          >
            <div className="font-display" style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
              {t.review}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--orange)", marginBottom: 18 }}>
              {t.methodLabel}: {methodText}
            </div>
            <div className="card" style={{ borderRadius: 16, overflow: "hidden", marginBottom: 18 }}>
              {lines.map((l) => (
                <div key={l.slug} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "12px 15px", borderBottom: "1px solid var(--line)", fontSize: 13.5 }}>
                  <span style={{ minWidth: 0, fontWeight: 600 }}>
                    {l.name}
                    <span style={{ display: "block", fontSize: 12, color: "var(--muted-2)", fontWeight: 600 }}>
                      {l.qty} {t.qtyUnit} · {l.variantLabel}
                    </span>
                  </span>
                  <span style={{ flex: "0 0 auto", fontWeight: 800, whiteSpace: "nowrap" }}>{l.lineLabel}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "12px 15px", fontSize: 13.5, fontWeight: 600, color: "var(--muted)" }}>
                <span>{t.subtotal}</span>
                <span>{rupiah(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "0 15px 12px", fontSize: 13.5, fontWeight: 700, color: "var(--green-dark)" }}>
                <span>{t.discount}</span>
                <span>-{rupiah(discount)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", padding: "14px 15px", background: "#FFF3E9", borderTop: "2px dashed var(--line)" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted-2)" }}>{t.estTotal}</span>
                <span className="font-display" style={{ fontSize: 24, fontWeight: 800, color: "var(--orange-dark)" }}>
                  {rupiah(grand)}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={sendOrder}
                style={{
                  flex: "1 1 200px",
                  padding: 15,
                  border: "2px solid var(--ink)",
                  borderRadius: 14,
                  background: "var(--orange)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "4px 4px 0 var(--ink)",
                }}
              >
                {t.submit}
              </button>
              <button
                onClick={() => setConfirm(false)}
                style={{ flex: "0 1 140px", padding: 15, border: "2px solid var(--ink)", borderRadius: 14, background: "#fff", color: "var(--ink)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
              >
                {t.editOrder}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
