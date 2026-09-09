const ITEMS = [
  "BLOKEES TRANSFORMERS",
  "BLOKEES MARVEL",
  "BLOKEES ULTRAMAN",
  "POKEMON",
  "SAINT SEIYA",
  "STAR WARS",
  "EVANGELION",
  "HATSUNE MIKU",
];

function Group({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      style={{ display: "flex", gap: 24, paddingRight: 24, alignItems: "center" }}
      aria-hidden={ariaHidden}
    >
      {ITEMS.map((label, idx) => (
        <span key={label} style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <span
            className="font-display"
            style={{ fontSize: 15, fontWeight: 700, color: "var(--bg)", whiteSpace: "nowrap" }}
          >
            {label}
          </span>
          <span style={{ color: "var(--orange)" }}>✦</span>
        </span>
      ))}
    </div>
  );
}

export default function Ticker() {
  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "2px solid var(--ink)",
        borderBottom: "2px solid var(--ink)",
        background: "var(--ink)",
        padding: "11px 0",
      }}
    >
      <div className="marquee-track" style={{ display: "flex", width: "max-content" }}>
        <Group />
        <Group ariaHidden />
      </div>
    </div>
  );
}
