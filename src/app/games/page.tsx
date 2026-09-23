import type { Metadata } from "next";
import GachaSpinner from "@/components/GachaSpinner";

export const metadata: Metadata = {
  title: "Games — Spinner & Kotak Gacha",
  description:
    "Spinner dan kotak gacha interaktif dari ITGabut Toys. Putar roda angka 2–12, pakai daftar nama, atau acak kotak 2x2 sampai 4x3 untuk undian blind box.",
  keywords: ["spinner gacha", "random picker", "undian blind box", "roda putar online", "ITGabut Toys games"],
  alternates: { canonical: "/games" },
  openGraph: {
    title: "Games — Spinner & Kotak Gacha | ITGabut Toys",
    description: "Putar roda angka atau acak kotak buat nentuin blind box mana yang kamu ambil.",
    url: "/games",
  },
};

export default function GamesPage() {
  return (
    <section className="container" style={{ padding: "30px 20px 60px" }}>
      <h1
        className="font-display"
        style={{ fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 8px" }}
      >
        Games
      </h1>
      <p style={{ margin: "0 0 28px", fontSize: 15, color: "var(--muted)", maxWidth: "62ch" }}>
        Bingung pilih blind box yang mana? Putar roda angka, pakai daftar nama, atau acak kotak — biar nasib yang
        menentukan.
      </p>

      <GachaSpinner />
    </section>
  );
}
