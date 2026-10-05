import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * Pageview collector.
 *
 * Writes go through the service-role key here rather than straight from the
 * browser, so `page_views` needs no anon RLS policy at all — the table stays
 * unreadable and unwritable to everyone except server code.
 */
export async function POST(request: Request) {
  // Always answer 204: this is fire-and-forget telemetry and must never
  // surface an error to a visitor or hold up a navigation.
  const noContent = new NextResponse(null, { status: 204 });

  try {
    const payload = (await request.json()) as { path?: unknown; referrer?: unknown };
    const raw = typeof payload.path === "string" ? payload.path : "";
    if (!raw.startsWith("/") || raw.length > 300) return noContent;

    // Drop query strings and hashes so "/produk/x?utm=y" folds into "/produk/x".
    const path = raw.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
    if (path.startsWith("/admin") || path.startsWith("/api")) return noContent;

    let kind = "page";
    let slug: string | null = null;
    if (path.startsWith("/produk/")) {
      kind = "product";
      slug = path.slice("/produk/".length) || null;
    } else if (path.startsWith("/blog/")) {
      kind = "blog";
      slug = path.slice("/blog/".length) || null;
    }
    if (slug && slug.length > 200) return noContent;

    const referrerRaw = typeof payload.referrer === "string" ? payload.referrer : "";
    const referrer = referrerRaw.slice(0, 300) || null;

    await supabaseAdmin.from("page_views").insert({ path, kind, slug, referrer });
  } catch {
    // Malformed body, database hiccup — nothing here is worth failing on.
  }

  return noContent;
}
