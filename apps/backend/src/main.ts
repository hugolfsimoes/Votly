import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

/** `outDir` com pasta `src` → `dist/src/main.js`; `public` fica em `../..` em relação a `__dirname`. */
function resolvePublicPath(): string {
  const nested = join(__dirname, '..', '..', 'public');
  const flat = join(__dirname, '..', 'public');
  if (existsSync(nested)) return nested;
  if (existsSync(flat)) return flat;
  return nested;
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(resolvePublicPath());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
