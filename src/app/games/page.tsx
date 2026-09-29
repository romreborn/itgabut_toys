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

const body: React.CSSProperties = {
  margin: "0 0 14px",
  fontSize: 15.5,
  lineHeight: 1.75,
  color: "var(--muted)",
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
        Butuh cara cepat buat menentukan pemenang? Putar spinner wheel berisi angka atau nama, atau acak kotak.
        Gratis, tanpa daftar akun, tanpa install — langsung jalan di browser HP maupun laptop.
      </p>

      <GachaSpinner />

      <div style={{ maxWidth: "72ch", marginTop: 56 }}>
        <h2 className="font-display" style={h2}>
          Bisa dipakai untuk apa saja?
        </h2>
        <p style={body}>
          Tools undian ini sengaja dibikin umum, jadi nggak terbatas buat satu keperluan:
        </p>
        <p style={{ ...body, whiteSpace: "pre-line" }}>
          {"• Undian giveaway Instagram atau TikTok — tinggal tempel daftar nama pemenang kandidat\n" +
            "• Doorprize acara kantor, arisan, atau reuni\n" +
            "• Menentukan giliran atau kelompok di kelas dan rapat\n" +
            "• Memilih siapa yang traktir, siapa yang jalan duluan, siapa yang piket\n" +
            "• Buat kolektor: menentukan blind box mana yang dibuka duluan"}
        </p>

        <h2 className="font-display" style={{ ...h2, marginTop: 34 }}>
          Cara pakai
        </h2>
        <p style={{ ...body, whiteSpace: "pre-line" }}>
          {"1. Pilih mode: Spinner (roda putar) atau Kotak (petak acak).\n" +
            "2. Di mode Spinner, tentukan isi roda — Angka (2 sampai 12) atau Nama.\n" +
            "3. Kalau pakai Nama, ketik satu nama per baris di panel samping. Maksimal 24 nama.\n" +
            "4. Nyalakan \"Buang angka yang keluar\" kalau pemenang tidak boleh dobel.\n" +
            "5. Tekan Putar roda, lalu tunggu hasilnya muncul."}
        </p>

        <h2 className="font-display" style={{ ...h2, marginTop: 34 }}>
          Kenapa pakai tools undian ini?
        </h2>
        <p style={{ ...body, whiteSpace: "pre-line" }}>
          {"• Gratis tanpa batas putaran, tanpa iklan yang menutupi layar\n" +
            "• Tanpa daftar akun dan tanpa install aplikasi\n" +
            "• Dua mode dalam satu halaman: roda putar dan acak kotak\n" +
            "• Mode nama otomatis memberi nomor urut, jadi gampang diverifikasi peserta\n" +
            "• Ada riwayat hasil, jadi kelihatan siapa saja yang sudah keluar\n" +
            "• Opsi buang hasil yang sudah keluar, supaya tidak ada pemenang dobel\n" +
            "• Jalan lancar di layar HP maupun laptop"}
        </p>

        <h2 className="font-display" style={{ ...h2, marginTop: 34 }}>
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
