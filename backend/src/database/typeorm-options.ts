import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';

import { getDatabaseConfig } from '../config/database.config';
import { ENV_FILE_PATHS } from '../config/env-file-paths';

config({ path: ENV_FILE_PATHS });

const isCompiled = __filename.endsWith('.js');

export function createTypeOrmOptions(): DataSourceOptions {
  const { host, port, database, username, password } =
    getDatabaseConfig();

  return {
    type: 'postgres',
    host,
    port,
    database,
    username,
    password,

    entities: [
      isCompiled
        ? 'dist/**/*.entity.js'
        : 'src/**/*.entity.ts',
    ],

    migrations: [
      isCompiled
        ? 'dist/database/migrations/*.js'
        : 'src/database/migrations/*.ts',
    ],

    synchronize: false,
    migrationsRun: false,
    migrationsTableName: 'typeorm_migrations',
    migrationsTransactionMode: 'all',

    logging: process.env.NODE_ENV !== 'production',
  };
}
