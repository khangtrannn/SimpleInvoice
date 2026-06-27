import { config } from 'dotenv';
import path from 'path';

const envFile = process.env.E2E_ENV_FILE ?? '.env.test';

config({ path: path.resolve(__dirname, '..', envFile) });
