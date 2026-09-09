/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
      // Admin-uploaded product photos, once the frontend reads imageUrl from
      // the backend API instead of its bundled static data.
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
