import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container" style={{ padding: "80px 20px", textAlign: "center" }}>
      <h1 className="font-display" style={{ fontSize: 40, fontWeight: 800, margin: "0 0 12px" }}>
        Halaman tidak ditemukan
      </h1>
      <p style={{ margin: "0 0 24px", fontSize: 15, color: "var(--muted)" }}>
        Produk atau halaman yang kamu cari mungkin sudah dipindahkan.
      </p>
      <Link href="/" className="btn btn-dark" style={{ display: "inline-flex" }}>
        Kembali ke beranda
      </Link>
    </section>
  );
}
