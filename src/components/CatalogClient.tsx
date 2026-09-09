"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Product, PRICE_BUCKETS } from "@/lib/products";
import { decorate } from "@/lib/decorate";
import ProductCard from "@/components/ProductCard";

const PER_PAGE = 12;

interface FilterState {
  q: string;
  ips: string[];
  types: string[];
  prices: string[];
  sort: string;
  page: number;
}

const INITIAL: FilterState = { q: "", ips: [], types: [], prices: [], sort: "relevan", page: 1 };

function toggleValue<T>(list: T[], v: T): T[] {
  return list.includes(v) ? list.filter((x) => x !== v) : list.concat([v]);
}

export default function CatalogClient({ products }: { products: Product[] }) {
  const { t } = useLanguage();
  const [state, setState] = useState<FilterState>(INITIAL);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const matches = (p: Product, skip?: keyof FilterState) => {
    const q = state.q.trim().toLowerCase();
    if (q && !(p.name + " " + p.ip + " " + p.type + " " + p.period).toLowerCase().includes(q)) return false;
    if (skip !== "ips" && state.ips.length && !state.ips.includes(p.ip)) return false;
    if (skip !== "types" && state.types.length && !state.types.includes(p.type)) return false;
    if (skip !== "prices" && state.prices.length) {
      const ok = state.prices.some((k) => p.price >= PRICE_BUCKETS[k][0] && p.price < PRICE_BUCKETS[k][1]);
      if (!ok) return false;
    }
    return true;
  };

  const ips = useMemo(() => Array.from(new Set(products.map((p) => p.ip))).sort(), [products]);

  const ipOptions = useMemo(
    () =>
      ips.map((v) => ({
        value: v,
        label: v,
        count: products.filter((p) => matches(p, "ips") && p.ip === v).length,
        checked: state.ips.includes(v),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ips, products, state.q, state.ips, state.types, state.prices]
  );

  const typeOptions = useMemo(
    () =>
      t.types.map(([value, label]) => ({
        value,
        label,
        count: products.filter((p) => matches(p, "types") && p.type === value).length,
        checked: state.types.includes(value),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, products, state.q, state.ips, state.types, state.prices]
  );

  const priceOptions = useMemo(
    () =>
      Object.keys(PRICE_BUCKETS).map((k) => {
        const label = t.price.find((x) => x[0] === k)?.[1] ?? k;
        return {
          value: k,
          label,
          count: products.filter((p) => matches(p, "prices") && p.price >= PRICE_BUCKETS[k][0] && p.price < PRICE_BUCKETS[k][1])
            .length,
          checked: state.prices.includes(k),
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, products, state.q, state.ips, state.types, state.prices]
  );

  const filtered = useMemo(() => products.filter((p) => matches(p)), [products, state]); // eslint-disable-line react-hooks/exhaustive-deps

  const sorted = useMemo(() => {
    const cmp: Record<string, (a: Product, b: Product) => number> = {
      best: (a, b) => Number(b.tag === "best") - Number(a.tag === "best") || a.price - b.price,
      murah: (a, b) => a.price - b.price,
      mahal: (a, b) => b.price - a.price,
      az: (a, b) => a.name.localeCompare(b.name),
    };
    const fn = cmp[state.sort];
    return fn ? filtered.slice().sort(fn) : filtered;
  }, [filtered, state.sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const page = Math.min(state.page, pageCount);
  const start = (page - 1) * PER_PAGE;
  const visible = sorted.slice(start, start + PER_PAGE).map((p) => decorate(p, t));

  const setPage = (n: number) => setState((s) => ({ ...s, page: n }));

  const chips: { key: string; label: string; remove: () => void }[] = [];
  state.ips.forEach((v) => chips.push({ key: "i" + v, label: v, remove: () => setState((s) => ({ ...s, ips: toggleValue(s.ips, v), page: 1 })) }));
  state.types.forEach((v) => chips.push({ key: "t" + v, label: v, remove: () => setState((s) => ({ ...s, types: toggleValue(s.types, v), page: 1 })) }));
  state.prices.forEach((v) => {
    const label = t.price.find((x) => x[0] === v)?.[1] ?? v;
    chips.push({ key: "r" + v, label, remove: () => setState((s) => ({ ...s, prices: toggleValue(s.prices, v), page: 1 })) });
  });

  const win: (number | "…")[] = [];
  for (let n = 1; n <= pageCount; n++) {
    if (n === 1 || n === pageCount || Math.abs(n - page) <= 1) win.push(n);
    else if (win[win.length - 1] !== "…") win.push("…");
  }

  const isEmpty = products.length > 0 && sorted.length === 0;
  const rangeLabel = sorted.length ? `${start + 1}–${Math.min(start + PER_PAGE, sorted.length)}` : "0";

  const reset = () => setState(INITIAL);

  return (
    <section id="katalog" className="container" style={{ padding: "52px 20px 20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <div>
          <h2
            className="font-display"
            style={{ fontSize: "clamp(28px,3.4vw,42px)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 6px" }}
          >
            {t.catalogTitle}
          </h2>
          <p style={{ margin: 0, fontSize: 15, color: "var(--muted)" }}>{t.catalogSub}</p>
        </div>
        <div style={{ display: "flex", gap: 9, alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ fontSize: 12.5, fontWeight: 700, color: "var(--muted-2)" }}>{t.sortBy}</label>
          <select
            value={state.sort}
            onChange={(e) => setState((s) => ({ ...s, sort: e.target.value, page: 1 }))}
            style={{
              padding: "11px 14px",
              border: "2px solid var(--ink)",
              borderRadius: 12,
              background: "#fff",
              fontSize: 13.5,
              fontWeight: 600,
              color: "var(--ink)",
            }}
          >
            {t.sorts.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={() => setFiltersOpen((o) => !o)}
        aria-expanded={filtersOpen}
        className="catalog-filter-toggle"
        style={{
          width: "100%",
          marginBottom: 16,
          padding: "13px 16px",
          border: "2px solid var(--ink)",
          borderRadius: 12,
          background: filtersOpen ? "var(--orange)" : "#fff",
          color: filtersOpen ? "#fff" : "var(--ink)",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "3px 3px 0 var(--ink)",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          {t.filterToggle}
          {chips.length > 0 && (
            <span
              style={{
                display: "inline-flex",
                minWidth: 19,
                height: 19,
                padding: "0 5px",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                background: filtersOpen ? "#fff" : "var(--orange)",
                color: filtersOpen ? "var(--orange-dark)" : "#fff",
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              {chips.length}
            </span>
          )}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: filtersOpen ? "rotate(180deg)" : "none", transition: "transform .2s ease" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
        <aside
          className={`card sticky-aside catalog-filter${filtersOpen ? " is-open" : ""}`}
          style={{
            flex: "0 1 252px",
            minWidth: 236,
            position: "sticky",
            top: 92,
            padding: 18,
          }}
        >
          <div style={{ position: "relative", marginBottom: 18 }}>
            <input
              type="search"
              value={state.q}
              onChange={(e) => setState((s) => ({ ...s, q: e.target.value, page: 1 }))}
              placeholder={t.searchHint}
              style={{
                width: "100%",
                padding: "12px 14px 12px 38px",
                border: "2px solid var(--ink)",
                borderRadius: 12,
                background: "var(--bg)",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--ink)",
              }}
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--muted-2)"
              strokeWidth={2.4}
              style={{ position: "absolute", left: 13, top: 15 }}
            >
              <circle cx="11" cy="11" r="7"></circle>
              <path d="M20 20l-4-4"></path>
            </svg>
          </div>

          <div className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
            {t.filterIp}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: 18, maxHeight: 236, overflow: "auto", paddingRight: 4 }}>
            {ipOptions.map((opt) => (
              <label
                key={opt.value}
                style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 8px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                <input
                  type="checkbox"
                  checked={opt.checked}
                  onChange={() => setState((s) => ({ ...s, ips: toggleValue(s.ips, opt.value), page: 1 }))}
                  style={{ width: 15, height: 15, accentColor: "var(--orange)", margin: 0, flex: "0 0 auto" }}
                />
                <span style={{ flex: 1 }}>{opt.label}</span>
                <span style={{ fontSize: 11, color: "var(--muted-3)" }}>{opt.count}</span>
              </label>
            ))}
          </div>

          <div className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
            {t.filterType}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: 18 }}>
            {typeOptions.map((opt) => (
              <label
                key={opt.value}
                style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 8px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                <input
                  type="checkbox"
                  checked={opt.checked}
                  onChange={() => setState((s) => ({ ...s, types: toggleValue(s.types, opt.value), page: 1 }))}
                  style={{ width: 15, height: 15, accentColor: "var(--orange)", margin: 0, flex: "0 0 auto" }}
                />
                <span style={{ flex: 1 }}>{opt.label}</span>
                <span style={{ fontSize: 11, color: "var(--muted-3)" }}>{opt.count}</span>
              </label>
            ))}
          </div>

          <div className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
            {t.filterPrice}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: 18 }}>
            {priceOptions.map((opt) => (
              <label
                key={opt.value}
                style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 8px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                <input
                  type="checkbox"
                  checked={opt.checked}
                  onChange={() => setState((s) => ({ ...s, prices: toggleValue(s.prices, opt.value), page: 1 }))}
                  style={{ width: 15, height: 15, accentColor: "var(--orange)", margin: 0, flex: "0 0 auto" }}
                />
                <span style={{ flex: 1 }}>{opt.label}</span>
                <span style={{ fontSize: 11, color: "var(--muted-3)" }}>{opt.count}</span>
              </label>
            ))}
          </div>

          <button
            onClick={reset}
            style={{
              width: "100%",
              padding: 11,
              border: "2px dashed var(--muted-3)",
              borderRadius: 12,
              background: "transparent",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--muted-2)",
              cursor: "pointer",
            }}
          >
            {t.resetAll}
          </button>

          <button
            onClick={() => setFiltersOpen(false)}
            className="catalog-filter-apply"
            style={{
              width: "100%",
              marginTop: 9,
              padding: 12,
              border: "2px solid var(--ink)",
              borderRadius: 12,
              background: "var(--orange)",
              color: "#fff",
              fontSize: 13.5,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "3px 3px 0 var(--ink)",
            }}
          >
            {t.filterApply}
          </button>
        </aside>

        <div style={{ flex: "1 1 440px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--muted)" }}>
              {t.showing} <strong style={{ color: "var(--ink)" }}>{rangeLabel}</strong> {t.of} {sorted.length}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  onClick={chip.remove}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "6px 11px",
                    border: "2px solid var(--ink)",
                    borderRadius: 999,
                    background: "var(--peach)",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {chip.label} <span style={{ color: "var(--orange-dark)" }}>✕</span>
                </button>
              ))}
            </div>
          </div>

          {isEmpty && (
            <div style={{ border: "2px dashed var(--muted-3)", borderRadius: 18, padding: "52px 24px", textAlign: "center", background: "#fff" }}>
              <div className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
                {t.emptyTitle}
              </div>
              <p style={{ margin: "0 0 18px", fontSize: 14, color: "var(--muted)" }}>{t.emptyBody}</p>
              <button
                onClick={reset}
                style={{
                  padding: "12px 20px",
                  border: "2px solid var(--ink)",
                  borderRadius: 12,
                  background: "var(--orange)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  boxShadow: "3px 3px 0 var(--ink)",
                }}
              >
                {t.resetAll}
              </button>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(205px, 1fr))", gap: 18 }}>
            {visible.map((p) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>

          {pageCount > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, flexWrap: "wrap", marginTop: 32 }}>
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                style={{
                  padding: "10px 15px",
                  border: "2px solid var(--ink)",
                  borderRadius: 11,
                  background: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  color: page <= 1 ? "#C0AFA2" : "var(--ink)",
                }}
              >
                ←
              </button>
              {win.map((n, idx) =>
                n === "…" ? (
                  <span key={"d" + idx} style={{ minWidth: 42, padding: "10px 12px", fontSize: 13, fontWeight: 800, textAlign: "center", color: "var(--muted-3)" }}>
                    …
                  </span>
                ) : (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    style={{
                      minWidth: 42,
                      padding: "10px 12px",
                      border: "2px solid var(--ink)",
                      borderRadius: 11,
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: "pointer",
                      background: n === page ? "var(--orange)" : "#fff",
                      color: n === page ? "#fff" : "var(--ink)",
                    }}
                  >
                    {n}
                  </button>
                )
              )}
              <button
                onClick={() => setPage(Math.min(pageCount, page + 1))}
                style={{
                  padding: "10px 15px",
                  border: "2px solid var(--ink)",
                  borderRadius: 11,
                  background: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  color: page >= pageCount ? "#C0AFA2" : "var(--ink)",
                }}
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
