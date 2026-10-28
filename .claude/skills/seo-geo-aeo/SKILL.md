---
name: seo-geo-aeo
description: |
  Standar SEO (Google), GEO (dikutip mesin AI seperti ChatGPT, Perplexity, AI Overviews)
  dan AEO (menjawab pertanyaan langsung) untuk ITGabut Toys. Pakai setiap kali menulis
  atau mengedit artikel blog, deskripsi produk, seoTitle/seoDescription, halaman, metadata,
  JSON-LD, atau llms.txt. Jalankan bersama skill humanizer.
metadata:
  version: "1.0.0"
---

# SEO + GEO + AEO untuk ITGabut Toys

Tujuannya satu: halaman gampang ditemukan di Google, gampang dikutip AI, dan langsung
menjawab pertanyaan pembeli. Semua aturan di CLAUDE.md tetap berlaku dan menang kalau
ada yang bertabrakan.

## 1. Riset kata kunci dulu

- Tentukan satu kata kunci utama per halaman, dalam bahasa yang diketik pembeli
  Indonesia: "blokees champion class optimus prime", "harga blokees galaxy version",
  "kapan rilis blokees wheels seri 5". Nama produk + lini + karakter + niat (harga,
  rilis, review, beli).
- Jangan bikin dua artikel untuk kata kunci yang sama. Cek dulu `blog_posts` di Supabase;
  kalau sudah ada, update artikel lama.

## 2. Judul, deskripsi, slug

- `seoTitle` ≤ 45 karakter (layout menambah " | ITGabut Toys"). Kata kunci utama di depan.
- `seoDescription` ≤ 160 karakter. Satu kalimat jawaban + alasan untuk klik. Tanpa
  "Temukan...", "Simak...", "Yuk...".
- `title` (H1) boleh lebih panjang dan lebih natural daripada `seoTitle`.
- Slug: huruf kecil, pakai tanda hubung, berisi kata kunci, tanpa tanggal kecuali
  memang seri tahunan. Slug lama yang diganti wajib redirect 308 di `next.config.mjs`.
- Hitung panjangnya, jangan mengira-ngira.

## 3. AEO: jawab di awal

- Paragraf pertama langsung menjawab inti pertanyaan dalam 1-2 kalimat (apa, kapan,
  berapa, di mana beli). Pembaca dan AI harus dapat jawabannya tanpa scroll.
- Sub-heading (`h`) berbentuk pertanyaan yang benar-benar diketik orang:
  "Kapan rilis dan berapa harganya?", "Bedanya Champion Class dan Galaxy Version apa?".
  Paragraf tepat di bawahnya menjawab di kalimat pertama, baru detail.
- Tanpa blok FAQ terpisah dan tanpa schema `FAQPage` baru di artikel blog.

## 4. GEO: gampang dikutip AI

- Tulis fakta yang bisa berdiri sendiri: nama lengkap produk, kode/seri, tinggi,
  jumlah karakter, tanggal, harga dalam Rupiah. Satu fakta per kalimat, jangan
  disembunyikan di kalimat panjang.
- Sebut entitas lengkap minimal sekali: "Blokees Champion Class Transformers",
  bukan cuma "CC".
- Pisahkan fakta dan dugaan secara eksplisit ("resminya...", "kemungkinan...",
  "label hanya terbaca sebagian"). Harga yang belum resmi: "belum diumumkan" / "TBC".
- Daftar (`list`) untuk isi set, varian, atau langkah. Mesin AI suka struktur.
- Kalau ada sumber resmi (pengumuman Blokees, distributor), cantumkan dengan blok `link`.
- Artikel baru otomatis masuk `/llms.txt` lewat `excerpt`, jadi `excerpt` harus berupa
  ringkasan faktual satu kalimat, bukan teaser.

## 5. Struktur dan tautan internal

- Satu H1 (judul), sub-heading pakai blok `h`, paragraf pendek (2-4 kalimat).
- Setiap artikel rilis/produk punya blok `products` yang menautkan produk terkait di
  katalog (kalau produknya ada). Tautkan juga 1-2 artikel blog terkait.
- Gambar: nama file deskriptif, `caption`/`alt` menjelaskan isi gambar dengan kata
  kunci secara wajar, bukan ditumpuk.
- `category` "Rilis Baru" untuk rilis dan bocoran.

## 6. Structured data

- Pakai yang sudah ada: `BlogPosting`, `Product` + `Offer`, `BreadcrumbList`,
  `Organization`/`ToyStore`, `ItemList`.
- **Jangan** tambah `Review` atau `AggregateRating`.
- Data di schema harus sama persis dengan yang tampil di halaman (harga, stok).

## 7. Cek sebelum selesai

- [ ] Kata kunci utama ada di seoTitle, H1, paragraf pertama, dan slug
- [ ] seoTitle ≤ 45, seoDescription ≤ 160 (dihitung)
- [ ] Paragraf pertama menjawab pertanyaan utama
- [ ] Heading berbentuk pertanyaan, tanpa blok FAQ
- [ ] Fakta vs dugaan jelas, tidak ada harga karangan
- [ ] Ada tautan internal (blok `products` / artikel terkait)
- [ ] Tidak ada em dash / en dash
- [ ] Sudah dilewatkan skill humanizer
- [ ] Setelah publish: `curl -sL https://www.itgabuttoys.com/blog/<slug>` dan cek
      `<title>`, meta description, dan JSON-LD
