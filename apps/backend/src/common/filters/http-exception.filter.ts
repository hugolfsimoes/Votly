import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Erro interno do servidor';
    let code: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const body = res as Record<string, unknown>;
        message = (body.message as string | string[]) ?? message;
        code = body.code as string | undefined;
      }
    } else if (exception instanceof Error) {
      this.logger.error(exception.stack ?? exception.message);
      message = process.env.NODE_ENV === 'production' ? message : exception.message;
    } else {
      this.logger.error('Exceção desconhecida', exception);
    }

    response.status(status).json({
      statusCode: status,
      code,
      message: Array.isArray(message) ? message : [message].flat(),
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
