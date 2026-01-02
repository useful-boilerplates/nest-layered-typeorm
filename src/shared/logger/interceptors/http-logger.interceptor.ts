import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../logger.service';
import { Request, Response } from 'express';

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') return next.handle();

    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'Unknown';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse<Response>();
          const statusCode = response.statusCode;
          const responseTime = Date.now() - startTime;

          this.logger.logHttpRequest(method, url, statusCode, responseTime, {
            ip,
            userAgent,
          });
        },
        error: (error: Error) => {
          const responseTime = Date.now() - startTime;
          const statusCode =
            error instanceof HttpException ? error.getStatus() : 500;

          this.logger.logHttpRequest(method, url, statusCode, responseTime, {
            ip,
            userAgent,
            error: error.message,
          });
        },
      }),
    );
  }
}
