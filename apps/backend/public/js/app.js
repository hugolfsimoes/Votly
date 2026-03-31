(function () {
  var TOKEN_KEY = 'votly_accessToken';

  /** Sincroniza sessão vinda do Vite (5173): o token não partilha localStorage com :3000. */
  (function consumeDevHandoff() {
    var h = window.location.hash;
    var prefix = '#votly_handoff=';
    if (!h || h.indexOf(prefix) !== 0) return;
    try {
      var token = decodeURIComponent(h.slice(prefix.length));
      if (token) localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      /* hash inválido */
    }
    try {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    } catch (e2) {
      /* ignore */
    }
  })();

  function looksLikeHtml(text) {
    if (!text || typeof text !== 'string') return false;
    var t = text.trim().slice(0, 32).toLowerCase();
    return t.startsWith('<!doctype') || t.startsWith('<html');
  }

  function resolveApiBase() {
    var m = document.querySelector('meta[name="votly-api-base"]');
    if (m) {
      var c = m.getAttribute('content');
      if (c != null && String(c).trim() !== '')
        return String(c).trim().replace(/\/$/, '');
    }
    if (window.location.protocol === 'file:') {
      return 'http://localhost:3000';
    }
    var p = window.location.port;
    var uiPorts = { '5500': 1, '5173': 1, '4173': 1, '8080': 1 };
    if (uiPorts[p]) {
      var h = window.location.hostname;
      return window.location.protocol + '//' + h + ':3000';
    }
    return '';
  }

  function parseError(data) {
    if (!data || typeof data !== 'object') return 'Pedido falhou';
    var m = data.message;
    if (Array.isArray(m)) return m.join(' ');
    if (typeof m === 'string') return m;
    return 'Erro desconhecido';
  }

  var htmlApiMsg =
    'O servidor devolveu uma página HTML em vez da API JSON. ' +
    'Usa a interface em http://localhost:PORT/login.html com o mesmo PORT do Nest (ex.: pnpm start:dev), ' +
    'ou adiciona no <head> desta página: <meta name="votly-api-base" content="http://localhost:3000"> ' +
    '(ajusta o URL se a API estiver doutro host/porta).';

  window.Votly = {
    apiBase: resolveApiBase(),

    getToken: function () {
      return localStorage.getItem(TOKEN_KEY);
    },

    setToken: function (t) {
      localStorage.setItem(TOKEN_KEY, t);
    },

    clearToken: function () {
      localStorage.removeItem(TOKEN_KEY);
    },

    request: function (path, opts) {
      opts = opts || {};
      var base = opts.apiBase != null ? opts.apiBase : this.apiBase;
      var url = base + path;
      var headers = Object.assign(
        { 'Content-Type': 'application/json' },
        opts.headers || {},
      );
      var token = this.getToken();
      if (token) headers['Authorization'] = 'Bearer ' + token;

      return fetch(url, {
        method: opts.method || 'GET',
        headers: headers,
        body: opts.body != null ? JSON.stringify(opts.body) : undefined,
      }).then(function (res) {
        return res.text().then(function (text) {
          if (looksLikeHtml(text)) {
            throw new Error(htmlApiMsg);
          }
          var data = null;
          if (text) {
            try {
              data = JSON.parse(text);
            } catch (e) {
              if (!res.ok) {
                throw new Error(
                  text.length > 180 ? text.slice(0, 180) + '…' : text || 'Resposta inválida',
                );
              }
              throw new Error(
                'Resposta não é JSON válido. Confirma que o URL da API está correto (apiBase atual: "' +
                  (base || window.location.origin) +
                  '").',
              );
            }
          }
          if (!res.ok) throw new Error(parseError(data));
          return data;
        });
      });
    },

    requireAuth: function () {
      if (!this.getToken()) {
        window.location.href = '/login.html';
        return false;
      }
      return true;
    },

    logout: function () {
      this.clearToken();
      window.location.href = '/login.html';
    },

    showError: function (el, err) {
      if (!el) return;
      el.textContent = err && err.message ? err.message : String(err);
      el.classList.add('is-visible');
    },

    clearError: function (el) {
      if (!el) return;
      el.classList.remove('is-visible');
      el.textContent = '';
    },
  };
})();
