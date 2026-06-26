import { appEnvValidationSchema } from './app.config';
import { authEnvValidationSchema } from './auth.config';
import { databaseEnvValidationSchema } from './database.config';

export const envValidationSchema = appEnvValidationSchema
  .concat(databaseEnvValidationSchema)
  .concat(authEnvValidationSchema);
