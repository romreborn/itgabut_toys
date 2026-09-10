import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { adminStyles as s } from "../../adminStyles";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const { data: posts, error } = await supabaseAdmin
    .from("blog_posts")
    .select("slug,title,category,dateLabel,isPublished")
    .order("createdAt", { ascending: false })
    .limit(200);

  return (
    <div style={s.page}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <h1 style={s.h1}>Blog ({posts?.length ?? 0})</h1>
        <Link href="/admin/blog/new" style={{ ...s.button, textDecoration: "none", display: "inline-block" }}>
          + Artikel baru
        </Link>
      </div>

      {error && <p style={{ color: "#C9490F" }}>Gagal memuat: {error.message}</p>}

      <div style={{ ...s.card, padding: 0, overflowX: "auto" }}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Judul</th>
              <th style={s.th}>Kategori</th>
              <th style={s.th}>Tanggal</th>
              <th style={s.th}>Status</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {(posts || []).map((p) => (
              <tr key={p.slug}>
                <td style={s.td}>{p.title}</td>
                <td style={s.td}>{p.category}</td>
                <td style={s.td}>{p.dateLabel}</td>
                <td style={s.td}>{p.isPublished ? "Published" : "Draft"}</td>
                <td style={s.td}>
                  <Link href={`/admin/blog/${p.slug}`} style={{ fontWeight: 700, color: "#EE6A26" }}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {!posts?.length && (
              <tr>
                <td style={s.td} colSpan={5}>
                  Belum ada artikel.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
