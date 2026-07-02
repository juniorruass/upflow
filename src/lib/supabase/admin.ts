import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service role: bypassa RLS. Só deve ser importado por rotas server-side
// em api/admin/** e api/instance/** -- nunca em código que roda no browser.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
