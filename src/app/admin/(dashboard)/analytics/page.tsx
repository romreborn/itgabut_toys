import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { adminStyles as s } from "../../adminStyles";

export const dynamic = "force-dynamic";

// 0 = "Hari ini": since midnight WIB (handled by admin_period_start in SQL), charted per hour.
const PERIODS = [0, 7, 30, 90];
const periodLabel = (p: number) => (p === 0 ? "Hari ini" : `${p} hari`);

interface TopRow {
  path: string;
  slug: string | null;
  views: number;
}

/** Resolves slugs to human names so the tables don't read as a wall of URLs. */
async function labelsFor(rows: TopRow[], table: "products" | "blog_posts", column: "name" | "title") {
  const slugs = rows.map((r) => r.slug).filter((x): x is string => !!x);
  if (slugs.length === 0) return new Map<string, string>();
  const { data } = await supabaseAdmin.from(table).select(`slug,${column}`).in("slug", slugs);
  return new Map(((data as Record<string, string>[]) || []).map((r) => [r.slug, r[column]]));
}

type Badge = { tone: "yes" | "partial" | "no"; text: string };

/** Product has an affiliate link when its shopeeUrl is set (the "Beli di Shopee" button uses it). */
async function productAffiliate(rows: TopRow[]): Promise<Map<string, Badge>> {
  const slugs = rows.map((r) => r.slug).filter((x): x is string => !!x);
  if (slugs.length === 0) return new Map();
  const { data } = await supabaseAdmin.from("products").select("slug,shopeeUrl").in("slug", slugs);
  return new Map(
    ((data as { slug: string; shopeeUrl: string | null }[]) || []).map((r) => [
      r.slug,
      r.shopeeUrl ? { tone: "yes", text: "Affiliate" } : { tone: "no", text: "Belum affiliate" },
    ])
  );
}

function isShopee(link: string | undefined): boolean {
  try {
    return /(^|\.)shopee\.co\.id$/.test(new URL(link ?? "").hostname);
  } catch {
    return false;
  }
}

/**
 * A post earns affiliate clicks either through its own Shopee link block (orange button), or through
 * product cards whose products have a shopeeUrl (the visitor clicks through to the product page).
 */
async function blogAffiliate(rows: TopRow[]): Promise<Map<string, Badge>> {
  const slugs = rows.map((r) => r.slug).filter((x): x is string => !!x);
  if (slugs.length === 0) return new Map();
  const { data } = await supabaseAdmin.from("blog_posts").select("slug,body").in("slug", slugs);
  const posts = (data as { slug: string; body: { t: string; url?: string; productSlugs?: string[] }[] }[]) || [];
  const linked = [...new Set(posts.flatMap((p) => p.body.flatMap((b) => (b.t === "products" ? b.productSlugs ?? [] : []))))];
  const withLink = new Set<string>();
  if (linked.length) {
    const { data: prods } = await supabaseAdmin.from("products").select("slug").in("slug", linked).not("shopeeUrl", "is", null);
    ((prods as { slug: string }[]) || []).forEach((p) => withLink.add(p.slug));
  }
  return new Map(
    posts.map((p) => {
      const direct = p.body.some((b) => b.t === "link" && isShopee(b.url));
      const viaProducts = new Set(p.body.flatMap((b) => (b.t === "products" ? b.productSlugs ?? [] : [])).filter((x) => withLink.has(x))).size;
      const badge: Badge = direct
        ? { tone: "yes", text: viaProducts ? `Affiliate: tombol Shopee + ${viaProducts} produk` : "Affiliate: tombol Shopee" }
        : viaProducts
        ? { tone: "partial", text: `Affiliate via ${viaProducts} produk` }
        : { tone: "no", text: "Belum affiliate" };
      return [p.slug, badge];
    })
  );
}

const BADGE_STYLE: Record<Badge["tone"], React.CSSProperties> = {
  yes: { background: "#DCEBD2", color: "#3A5A2A", borderColor: "#3A5A2A" },
  partial: { background: "#FFF3C4", color: "#6B4E00", borderColor: "#B8860B" },
  no: { background: "#F3ECE4", color: "#6E5A4E", borderColor: "#C9B8AA" },
};

