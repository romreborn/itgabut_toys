/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Default 1MB is too small for the Excel restock sheets uploaded via
    // the /admin/products/import Server Action.
    serverActions: { bodySizeLimit: "10mb" },
  },
  images: {
    remotePatterns: [
      // Product photos sourced from the official Blokees storefront.
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/**" },
      // Product photos sourced from the community Blokees Wiki (Fandom).
      { protocol: "https", hostname: "static.wikia.nocookie.net", pathname: "/**" },
      // Product photos sourced from third-party Blokees retailers (for SKUs
      // no longer listed on the official storefront).
      { protocol: "https", hostname: "actionfigurehq.com", pathname: "/**" },
      { protocol: "https", hostname: "product.hstatic.net", pathname: "/**" },
      // Homepage hero key art sourced from toy-news coverage.
      { protocol: "https", hostname: "news.tfw2005.com", pathname: "/**" },
      // Admin-uploaded product photos, once the frontend reads imageUrl from
      // the backend API instead of its bundled static data.
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
