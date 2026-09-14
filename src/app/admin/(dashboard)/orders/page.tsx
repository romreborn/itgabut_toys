import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { adminStyles as s } from "../../adminStyles";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Menunggu",
  CONFIRMED: "Dikonfirmasi",
  PROCESSING: "Diproses",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const STATUS_COLOR: Record<string, { bg: string; fg: string }> = {
  PENDING: { bg: "#FFF3E9", fg: "#C9490F" },
  CONFIRMED: { bg: "#EAF2FF", fg: "#2A5AA5" },
  PROCESSING: { bg: "#FFF7E4", fg: "#B8860B" },
  SHIPPED: { bg: "#EAF2FF", fg: "#2A5AA5" },
  COMPLETED: { bg: "#DCEBD2", fg: "#3A5A2A" },
  CANCELLED: { bg: "#F2E7DC", fg: "#8A7263" },
};

const METHOD_LABEL: Record<string, string> = { PICKUP: "Ambil sendiri", COD: "COD", SHIP: "Kirim" };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  let query = supabaseAdmin
    .from("orders")
    .select("id,method,mall,recipientName,recipientPhone,city,total,status,createdAt")
    .order("createdAt", { ascending: false })
    .limit(300);
  if (status) query = query.eq("status", status);

  const { data: orders, error } = await query;

  return (
    <div style={s.page}>
      <h1 style={s.h1}>Pesanan ({orders?.length ?? 0})</h1>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <Link href="/admin/orders" style={{ ...(!status ? s.button : s.buttonGhost), display: "inline-block", textDecoration: "none" }}>
          Semua
        </Link>
        {Object.entries(STATUS_LABEL).map(([value, label]) => (
          <Link
            key={value}
            href={`/admin/orders?status=${value}`}
            style={{ ...(status === value ? s.button : s.buttonGhost), display: "inline-block", textDecoration: "none" }}
          >
            {label}
          </Link>
        ))}
      </div>

      {error && <p style={{ color: "#C9490F" }}>Gagal memuat: {error.message}</p>}

      <div style={{ ...s.card, padding: 0, overflowX: "auto" }}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Tanggal</th>
              <th style={s.th}>Penerima</th>
              <th style={s.th}>Metode</th>
              <th style={s.th}>Total</th>
              <th style={s.th}>Status</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {(orders || []).map((o) => {
              const color = STATUS_COLOR[o.status] || STATUS_COLOR.PENDING;
              return (
                <tr key={o.id}>
                  <td style={s.td}>
                    {new Date(o.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                  </td>
                  <td style={s.td}>
                    {o.recipientName}
                    <div style={{ fontSize: 11.5, color: "#8A7263" }}>{o.recipientPhone}</div>
                  </td>
                  <td style={s.td}>
                    {METHOD_LABEL[o.method] || o.method}
                    {o.mall && <div style={{ fontSize: 11.5, color: "#8A7263" }}>{o.mall}</div>}
                    {o.city && <div style={{ fontSize: 11.5, color: "#8A7263" }}>{o.city}</div>}
                  </td>
                  <td style={s.td}>Rp{Number(o.total).toLocaleString("id-ID")}</td>
                  <td style={s.td}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 11.5,
                        fontWeight: 700,
                        background: color.bg,
                        color: color.fg,
                      }}
                    >
                      {STATUS_LABEL[o.status] || o.status}
                    </span>
                  </td>
                  <td style={s.td}>
                    <Link href={`/admin/orders/${o.id}`} style={{ fontWeight: 700, color: "#EE6A26" }}>
                      Detail
                    </Link>
                  </td>
                </tr>
              );
            })}
            {!orders?.length && (
              <tr>
                <td style={s.td} colSpan={6}>
                  Belum ada pesanan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
