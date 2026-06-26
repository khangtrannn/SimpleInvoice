import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export const authEnvValidationSchema = Joi.object({
  JWT_SECRET: Joi.string().min(32).required(),

  JWT_EXPIRES_IN: Joi.number().integer().positive().default(3600),
});

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: Number(process.env.JWT_EXPIRES_IN ?? 3600),
}));
