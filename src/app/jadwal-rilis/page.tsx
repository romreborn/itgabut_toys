import type { Metadata } from "next";
import Link from "next/link";
import ReleaseCalendar, { type CalendarProduct } from "@/components/ReleaseCalendar";
import { getProductsBySlugs } from "@/lib/products";
import { getPostSummaries } from "@/lib/posts";
import { RELEASE_EVENTS } from "@/data/releaseEvents";
import { KIND_STYLE, MONTHS_ID, allProductSlugs, formatEventDate, monthKey, sortedEvents, todayJakarta, upcomingEvents } from "@/lib/releases";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/constants";

export const revalidate = 60;

const TITLE = "Jadwal Rilis Blokees 2026";
const DESCRIPTION =
  "Kalender rilis Blokees 2026: tanggal rilis produk baru, pameran, dan film terkait, lengkap dengan harga dan status pre-order di ITGabut Toys.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/jadwal-rilis" },
  openGraph: { title: `${TITLE} | ITGabut Toys`, description: DESCRIPTION, url: "/jadwal-rilis", type: "website", images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }] },
};

export default async function ReleaseSchedulePage() {
  const today = todayJakarta();
  const events = sortedEvents(RELEASE_EVENTS);
  const postSlugs = [...new Set(events.map((e) => e.postSlug).filter((s): s is string => !!s))];
  const [productRows, posts] = await Promise.all([getProductsBySlugs(allProductSlugs(events)), getPostSummaries(postSlugs)]);

  // Only what the calendar shows, so the client payload stays small.
  const products: Record<string, CalendarProduct> = Object.fromEntries(
    productRows.map((p) => [p.slug, { slug: p.slug, name: p.name, imageUrl: p.imageUrl, price: p.price, avail: p.avail, shopeeUrl: p.shopeeUrl }]),
  );
  const postTitles: Record<string, string> = Object.fromEntries(posts.map((p) => [p.slug, p.title]));

  const upcoming = upcomingEvents(today);
  const next = upcoming[0];
  const months = [...new Set(events.map((e) => monthKey(e.date)))].sort().reverse();
  const urlFor = (e: (typeof events)[number]) =>
    e.productSlugs?.find((s) => products[s]) ? `${SITE_URL}/produk/${e.productSlugs.find((s) => products[s])}` : e.postSlug && postTitles[e.postSlug] ? `${SITE_URL}/blog/${e.postSlug}` : `${SITE_URL}/jadwal-rilis`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: TITLE,
      url: `${SITE_URL}/jadwal-rilis`,
      inLanguage: "id-ID",
      description: DESCRIPTION,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: upcoming.length,
        itemListElement: upcoming.map((e, i) => ({ "@type": "ListItem", position: i + 1, name: `${formatEventDate(e, false)}: ${e.title}`, url: urlFor(e) })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Beranda", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Jadwal Rilis", item: `${SITE_URL}/jadwal-rilis` },
      ],
    },
  ];

  return (
    <section className="container" style={{ padding: "26px 20px 60px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" style={{ fontSize: 13, fontWeight: 600, color: "var(--muted-2)", marginBottom: 14 }}>
        <Link href="/">Beranda</Link> / <span style={{ color: "var(--ink)" }}>Jadwal Rilis</span>
      </nav>
      <h1 className="font-display" style={{ fontSize: "clamp(28px,3.8vw,46px)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 12px" }}>
        {TITLE}
      </h1>
      <p style={{ margin: "0 0 24px", fontSize: 15.5, lineHeight: 1.7, color: "var(--muted)", maxWidth: "72ch" }}>
        Jadwal rilis produk baru Blokees, pameran, dan film yang berkaitan, dalam satu kalender.
        {next ? ` Rilis berikutnya: ${next.title}, ${formatEventDate(next)}${next.confirmed ? "" : " (TBC)"}.` : ""} Tanggal bertanda TBC masih
        estimasi atau bocoran dan bisa berubah. Klik tanggal bertitik untuk melihat produk, harga, dan status pre-order di ITGabut Toys.
      </p>

      <ReleaseCalendar events={events} products={products} postTitles={postTitles} today={today} />

      {/* Plain server-rendered list: readable without JavaScript and by search engines. */}
      <h2 className="font-display" style={{ fontSize: "clamp(20px,2.4vw,26px)", fontWeight: 800, margin: "44px 0 6px" }}>
        Kapan rilis Blokees berikutnya?
      </h2>
      <p style={{ margin: "0 0 18px", fontSize: 14.5, color: "var(--muted)" }}>Semua jadwal per bulan, dari yang terbaru.</p>
      {months.map((mk) => {
        const [y, m] = mk.split("-").map(Number);
        const list = events.filter((e) => monthKey(e.date) === mk);
        return (
          <div key={mk} style={{ marginBottom: 22 }}>
            <h3 className="font-display" style={{ fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>
              Rilis Blokees {MONTHS_ID[m - 1]} {y}
            </h3>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8, fontSize: 14.5 }}>
              {list.map((e) => {
                const prod = e.productSlugs?.find((s) => products[s]);
                return (
                  <li key={e.id}>
                    <strong>{formatEventDate(e, false)}</strong>: {prod ? <Link href={`/produk/${prod}`}>{e.title}</Link> : e.title}
                    <span style={{ color: KIND_STYLE[e.kind].fg, fontWeight: 600 }}> ({KIND_STYLE[e.kind].label.toLowerCase()}{e.confirmed ? "" : ", TBC"})</span>
                    {e.postSlug && postTitles[e.postSlug] && (
                      <>
                        {" "}
                        <Link href={`/blog/${e.postSlug}`} style={{ fontSize: 13.5 }}>
                          baca artikelnya
                        </Link>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
      <p style={{ marginTop: 26, fontSize: 14.5 }}>
        Mau pesan sebelum stok habis? <Link href="/katalog">Lihat katalog Blokees per seri</Link> atau <Link href="/blog">baca info rilis terbaru di blog</Link>.
      </p>
    </section>
  );
}
