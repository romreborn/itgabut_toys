import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set. Copy .env.example to .env.local (or set them in Vercel's project env vars)."
  );
}

/**
 * Shared Supabase client, safe to use from both Server Components and the
 * browser — the anon key it carries has no elevated privileges, only what
 * RLS policies grant to the `anon`/`authenticated` roles (read-only access
 * to active products and published blog posts; nothing else).
 *
 * `next: { revalidate: 60 }` pins every request to the same 60s window as
 * each route's own `export const revalidate`, set explicitly rather than
 * relying on Next.js to infer it ambiently through a third-party client —
 * that inference has proven unreliable in practice, letting a build bake
 * in a Data Cache entry from a much older deploy (Next's Data Cache can
 * persist *across* deployments independently of a page's revalidate).
 */
export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
  global: {
    fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 60 } }),
  },
});
