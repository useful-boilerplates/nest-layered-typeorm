import { ConfigType, registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: Number.parseInt(process.env.PORT ?? '8080', 10),
  env: process.env.NODE_ENV ?? 'development',
}));

export type AppConfig = ConfigType<typeof appConfig>;
