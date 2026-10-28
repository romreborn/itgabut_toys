/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Default 1MB is too small for the Excel restock sheets uploaded via
    // the /admin/products/import Server Action.
    serverActions: { bodySizeLimit: "10mb" },
    // The whole stylesheet is ~3 KiB compressed: inline it in the HTML instead of a
    // render-blocking request (PageSpeed: render-blocking requests).
    inlineCss: true,
  },
  // Renamed product slugs, so old links and indexed URLs keep working.
  async redirects() {
    return [
      {
        source: "/produk/jurassic-world-terraventure-ts01-1-set-carton-a-b-119",
        destination: "/produk/jurassic-world-terraventure-ts01-119",
        permanent: true,
      },
    ];
  },
  images: {
    // AVIF first (typically 20-30% smaller than WebP); browsers without AVIF still get WebP.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Product photos sourced from the official Blokees storefront.
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/**" },
      // Product photos sourced from the community Blokees Wiki (Fandom).
      { protocol: "https", hostname: "static.wikia.nocookie.net", pathname: "/**" },
      // Product photos sourced from third-party Blokees retailers (for SKUs
      // no longer listed on the official storefront).
      { protocol: "https", hostname: "actionfigurehq.com", pathname: "/**" },
      { protocol: "https", hostname: "product.hstatic.net", pathname: "/**" },
      // Admin-uploaded product photos, once the frontend reads imageUrl from
      // the backend API instead of its bundled static data.
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
