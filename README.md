# ITGabut Toys — Frontend

Next.js 16 (App Router) rebuild of the Claude Design mockup
(`ITGabut Toys Catalog-handoff.zip`), built for SEO and ready to deploy on
Vercel. Reads its catalog and blog content live from Supabase — no separate
backend needed.

## What's here

- **Real routes per product and blog post** (`/produk/[slug]`, `/blog/[slug]`),
  statically generated at build time (`generateStaticParams`) so every product
  and article is a crawlable, indexable page with its own `<title>`,
  meta description, canonical URL, and JSON-LD (`Product` / `Article` /
  `ToyStore`). Pages revalidate every 60s (ISR) and `dynamicParams = true`, so
  a product/post added or edited in Supabase shows up without a redeploy.
- `app/sitemap.ts` and `app/robots.ts` generate `/sitemap.xml` and
  `/robots.txt` automatically (cart/checkout are excluded from indexing).
- Catalog search/filter/sort/pagination is a client component
  (`components/CatalogClient.tsx`) fed by server-rendered product data —
  the full catalog HTML is still in the initial server response.
- Cart (`/keranjang`) and checkout (`/checkout`) are client-only, backed by
  `localStorage`, and build a WhatsApp order message exactly like the original
  design (no order-persistence backend).
- ID/EN language toggle (`context/LanguageContext.tsx`) — Indonesian is the
  default and what search engines see first; the toggle re-renders text
  client-side.

## Data: Supabase

Products and blog posts are read directly from Supabase Postgres via
`@supabase/supabase-js` (`src/lib/supabaseClient.ts`), using the public
**anon** key — safe to expose client-side, since Row Level Security only
grants that key read access to active products / published blog posts.
Nothing else (orders, customers, admin accounts) is reachable through it.

To manage content: use the Supabase dashboard directly.
- **Table Editor** — add/edit products and blog posts.
- **Storage** (`product-images` bucket) — upload photos, then paste the
  public URL into a product's `imageUrl` column.

There is no admin panel or API server in this repo — see
`../backend-archived/ARCHIVED.md` for why, and how to bring one back if you
ever want a nicer editing UI than the Table Editor.

## Structure

```
src/
  app/                 routes (home, produk/[slug], blog, blog/[slug], keranjang, checkout)
  components/          UI building blocks
  context/             LanguageContext, CartContext (client state)
  lib/                 products.ts / posts.ts (Supabase fetchers), i18n dictionary, formatting
public/logo.png         store logo
```

## Product photos

`components/ProductImage.tsx` renders the product's real photo (`imageUrl`
column) with lazy-loading + a skeleton shimmer while it loads, via
`next/image`. Falls back to a deterministic colored placeholder tile when a
product has no photo yet, or its URL is broken.

## Develop

```bash
cp .env.example .env.local   # fill in Supabase URL + anon key
npm install
npm run dev
```

## Deploy to Vercel

Point a Vercel project at this `frontend` folder (Root Directory = `frontend`
if the repo root is one level up). Framework preset "Next.js" is auto-detected.
Before going live:
- Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in
  Vercel's Project Environment Variables (same values as `.env.local`).
- Update `SITE_URL` in `src/lib/constants.ts` to the real production domain
  (it feeds canonical URLs, sitemap, and Open Graph tags).
- Add the external image hosts you actually use to `next.config.mjs`'s
  `images.remotePatterns` if they're not already listed there (currently:
  `cdn.shopify.com`, `static.wikia.nocookie.net`, and this project's own
  Supabase Storage domain).
