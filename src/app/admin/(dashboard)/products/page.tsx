import Link from "next/link";
import Image from "next/image";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { adminStyles as s } from "../../adminStyles";
import AvailabilityToggle from "./AvailabilityToggle";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;
const TAG_LABEL: Record<string, string> = { BEST: "Best Seller", NEW: "Baru", MOVIE: "Movie" };

/**
 * Hosts configured in next.config.mjs. A product's imageUrl is free-text in the
 * admin form, so an unlisted host would otherwise crash this whole page when
 * next/image renders it server-side.
 */
const OPTIMIZED_HOSTS = ["cdn.shopify.com", "static.wikia.nocookie.net", "actionfigurehq.com", "product.hstatic.net"];

function canOptimize(url: string): boolean {
  if (url.startsWith("/")) return true;
  try {
    const { host } = new URL(url);
    return OPTIMIZED_HOSTS.includes(host) || host.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

const THUMB: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 8,
  border: "1px solid #EFE6DE",
  objectFit: "cover",
  display: "block",
  background: "#F6EFE8",
};

function Thumb({ url, name }: { url: string | null; name: string }) {
  if (!url) return <div style={THUMB} aria-label={`${name} — belum ada foto`} />;
  if (!canOptimize(url)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" width={40} height={40} loading="lazy" decoding="async" style={THUMB} />;
  }
  return <Image src={url} alt="" width={40} height={40} style={THUMB} />;
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const from = (currentPage - 1) * PAGE_SIZE;

  let query = supabaseAdmin
    .from("products")
    .select("slug,name,ip,type,price,availability,tag,isActive,sortOrder,imageUrl", { count: "exact" })
    .order("sortOrder", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (q) query = query.or(`name.ilike.%${q}%,ip.ilike.%${q}%,slug.ilike.%${q}%`);

  const { data: products, error, count } = await query;
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageHref = (n: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (n > 1) params.set("page", String(n));
    const qs = params.toString();
    return qs ? `/admin/products?${qs}` : "/admin/products";
  };

  return (
    <div style={s.page}>
      <style>{`
        .admin-products-row:hover { background: #FBF6EF; }
        .admin-products-table thead th { position: sticky; top: 0; background: #fff; z-index: 1; }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <h1 style={s.h1}>Produk ({total})</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/admin/products/import" style={{ ...s.buttonGhost, textDecoration: "none", display: "inline-block" }}>
            Import Excel
          </Link>
          <Link href="/admin/products/new" style={{ ...s.button, textDecoration: "none", display: "inline-block" }}>
            + Produk baru
          </Link>
        </div>
      </div>

      <form style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="search"
          name="q"
          defaultValue={q || ""}
          placeholder="Cari nama, IP, atau slug…"
          style={{ ...s.input, marginBottom: 0, maxWidth: 340 }}
        />
        <button type="submit" style={s.button}>
          Cari
        </button>
        {q && (
          <Link href="/admin/products" style={{ ...s.buttonGhost, textDecoration: "none", display: "inline-block" }}>
            Reset
          </Link>
        )}
        {q && (
          <span style={{ fontSize: 12.5, color: "#8A7263" }}>
            {total} hasil untuk “{q}”
          </span>
        )}
      </form>

      {error && <p style={{ color: "#C9490F" }}>Gagal memuat: {error.message}</p>}

      <div style={{ ...s.card, padding: 0, overflow: "auto", maxHeight: "72vh" }}>
        <table className="admin-products-table" style={{ ...s.table, tableLayout: "fixed", minWidth: 920 }}>
          <colgroup>
            <col style={{ width: 56 }} />
            <col style={{ width: "26%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: 110 }} />
            <col style={{ width: 190 }} />
            <col style={{ width: 64 }} />
            <col style={{ width: 72 }} />
            <col style={{ width: 56 }} />
          </colgroup>
          <thead>
            <tr>
              <th style={s.th}></th>
              <th style={s.th}>Nama</th>
              <th style={s.th}>IP</th>
              <th style={s.th}>Tipe</th>
              <th style={{ ...s.th, textAlign: "right" }}>Harga</th>
              <th style={s.th}>Status</th>
              <th style={{ ...s.th, textAlign: "center" }}>Aktif</th>
              <th style={{ ...s.th, textAlign: "right" }}>Urutan</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map((p) => (
              <tr key={p.slug} className="admin-products-row">
                <td style={{ ...s.td, padding: "8px 10px" }}>
                  <Thumb url={p.imageUrl} name={p.name} />
                </td>
                <td style={s.td}>
                  <div style={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={p.name}>
                    {p.name}
                  </div>
                  {p.tag && (
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: 4,
                        padding: "2px 7px",
                        borderRadius: 6,
                        fontSize: 10.5,
                        fontWeight: 700,
                        background: "#FFF3E9",
                        color: "#EE6A26",
                      }}
                    >
                      {TAG_LABEL[p.tag] ?? p.tag}
                    </span>
                  )}
                </td>
                <td style={{ ...s.td, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={p.ip}>
                  {p.ip}
                </td>
                <td style={{ ...s.td, color: "#8A7263", fontSize: 12.5 }}>{p.type === "BLIND_BOX" ? "Blind Box" : "Non Blind Box"}</td>
                <td style={{ ...s.td, textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  Rp{Number(p.price).toLocaleString("id-ID")}
                </td>
                <td style={s.td}>
                  <AvailabilityToggle slug={p.slug} value={p.availability} />
                </td>
                <td style={{ ...s.td, textAlign: "center" }}>
                  <span
                    aria-label={p.isActive ? "Aktif" : "Nonaktif"}
                    title={p.isActive ? "Aktif" : "Nonaktif"}
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: p.isActive ? "#3A5A2A" : "#D8CCC0",
                    }}
                  />
                </td>
                <td style={{ ...s.td, textAlign: "right", color: "#8A7263", fontVariantNumeric: "tabular-nums" }}>{p.sortOrder}</td>
                <td style={{ ...s.td, textAlign: "right" }}>
                  <Link href={`/admin/products/${p.slug}`} style={{ fontWeight: 700, color: "#EE6A26" }}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {!products?.length && (
              <tr>
                <td style={s.td} colSpan={9}>
                  {q ? `Tidak ada produk cocok dengan “${q}”.` : "Tidak ada produk."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
          {currentPage > 1 ? (
            <Link href={pageHref(currentPage - 1)} style={{ ...s.buttonGhost, textDecoration: "none", display: "inline-block" }}>
              ← Sebelumnya
            </Link>
          ) : (
            <span style={{ ...s.buttonGhost, opacity: 0.4, cursor: "default" }}>← Sebelumnya</span>
          )}
          <span style={{ fontSize: 13, color: "#8A7263" }}>
            Halaman {currentPage} dari {totalPages}
          </span>
          {currentPage < totalPages ? (
            <Link href={pageHref(currentPage + 1)} style={{ ...s.buttonGhost, textDecoration: "none", display: "inline-block" }}>
              Berikutnya →
            </Link>
          ) : (
            <span style={{ ...s.buttonGhost, opacity: 0.4, cursor: "default" }}>Berikutnya →</span>
          )}
        </div>
      )}
    </div>
  );
}
