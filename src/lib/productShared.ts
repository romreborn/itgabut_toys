/**
 * Product types and constants that client components need.
 *
 * Kept separate from `@/lib/products` on purpose: that module creates the Supabase client at
 * import time, so importing even one constant from it pulled the whole Supabase SDK (~64 KiB
 * transferred) into the browser bundle of every page with a product card.
 */

export type Availability = "ready" | "preorder" | "sold";
export type ProductTag = "best" | "new" | "movie" | "";

export interface Product {
  slug: string;
  name: string;
  ip: string;
  type: "Blind Box" | "Non Blind Box";
  battery: boolean;
  pack: string;
  cond: string;
  period: string;
  pIdx: number;
  avail: Availability;
  tag: ProductTag;
  price: number;
  oldPrice: number;
  year: number | null;
  /** Real product photo URL, if one's been sourced/uploaded yet. */
  imageUrl: string | null;
  /** Catalog insertion order — higher means added more recently. */
  sortOrder: number;
  /** Optional long-form copy for the product page; paragraphs separated by blank lines. */
  description: string | null;
  /** Optional short name for the <title> when the catalog name is too long. */
  seoTitle: string | null;
  /** Optional Shopee product link (affiliate) for "Beli di Shopee"; falls back to the store page. */
  shopeeUrl: string | null;
}

/** Status badge colors; every fg/bg pair meets WCAG AA (>= 4.5:1). */
export const AVAIL_STYLE: Record<Availability, { bg: string; fg: string }> = {
  ready: { bg: "#DCEBD2", fg: "#3A5A2A" },
  preorder: { bg: "#FFE7D6", fg: "#B7420E" },
  sold: { bg: "#EFE6DE", fg: "#6E5A4E" },
};

export const PRICE_BUCKETS: Record<string, [number, number]> = {
  "<50": [0, 50000],
  "50-150": [50000, 150000],
  "150-300": [150000, 300000],
  "300-500": [300000, 500000],
  ">500": [500000, 1e9],
};
