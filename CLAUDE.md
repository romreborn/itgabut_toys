# ITGabut Toys — project guide for Claude

Toko online Blokees & action figure. Repo ini = aplikasi Next.js (App Router) yang
auto-deploy ke Vercel dari GitHub `romreborn/itgabut_toys`, branch `main`. Host
kanonik: `https://www.itgabuttoys.com` (apex redirect ke www). ISR `revalidate = 60`.

## Data (Supabase)

Tiga tabel: `blog_posts`, `products`, `page_views`. Tidak ada ORM — baca/tulis lewat
Supabase REST pakai **service-role key** yang ada di `frontend/.env.local` (TIDAK
di-commit). Pola kerja yang dipakai: tulis skrip `.cjs` kecil di folder scratchpad
yang memanggil REST (`POST` untuk insert, `PATCH ...?slug=eq.<slug>` untuk update)
dengan header `apikey` + `Authorization: Bearer <service key>` dan
`Content-Type: application/json`. Setelah DDL apa pun, jalankan
`notify pgrst, 'reload schema'`.

### `blog_posts`
Field wajib diisi eksplisit saat insert (NOT NULL): `id` (uuid), `createdAt`,
`updatedAt`, `publishedAt` (ISO). Lainnya: `slug`, `title`, `seoTitle`,
`seoDescription`, `excerpt`, `category` ("Rilis Baru" untuk rilis/bocoran),
`readTime`, `dateLabel`, `isPublished`, `coverImageUrl`, `body`.

`body` = array blok JSON. Tipe blok: `p` {text}, `h` {text} (sub-heading),
`img` {id,url,caption}, `gallery` {images:[{url,alt}], caption},
`products` {label, productSlugs:[]}, `list` {items:[]}, `link` {url, label}.

### `products`
`slug`, `name`, `ip`, `type` (mis. BLIND_BOX), `pack`, `condition`,
`availability` (READY/PREORDER/SOLD), `tag`, `price`, `oldPrice`, `isActive`,
`imageUrl`, `sortOrder`, `description`, `seoTitle`. Harga katalog tampil dengan
**diskon 10% dicoret** (DISCOUNT_RATE / salePrice di `src/lib/format.ts`); keranjang
tidak mendiskon lagi.

## Aturan menulis blog (penting, konsisten dengan seluruh situs)

- Bahasa Indonesia, santai, seperti ngobrol.
- **Tanpa em dash / en dash (– —)** di mana pun. Pakai koma/titik/tanda kurung.
- **Tanpa blok FAQ** ("Yang sering ditanya"). Ganti dengan heading berbentuk
  pertanyaan di dalam isi artikel (untuk AEO), mis. "Kapan rilis dan berapa harganya?".
- Judul SEO (`seoTitle`) ≤ 45 karakter, `seoDescription` ≤ 160. Helper `fitTitle`
  di `src/lib/seo.ts` menjaga judul ≤ 60 dan deskripsi ≤ 160.
- Foto blog ditaruh di `frontend/public/blog/<Folder>/` dan **wajib di-commit + push**
  ke `main`, kalau tidak gambarnya 404 di produksi. Kompres ~1000px lebar, JPEG, pakai
  `sharp`. Ganti nama file acak jadi deskriptif.
- Harga yang belum resmi tulis "belum diumumkan"/"TBC", jangan dikarang.
- Pisahkan fakta dari dugaan ("kemungkinan", "label hanya terbaca sebagian").

## Produk & gambar

- Foto produk: 1000×1000 webp di `frontend/public/products/<slug>.webp` via `sharp`.
- Jangan pakai kata "Carton"/"Carton A + B" di nama produk.
- Kalau slug produk diganti, tambah redirect 308 di `next.config.mjs` supaya link lama
  tidak putus.

## Pantangan (keamanan & kebijakan)

- **Jangan** tambahkan `Review` / `AggregateRating` schema (aturan Google).
- **Jangan** publikasikan username/foto profil pembeli tanpa diburamkan; file asli
  disimpan di luar `public/`.
- Service key Supabase & secret lain tetap server-side, jangan di-commit.

## Jebakan shell (Windows)

Hindari regex backslash dan apostrof di dalam `node -e`/heredoc inline — sering rusak.
Lebih aman tulis skrip ke file (Write tool) lalu `node file.cjs`. Setelah edit artikel,
verifikasi langsung ke URL live (`curl -sL https://www.itgabuttoys.com/blog/<slug>`).

## Alur rilis

Commit + push ke `main` → Vercel build & deploy otomatis (±1-2 menit). Verifikasi
halaman live setelahnya. Commit hanya saat diminta; jangan push folder user yang tidak
diminta.
