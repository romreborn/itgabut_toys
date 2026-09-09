import { supabase } from "@/lib/supabaseClient";

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
}

/** Raw shape of a row in Supabase's `products` table. */
interface ProductRow {
  slug: string;
  name: string;
  ip: string;
  type: "BLIND_BOX" | "NON_BLIND_BOX";
  battery: boolean;
  pack: string;
  condition: string;
  period: string;
  periodIndex: number;
  availability: "READY" | "PREORDER" | "SOLD";
  tag: "BEST" | "NEW" | "MOVIE" | null;
  price: number;
  oldPrice: number;
  year: number | null;
  imageUrl: string | null;
  sortOrder: number;
}

const PRODUCT_COLUMNS =
  "slug,name,ip,type,battery,pack,condition,period,periodIndex,availability,tag,price,oldPrice,year,imageUrl,sortOrder";

function fromRow(r: ProductRow): Product {
  return {
    slug: r.slug,
    name: r.name,
    ip: r.ip,
    type: r.type === "BLIND_BOX" ? "Blind Box" : "Non Blind Box",
    battery: r.battery,
    pack: r.pack,
    cond: r.condition,
    period: r.period,
    pIdx: r.periodIndex,
    avail: r.availability.toLowerCase() as Availability,
    tag: r.tag ? (r.tag.toLowerCase() as ProductTag) : "",
    price: r.price,
    oldPrice: r.oldPrice,
    year: r.year,
    imageUrl: r.imageUrl,
    sortOrder: r.sortOrder,
  };
}

/** Full active catalog — used by the catalog grid, sitemap, and related-product lookups. */
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("isActive", true)
    .order("sortOrder", { ascending: false });
  if (error) {
    console.error("getAllProducts:", error.message);
    return [];
  }
  return (data as ProductRow[]).map(fromRow);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("isActive", true)
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error("getProductBySlug:", error.message);
    return null;
  }
  return data ? fromRow(data as ProductRow) : null;
}

/** Other active products sharing the same IP, for the detail page's "related" rail. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("isActive", true)
    .eq("ip", product.ip)
    .neq("slug", product.slug)
    .limit(limit);
  if (error) {
    console.error("getRelatedProducts:", error.message);
    return [];
  }
  return (data as ProductRow[]).map(fromRow);
}

/** Exact lookup by slug, in the given order — used by blog "products mentioned" blocks. */
export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  if (slugs.length === 0) return [];
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("isActive", true)
    .in("slug", slugs);
  if (error) {
    console.error("getProductsBySlugs:", error.message);
    return [];
  }
  const rows = (data as ProductRow[]).map(fromRow);
  const bySlug = new Map(rows.map((p) => [p.slug, p]));
  return slugs.map((s) => bySlug.get(s)).filter((p): p is Product => !!p);
}

export const AVAIL_STYLE: Record<Availability, { bg: string; fg: string }> = {
  ready: { bg: "#DCEBD2", fg: "#3A5A2A" },
  preorder: { bg: "#FFE7D6", fg: "#C9490F" },
  sold: { bg: "#EFE6DE", fg: "#8A7263" },
};

export const PRICE_BUCKETS: Record<string, [number, number]> = {
  "<50": [0, 50000],
  "50-150": [50000, 150000],
  "150-300": [150000, 300000],
  "300-500": [300000, 500000],
  ">500": [500000, 1e9],
};