function AffiliateBadge({ badge }: { badge: Badge }) {
  return (
    <span
      style={{
        display: "inline-block",
        marginLeft: 8,
        padding: "2px 8px",
        border: "1.5px solid",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 800,
        whiteSpace: "nowrap",
        verticalAlign: "middle",
        ...BADGE_STYLE[badge.tone],
      }}
    >
      {badge.text}
    </span>
  );
}

function Cards({ label, value }: { label: string; value: number | string }) {
  return (
    <div style={{ ...s.card, padding: "16px 18px", flex: "1 1 160px", minWidth: 0 }}>
      <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: ".5px", textTransform: "uppercase", color: "#8A7263" }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function Table({
  title,
  rows,
  labels,
  badges,
  emptyText,
}: {
  title: string;
  rows: TopRow[];
  labels?: Map<string, string>;
  /** Affiliate status per slug; when given, a badge and a coverage count are shown. */
  badges?: Map<string, Badge>;
  emptyText: string;
}) {
  const max = rows.length ? rows[0].views : 0;
  const covered = badges ? rows.filter((r) => r.slug && badges.get(r.slug)?.tone !== "no" && badges.has(r.slug)).length : 0;
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 10px" }}>
        {title}
        {badges && rows.length > 0 && (
          <span style={{ marginLeft: 10, fontSize: 12.5, fontWeight: 700, color: "#6E5A4E" }}>
            {covered} dari {rows.length} sudah affiliate
          </span>
        )}
      </h2>
      <div style={{ ...s.card, padding: 0, overflowX: "auto" }}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Halaman</th>
              <th style={{ ...s.th, width: 170 }}>Pengunjung unik</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const label = r.slug ? labels?.get(r.slug) : null;
              const badge = r.slug ? badges?.get(r.slug) : undefined;
              return (
                <tr key={r.path}>
                  <td style={s.td}>
                    <Link href={r.path} target="_blank" style={{ fontWeight: 700, color: "var(--ink, #2E1A10)" }}>
                      {label || r.path}
                    </Link>
                    {badge && <AffiliateBadge badge={badge} />}
                    {label && <div style={{ fontSize: 11.5, color: "#8A7263" }}>{r.path}</div>}
                  </td>
                  <td style={s.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 8, background: "#F3ECE4", borderRadius: 99, overflow: "hidden" }}>
                        <div
                          style={{
                            width: max ? `${Math.max(4, (r.views / max) * 100)}%` : "0%",
                            height: "100%",
                            background: "#EE6A26",
                          }}
                        />
                      </div>
                      <span style={{ fontWeight: 800, fontVariantNumeric: "tabular-nums", minWidth: 36, textAlign: "right" }}>
                        {r.views}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td style={s.td} colSpan={2}>
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const { days: daysRaw } = await searchParams;
  const days = daysRaw && PERIODS.includes(Number(daysRaw)) ? Number(daysRaw) : 30;
  const isToday = days === 0;

  const [summaryRes, productsRes, blogRes, pagesRes, dailyRes] = await Promise.all([
    supabaseAdmin.rpc("admin_views_summary", { p_days: days }),
    supabaseAdmin.rpc("admin_top_paths", { p_days: days, p_kind: "product", p_limit: 20 }),
    supabaseAdmin.rpc("admin_top_paths", { p_days: days, p_kind: "blog", p_limit: 20 }),
    supabaseAdmin.rpc("admin_top_paths", { p_days: days, p_kind: "page", p_limit: 20 }),
    isToday ? supabaseAdmin.rpc("admin_views_hourly_today") : supabaseAdmin.rpc("admin_views_daily", { p_days: days }),
  ]);

  const error = summaryRes.error || productsRes.error || blogRes.error || pagesRes.error || dailyRes.error;
  const summary = (summaryRes.data?.[0] as {
    total: number;
    unique_visitors: number;
    unique_paths: number;
    product_views: number;
    blog_views: number;
  }) || {
    total: 0,
    unique_visitors: 0,
    unique_paths: 0,
    product_views: 0,
    blog_views: 0,
  };
  const products = (productsRes.data as TopRow[]) || [];
  const blogs = (blogRes.data as TopRow[]) || [];
  const pages = (pagesRes.data as TopRow[]) || [];
  const fmtDay = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  const fmtHour = (h: number) => `${String(h).padStart(2, "0")}:00`;
  // One bar list for both charts: hours of today, or days of the period.
  const daily = isToday
    ? ((dailyRes.data as { hour: number; views: number }[]) || []).map((r) => ({ key: String(r.hour), label: fmtHour(r.hour), views: r.views }))
    : ((dailyRes.data as { day: string; views: number }[]) || []).map((r) => ({ key: r.day, label: fmtDay(r.day), views: r.views }));

  const [productLabels, blogLabels, productBadges, blogBadges] = await Promise.all([
    labelsFor(products, "products", "name"),
    labelsFor(blogs, "blog_posts", "title"),
    productAffiliate(products),
    blogAffiliate(blogs),
  ]);

  const maxDaily = daily.reduce((m, d) => Math.max(m, Number(d.views)), 0);

  return (
    <div style={s.page}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <h1 style={s.h1}>Analytics</h1>
        <div style={{ display: "flex", gap: 8 }}>
          {PERIODS.map((p) => (
            <Link
              key={p}
              href={`/admin/analytics?days=${p}`}
              style={{
                ...(days === p ? s.button : s.buttonGhost),
                display: "inline-block",
                textDecoration: "none",
              }}
            >
              {periodLabel(p)}
            </Link>
          ))}
        </div>
      </div>

      {error && <p style={{ color: "#C9490F" }}>Gagal memuat: {error.message}</p>}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 26 }}>
        <Cards label="Pengunjung unik" value={Number(summary.unique_visitors).toLocaleString("id-ID")} />
        <Cards label="Total dibuka (termasuk reload)" value={Number(summary.total).toLocaleString("id-ID")} />
        <Cards label="Halaman unik" value={Number(summary.unique_paths).toLocaleString("id-ID")} />
        <Cards label="Lihat produk" value={Number(summary.product_views).toLocaleString("id-ID")} />
        <Cards label="Baca blog" value={Number(summary.blog_views).toLocaleString("id-ID")} />
      </div>

      {daily.length > 0 && (
        <div style={{ ...s.card, padding: 18, marginBottom: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 14px" }}>
            {isToday ? "Pengunjung unik per jam hari ini (WIB)" : "Pengunjung unik per hari"}
          </h2>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 120 }}>
            {daily.map((d) => (
              <div
                key={d.key}
                title={`${d.label}: ${d.views}`}
                style={{
                  flex: 1,
                  minWidth: 3,
                  height: `${maxDaily ? Math.max(3, (Number(d.views) / maxDaily) * 100) : 3}%`,
                  background: "#EE6A26",
                  borderRadius: "3px 3px 0 0",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11.5, color: "#8A7263" }}>
            <span>{daily[0].label}</span>
            {isToday && <span>{daily[12]?.label}</span>}
            <span>{daily[daily.length - 1].label}</span>
          </div>
        </div>
      )}

      <Table
        title="Produk paling sering dilihat"
        rows={products}
        labels={productLabels}
        badges={productBadges}
        emptyText="Belum ada data kunjungan produk."
      />
      <Table title="Blog paling sering dibaca" rows={blogs} labels={blogLabels} badges={blogBadges} emptyText="Belum ada data kunjungan blog." />
      <Table title="Halaman lain" rows={pages} emptyText="Belum ada data." />

      <p style={{ fontSize: 12.5, color: "#8A7263", lineHeight: 1.7, marginTop: 4 }}>
        Angka dihitung per pengunjung unik (IP + browser): kalau orang yang sama membuka atau me-reload halaman yang
        sama berkali-kali dalam periode ini, tetap terhitung 1. Hanya &quot;Total dibuka&quot; yang menghitung setiap reload.
        Bot dan crawler tidak ikut terhitung, dan halaman admin tidak dilacak. Data sebelum 7 Oktober 2026 belum punya
        info pengunjung, jadi setiap kunjungan lama tetap dihitung satu per satu.
      </p>
    </div>
  );
}
