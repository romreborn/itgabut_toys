/**
 * next/image loader that skips Vercel's Image Optimization. The Hobby plan's optimization
 * quota ran out, and every image it hadn't cached yet came back as 402, which made product
 * and blog photos fall back to the "coming soon" tile.
 *
 * - Local files (/products, /blog, /logo...) are pre-sized webp/jpg, so they're served as-is.
 * - cdn.shopify.com resizes on its own CDN through the `width` query param.
 * - Anything else (Supabase storage, retailer hosts) is served as-is.
 */
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  if (src.startsWith("https://cdn.shopify.com/")) {
    return `${src}${src.includes("?") ? "&" : "?"}width=${width}`;
  }
  return src;
}
