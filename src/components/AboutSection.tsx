"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, SHOPEE_URL, WA_DISPLAY, WA_NUMBER } from "@/lib/constants";

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="tentang" className="container" style={{ padding: "64px 20px 20px" }}>
      <div
        className="card"
        style={{
          borderRadius: 22,
          boxShadow: "7px 7px 0 var(--ink)",
          padding: 34,
          display: "flex",
          flexWrap: "wrap",
          gap: 34,
          alignItems: "center",
        }}
      >
        <div style={{ flex: "0 1 200px", minWidth: 150, display: "grid", placeItems: "center" }}>
          <Image src="/logo.png" alt="ITGabut Toys" width={200} height={200} style={{ width: "100%", maxWidth: 200, height: "auto" }} />
        </div>
        <div style={{ flex: "1 1 380px", minWidth: 0 }}>
          <h2
            className="font-display"
            style={{ fontSize: "clamp(26px,3.2vw,36px)", fontWeight: 800, letterSpacing: "-.8px", margin: "0 0 14px" }}
          >
            {t.aboutTitle}
          </h2>
          <p style={{ margin: "0 0 12px", fontSize: 15.5, lineHeight: 1.7, color: "var(--muted)" }}>{t.aboutBody1}</p>
          <p style={{ margin: "0 0 22px", fontSize: 15.5, lineHeight: 1.7, color: "var(--muted)" }}>{t.aboutBody2}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener"
              style={{
                padding: "13px 20px",
                border: "2px solid var(--ink)",
                borderRadius: 13,
                background: "var(--orange)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              WhatsApp {WA_DISPLAY}
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener"
              style={{
                padding: "13px 20px",
                border: "2px solid var(--ink)",
                borderRadius: 13,
                background: "#fff",
                color: "var(--ink)",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {INSTAGRAM_HANDLE}
            </a>
            <a
              href={SHOPEE_URL}
              target="_blank"
              rel="noopener"
              style={{
                padding: "13px 20px",
                border: "2px solid var(--ink)",
                borderRadius: 13,
                background: "#fff",
                color: "var(--ink)",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Shopee
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
