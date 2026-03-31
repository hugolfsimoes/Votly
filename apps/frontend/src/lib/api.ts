const TOKEN_KEY = 'votly_accessToken';

/** Base para chamadas JSON (proxy `/api` em dev ou URL absoluta). */
export function apiBase(): string {
  const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? '';
  if (base) return base;
  return '/api';
}

/**
 * Origem onde o Nest serve HTML estático (login.html, groups.html).
 * Com proxy só em `/api`, o browser não serve esses ficheiros no :5173.
 */
export function apiStaticOrigin(): string {
  const o = import.meta.env.VITE_API_STATIC_ORIGIN?.replace(/\/$/, '');
  if (o) return o;
  const url = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
  if (url) return url;
  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:3000`;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function parseApiError(text: string, status: number): string {
  const t = text.trim();
  if (t.startsWith('<!') || t.toLowerCase().startsWith('<html')) {
    return 'Resposta inválida (HTML em vez de JSON). Confirma que a API está a correr e o proxy /api aponta para a porta certa.';
  }
  try {
    const data = JSON.parse(t) as { message?: string | string[] };
    const m = data.message;
    if (Array.isArray(m)) return m.join(' ');
    if (typeof m === 'string') return m;
  } catch {
    /* ignore */
  }
  return t || `Erro ${status}`;
}

export async function signIn(email: string, password: string): Promise<{ accessToken: string }> {
  const res = await fetch(`${apiBase()}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(parseApiError(text, res.status));
  }
  return JSON.parse(text) as { accessToken: string };
}
