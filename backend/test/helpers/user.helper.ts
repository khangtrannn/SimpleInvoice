import bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import { UserEntity } from '../../src/users/entities/user.entity';
import { BCRYPT_SALT_ROUNDS } from '../../src/database/seed/seed.constants';

export async function seedTestUser(
  dataSource: DataSource,
  email: string,
  password: string,
  fullname: string,
): Promise<UserEntity> {
  const repo = dataSource.getRepository(UserEntity);
  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  await repo.upsert({ email, passwordHash, fullname }, ['email']);

  return repo.findOneByOrFail({ email });
}
