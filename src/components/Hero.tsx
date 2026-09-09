"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { WA_NUMBER } from "@/lib/constants";
import ProductImage from "@/components/ProductImage";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section
      className="container"
      style={{
        padding: "52px 20px 26px",
        display: "flex",
        flexWrap: "wrap",
        gap: 40,
        alignItems: "center",
      }}
    >
      <div style={{ flex: "1 1 430px", minWidth: 0 }}>
        <div
          className="pill"
          style={{ marginBottom: 20 }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)" }} />
          {t.heroBadge}
        </div>
        <h1
          className="font-display"
          style={{
            fontWeight: 800,
            fontSize: "clamp(36px,5.2vw,64px)",
            lineHeight: 1.03,
            letterSpacing: "-1.5px",
            margin: "0 0 18px",
          }}
        >
          {t.h1a}
          <span style={{ color: "var(--orange)" }}>{t.h1b}</span>
        </h1>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.65,
            color: "var(--muted)",
            maxWidth: "58ch",
            margin: "0 0 28px",
          }}
        >
          {t.lead}
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/#katalog" className="btn btn-dark" style={{ boxShadow: "4px 4px 0 var(--orange)" }}>
            {t.ctaCatalog}
          </Link>
          <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener" className="btn btn-white">
            {t.ctaWa}
          </a>
        </div>
      </div>
      <div
        style={{
          flex: "1 1 320px",
          minWidth: 0,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
        }}
      >
        <div
          className="card"
          style={{ gridColumn: "span 2", boxShadow: "6px 6px 0 var(--orange)", overflow: "hidden" }}
        >
          <div style={{ aspectRatio: "16/10" }}>
            <ProductImage name="Rak Blokees ITGabut Toys" seed="hero-1" />
          </div>
        </div>
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ aspectRatio: "1" }}>
            <ProductImage name="Figure Blokees" seed="hero-2" />
          </div>
        </div>
        <div className="card" style={{ boxShadow: "4px 4px 0 var(--green)", overflow: "hidden" }}>
          <div style={{ aspectRatio: "1" }}>
            <ProductImage name="Blind Box Blokees" seed="hero-3" />
          </div>
        </div>
      </div>
    </section>
  );
}
