import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { adminStyles as s } from "../../adminStyles";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  let query = supabaseAdmin
    .from("products")
    .select("slug,name,ip,type,price,availability,tag,isActive,sortOrder")
    .order("sortOrder", { ascending: false })
    .limit(300);

  if (q) query = query.or(`name.ilike.%${q}%,ip.ilike.%${q}%,slug.ilike.%${q}%`);

  const { data: products, error } = await query;

  return (
    <div style={s.page}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <h1 style={s.h1}>Produk ({products?.length ?? 0})</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/admin/products/import" style={{ ...s.buttonGhost, textDecoration: "none", display: "inline-block" }}>
            Import Excel
          </Link>
          <Link href="/admin/products/new" style={{ ...s.button, textDecoration: "none", display: "inline-block" }}>
            + Produk baru
          </Link>
        </div>
      </div>

      <form style={{ marginBottom: 16 }}>
        <input
          type="search"
          name="q"
          defaultValue={q || ""}
          placeholder="Cari nama, IP, atau slug…"
          style={{ ...s.input, marginBottom: 0, maxWidth: 340 }}
        />
      </form>

      {error && <p style={{ color: "#C9490F" }}>Gagal memuat: {error.message}</p>}

      <div style={{ ...s.card, padding: 0, overflowX: "auto" }}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Nama</th>
              <th style={s.th}>IP</th>
              <th style={s.th}>Tipe</th>
              <th style={s.th}>Harga</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Aktif</th>
              <th style={s.th}>Urutan</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map((p) => (
              <tr key={p.slug}>
                <td style={s.td}>{p.name}</td>
                <td style={s.td}>{p.ip}</td>
                <td style={s.td}>{p.type === "BLIND_BOX" ? "Blind Box" : "Non Blind Box"}</td>
                <td style={s.td}>Rp{Number(p.price).toLocaleString("id-ID")}</td>
                <td style={s.td}>{p.availability}</td>
                <td style={s.td}>{p.isActive ? "✓" : "—"}</td>
                <td style={s.td}>{p.sortOrder}</td>
                <td style={s.td}>
                  <Link href={`/admin/products/${p.slug}`} style={{ fontWeight: 700, color: "#EE6A26" }}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {!products?.length && (
              <tr>
                <td style={s.td} colSpan={8}>
                  Tidak ada produk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
