import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export const paymentsEnvValidationSchema = Joi.object({
  APP_PUBLIC_URL: Joi.string().uri().default('http://localhost:5173'),

  PAYMENT_LINK_EXPIRES_IN_DAYS: Joi.number()
    .integer()
    .positive()
    .default(30),

  EMAIL_PROVIDER: Joi.string()
    .valid('console', 'sendgrid')
    .default('console'),
});

export default registerAs('payments', () => ({
  appPublicUrl: process.env.APP_PUBLIC_URL ?? 'http://localhost:5173',
  paymentLinkExpiresInDays:
    Number(process.env.PAYMENT_LINK_EXPIRES_IN_DAYS ?? 30),
  emailProvider: process.env.EMAIL_PROVIDER ?? 'console',
}));
