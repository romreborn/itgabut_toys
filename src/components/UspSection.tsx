"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function UspSection() {
  const { t } = useLanguage();
  const items = [
    { kicker: t.usp1kicker, title: t.usp1title, body: t.usp1body },
    { kicker: t.usp2kicker, title: t.usp2title, body: t.usp2body },
    { kicker: t.usp3kicker, title: t.usp3title, body: t.usp3body },
  ];

  return (
    <section className="container" style={{ padding: "44px 20px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
        {items.map((it) => (
          <div key={it.title} className="card" style={{ padding: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.3px", color: "var(--orange)", marginBottom: 8 }}>
              {it.kicker}
            </div>
            <div className="font-display" style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2, marginBottom: 8 }}>
              {it.title}
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--muted)" }}>{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
