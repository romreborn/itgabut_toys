"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function str(fd: FormData, key: string): string {
  return String(fd.get(key) || "").trim();
}

function parseBody(fd: FormData): unknown {
  const raw = str(fd, "body") || "[]";
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Body harus berupa array JSON.");
    return parsed;
  } catch (e) {
    throw new Error(`Body bukan JSON yang valid: ${(e as Error).message}`);
  }
}

function buildPayload(fd: FormData) {
  const isPublished = fd.get("isPublished") === "on";
  return {
    title: str(fd, "title"),
    excerpt: str(fd, "excerpt"),
    category: str(fd, "category"),
    readTime: str(fd, "readTime"),
    dateLabel: str(fd, "dateLabel"),
    isPublished,
    body: parseBody(fd),
    // Only stamped when (re-)published — never written to null, since the
    // column isn't guaranteed nullable and `dateLabel` is the actual
    // display source of truth on the storefront anyway.
    ...(isPublished ? { publishedAt: new Date().toISOString() } : {}),
  };
}

export async function createBlogPostAction(formData: FormData) {
  const slug = str(formData, "slug");
  if (!slug) throw new Error("Slug wajib diisi.");

  const payload = buildPayload(formData);
  const { error } = await supabaseAdmin
    .from("blog_posts")
    .insert({ id: crypto.randomUUID(), slug, ...payload });
  if (error) throw new Error(`Gagal membuat artikel: ${error.message}`);

  revalidatePath("/", "layout");
  redirect("/admin/blog");
}

export async function updateBlogPostAction(slug: string, formData: FormData) {
  const payload = buildPayload(formData);
  const { error } = await supabaseAdmin.from("blog_posts").update(payload).eq("slug", slug);
  if (error) throw new Error(`Gagal menyimpan artikel: ${error.message}`);

  revalidatePath("/", "layout");
  redirect("/admin/blog");
}

export async function deleteBlogPostAction(slug: string) {
  const { error } = await supabaseAdmin.from("blog_posts").delete().eq("slug", slug);
  if (error) throw new Error(`Gagal menghapus artikel: ${error.message}`);

  revalidatePath("/", "layout");
  redirect("/admin/blog");
}
