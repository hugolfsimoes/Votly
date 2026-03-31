import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null = null;

/**
 * Cliente Supabase para o browser (Vite).
 * Aceita nomes `VITE_*` ou os do wizard Next (`NEXT_PUBLIC_*`).
 * O Votly continua a usar a API Nest + JWT para dados da app; isto serve para
 * funcionalidades Supabase no cliente (Auth, Realtime, Storage, etc.), se precisares.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  const url =
    import.meta.env.VITE_SUPABASE_URL?.trim() ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.trim();
  if (!url || !anonKey) {
    return null;
  }
  if (!browserClient) {
    browserClient = createClient(url, anonKey);
  }
  return browserClient;
}
