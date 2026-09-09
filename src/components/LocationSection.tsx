"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LocationSection() {
  const { t } = useLanguage();

  return (
    <section id="lokasi" className="container" style={{ padding: "64px 20px 0" }}>
      <h2
        className="font-display"
        style={{ fontSize: "clamp(28px,3.4vw,42px)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 8px" }}
      >
        {t.locTitle}
      </h2>
      <p style={{ margin: "0 0 26px", fontSize: 15, color: "var(--muted)", maxWidth: "64ch" }}>{t.locSub}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(258px, 1fr))", gap: 18 }}>
        <div className="card" style={{ padding: 24, boxShadow: "5px 5px 0 var(--orange)" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.2px", color: "var(--orange)", marginBottom: 6 }}>
            {t.locMain}
          </div>
          <h3 className="font-display" style={{ fontSize: 22, fontWeight: 800, margin: "0 0 8px" }}>
            Citra Raya
          </h3>
          <p style={{ margin: "0 0 14px", fontSize: 14, lineHeight: 1.6, color: "var(--muted)" }}>
            Perumahan Citra Raya, Tangerang
          </p>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "var(--muted)" }}>{t.locCitra}</p>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.2px", color: "var(--muted-2)", marginBottom: 6 }}>
            COD
          </div>
          <h3 className="font-display" style={{ fontSize: 22, fontWeight: 800, margin: "0 0 8px" }}>
            Alam Sutera
          </h3>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "var(--muted)" }}>{t.locAlam}</p>
        </div>
        <div className="card" style={{ padding: 24, boxShadow: "5px 5px 0 var(--green)" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.2px", color: "var(--muted-2)", marginBottom: 6 }}>
            COD
          </div>
          <h3 className="font-display" style={{ fontSize: 22, fontWeight: 800, margin: "0 0 8px" }}>
            Gading Serpong
          </h3>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "var(--muted)" }}>{t.locGading}</p>
        </div>
      </div>
    </section>
  );
}
