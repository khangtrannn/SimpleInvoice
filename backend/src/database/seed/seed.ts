import dataSource from '../data-source';
import { runDatabaseSeed } from './seed-runner';

async function bootstrapSeed(): Promise<void> {
  await dataSource.initialize();

  try {
    await runDatabaseSeed(dataSource);
  } finally {
    await dataSource.destroy();
  }
}

bootstrapSeed().catch((error) => {
  console.error('Database seed failed');
  console.error(error);
  process.exit(1);
});