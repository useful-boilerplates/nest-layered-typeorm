import {
  Injectable,
  Inject,
  LoggerService as NestLoggerService,
} from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  log(message: string, context?: string, metadata?: Record<string, any>): void {
    this.logger.info(message, { context, ...metadata });
  }

  error(
    message: string,
    context?: string,
    trace?: string | Error,
    metadata?: Record<string, any>,
  ): void {
    const errorData = {
      context,
      ...metadata,
    };

    if (trace instanceof Error) {
      errorData['stack'] = trace.stack;
      errorData['errorName'] = trace.name;
      errorData['errorMessage'] = trace.message;
    } else if (trace) {
      errorData['trace'] = trace;
    }

    this.logger.error(message, errorData);
  }

  warn(
    message: string,
    context?: string,
    metadata?: Record<string, any>,
  ): void {
    this.logger.warn(message, { context, ...metadata });
  }

  debug(
    message: string,
    context?: string,
    metadata?: Record<string, any>,
  ): void {
    this.logger.debug(message, { context, ...metadata });
  }

  verbose(
    message: string,
    context?: string,
    metadata?: Record<string, any>,
  ): void {
    this.logger.verbose(message, { context, ...metadata });
  }

  logHttpRequest(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    metadata?: Record<string, any>,
  ): void {
    this.logger.info('HTTP Request', {
      context: 'HTTP',
      method,
      url,
      statusCode,
      responseTime: `${responseTime}ms`,
      ...metadata,
    });
  }

  logDatabaseQuery(
    query: string,
    duration: number,
    metadata?: Record<string, any>,
  ): void {
    this.logger.debug('Database Query', {
      context: 'Database',
      query,
      duration: `${duration}ms`,
      ...metadata,
    });
  }

  logBusinessEvent(
    event: string,
    context: string,
    metadata?: Record<string, any>,
  ): void {
    this.logger.info(`Business Event: ${event}`, {
      context,
      event,
      ...metadata,
    });
  }

  logSecurityEvent(
    event: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    metadata?: Record<string, any>,
  ): void {
    const logLevel =
      severity === 'critical' || severity === 'high' ? 'error' : 'warn';

    this.logger[logLevel](`Security Event: ${event}`, {
      context: 'Security',
      event,
      severity,
      ...metadata,
    });
  }

  logPerformance(
    operation: string,
    duration: number,
    context?: string,
    metadata?: Record<string, any>,
  ): void {
    const level = duration > 1000 ? 'warn' : 'debug';

    this.logger[level](`Performance: ${operation}`, {
      context: context || 'Performance',
      operation,
      duration: `${duration}ms`,
      ...metadata,
    });
  }
}
