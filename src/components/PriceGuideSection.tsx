"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { rupiah } from "@/lib/format";
import type { LineSummary } from "@/lib/productLines";

/**
 * "How much are Blokees?" answered directly: one lead sentence plus a per-line price table
 * computed from the live catalog, so search snippets and AI answers can quote real figures.
 */
export default function PriceGuideSection({ lines, range }: { lines: LineSummary[]; range: { min: number; max: number } }) {
  const { t } = useLanguage();
  if (lines.length === 0) return null;
  const fmt = { blind: t.fmtBlind, nonblind: t.fmtNonBlind, mixed: t.fmtMixed };
  const cell: React.CSSProperties = { textAlign: "left", padding: "10px 14px", borderTop: "1px solid var(--line)", verticalAlign: "top" };

  return (
    <section id="harga" className="container" style={{ padding: "64px 20px 0" }}>
      <h2 className="font-display" style={{ fontSize: "clamp(28px,3.4vw,42px)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 10px" }}>
        {t.priceGuideTitle}
      </h2>
      <p style={{ margin: "0 0 20px", fontSize: 15.5, lineHeight: 1.7, color: "var(--muted)", maxWidth: "70ch" }}>
        {t.priceGuideLead.replace("{min}", rupiah(range.min)).replace("{max}", rupiah(range.max))}
      </p>
      <div className="card" style={{ borderRadius: 16, overflowX: "auto", maxWidth: 860 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14.5, lineHeight: 1.5 }}>
          <thead>
            <tr style={{ background: "var(--ink)", color: "var(--bg)" }}>
              {[t.priceGuideLine, t.priceGuideFormat, t.priceGuideCount, t.priceGuideRange].map((h) => (
                <th key={h} scope="col" style={{ textAlign: "left", padding: "11px 14px", fontWeight: 700 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={l.name} style={{ background: i % 2 ? "var(--bg)" : "#fff" }}>
                <th scope="row" style={{ ...cell, fontWeight: 700, color: "var(--ink)" }}>
                  {l.name}
                </th>
                <td style={{ ...cell, color: "var(--muted)" }}>{fmt[l.format]}</td>
                <td style={{ ...cell, color: "var(--muted)" }}>{l.count}</td>
                <td style={{ ...cell, fontWeight: 700, color: "var(--orange-dark)", whiteSpace: "nowrap" }}>
                  {l.min === l.max ? rupiah(l.min) : `${rupiah(l.min)} – ${rupiah(l.max)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ margin: "18px 0 0", fontSize: 14.5, color: "var(--muted)" }}>
        <span style={{ fontWeight: 700, color: "var(--ink)" }}>{t.priceGuideMore}</span>{" "}
        <Link href="/blog/apa-itu-blokees" style={{ fontWeight: 700 }}>
          {t.guideWhatIs}
        </Link>
        {" · "}
        <Link href="/blog/champion-class-vs-galaxy-version" style={{ fontWeight: 700 }}>
          {t.guideCcGv}
        </Link>
        {" · "}
        <Link href="/blog/arti-rasio-secret-blind-box-blokees" style={{ fontWeight: 700 }}>
          {t.guideRatio}
        </Link>
      </p>
    </section>
  );
}
