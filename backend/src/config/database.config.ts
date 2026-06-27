import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

interface DatabaseEnvironment {
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_DB: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
}

export const databaseEnvValidationSchema: Joi.ObjectSchema<DatabaseEnvironment> =
  Joi.object({
    POSTGRES_HOST: Joi.string().hostname().required(),

    POSTGRES_PORT: Joi.number().port().required(),

    POSTGRES_DB: Joi.string().required(),

    POSTGRES_USER: Joi.string().required(),

    POSTGRES_PASSWORD: Joi.string().required(),
  });

export function getDatabaseConfig(
  environment: NodeJS.ProcessEnv = process.env,
): DatabaseConfig {
  const validation = databaseEnvValidationSchema.validate(environment, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (validation.error) {
    throw new Error(
      `Invalid PostgreSQL configuration: ${validation.error.message}`,
    );
  }

  return {
    host: validation.value.POSTGRES_HOST,
    port: validation.value.POSTGRES_PORT,
    database: validation.value.POSTGRES_DB,
    username: validation.value.POSTGRES_USER,
    password: validation.value.POSTGRES_PASSWORD,
  };
}

export default registerAs('database', () => ({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
}));
