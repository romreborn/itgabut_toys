"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { INSTAGRAM_URL, SHOPEE_URL, WA_DISPLAY, WA_NUMBER } from "@/lib/constants";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer style={{ marginTop: 64, borderTop: "2px solid var(--ink)", background: "var(--ink)", color: "var(--bg)" }}>
      <div
        className="container"
        style={{
          padding: "50px 20px 26px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 32,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Image src="/logo.png" alt="ITGabut Toys" width={44} height={44} style={{ objectFit: "contain" }} />
            <span className="font-display" style={{ fontSize: 21, fontWeight: 800 }}>
              ITGabut <span style={{ color: "var(--orange)" }}>Toys</span>
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#C9B7A9", maxWidth: "36ch" }}>
            {t.footerAbout}
          </p>
        </div>
        <div>
          <div className="font-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
            {t.footerShop}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 14, fontWeight: 600 }}>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener" style={{ color: "var(--bg)" }}>
              Instagram · @itgabut.hobby
            </a>
            <a href={SHOPEE_URL} target="_blank" rel="noopener" style={{ color: "var(--bg)" }}>
              Shopee · shopee.co.id/itgabut
            </a>
            <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener" style={{ color: "var(--bg)" }}>
              WhatsApp · {WA_DISPLAY}
            </a>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--muted-2)" }}>
              Toco.id{" "}
              <span
                style={{
                  padding: "3px 8px",
                  border: "1px solid var(--muted-2)",
                  borderRadius: 999,
                  fontSize: 10.5,
                  fontWeight: 800,
                  letterSpacing: ".6px",
                }}
              >
                SOON
              </span>
            </span>
          </div>
        </div>
        <div>
          <div className="font-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
            {t.footerCat}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 14, fontWeight: 600 }}>
            <Link href="/#katalog" style={{ color: "var(--bg)" }}>Blokees Transformers</Link>
            <Link href="/#katalog" style={{ color: "var(--bg)" }}>Blokees Marvel</Link>
            <Link href="/#katalog" style={{ color: "var(--bg)" }}>Blokees Ultraman</Link>
            <Link href="/#katalog" style={{ color: "var(--bg)" }}>Pokemon &amp; Saint Seiya</Link>
            <Link href="/#katalog" style={{ color: "var(--bg)" }}>Blokees Wheels · Blind Box</Link>
            <Link href="/blog" style={{ color: "var(--bg)" }}>{t.navBlog}</Link>
          </div>
        </div>
        <div>
          <div className="font-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
            {t.footerVisit}
          </div>
          <p style={{ margin: "0 0 12px", fontSize: 14, lineHeight: 1.7, color: "#C9B7A9" }}>
            Perumahan Citra Raya, Tangerang
          </p>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: "var(--muted-2)" }}>{t.footerArea}</p>
        </div>
      </div>
      <div
        style={{
          borderTop: "1px solid #4A3226",
          padding: "16px 20px",
          textAlign: "center",
          fontSize: 12,
          color: "var(--muted-2)",
        }}
      >
        © {year} ITGabut Toys · Citra Raya · Alam Sutera · Gading Serpong
      </div>
    </footer>
  );
}
