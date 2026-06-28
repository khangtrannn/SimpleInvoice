import { registerAs } from '@nestjs/config';
import Joi from 'joi';

const DEFAULT_CORS_ORIGINS = [
  'http://localhost:3000',
  'https://simpleinvoice.khangtran.dev',
];
const DEFAULT_CORS_ORIGIN = DEFAULT_CORS_ORIGINS.join(',');

function parseCorsOrigin(raw: string | undefined): string[] {
  const configuredOrigins = (raw ?? DEFAULT_CORS_ORIGIN)
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  return [...new Set([...DEFAULT_CORS_ORIGINS, ...configuredOrigins])];
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
