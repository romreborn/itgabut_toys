import "server-only";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
/** Failures older than this stop counting, so an occasional typo never accumulates into a lock. */
const WINDOW_MINUTES = 15;

const TABLE = "admin_login_attempts";

/**
 * Best-effort client IP. Cloudflare sits in front of Vercel here, so its header
 * is the most trustworthy; the others are fallbacks for direct/preview traffic.
 */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const cf = h.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Seconds still remaining on a lock, or 0 when the caller may attempt a login.
 *
 * Every failure path here returns 0 (fail-open) on purpose: a database hiccup
 * should not lock the owner out of their own shop. The password check still
 * runs regardless, so failing open costs throttling, never authentication.
 */
export async function lockRemainingSeconds(identifier: string): Promise<number> {
  try {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select("lockedUntil")
      .eq("identifier", identifier)
      .maybeSingle();
    if (error || !data?.lockedUntil) return 0;

    const remainingMs = new Date(data.lockedUntil).getTime() - Date.now();
    return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
  } catch {
    return 0;
  }
}

/** Records a failed attempt and locks the identifier once it crosses the limit. */
export async function registerFailure(identifier: string): Promise<void> {
  try {
    const { data } = await supabaseAdmin
      .from(TABLE)
      .select("attempts,updatedAt")
      .eq("identifier", identifier)
      .maybeSingle();

    const staleBefore = Date.now() - WINDOW_MINUTES * 60_000;
    const withinWindow = data?.updatedAt ? new Date(data.updatedAt).getTime() > staleBefore : false;
    const attempts = withinWindow ? (data?.attempts ?? 0) + 1 : 1;

    await supabaseAdmin.from(TABLE).upsert(
      {
        identifier,
        attempts,
        lockedUntil: attempts >= MAX_ATTEMPTS ? new Date(Date.now() + LOCK_MINUTES * 60_000).toISOString() : null,
        updatedAt: new Date().toISOString(),
      },
      { onConflict: "identifier" }
    );
  } catch {
    // Throttling is advisory — never block a login flow because bookkeeping failed.
  }
}

/** Clears the counter after a successful login. */
export async function clearAttempts(identifier: string): Promise<void> {
  try {
    await supabaseAdmin.from(TABLE).delete().eq("identifier", identifier);
  } catch {
    // Same as above: a stale counter expires on its own after WINDOW_MINUTES.
  }
}
