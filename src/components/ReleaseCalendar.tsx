"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { rupiah, salePrice } from "@/lib/format";
import { AVAIL_STYLE, type Availability } from "@/lib/productShared";
import {
  KIND_STYLE,
  MONTHS_ID,
  eventDays,
  formatEventDate,
  isMonthOnly,
  monthKey,
  sortedEvents,
  type ReleaseEvent,
} from "@/lib/releases";

export interface CalendarProduct {
  slug: string;
  name: string;
  imageUrl: string | null;
  price: number;
  avail: Availability;
  shopeeUrl: string | null;
}

const AVAIL_LABEL: Record<Availability, string> = { ready: "Ready", preorder: "Pre-order", sold: "Habis" };

const addMonths = (key: string, n: number) => {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};

export default function ReleaseCalendar({
  events,
  products,
  postTitles,
  today,
}: {
  events: ReleaseEvent[];
  products: Record<string, CalendarProduct>;
  postTitles: Record<string, string>;
  today: string;
}) {
  const all = useMemo(() => sortedEvents(events), [events]);
  const months = useMemo(() => [...new Set(all.map((e) => monthKey(e.date)))].sort(), [all]);
  const firstUpcoming = all.find((e) => (isMonthOnly(e) ? e.date >= monthKey(today) : (e.endDate ?? e.date) >= today)) ?? all[all.length - 1];

  const [month, setMonth] = useState(monthKey(firstUpcoming?.date ?? today));
  const [selectedId, setSelectedId] = useState(firstUpcoming?.id ?? "");

  // Deep link from the homepage cards: /jadwal-rilis#ev-<id>
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.replace(/^#ev-/, ""));
    const ev = all.find((e) => e.id === id);
    if (ev) {
      setMonth(monthKey(ev.date));
      setSelectedId(ev.id);
    }
  }, [all]);

  const byDay = useMemo(() => {
    const map = new Map<string, ReleaseEvent[]>();
    for (const e of all) for (const d of eventDays(e)) map.set(d, [...(map.get(d) ?? []), e]);
    return map;
  }, [all]);

  const selected = all.find((e) => e.id === selectedId);
  // Everything on the selected event's day(s), so two releases on one date show together.
  const shown = selected
    ? isMonthOnly(selected)
      ? [selected]
      : [...new Map(eventDays(selected).flatMap((d) => byDay.get(d) ?? []).map((e) => [e.id, e])).values()]
    : [];
  const monthOnly = all.filter((e) => isMonthOnly(e) && e.date === month);

  const [y, m] = month.split("-").map(Number);
  const firstDow = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7; // Monday first
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells: (string | null)[] = [
    ...Array<null>(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`),
  ];

  const go = (n: number) => {
    const next = addMonths(month, n);
    setMonth(next);
    const first = all.find((e) => monthKey(e.date) === next);
    if (first) setSelectedId(first.id);
  };

  return (
    <div className="rc-layout">
      <div className="card rc-cal">
        <div className="rc-head">
          <button type="button" className="rc-nav" onClick={() => go(-1)} disabled={month <= months[0]} aria-label="Bulan sebelumnya">
            ‹
          </button>
          <h2 className="font-display" style={{ margin: 0, fontSize: 22, fontWeight: 800 }} aria-live="polite">
            {MONTHS_ID[m - 1]} {y}
          </h2>
          <button type="button" className="rc-nav" onClick={() => go(1)} disabled={month >= months[months.length - 1]} aria-label="Bulan berikutnya">
            ›
          </button>
        </div>
        <div className="rc-grid" role="group" aria-label={`Kalender rilis ${MONTHS_ID[m - 1]} ${y}`}>
          {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
            <div key={d} className="rc-dow">
              {d}
            </div>
          ))}
          {cells.map((d, i) => {
            if (!d) return <div key={`x${i}`} />;
            const evs = byDay.get(d) ?? [];
            const isSel = !!selected && !isMonthOnly(selected) && eventDays(selected).includes(d);
            const cls = `rc-day${evs.length ? " has" : ""}${d === today ? " today" : ""}${isSel ? " sel" : ""}`;
            const dayNum = Number(d.slice(8));
            if (!evs.length) {
              return (
                <div key={d} className={cls} aria-label={d === today ? `${dayNum}, hari ini` : undefined}>
                  {dayNum}
                </div>
              );
            }
            return (
              <button
                key={d}
                type="button"
                className={cls}
                onClick={() => setSelectedId(evs[0].id)}
                aria-pressed={isSel}
                aria-label={`${dayNum} ${MONTHS_ID[m - 1]}: ${evs.map((e) => e.title).join("; ")}`}
              >
                {dayNum}
                <span className="rc-dots" aria-hidden>
                  {evs.slice(0, 3).map((e) => (
                    <span key={e.id} className="rc-dot" style={{ background: KIND_STYLE[e.kind].fg }} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
        {monthOnly.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--muted-2)", marginBottom: 6 }}>Tanggal belum pasti bulan ini</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {monthOnly.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setSelectedId(e.id)}
                  className="blog-chip"
                  style={e.id === selectedId ? { background: "var(--ink)", color: "var(--bg)" } : undefined}
                >
                  {e.title}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="rc-legend">
          {Object.values(KIND_STYLE).map((k) => (
            <span key={k.label} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span className="rc-dot" style={{ background: k.fg }} />
              {k.label}
            </span>
          ))}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 14, height: 14, borderRadius: 4, outline: "2px dashed var(--orange-dark)", outlineOffset: -2 }} />
            Hari ini
          </span>
        </div>
      </div>

      <div className="card rc-detail" aria-live="polite">
        {shown.length === 0 ? (
          <p style={{ margin: 0, color: "var(--muted)" }}>Pilih tanggal bertitik di kalender untuk melihat detail rilisnya.</p>
        ) : (
          shown.map((e, idx) => (
            <article key={e.id} id={`ev-${e.id}`} style={idx ? { marginTop: 22, paddingTop: 22, borderTop: "2px dashed var(--line-2)" } : undefined}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                <span className="rc-badge" style={{ background: KIND_STYLE[e.kind].bg, color: KIND_STYLE[e.kind].fg }}>
                  {KIND_STYLE[e.kind].label}
                </span>
                {!e.confirmed && (
                  <span className="rc-badge" style={{ background: "#FFF3C4", color: "#7A5A00" }}>
                    TBC
                  </span>
                )}
                {(isMonthOnly(e) ? e.date < monthKey(today) : (e.endDate ?? e.date) < today) && (
                  <span className="rc-badge" style={{ background: "#EFE6DE", color: "#6E5A4E" }}>
                    Sudah lewat
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--orange-dark)" }}>{formatEventDate(e)}</div>
              <h3 className="font-display" style={{ margin: "4px 0 8px", fontSize: 21, fontWeight: 800, lineHeight: 1.25 }}>
                {e.title}
              </h3>
              {e.note && <p style={{ margin: "0 0 14px", fontSize: 14.5, lineHeight: 1.65, color: "var(--muted)" }}>{e.note}</p>}
              {(e.productSlugs ?? []).filter((s) => products[s]).length > 0 && (
                <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
                  {(e.productSlugs ?? [])
                    .map((s) => products[s])
                    .filter(Boolean)
                    .map((p) => (
                      <div key={p.slug} className="rc-prod">
                        <Link href={`/produk/${p.slug}`} style={{ width: 72, height: 72, borderRadius: 10, overflow: "hidden", border: "1.5px solid var(--ink)", display: "block" }}>
                          <ProductImage name={p.name} seed={p.slug} imageUrl={p.imageUrl} sizes="72px" />
                        </Link>
                        <div style={{ minWidth: 0 }}>
                          <Link href={`/produk/${p.slug}`} style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", lineHeight: 1.3, display: "block" }}>
                            {p.name}
                          </Link>
                          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 5 }}>
                            <span style={{ fontSize: 14, fontWeight: 800 }}>{rupiah(salePrice(p.price))}</span>
                            <span className="rc-badge" style={{ background: AVAIL_STYLE[p.avail].bg, color: AVAIL_STYLE[p.avail].fg }}>
                              {AVAIL_LABEL[p.avail]}
                            </span>
                            {p.shopeeUrl && (
                              <a href={p.shopeeUrl} target="_blank" rel="sponsored noopener" style={{ fontSize: 12.5, fontWeight: 700, color: "var(--orange-dark)" }}>
                                Beli di Shopee ↗
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              {e.postSlug && postTitles[e.postSlug] && (
                <Link href={`/blog/${e.postSlug}`} style={{ fontSize: 14, fontWeight: 700 }}>
                  Baca: {postTitles[e.postSlug]} →
                </Link>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}

