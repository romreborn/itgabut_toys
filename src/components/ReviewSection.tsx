"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SHOPEE_URL } from "@/lib/constants";
import { SHOPEE_RATING, SHOPEE_REVIEWS } from "@/lib/reviews";
import ReviewCards from "@/components/ReviewCards";

export default function ReviewSection() {
  const { t } = useLanguage();
  // Written reviews first; the homepage shows six, /tentang shows all of them.
  const featured = [...SHOPEE_REVIEWS].sort((a, b) => Number(!!b.text) - Number(!!a.text)).slice(0, 6);

  return (
    <section id="ulasan" className="container" style={{ padding: "64px 20px 0" }}>
      <h2 className="font-display" style={{ fontSize: "clamp(28px,3.4vw,42px)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 8px" }}>
        {t.reviewsTitle}
      </h2>
      <p style={{ margin: "0 0 22px", fontSize: 15, color: "var(--muted)", maxWidth: "64ch" }}>
        <span style={{ color: "#F5A623", fontWeight: 800 }}>★ {SHOPEE_RATING.score}</span>{" "}
        {t.reviewsSub.replace("{count}", String(SHOPEE_RATING.count)).replace("{asOf}", SHOPEE_RATING.asOf)}
      </p>
      <ReviewCards reviews={featured} />
      <a href={SHOPEE_URL} target="_blank" rel="noopener" className="btn btn-white" style={{ marginTop: 18 }}>
        {t.reviewsCta}
      </a>
    </section>
  );
}
