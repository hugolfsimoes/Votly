import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { BrandMark } from '@votly/ui';
import { apiStaticOrigin, getToken, setToken, signIn } from './lib/api';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  /** Incrementar após mudar o token no localStorage para o React voltar a ler a sessão. */
  const [authVersion, setAuthVersion] = useState(0);

  const staticOrigin = apiStaticOrigin();
  const registerHref = `${staticOrigin}/register.html`;
  const isDev = import.meta.env.DEV;
  const hasSession = useMemo(() => !!getToken(), [authVersion]);

  useEffect(() => {
    if (!hasSession) return;
    const token = getToken();
    if (!token) return;
    if (isDev) {
      window.location.replace(
        `${staticOrigin}/groups.html#votly_handoff=${encodeURIComponent(token)}`,
      );
      return;
    }
    window.location.href = `${staticOrigin}/groups.html`;
  }, [staticOrigin, isDev, hasSession, authVersion]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await signIn(email.trim(), password);
      setToken(data.accessToken);
      setAuthVersion((n) => n + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-[640px] px-5 pb-12 pt-6">
      <header className="mb-8 flex items-center justify-between gap-4 border-b border-[#444] pb-4">
        <a
          className="font-display text-[1.1rem] font-bold tracking-[0.12em] text-white no-underline"
          href="/"
        >
          <BrandMark className="font-display" />
        </a>
      </header>

      <div className="rounded-votly border border-[#454545] bg-votly-elevated px-5 py-[1.35rem]">
        {hasSession ? (
          <>
            <h1 className="font-display mb-3 text-[1.65rem] font-semibold tracking-wide text-white">
              A abrir os teus grupos…
            </h1>
            <p className="mb-0 text-votly-muted">
              Se não fores redirecionado, confirma que a API está a correr em{' '}
              <span className="text-white/90">{staticOrigin}</span>.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display mb-3 text-[1.65rem] font-semibold tracking-wide text-white">
              Entrar
            </h1>
            <p className="mb-5 text-votly-muted">Acede aos teus grupos e votações.</p>

            {error ? (
              <div
                className="mb-4 rounded-votly border border-red-400/35 bg-red-400/10 px-[0.85rem] py-[0.65rem] text-[0.95rem] text-votly-danger"
                role="alert"
              >
                {error}
              </div>
            ) : null}

            <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label
              className="mb-[0.35rem] block text-[0.85rem] uppercase tracking-[0.08em] text-votly-muted"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full rounded-votly border border-[#555] bg-votly-input px-[0.85rem] py-[0.65rem] font-sans text-base text-white outline-none focus:border-votly-accent-muted focus:ring-2 focus:ring-votly-accent-muted/40"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="mb-[0.35rem] block text-[0.85rem] uppercase tracking-[0.08em] text-votly-muted"
              htmlFor="password"
            >
              Palavra-passe
            </label>
            <input
              className="w-full rounded-votly border border-[#555] bg-votly-input px-[0.85rem] py-[0.65rem] font-sans text-base text-white outline-none focus:border-votly-accent-muted focus:ring-2 focus:ring-votly-accent-muted/40"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </div>
          <div className="mt-5">
            <button
              className="cursor-pointer rounded-votly border-none bg-votly-accent px-5 py-[0.65rem] font-sans text-base font-semibold text-votly-primary-ink transition-colors hover:bg-votly-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? 'A entrar…' : 'Entrar'}
            </button>
          </div>
            </form>

            <p className="mb-0 mt-5 text-votly-muted">
              Sem conta?{' '}
              <a className="text-votly-accent no-underline hover:text-votly-accent-hover" href={registerHref}>
                Criar registo
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
