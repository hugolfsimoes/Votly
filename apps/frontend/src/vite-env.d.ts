/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  /** Origem do Nest para páginas estáticas (.html), ex.: http://localhost:3000 */
  readonly VITE_API_STATIC_ORIGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
