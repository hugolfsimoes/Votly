import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  /** JSON para health-check (SPA / proxy /api → não use GET /). */
  @Get('health')
  health() {
    return { status: 'ok', service: 'votly-api' };
  }

  /** Navegador direto na API: assets estáticos em /login.html, etc. */
  @Get()
  @Redirect('/login.html', 302)
  root() {
    /* redirect via decorator */
  }
}
