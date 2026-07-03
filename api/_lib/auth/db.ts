import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

export class UserStoreConfigError extends Error {
  constructor() {
    super('DATABASE_URL ausente. Configure a conexão do banco de usuários.');
    this.name = 'UserStoreConfigError';
  }
}

export function getDb(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new UserStoreConfigError();
  return neon(url);
}
