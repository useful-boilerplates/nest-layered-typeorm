import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { corsConfig, CorsConfig } from '../config/cors.config';
import { LoggerService } from '../logger';

export function setupCors(app: INestApplication, logger: LoggerService): void {
  const configService = app.get(ConfigService);
  const config = configService.get<CorsConfig>(corsConfig.KEY, { infer: true });

  if (!config) {
    logger.warn(
      'CORS configuration not found, disabled by default',
      'Bootstrap',
    );
    return;
  }

  if (config.enabled) {
    app.enableCors({
      origin: config.origin,
      credentials: config.credentials,
      methods: config.methods,
      allowedHeaders: config.allowedHeaders,
      exposedHeaders:
        config.exposedHeaders.length > 0 ? config.exposedHeaders : undefined,
      maxAge: config.maxAge,
      preflightContinue: config.preflightContinue,
      optionsSuccessStatus: config.optionsSuccessStatus,
    });
    logger.log(
      `CORS enabled with origin: ${JSON.stringify(config.origin)}`,
      'Bootstrap',
    );
  } else {
    logger.warn('CORS is disabled', 'Bootstrap');
  }
}
