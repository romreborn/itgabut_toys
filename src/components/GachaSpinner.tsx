"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "wheel" | "grid";
type Entry = "number" | "names";

interface GameState {
  mode: Mode;
  count: number;
  grid: string;
  rot: number;
  busy: boolean;
  active: number | null;
  result: number | null;
  showResult: boolean;
  history: number[];
  picked: number[];
  remove: boolean;
  animKey: number;
  entry: Entry;
  namesText: string;
  cheerIdx: number;
}

const INITIAL: GameState = {
  mode: "wheel",
  count: 12,
  grid: "3x3",
  rot: 0,
  busy: false,
  active: null,
  result: null,
  showResult: false,
  history: [],
  picked: [],
  remove: false,
  animKey: 0,
  entry: "number",
  namesText: "",
  cheerIdx: 0,
};

/** Segment colours, reused in order around the wheel. Matches the site palette. */
const FILLS: [string, string][] = [
  ["#EE6A26", "#fff"],
  ["#FFC93C", "#2E1A10"],
  ["#7C9A6B", "#fff"],
  ["#FFE7D6", "#2E1A10"],
  ["#C9490F", "#fff"],
  ["#F2C89C", "#2E1A10"],
];

const GRIDS = ["2x2", "3x2", "3x3", "4x2", "3x4", "4x3"];
const MAX_NAMES = 24;
const SPIN_SECONDS = 4.5;

const NOTES = ["Hoki! Ambil kotak ini.", "Kucingnya setuju.", "Ini jodohnya.", "Semoga dapat secret!"];

const CHEERS = [
  "Selamat {n}, anda cuan cuan cuannnn!",
  "Wih {n}! Hoki kamu lagi on fire nih",
  "{n} menang! Kucingnya sampai bangun dari rebahan.",
  "Selamat {n}! Rezeki anak gabut emang nggak ke mana.",
  "{n}, dompetmu aman, hadiahmu datang!",
  "Gacha master of the day: {n}!",
  "{n} kejatuhan durian runtuh, eh, hadiah runtuh!",
  "Selamat {n}! Semesta lagi pilih kasih sama kamu.",
  "{n} menang! Yang lain sabar, besok giliranmu.",
  "Cie {n}, hoki banget sih hari ini!",
  "{n}, jangan lupa traktir kucingnya ya!",
  "Selamat {n}! Tangan dinginmu terbukti ampuh.",
  "Meong meong, {n} menang! Artinya: selamat!",
  "{n}, ini bukan mimpi. Kamu beneran menang!",
];

function polar(deg: number, r: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [150 + r * Math.sin(rad), 150 - r * Math.cos(rad)];
}

