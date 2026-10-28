import { supabase } from "@/lib/supabaseClient";
import type { Availability, Product, ProductTag } from "@/lib/productShared";

// Server-side data access. Client components must import types/constants from
// "@/lib/productShared" instead, so the Supabase SDK stays out of the browser bundle.
export type { Availability, Product, ProductTag };
export { AVAIL_STYLE, PRICE_BUCKETS } from "@/lib/productShared";

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
  description: string | null;
  seoTitle: string | null;
  shopeeUrl: string | null;
}

const PRODUCT_COLUMNS =
  "slug,name,ip,type,battery,pack,condition,period,periodIndex,availability,tag,price,oldPrice,year,imageUrl,sortOrder,description,seoTitle,shopeeUrl";

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
    description: r.description,
    seoTitle: r.seoTitle,
    shopeeUrl: r.shopeeUrl,
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

