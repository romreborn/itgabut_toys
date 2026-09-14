import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { adminStyles as s } from "../../../adminStyles";
import { updateOrderStatusAction } from "../actions";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Menunggu",
  CONFIRMED: "Dikonfirmasi",
  PROCESSING: "Diproses",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const METHOD_LABEL: Record<string, string> = { PICKUP: "Ambil sendiri", COD: "COD", SHIP: "Kirim" };

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select(
      "id,method,mall,recipientName,recipientPhone,province,city,address,subtotal,discount,total,status,waMessage,createdAt,updatedAt"
    )
    .eq("id", id)
    .maybeSingle();

  if (!order) notFound();

  const { data: items } = await supabaseAdmin
    .from("order_items")
    .select("id,nameSnapshot,priceSnapshot,qty,variant,lineTotal")
    .eq("orderId", id)
    .order("id", { ascending: true });

  const updateWithId = updateOrderStatusAction.bind(null, id);

  return (
    <div style={s.page}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <Link href="/admin/orders" style={{ fontSize: 12.5, fontWeight: 700, color: "#8A7263" }}>
            ← Kembali ke pesanan
          </Link>
          <h1 style={{ ...s.h1, margin: "6px 0 0" }}>Pesanan #{order.id.slice(0, 8)}</h1>
        </div>
        <form action={updateWithId} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select name="status" defaultValue={order.status} style={{ ...s.input, marginBottom: 0, width: "auto" }}>
            {Object.entries(STATUS_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button type="submit" style={s.button}>
            Update status
          </button>
        </form>
      </div>

      <div style={{ ...s.row, alignItems: "flex-start" }}>
        <div style={{ ...s.col, flex: "1 1 320px" }}>
          <div style={{ ...s.card, marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 14px" }}>Penerima</h2>
            <p style={{ margin: "0 0 4px", fontSize: 14 }}>
              <strong>{order.recipientName}</strong>
            </p>
            <p style={{ margin: "0 0 4px", fontSize: 14, color: "#8A7263" }}>{order.recipientPhone}</p>
            <p style={{ margin: "10px 0 4px", fontSize: 13.5 }}>
              <strong>Metode:</strong> {METHOD_LABEL[order.method] || order.method}
            </p>
            {order.mall && (
              <p style={{ margin: "0 0 4px", fontSize: 13.5 }}>
                <strong>Lokasi COD:</strong> {order.mall}
              </p>
            )}
            {(order.province || order.city || order.address) && (
              <p style={{ margin: "0 0 4px", fontSize: 13.5 }}>
                <strong>Alamat:</strong> {order.address ? `${order.address}, ` : ""}
                {order.city ? `${order.city}, ` : ""}
                {order.province || ""}
              </p>
            )}
            <p style={{ margin: "10px 0 0", fontSize: 12, color: "#8A7263" }}>
              Dibuat: {new Date(order.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>

          <div style={s.card}>
            <h2 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 14px" }}>Pesan WhatsApp</h2>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontFamily: "inherit",
                fontSize: 13,
                margin: 0,
                background: "#FBF6EF",
                border: "1px solid #EFE6DE",
                borderRadius: 10,
                padding: 12,
              }}
            >
              {order.waMessage}
            </pre>
          </div>
        </div>

        <div style={{ ...s.col, flex: "2 1 420px" }}>
          <div style={{ ...s.card, padding: 0, overflowX: "auto" }}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Produk</th>
                  <th style={s.th}>Varian</th>
                  <th style={s.th}>Harga</th>
                  <th style={s.th}>Qty</th>
                  <th style={s.th}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(items || []).map((it) => (
                  <tr key={it.id}>
                    <td style={s.td}>{it.nameSnapshot}</td>
                    <td style={s.td}>{it.variant === "SET" ? "Whole Set" : "Single"}</td>
                    <td style={s.td}>Rp{Number(it.priceSnapshot).toLocaleString("id-ID")}</td>
                    <td style={s.td}>{it.qty}</td>
                    <td style={s.td}>Rp{Number(it.lineTotal).toLocaleString("id-ID")}</td>
                  </tr>
                ))}
                {!items?.length && (
                  <tr>
                    <td style={s.td} colSpan={5}>
                      Tidak ada item.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ ...s.card, marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 6 }}>
              <span>Subtotal</span>
              <span>Rp{Number(order.subtotal).toLocaleString("id-ID")}</span>
            </div>
            {order.discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 6, color: "#C9490F" }}>
                <span>Diskon</span>
                <span>-Rp{Number(order.discount).toLocaleString("id-ID")}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, marginTop: 10, paddingTop: 10, borderTop: "2px solid #2E1A10" }}>
              <span>Total</span>
              <span>Rp{Number(order.total).toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
