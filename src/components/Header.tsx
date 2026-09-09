"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { INSTAGRAM_URL, WA_NUMBER } from "@/lib/constants";

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        backdropFilter: "blur(12px)",
        background: "rgba(251,243,231,.9)",
        borderBottom: "2px solid var(--ink)",
      }}
    >
      <div
        className="container"
        style={{
          padding: "11px 20px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 10, flex: "0 0 auto" }}
        >
          <Image src="/logo.png" alt="ITGabut Toys" width={48} height={48} style={{ objectFit: "contain" }} />
          <span style={{ display: "block", lineHeight: 1.15 }}>
            <span
              className="font-display"
              style={{
                display: "block",
                fontWeight: 800,
                fontSize: 21,
                letterSpacing: "-.4px",
                color: "var(--ink)",
              }}
            >
              ITGabut <span style={{ color: "var(--orange)" }}>Toys</span>
            </span>
            <span
              style={{
                display: "block",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "1.3px",
                textTransform: "uppercase",
                color: "var(--muted-2)",
                whiteSpace: "nowrap",
              }}
            >
              Blokees &amp; figure store
            </span>
          </span>
        </Link>

        <nav className="hide-mobile" style={{ display: "flex", gap: 2, marginLeft: "auto", flexWrap: "wrap" }}>
          <Link
            href="/#katalog"
            style={{ padding: "8px 11px", borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}
          >
            {t.navCatalog}
          </Link>
          <Link
            href="/blog"
            style={{ padding: "8px 11px", borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}
          >
            {t.navBlog}
          </Link>
          <Link
            href="/#lokasi"
            style={{ padding: "8px 11px", borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}
          >
            {t.navLocation}
          </Link>
          <Link
            href="/#tentang"
            style={{ padding: "8px 11px", borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}
          >
            {t.navAbout}
          </Link>
        </nav>

        <div style={{ display: "flex", gap: 7, alignItems: "center", marginLeft: "auto" }}>
          <div style={{ display: "flex", border: "2px solid var(--ink)", borderRadius: 10, overflow: "hidden" }}>
            <button
              onClick={() => setLang("id")}
              style={{
                padding: "7px 10px",
                border: 0,
                fontSize: 11.5,
                fontWeight: 800,
                cursor: "pointer",
                background: lang === "id" ? "var(--ink)" : "#fff",
                color: lang === "id" ? "var(--bg)" : "var(--ink)",
              }}
            >
              ID
            </button>
            <button
              onClick={() => setLang("en")}
              style={{
                padding: "7px 10px",
                border: 0,
                fontSize: 11.5,
                fontWeight: 800,
                cursor: "pointer",
                background: lang === "en" ? "var(--ink)" : "#fff",
                color: lang === "en" ? "var(--bg)" : "var(--ink)",
              }}
            >
              EN
            </button>
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener"
            title="Instagram"
            className="hide-mobile"
            style={{
              width: 36,
              height: 36,
              display: "grid",
              placeItems: "center",
              border: "2px solid var(--ink)",
              borderRadius: 10,
              background: "#fff",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2E1A10" strokeWidth={2}>
              <rect x="3" y="3" width="18" height="18" rx="5"></rect>
              <circle cx="12" cy="12" r="4"></circle>
              <circle cx="17.4" cy="6.6" r="1.2" fill="#2E1A10" stroke="none"></circle>
            </svg>
          </a>
          <Link
            href="/keranjang"
            title={t.cart}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 12px",
              border: "2px solid var(--ink)",
              borderRadius: 10,
              background: "var(--yellow)",
              fontSize: 12.5,
              fontWeight: 800,
              color: "var(--ink)",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2E1A10" strokeWidth={2.1} strokeLinecap="round">
              <path d="M3 4h2.2l2.3 11h10.2l2-7.5H6.4"></path>
              <circle cx="9.5" cy="19" r="1.6" fill="#2E1A10" stroke="none"></circle>
              <circle cx="17" cy="19" r="1.6" fill="#2E1A10" stroke="none"></circle>
            </svg>
            {cart.length}
          </Link>
          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noopener"
            className="hide-mobile"
            style={{
              padding: "9px 13px",
              border: "2px solid var(--ink)",
              borderRadius: 10,
              background: "var(--orange)",
              color: "#fff",
              fontSize: 12.5,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            WhatsApp
          </a>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className="show-mobile"
            style={{
              display: "none",
              width: 36,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid var(--ink)",
              borderRadius: 10,
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2E1A10" strokeWidth={2.2} strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="show-mobile"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: "0 20px 14px",
            borderTop: "1px solid var(--line)",
          }}
        >
          <Link href="/#katalog" onClick={() => setMenuOpen(false)} style={{ padding: "10px 4px", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
            {t.navCatalog}
          </Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)} style={{ padding: "10px 4px", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
            {t.navBlog}
          </Link>
          <Link href="/#lokasi" onClick={() => setMenuOpen(false)} style={{ padding: "10px 4px", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
            {t.navLocation}
          </Link>
          <Link href="/#tentang" onClick={() => setMenuOpen(false)} style={{ padding: "10px 4px", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
            {t.navAbout}
          </Link>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener" style={{ padding: "10px 4px", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
            Instagram
          </a>
          <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener" style={{ padding: "10px 4px", fontSize: 14, fontWeight: 700, color: "var(--orange)" }}>
            WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