function clip(text: string, max: number) {
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

export default function GachaSpinner() {
  const [s, setS] = useState<GameState>(INITIAL);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };
  useEffect(() => clearTimers, []);

  const patch = (p: Partial<GameState>) => setS((prev) => ({ ...prev, ...p }));

  /** Clears the round (timers, history, picks) before switching mode or size. */
  const reset = (p: Partial<GameState>) => {
    clearTimers();
    setS((prev) => ({
      ...prev,
      busy: false,
      active: null,
      result: null,
      showResult: false,
      picked: [],
      history: [],
      ...p,
    }));
  };

  const nameList = s.namesText
    .split(/\n|,/)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, MAX_NAMES);

  const usingNames = s.mode === "wheel" && s.entry === "names";
  const [cols, rows] = s.grid.split("x").map(Number);
  const total = usingNames ? nameList.length : s.mode === "wheel" ? s.count : cols * rows;

  const all = Array.from({ length: total }, (_, i) => i + 1);
  const pool = s.remove || s.mode === "grid" ? all.filter((n) => !s.picked.includes(n)) : all;

  const nameOf = (n: number) => (usingNames ? nameList[n - 1] || "" : "");

  const finish = (n: number) => {
    setS((prev) => {
      let ci = Math.floor(Math.random() * CHEERS.length);
      if (CHEERS.length > 1 && ci === prev.cheerIdx) ci = (ci + 1) % CHEERS.length;
      return {
        ...prev,
        busy: false,
        result: n,
        showResult: true,
        cheerIdx: ci,
        history: [n, ...prev.history].slice(0, MAX_NAMES),
        picked: [...prev.picked, n],
      };
    });
  };

  const spin = () => {
    if (s.busy || !pool.length) return;
    if (usingNames && nameList.length < 2) return;
    const k = Math.floor(Math.random() * pool.length);
    const a = 360 / pool.length;
    const center = (k + 0.5) * a;
    const target = (360 - center) % 360;
    const delta = (target - (s.rot % 360) + 360) % 360;
    patch({ busy: true, showResult: false, rot: s.rot + 360 * 6 + delta });
    later(() => finish(pool[k]), SPIN_SECONDS * 1000 + 150);
  };

  const shuffle = () => {
    if (s.busy || !pool.length) return;
    const winner = pool[Math.floor(Math.random() * pool.length)];
    const steps: number[] = [];
    let prev: number | null = null;
    for (let i = 0; i < 20; i++) {
      let n: number;
      do {
        n = pool[Math.floor(Math.random() * pool.length)];
      } while (pool.length > 1 && n === prev);
      steps.push(n);
      prev = n;
    }
    if (pool.length > 1 && steps[steps.length - 1] === winner) steps.pop();
    steps.push(winner);

    patch({ busy: true, showResult: false, active: null });
    let t = 0;
    steps.forEach((n, i) => {
      t += 55 + Math.pow(i / steps.length, 3) * 420;
      later(() => patch({ active: n }), t);
    });
    later(() => finish(winner), t + 520);
  };

  const segAngle = 360 / Math.max(1, pool.length);
  const segments = pool.map((n, i) => {
    const base = FILLS[i % FILLS.length];
    // Avoid the first and last wedge sharing a colour when the count wraps.
    const fill = pool.length % FILLS.length === 1 && i === pool.length - 1 ? FILLS[2] : base;
    const [x1, y1] = polar(i * segAngle, 142);
    const [x2, y2] = polar((i + 1) * segAngle, 142);
    const d =
      pool.length === 1
        ? "M150 8 A142 142 0 1 1 149.99 8 Z"
        : `M150 150 L${x1.toFixed(2)} ${y1.toFixed(2)} A142 142 0 ${segAngle > 180 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
    const c = (i + 0.5) * segAngle;
    const nm = clip(nameOf(n), 10);
    const len = pool.length;
    const [tx, ty] = usingNames ? polar(c, 124) : polar(c, len > 8 ? 108 : 100);
    const [nx, ny] = polar(c, 78);
    const baseNfs = len > 16 ? 10 : len > 12 ? 11.5 : len > 8 ? 13 : len > 5 ? 15 : 17;
    const estW = nm.length * baseNfs * 0.58;
    const nfs = estW > 66 ? Math.max(8, (baseNfs * 66) / estW) : baseNfs;
    return {
      key: `s${n}`,
      d,
      fill: fill[0],
      ink: fill[1],
      label: String(n),
      tx,
      ty,
      tr: `rotate(${c.toFixed(2)} ${tx.toFixed(2)} ${ty.toFixed(2)})`,
      fs: usingNames ? (len > 12 ? 13 : len > 8 ? 16 : 20) : len > 9 ? 26 : len > 6 ? 32 : 40,
      name: nm,
      nx,
      ny,
      ntr: `rotate(${(c > 180 ? c + 90 : c - 90).toFixed(2)} ${nx.toFixed(2)} ${ny.toFixed(2)})`,
      nfs,
      nMaxW: estW > 66 ? 66 : undefined,
    };
  });

  const cells = Array.from({ length: cols * rows }, (_, i) => {
    const n = i + 1;
    const out = s.picked.includes(n);
    const isActive = s.active === n && s.busy;
    return {
      key: `c${n}-${s.animKey}`,
      n,
      bg: isActive ? "#FFC93C" : out ? "#EFE6DE" : "#fff",
      fg: out ? "#C0AFA2" : "var(--ink)",
      shadow: out ? "none" : isActive ? "6px 6px 0 var(--ink)" : "3px 3px 0 var(--ink)",
      lift: isActive ? "translate(-3px,-3px) scale(1.04)" : "none",
      strike: out ? "line-through" : "none",
      anim: `gachaCellIn .45s cubic-bezier(.2,1.4,.4,1) ${(i * 0.04).toFixed(2)}s both`,
    };
  });

  const needNames = usingNames && nameList.length < 2;
  const allDrawn = (s.remove || s.mode === "grid") && pool.length === 0 && total > 0;
  const resultName = nameOf(s.result || 0);
  const resultNote = resultName
    ? CHEERS[s.cheerIdx % CHEERS.length].replace("{n}", resultName)
    : NOTES[(s.result || 0) % NOTES.length];

  const pill = (on: boolean) => ({
    background: on ? "var(--orange)" : "#fff",
    color: on ? "#fff" : "var(--ink)",
  });
  const tab = (on: boolean) => ({
    background: on ? "var(--ink)" : "#fff",
    color: on ? "var(--bg)" : "var(--ink)",
  });

  const panelTitle: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 9,
  };

  return (
    <>
      <style>{`
        @keyframes gachaStageIn{0%{opacity:0;transform:translateY(18px) scale(.94)}100%{opacity:1;transform:none}}
        @keyframes gachaCellIn{0%{opacity:0;transform:scale(.6) rotate(-8deg)}70%{transform:scale(1.06) rotate(2deg)}100%{opacity:1;transform:none}}
        @keyframes gachaResultPop{0%{opacity:0;transform:translateY(30px) scale(.8)}60%{opacity:1;transform:translateY(-6px) scale(1.04)}100%{opacity:1;transform:none}}
        @keyframes gachaCatHop{0%,100%{transform:translateY(0) rotate(-3deg)}30%{transform:translateY(-7px) rotate(3deg)}60%{transform:translateY(0) rotate(-1deg)}}
        @keyframes gachaThumbPop{0%{transform:scale(0) rotate(-40deg)}45%{transform:scale(1.25) rotate(8deg)}70%{transform:scale(.92) rotate(-4deg)}100%{transform:scale(1) rotate(0)}}
        @keyframes gachaTwinkle{0%,100%{opacity:.35;transform:scale(.8)}50%{opacity:1;transform:scale(1.15)}}
        @keyframes gachaPointerTick{0%,100%{transform:translateX(-50%) rotate(0)}50%{transform:translateX(-50%) rotate(-10deg)}}
        .gacha-spin-btn:hover:not(:disabled){background:var(--yellow-dark)}
        .gacha-shuffle-btn:hover:not(:disabled){transform:translate(2px,2px);box-shadow:2px 2px 0 var(--ink)}
        .gacha-reset-btn:hover{border-color:var(--orange);color:var(--orange)}
        @media (prefers-reduced-motion: reduce){
          .gacha-stage,.gacha-cell,.gacha-result{animation:none!important}
        }
      `}</style>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
        {/* Stage */}
        <div
          className="card"
          style={{
            flex: "1 1 440px",
            minWidth: 0,
            borderRadius: 24,
            boxShadow: "7px 7px 0 var(--ink)",
            padding: "clamp(18px,4vw,36px)",
            display: "grid",
            placeItems: "center",
            minHeight: 460,
          }}
        >
          {s.mode === "wheel" ? (
            <div
              className="gacha-stage"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 22,
                animation: "gachaStageIn .5s cubic-bezier(.2,1.3,.4,1) both",
              }}
            >
              <div style={{ position: "relative", width: "100%", maxWidth: 420, aspectRatio: "1" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: -14,
                    zIndex: 3,
                    width: 0,
                    height: 0,
                    transform: "translateX(-50%)",
                    transformOrigin: "50% 0",
                    animation: s.busy ? "gachaPointerTick .14s ease-in-out infinite" : "none",
                  }}
                >
                  <svg width="38" height="46" viewBox="0 0 38 46" style={{ display: "block", marginLeft: -19 }}>
                    <path d="M19 44L3 10a16 16 0 1 1 32 0z" fill="#2E1A10" />
                    <circle cx="19" cy="14" r="6" fill="#FFC93C" />
                  </svg>
                </div>

                {/* Hard drop shadow. Sized to the wheel exactly and offset, so it reads as
                    one clean shadow instead of a dark ring around the whole circle. */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                    borderRadius: "50%",
                    background: "var(--ink)",
                    transform: "translate(6px,6px)",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    transform: `rotate(${s.rot}deg)`,
                    transition: s.busy ? `transform ${SPIN_SECONDS}s cubic-bezier(.12,.72,.12,1)` : "none",
                  }}
                >
                  <svg viewBox="0 0 300 300" width="100%" height="100%" style={{ display: "block" }}>
                    <circle cx={150} cy={150} r={150} fill="#2E1A10" />
                    {segments.map((sg) => (
                      <g key={sg.key}>
                        <path d={sg.d} fill={sg.fill} stroke="#2E1A10" strokeWidth={2} />
                        <text
                          x={sg.tx}
                          y={sg.ty}
                          transform={sg.tr}
                          fill={sg.ink}
                          fontFamily="var(--font-display)"
                          fontWeight={800}
                          fontSize={sg.fs}
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          {sg.label}
                        </text>
                        {sg.name ? (
                          <text
                            x={sg.nx}
                            y={sg.ny}
                            transform={sg.ntr}
                            fill={sg.ink}
                            fontFamily="var(--font-body)"
                            fontWeight={700}
                            fontSize={sg.nfs}
                            textAnchor="middle"
                            dominantBaseline="central"
                            textLength={sg.nMaxW}
                            lengthAdjust={sg.nMaxW ? "spacingAndGlyphs" : undefined}
                          >
                            {sg.name}
                          </text>
                        ) : null}
                      </g>
                    ))}
                  </svg>
                </div>

                {needNames && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 4,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "50%",
                      background: "rgba(251,243,231,.92)",
                      padding: "18%",
                    }}
                  >
                    <p
                      className="font-display"
                      style={{
                        margin: 0,
                        textAlign: "center",
                        fontSize: "clamp(17px,2.6vw,22px)",
                        fontWeight: 700,
                        lineHeight: 1.3,
                        color: "var(--ink)",
                      }}
                    >
                      Tulis minimal 2 nama di panel samping untuk mulai.
                    </p>
                  </div>
                )}

                {/* Hub. Explicit width AND height — a percentage width plus aspect-ratio
                    is unreliable on a <button>, which collapsed it to a sliver. */}
                <button
                  onClick={spin}
                  disabled={s.busy || needNames}
                  className="gacha-spin-btn font-display"
                  aria-label="Putar roda"
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    zIndex: 3,
                    width: "26%",
                    height: "26%",
                    padding: 0,
                    transform: "translate(-50%,-50%)",
                    border: "3px solid var(--ink)",
                    borderRadius: "50%",
                    background: "var(--yellow)",
                    fontSize: "clamp(13px,2.4vw,19px)",
                    fontWeight: 800,
                    color: "var(--ink)",
                    cursor: s.busy || needNames ? "default" : "pointer",
                    boxShadow: "0 4px 0 var(--ink)",
                    lineHeight: 1,
                  }}
                >
                  {s.busy ? "…" : "SPIN"}
                </button>
              </div>

              <button
                onClick={spin}
                disabled={s.busy || needNames}
                className="gacha-shuffle-btn font-display"
                style={{
                  padding: "16px 40px",
                  border: "2px solid var(--ink)",
                  borderRadius: 16,
                  background: s.busy || needNames ? "var(--line)" : "var(--yellow)",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "var(--ink)",
                  cursor: s.busy || needNames ? "default" : "pointer",
                  boxShadow: "4px 4px 0 var(--ink)",
                  transition: "transform .12s, box-shadow .12s, background .12s",
                }}
              >
                {s.busy ? "Memutar…" : "Putar roda"}
              </button>

              <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "var(--muted-2)" }}>
                {needNames ? "Butuh minimal 2 nama." : `${pool.length} pilihan siap diputar.`}
              </p>
            </div>
          ) : (
            <div
              className="gacha-stage"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 26,
                animation: "gachaStageIn .5s cubic-bezier(.2,1.3,.4,1) both",
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: cols >= 4 ? 520 : 420,
                  display: "grid",
                  gridTemplateColumns: `repeat(${cols},minmax(0,1fr))`,
                  gap: "clamp(8px,1.6vw,14px)",
                }}
              >
                {cells.map((c) => (
                  <div
                    key={c.key}
                    className="gacha-cell font-display"
                    style={{
                      aspectRatio: "1",
                      display: "grid",
                      placeItems: "center",
                      border: "2px solid var(--ink)",
                      borderRadius: 18,
                      fontWeight: 800,
                      fontSize: "clamp(26px,5vw,46px)",
                      lineHeight: 1,
                      background: c.bg,
                      color: c.fg,
                      boxShadow: c.shadow,
                      textDecoration: c.strike,
                      transition: "background .12s, box-shadow .12s, transform .12s",
                      transform: c.lift,
                      animation: c.anim,
                    }}
                  >
                    {c.n}
                  </div>
                ))}
              </div>
              <button
                onClick={shuffle}
                disabled={s.busy || pool.length === 0}
                className="gacha-shuffle-btn font-display"
                style={{
                  padding: "16px 40px",
                  border: "2px solid var(--ink)",
                  borderRadius: 16,
                  background: s.busy || pool.length === 0 ? "var(--line)" : "var(--yellow)",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "var(--ink)",
                  cursor: s.busy || pool.length === 0 ? "default" : "pointer",
                  boxShadow: "4px 4px 0 var(--ink)",
                  transition: "transform .12s, box-shadow .12s, background .12s",
                }}
              >
                {s.busy ? "Mengacak…" : "Acak kotak"}
              </button>

              <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "var(--muted-2)" }}>
                {pool.length === 0 ? "Semua kotak sudah keluar." : `${pool.length} kotak tersisa.`}
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <aside style={{ flex: "0 1 330px", minWidth: 270, display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="card" style={{ borderRadius: 20, boxShadow: "5px 5px 0 var(--ink)", padding: 20 }}>
            <div className="font-display" style={{ fontSize: 17, fontWeight: 800, marginBottom: 12 }}>
              Mode
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
              <button
                onClick={() => s.mode !== "wheel" && reset({ mode: "wheel", rot: 0 })}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "14px 10px",
                  border: "2px solid var(--ink)",
                  borderRadius: 14,
                  cursor: "pointer",
                  ...tab(s.mode === "wheel"),
                }}
              >
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth={2.2}>
                  <circle cx="15" cy="15" r="12" />
                  <path d="M15 3v24M3 15h24M6.5 6.5l17 17M23.5 6.5l-17 17" />
                </svg>
                <span style={{ fontSize: 13, fontWeight: 800 }}>Spinner</span>
              </button>
              <button
                onClick={() => s.mode !== "grid" && reset({ mode: "grid", animKey: s.animKey + 1 })}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "14px 10px",
                  border: "2px solid var(--ink)",
                  borderRadius: 14,
                  cursor: "pointer",
                  ...tab(s.mode === "grid"),
                }}
              >
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth={2.2}>
                  <rect x="3" y="3" width="10" height="10" rx="2" />
                  <rect x="17" y="3" width="10" height="10" rx="2" />
                  <rect x="3" y="17" width="10" height="10" rx="2" />
                  <rect x="17" y="17" width="10" height="10" rx="2" />
                </svg>
                <span style={{ fontSize: 13, fontWeight: 800 }}>Kotak</span>
              </button>
            </div>

            {s.mode === "wheel" && (
              <>
                <div className="font-display" style={panelTitle}>
                  Isi roda
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    border: "2px solid var(--ink)",
                    borderRadius: 11,
                    overflow: "hidden",
                    marginBottom: 18,
                  }}
                >
                  <button
                    onClick={() => !s.busy && reset({ entry: "number", rot: 0 })}
                    style={{ padding: "10px 0", border: 0, fontSize: 13, fontWeight: 800, cursor: "pointer", ...tab(!usingNames) }}
                  >
                    Angka
                  </button>
                  <button
                    onClick={() => !s.busy && reset({ entry: "names", rot: 0 })}
                    style={{
                      padding: "10px 0",
                      border: 0,
                      borderLeft: "2px solid var(--ink)",
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: "pointer",
                      ...tab(usingNames),
                    }}
                  >
                    Nama
                  </button>
                </div>
              </>
            )}

            {s.mode === "wheel" && !usingNames && (
              <>
                <div className="font-display" style={panelTitle}>
                  Jumlah angka
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", gap: 6 }}>
                  {Array.from({ length: 11 }, (_, i) => i + 2).map((n) => (
                    <button
                      key={n}
                      onClick={() => !s.busy && reset({ count: n, rot: 0 })}
                      style={{
                        padding: "9px 0",
                        border: "2px solid var(--ink)",
                        borderRadius: 10,
                        fontSize: 13.5,
                        fontWeight: 800,
                        cursor: "pointer",
                        ...pill(s.count === n),
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </>
            )}

            {usingNames && (
              <>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                  <span className="font-display" style={{ fontSize: 15, fontWeight: 700 }}>
                    Daftar nama
                  </span>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted-2)" }}>
                    {nameList.length} nama{nameList.length >= MAX_NAMES ? ` (maks. ${MAX_NAMES})` : ""}
                  </span>
                </div>
                <textarea
                  rows={7}
                  value={s.namesText}
                  onChange={(e) => !s.busy && reset({ namesText: e.target.value, rot: s.rot })}
                  placeholder={"Satu nama per baris\nBudi\nSinta\nAndre"}
                  style={{
                    width: "100%",
                    padding: 12,
                    border: "2px solid var(--ink)",
                    borderRadius: 12,
                    background: "var(--bg)",
                    fontSize: 14,
                    fontWeight: 600,
                    lineHeight: 1.5,
                    color: "var(--ink)",
                    resize: "vertical",
                  }}
                />
                <p style={{ margin: "7px 0 0", fontSize: 11.5, fontWeight: 600, color: "var(--muted-2)" }}>
                  Setiap nama otomatis dapat nomor sesuai urutan.
                </p>
              </>
            )}

            {s.mode === "grid" && (
              <>
                <div className="font-display" style={panelTitle}>
                  Ukuran kotak
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 7 }}>
                  {GRIDS.map((g) => {
                    const [gc, gr] = g.split("x").map(Number);
                    return (
                      <button
                        key={g}
                        onClick={() => !s.busy && reset({ grid: g, animKey: s.animKey + 1 })}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                          padding: "10px 4px",
                          border: "2px solid var(--ink)",
                          borderRadius: 11,
                          cursor: "pointer",
                          ...pill(s.grid === g),
                        }}
                      >
                        <span style={{ fontSize: 14, fontWeight: 800 }}>{g}</span>
                        <span style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.8 }}>1–{gc * gr}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {s.mode === "wheel" && (
              <button
                onClick={() => !s.busy && patch({ remove: !s.remove })}
                style={{
                  width: "100%",
                  marginTop: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 13px",
                  border: "2px solid var(--ink)",
                  borderRadius: 12,
                  background: "var(--bg)",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                aria-pressed={s.remove}
              >
                <span
                  style={{
                    flex: "0 0 auto",
                    width: 40,
                    height: 23,
                    border: "2px solid var(--ink)",
                    borderRadius: 999,
                    background: s.remove ? "var(--yellow)" : "#fff",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 2,
                      left: s.remove ? 19 : 2,
                      width: 15,
                      height: 15,
                      borderRadius: "50%",
                      background: "var(--ink)",
                      transition: "left .2s",
                    }}
                  />
                </span>
                <span style={{ display: "block" }}>
                  <span style={{ display: "block", fontSize: 13, fontWeight: 800, color: "var(--ink)" }}>
                    Buang angka yang keluar
                  </span>
                  <span style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "var(--muted-2)" }}>
                    Angka yang sudah terpilih tidak ikut lagi
                  </span>
                </span>
              </button>
            )}
          </div>

          <div className="card" style={{ borderRadius: 20, boxShadow: "5px 5px 0 var(--orange)", padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
              <div className="font-display" style={{ fontSize: 17, fontWeight: 800 }}>
                Riwayat
              </div>
              <button
                onClick={() => reset({ rot: s.rot, animKey: s.animKey + 1 })}
                className="gacha-reset-btn"
                style={{
                  padding: "6px 11px",
                  border: "2px dashed var(--muted-3)",
                  borderRadius: 9,
                  background: "transparent",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--muted-2)",
                  cursor: "pointer",
                  transition: "border-color .12s, color .12s",
                }}
              >
                Ulang
              </button>
            </div>

            {s.history.length === 0 ? (
              <p style={{ margin: 0, fontSize: 13, color: "var(--muted-3)", fontWeight: 600 }}>Belum ada putaran.</p>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {s.history.map((n, i) => (
                  <span
                    key={`h${i}-${n}`}
                    className="font-display"
                    style={{
                      minWidth: 38,
                      padding: "7px 10px",
                      border: "2px solid var(--ink)",
                      borderRadius: 10,
                      textAlign: "center",
                      fontSize: 16,
                      fontWeight: 800,
                      lineHeight: 1.1,
                      background: i === 0 ? "var(--orange)" : "var(--bg)",
                      color: i === 0 ? "#fff" : "var(--ink)",
                    }}
                  >
                    {nameOf(n) ? `${n} · ${nameOf(n)}` : n}
                  </span>
                ))}
              </div>
            )}

            {allDrawn && (
              <p
                style={{
                  margin: "12px 0 0",
                  padding: "10px 12px",
                  border: "2px solid var(--yellow)",
                  borderRadius: 11,
                  background: "#FFF7E4",
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "var(--muted)",
                }}
              >
                Semua angka sudah keluar. Tekan Ulang untuk main lagi.
              </p>
            )}
          </div>
        </aside>
      </div>

      {s.showResult && (
        <div
          onClick={() => patch({ showResult: false })}
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 90,
            background: "rgba(46,26,16,.55)",
            display: "grid",
            placeItems: "center",
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="gacha-result"
            style={{
              width: "100%",
              maxWidth: 360,
              border: "2px solid var(--ink)",
              borderRadius: 26,
              background: "var(--bg)",
              boxShadow: "8px 8px 0 var(--ink)",
              padding: "28px 24px 24px",
              textAlign: "center",
              animation: "gachaResultPop .5s cubic-bezier(.2,1.5,.4,1) both",
            }}
          >
            <svg
              viewBox="0 0 72 72"
              width="96"
              height="96"
              fill="none"
              stroke="#2E1A10"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ display: "block", margin: "0 auto 6px" }}
              aria-hidden="true"
            >
              <g style={{ animation: "gachaTwinkle 1.1s ease-in-out infinite" }}>
                <path d="M9 12l1.4 3.6L14 17l-3.6 1.4L9 22l-1.4-3.6L4 17l3.6-1.4z" fill="#FFC93C" stroke="none" />
                <path d="M64 24l1.1 2.9L68 28l-2.9 1.1L64 32l-1.1-2.9L60 28l2.9-1.1z" fill="#FFC93C" stroke="none" />
              </g>
              <path
                d="M17 60l1.1 2.9L21 64l-2.9 1.1L17 68l-1.1-2.9L13 64l2.9-1.1z"
                fill="#FFC93C"
                stroke="none"
                style={{ animation: "gachaTwinkle 1.1s ease-in-out .5s infinite" }}
              />
              <g style={{ animation: "gachaCatHop 1s ease-in-out .1s 2", transformOrigin: "34px 40px" }}>
                <path d="M15 26L15.5 10L28.5 18Z" fill="#E8955C" />
                <path d="M49 26L48.5 10L35.5 18Z" fill="#E8955C" />
                <path d="M19.5 21.5l.3-6.5 5 3.2z" fill="#F7B0A0" stroke="none" />
                <path d="M44.5 21.5l-.3-6.5-5 3.2z" fill="#F7B0A0" stroke="none" />
                <circle cx="32" cy="38" r="19" fill="#F2C89C" />
                <path
                  d="M24 22.5c1.6 2.2 1.8 4.6 1.2 6.8M32 20.5c.9 2.6.8 5 0 7.2M40 22.5c-1.6 2.2-1.8 4.6-1.2 6.8"
                  stroke="#C9490F"
                  strokeWidth={2}
                />
                <ellipse cx="21.5" cy="41" rx="3.6" ry="2.4" fill="#F7B0A0" stroke="none" />
                <ellipse cx="42.5" cy="41" rx="3.6" ry="2.4" fill="#F7B0A0" stroke="none" />
                <path d="M23 36.5c1.6-2.4 4.4-2.4 6 0M35 36.5c1.6-2.4 4.4-2.4 6 0" />
                <path d="M32 43.5l-2.2-2.6h4.4z" fill="#C9490F" stroke="#C9490F" strokeWidth={1.6} />
                <path d="M32 44.2c0 2.1-1.6 3.2-3.2 2.6M32 44.2c0 2.1 1.6 3.2 3.2 2.6" />
                <path d="M13 36.5l6 1M13.5 42l5.8-.4M51 36.5l-6 1M50.5 42l-5.8-.4" strokeWidth={2} />
              </g>
              <g style={{ animation: "gachaThumbPop .55s cubic-bezier(.2,1.6,.4,1) .2s both", transformOrigin: "56px 50px" }}>
                <path
                  d="M50 62V48.5c0-3 2.4-5.4 5.4-5.4h.4c1.7 0 3 1.4 3 3.1v3.3h5c2.3 0 4 2.1 3.6 4.3l-1.2 6.2c-.3 1.7-1.8 2.9-3.5 2.9H50z"
                  fill="#E8955C"
                />
                <path d="M50 48h-4.5v14H50" fill="#F2C89C" />
              </g>
            </svg>

            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "1.4px",
                textTransform: "uppercase",
                color: "var(--muted-2)",
                marginBottom: 2,
              }}
            >
              Yang terpilih
            </div>
            <div
              className="font-display"
              style={{ fontSize: 96, fontWeight: 800, lineHeight: 1, color: "var(--orange)", marginBottom: 6 }}
            >
              {s.result}
            </div>
            {resultName && (
              <div
                className="font-display"
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: "var(--ink)",
                  margin: "-4px 0 8px",
                  overflowWrap: "anywhere",
                }}
              >
                {resultName}
              </div>
            )}
            <p style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, lineHeight: 1.5, color: "var(--muted)" }}>
              {resultNote}
            </p>
            <div style={{ display: "flex", gap: 9 }}>
              <button
                onClick={() => {
                  patch({ showResult: false });
                  later(() => (s.mode === "wheel" ? spin() : shuffle()), 250);
                }}
                style={{
                  flex: 1,
                  padding: 13,
                  border: "2px solid var(--ink)",
                  borderRadius: 13,
                  background: "var(--yellow)",
                  fontSize: 14,
                  fontWeight: 800,
                  color: "var(--ink)",
                  cursor: "pointer",
                  boxShadow: "3px 3px 0 var(--ink)",
                }}
              >
                Main lagi
              </button>
              <button
                onClick={() => patch({ showResult: false })}
                style={{
                  flex: 1,
                  padding: 13,
                  border: "2px solid var(--ink)",
                  borderRadius: 13,
                  background: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--ink)",
                  cursor: "pointer",
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
