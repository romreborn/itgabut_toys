import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * On-demand revalidation for content edited outside the admin panel (the scratch
 * scripts that write to Supabase directly). Pages now cache for a day instead of a
 * minute, so after a change the script calls this to refresh just what changed.
 *
 * Auth: `Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>` — the key the scripts
 * already use, and a server-only secret on Vercel.
 * Body: `{ "paths": ["/produk/x", "/blog/y"] }` or `{ "all": true }`.
 */
function authorized(request: Request): boolean {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!secret || !token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let payload: { paths?: unknown; all?: unknown } = {};
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (payload.all === true) {
    revalidatePath("/", "layout");
    return NextResponse.json({ revalidated: "all" });
  }

  const paths = Array.isArray(payload.paths)
    ? payload.paths.filter((p): p is string => typeof p === "string" && p.startsWith("/") && p.length < 300).slice(0, 50)
    : [];
  if (paths.length === 0) return NextResponse.json({ error: "no paths" }, { status: 400 });
  for (const p of paths) revalidatePath(p);
  return NextResponse.json({ revalidated: paths });
}
