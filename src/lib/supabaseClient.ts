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
 */
export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});
