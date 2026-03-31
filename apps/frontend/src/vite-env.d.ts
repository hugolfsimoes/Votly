/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  /** Origem do Nest para páginas estáticas (.html), ex.: http://localhost:3000 */
  readonly VITE_API_STATIC_ORIGIN?: string;
  /** Projeto Supabase (URL pública do dashboard) */
  readonly VITE_SUPABASE_URL?: string;
  /**
   * Chave pública anónima / “publishable” do Supabase (segura para expor no cliente).
   */
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** Nomes alinhados ao wizard Next / dashboard Supabase (expostos via envPrefix no Vite). */
  readonly NEXT_PUBLIC_SUPABASE_URL?: string;
  readonly NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
