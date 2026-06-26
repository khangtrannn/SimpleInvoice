import Joi from 'joi';

export const databaseEnvValidationSchema = Joi.object({
  POSTGRES_HOST: Joi.string().hostname().required(),

  POSTGRES_PORT: Joi.number().port().required(),

  POSTGRES_DB: Joi.string().required(),

  POSTGRES_USER: Joi.string().required(),

  POSTGRES_PASSWORD: Joi.string().required(),
});

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export function getDatabaseConfig(
  environment: NodeJS.ProcessEnv = process.env,
): DatabaseConfig {
  const { error, value } = databaseEnvValidationSchema.validate(environment, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    throw new Error(`Invalid PostgreSQL configuration: ${error.message}`);
  }

  return {
    host: value.POSTGRES_HOST,
    port: value.POSTGRES_PORT,
    database: value.POSTGRES_DB,
    username: value.POSTGRES_USER,
    password: value.POSTGRES_PASSWORD,
  };
}
