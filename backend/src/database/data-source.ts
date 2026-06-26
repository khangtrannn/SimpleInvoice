import { DataSource } from 'typeorm';

import { createTypeOrmOptions } from './typeorm-options';

export default new DataSource(createTypeOrmOptions());