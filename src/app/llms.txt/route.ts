import { getAllPosts } from "@/lib/posts";
import { SHOPEE_RATING } from "@/lib/reviews";
import { INSTAGRAM_HANDLE, MALLS, SHOPEE_URL, SITE_URL, WA_DISPLAY } from "@/lib/constants";

// /llms.txt: a plain-text summary of the store for AI search engines (https://llmstxt.org).
// Every line restates facts already published on the site; nothing here is new copy.
export const revalidate = 3600;

export async function GET() {
  const posts = await getAllPosts();
  const lines = [
    "# ITGabut Toys",
    "",
    "> Toko Blokees dan action figure di Perumahan Citra Raya, Tangerang, Banten. Barang bisa diambil di toko, COD di mall sekitar Tangerang, atau dikirim ke seluruh Indonesia.",
    "",
    "## Tentang toko",
    "- Menjual figure dan building block figure, kebanyakan Blokees: Transformers, Marvel, Ultraman, Pokemon, Saint Seiya, Star Wars, Evangelion, dan blind box Blokees Wheels.",
    "- Lini yang dijual antara lain Champion Class, Galaxy Version, Action Edition, Fantastics, dan Blokees Wheels. Semua barang masih segel.",
    "- Semua harga di katalog sudah dipotong diskon 10% dari harga list distributor terbaru. Stok dicek ulang lewat WhatsApp sebelum pesanan diproses.",
    `- Ambil di toko: Perumahan Citra Raya, Tangerang (chat dulu sebelum datang). COD by appointment di ${MALLS.join(", ")}.`,
    "- Pengiriman ke seluruh Indonesia termasuk luar pulau lewat JNE, J&T, atau Lion Parcel, dipacking dus tebal dan bubble wrap.",
    `- Rating toko di Shopee ${SHOPEE_RATING.score} dari 5, dari ${SHOPEE_RATING.count} ulasan pembeli (${SHOPEE_RATING.asOf}).`,
    `- Kontak: WhatsApp ${WA_DISPLAY}, Instagram ${INSTAGRAM_HANDLE}, Shopee ${SHOPEE_URL}.`,
    "",
    "## Halaman utama",
    `- [Katalog produk](${SITE_URL}/#katalog): stok, harga, status ready atau pre-order.`,
    `- [Tentang & kontak](${SITE_URL}/tentang): profil toko, cara ambil, COD, dan pengiriman.`,
    `- [Blog](${SITE_URL}/blog): info rilis, bocoran lineup, dan panduan Blokees.`,
    `- [Spinner wheel](${SITE_URL}/games): tools undian gratis.`,
    "",
    "## Artikel",
    ...posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
