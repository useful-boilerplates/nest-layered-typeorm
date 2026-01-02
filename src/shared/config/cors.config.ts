import { ConfigType, registerAs } from '@nestjs/config';

export const corsConfig = registerAs('cors', () => {
  const {
    CORS_ENABLED,
    CORS_ORIGIN,
    CORS_CREDENTIALS,
    CORS_METHODS,
    CORS_ALLOWED_HEADERS,
    CORS_EXPOSED_HEADERS,
    CORS_MAX_AGE,
  } = process.env;

  const parseOrigin = (originValue: string | undefined) => {
    if (!originValue || originValue === '*') return '*';
    if (originValue === 'true') return true;
    if (originValue === 'false') return false;

    const origins = originValue.split(',').map((o) => o.trim());

    const processedOrigins = origins.map((o) => {
      if (o.startsWith('/') && o.endsWith('/')) {
        try {
          return new RegExp(o.slice(1, -1));
        } catch {
          return o;
        }
      }
      return o;
    });

    return processedOrigins.length === 1
      ? processedOrigins[0]
      : processedOrigins;
  };

  const origin = parseOrigin(CORS_ORIGIN);

  return {
    enabled: CORS_ENABLED !== 'false',
    origin,
    credentials: CORS_CREDENTIALS === 'true',
    methods: (CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS').split(
      ',',
    ),
    allowedHeaders: (
      CORS_ALLOWED_HEADERS ||
      'Content-Type,Authorization,Accept,X-Requested-With,x-custom-header,Origin'
    ).split(','),
    exposedHeaders: (CORS_EXPOSED_HEADERS || 'Content-Range,X-Total-Count')
      .split(',')
      .filter(Boolean),
    maxAge: Number.parseInt(CORS_MAX_AGE || '86400', 10),
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
});

export type CorsConfig = ConfigType<typeof corsConfig>;
