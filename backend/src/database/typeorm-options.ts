import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';

import { DatabaseConfig, getDatabaseConfig } from '../config/database.config';
import { ENV_FILE_PATHS } from '../config/env-file-paths';

config({ path: ENV_FILE_PATHS });

const isCompiled = __filename.endsWith('.js');

export function createTypeOrmOptions(
  databaseConfig: DatabaseConfig = getDatabaseConfig(),
): DataSourceOptions {
  return {
    type: 'postgres',
    host: databaseConfig.host,
    port: databaseConfig.port,
    database: databaseConfig.database,
    username: databaseConfig.username,
    password: databaseConfig.password,

    entities: [isCompiled ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts'],

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
