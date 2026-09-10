import Link from "next/link";
import { adminStyles as s } from "../../../adminStyles";
import ImportForm from "./ImportForm";

export default function ImportProductsPage() {
  return (
    <div style={s.page}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <h1 style={s.h1}>Import produk dari Excel</h1>
        <Link href="/admin/products" style={{ ...s.buttonGhost, textDecoration: "none", display: "inline-block" }}>
          ← Kembali ke daftar produk
        </Link>
      </div>
      <p style={{ marginBottom: 16, fontSize: 13.5, color: "#8A7263", maxWidth: 640 }}>
        Kolom yang dibaca otomatis (nama kolom cukup mengandung kata ini, tidak harus persis): <strong>IP</strong>,{" "}
        <strong>Category</strong> (BB/NBB, tambahkan &quot;Battery&quot; untuk produk bertenaga baterai),{" "}
        <strong>Description</strong> (nama produk), <strong>Info Packaging</strong>, <strong>Stock Condition</strong>,{" "}
        <strong>Global Launching</strong>, <strong>Retail Price</strong>, dan <strong>NEW Retail Price</strong>. Kolom
        lain (Item Code, Total Qty, Qty Order, Total Biaya) diabaikan. Produk dengan kombinasi IP + nama yang sama
        dengan yang sudah ada akan <strong>diperbarui</strong>, bukan diduplikasi.
      </p>
      <ImportForm />
    </div>
  );
}
