import Joi from 'joi';

import { databaseEnvValidationSchema } from './database.config';

export const envValidationSchema = databaseEnvValidationSchema.keys({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),

  PORT: Joi.number().port().default(4000),

  JWT_SECRET: Joi.string().min(32).required(),

  JWT_EXPIRES_IN: Joi.number().integer().positive().default(3600),
});
