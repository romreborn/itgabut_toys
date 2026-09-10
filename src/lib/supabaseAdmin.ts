import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set. See .env.example."
  );
}

/**
 * Server-only Supabase client signed in as `service_role` — bypasses Row
 * Level Security entirely. Only ever import this from admin Server
 * Actions/Route Handlers under `src/app/admin/**`. The `server-only` import
 * above makes it a build error to accidentally pull this into a Client
 * Component or anything the browser bundle could reach.
 */
export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
});
