"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const BUCKET = "product-images";

function num(fd: FormData, key: string): number {
  const n = Number(fd.get(key));
  return Number.isFinite(n) ? n : 0;
}

function numOrNull(fd: FormData, key: string): number | null {
  const v = String(fd.get(key) || "").trim();
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) || "").trim();
}

async function uploadImageIfProvided(fd: FormData, slug: string): Promise<string | null> {
  const file = fd.get("imageFile");
  if (!(file instanceof File) || file.size === 0) return null;
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${slug}-${Date.now()}.${ext}`;
  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || "image/jpeg",
    upsert: true,
  });
  if (error) throw new Error(`Upload gambar gagal: ${error.message}`);
  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function buildPayload(fd: FormData) {
  return {
    name: str(fd, "name"),
    ip: str(fd, "ip"),
    type: str(fd, "type"),
    battery: fd.get("battery") === "on",
    pack: str(fd, "pack"),
    condition: str(fd, "condition"),
    period: str(fd, "period"),
    periodIndex: num(fd, "periodIndex"),
    availability: str(fd, "availability"),
    tag: str(fd, "tag") || null,
    price: num(fd, "price"),
    oldPrice: num(fd, "oldPrice"),
    year: numOrNull(fd, "year"),
    isActive: fd.get("isActive") === "on",
    sortOrder: num(fd, "sortOrder"),
    description: str(fd, "description") || null,
    seoTitle: str(fd, "seoTitle") || null,
    shopeeUrl: shopeeUrl(fd),
  };
}

/** Optional per-product Shopee (affiliate) link. Only https Shopee URLs are accepted. */
function shopeeUrl(fd: FormData): string | null {
  const v = str(fd, "shopeeUrl");
  if (!v) return null;
  let host = "";
  try {
    const u = new URL(v);
    if (u.protocol === "https:") host = u.hostname;
  } catch {}
  if (host !== "shopee.co.id" && !host.endsWith(".shopee.co.id")) {
    throw new Error("Link Shopee harus berupa URL https://shopee.co.id/... atau https://s.shopee.co.id/...");
  }
  return v;
}

export async function createProductAction(formData: FormData) {
  const slug = str(formData, "slug");
  if (!slug) throw new Error("Slug wajib diisi.");

  const payload = buildPayload(formData);
  const uploadedUrl = await uploadImageIfProvided(formData, slug);
  const imageUrl = uploadedUrl || str(formData, "imageUrl") || null;

  // products.id and products.updatedAt have no database default, so set them here
  // (same pattern as blog_posts and orders).
  const { error } = await supabaseAdmin
    .from("products")
    .insert({ id: crypto.randomUUID(), slug, ...payload, imageUrl, updatedAt: new Date().toISOString() });
  if (error) throw new Error(`Gagal membuat produk: ${error.message}`);

  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function updateProductAction(slug: string, formData: FormData) {
  const payload = buildPayload(formData);
  const uploadedUrl = await uploadImageIfProvided(formData, slug);
  const imageUrl = uploadedUrl || str(formData, "imageUrl") || null;

  const { error } = await supabaseAdmin
    .from("products")
    .update({ ...payload, imageUrl })
    .eq("slug", slug);
  if (error) throw new Error(`Gagal menyimpan produk: ${error.message}`);

  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function updateAvailabilityAction(slug: string, availability: "READY" | "PREORDER" | "SOLD") {
  const { error } = await supabaseAdmin.from("products").update({ availability }).eq("slug", slug);
  if (error) throw new Error(`Gagal mengubah status: ${error.message}`);

  revalidatePath("/", "layout");
  revalidatePath("/admin/products");
}

export async function deleteProductAction(slug: string) {
  const { error } = await supabaseAdmin.from("products").delete().eq("slug", slug);
  if (error) throw new Error(`Gagal menghapus produk: ${error.message}`);

  revalidatePath("/", "layout");
  redirect("/admin/products");
}
