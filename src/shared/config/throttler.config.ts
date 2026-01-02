import { ConfigType, registerAs } from '@nestjs/config';

export const throttlerConfig = registerAs('throttle', () => ({
  ttl: Number.parseInt(process.env.THROTTLE_TTL || '60000'),
  limit: Number.parseInt(process.env.THROTTLE_LIMIT || '60'),
}));

export type ThrottlerConfig = ConfigType<typeof throttlerConfig>;
