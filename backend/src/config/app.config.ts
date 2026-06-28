import { registerAs } from '@nestjs/config';
import Joi from 'joi';

const DEFAULT_CORS_ORIGIN = 'http://localhost:3000';

function parseCorsOrigin(raw: string | undefined): string[] {
  return (raw ?? DEFAULT_CORS_ORIGIN)
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

export const appEnvValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),

  PORT: Joi.number().port().default(4000),

  CORS_ORIGIN: Joi.string().default(DEFAULT_CORS_ORIGIN),
});

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN),
}));
