import type { Metadata } from "next";
import Link from "next/link";
import GachaSpinner from "@/components/GachaSpinner";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Spinner Wheel Gratis & Tools Undian Online",
  description:
    "Tools undian gratis: putar spinner wheel berisi angka atau nama, atau acak kotak 2x2 sampai 4x3. Tanpa daftar, tanpa install, langsung jalan di browser HP maupun laptop.",
  keywords: [
    "spinner wheel gratis",
    "free spinner wheel",
    "tools undian",
    "tools undian gratis",
    "aplikasi undian online",
    "pengacak nama online",
    "roda putar online",
    "random picker gratis",
    "undian nama gratis",
    "kocok arisan online",
  ],
  alternates: { canonical: "/games" },
  openGraph: {
    title: "Spinner Wheel Gratis & Tools Undian Online | ITGabut Toys",
    description:
      "Putar roda angka atau nama, atau acak kotak. Gratis, tanpa daftar, langsung jalan di browser.",
    url: "/games",
  },
};

const FAQ = [
  {
    q: "Apakah spinner wheel ini gratis?",
    a: "Gratis sepenuhnya. Tidak ada biaya, tidak perlu daftar akun, dan tidak ada batas berapa kali kamu memutarnya.",
  },
  {
    q: "Apakah perlu install aplikasi atau daftar akun?",
    a: "Tidak perlu keduanya. Tools undian ini jalan langsung di browser, baik di HP maupun laptop. Buka halamannya, atur isinya, lalu putar.",
  },
  {
    q: "Bisa dipakai untuk undian nama, bukan cuma angka?",
    a: "Bisa. Pilih mode Spinner lalu ganti isi roda dari Angka ke Nama, kemudian ketik satu nama per baris. Roda otomatis menyesuaikan jumlah dan memberi nomor urut ke setiap nama, maksimal 24 nama.",
  },
  {
    q: "Bagaimana supaya satu nama tidak keluar dua kali?",
    a: "Nyalakan tombol \"Buang angka yang keluar\". Setiap hasil yang sudah keluar akan dikeluarkan dari putaran berikutnya, jadi cocok untuk undian berhadiah yang pemenangnya tidak boleh dobel.",
  },
  {
    q: "Apakah hasil undiannya benar-benar acak?",
    a: "Ya. Pemenang ditentukan lebih dulu secara acak oleh browser kamu, lalu animasinya menyesuaikan ke hasil itu. Tidak ada urutan yang diatur atau hasil yang bisa diprediksi.",
  },
  {
    q: "Apa bedanya mode Spinner dan mode Kotak?",
    a: "Mode Spinner memakai roda putar, cocok untuk undian nama atau angka dengan animasi yang seru ditonton bareng. Mode Kotak mengacak petak 2x2 sampai 4x3, lebih cepat dan cocok kalau kamu cuma butuh menentukan satu nomor.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Spinner Wheel & Tools Undian ITGabut Toys",
  url: `${SITE_URL}/games`,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web browser",
  description:
    "Tools undian gratis berbasis browser: spinner wheel berisi angka atau nama, plus mode acak kotak. Tanpa daftar dan tanpa install.",
  inLanguage: "id-ID",
  offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
  publisher: { "@type": "Organization", name: "ITGabut Toys", url: SITE_URL },
};

const h2: React.CSSProperties = {
  fontSize: "clamp(21px,2.6vw,27px)",
  fontWeight: 800,
  letterSpacing: "-.4px",
  margin: "0 0 12px",
};

export default function GamesPage() {
  return (
    <section className="container" style={{ padding: "30px 20px 60px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <h1
        className="font-display"
        style={{ fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 10px" }}
      >
        Spinner Wheel Gratis &amp; Tools Undian Online
      </h1>
      <p style={{ margin: "0 0 26px", fontSize: 16, lineHeight: 1.7, color: "var(--muted)", maxWidth: "66ch" }}>
        Putar roda berisi angka atau nama, atau acak kotak. Gratis dan langsung jalan di browser.
      </p>

      <GachaSpinner />

      <div style={{ maxWidth: "72ch", marginTop: 56 }}>
        <h2 className="font-display" style={h2}>
          Pertanyaan yang sering muncul
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FAQ.map((f) => (
            <details key={f.q} className="card" style={{ borderRadius: 14, padding: "14px 16px" }}>
              <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 15.5, color: "var(--ink)", listStyle: "none" }}>
                {f.q}
              </summary>
              <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.7, color: "var(--muted)" }}>{f.a}</p>
            </details>
          ))}
        </div>

        <div
          className="card"
          style={{ marginTop: 34, borderRadius: 16, padding: "18px 20px", boxShadow: "4px 4px 0 var(--orange)" }}
        >
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "var(--muted)" }}>
            Spinner ini dibuat oleh <strong style={{ color: "var(--ink)" }}>ITGabut Toys</strong>, toko Blokees dan
            action figure di Citra Raya, Tangerang. Kalau kamu lagi cari figure buat hadiah giveaway-nya,{" "}
            <Link href="/#katalog" style={{ fontWeight: 700 }}>
              lihat katalog kami
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
