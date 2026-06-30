import { appEnvValidationSchema } from './app.config';
import { authEnvValidationSchema } from './auth.config';
import { databaseEnvValidationSchema } from './database.config';
import { paymentsEnvValidationSchema } from './payments.config';

export const envValidationSchema = appEnvValidationSchema
  .concat(databaseEnvValidationSchema)
  .concat(authEnvValidationSchema)
  .concat(paymentsEnvValidationSchema);
