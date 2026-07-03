import { neon } from '@neondatabase/serverless';

export type StoredUser = {
  id: string;
  cpf: string;
  name: string;
  birthDate: string;
  email?: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
};

export class UserStoreConfigError extends Error {
  constructor() {
    super('DATABASE_URL ausente. Configure a conexão do banco de usuários.');
    this.name = 'UserStoreConfigError';
  }
}

type UserRow = {
  id: string;
  cpf: string;
  name: string;
  birth_date: string;
  email: string | null;
  phone: string;
  password_hash: string;
  created_at: string;
};

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new UserStoreConfigError();
  return neon(url);
}

function toStoredUser(row: UserRow): StoredUser {
  return {
    id: row.id,
    cpf: row.cpf,
    name: row.name,
    birthDate: row.birth_date,
    email: row.email ?? undefined,
    phone: row.phone,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
  };
}

export async function findUserById(id: string): Promise<StoredUser | undefined> {
  const sql = getDb();
  const rows = (await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`) as UserRow[];
  return rows[0] ? toStoredUser(rows[0]) : undefined;
}

export async function findUserByCpf(cpf: string): Promise<StoredUser | undefined> {
  const sql = getDb();
  const rows = (await sql`SELECT * FROM users WHERE cpf = ${cpf} LIMIT 1`) as UserRow[];
  return rows[0] ? toStoredUser(rows[0]) : undefined;
}

export async function findUserByPhone(phone: string): Promise<StoredUser | undefined> {
  const sql = getDb();
  const rows = (await sql`SELECT * FROM users WHERE phone = ${phone} LIMIT 1`) as UserRow[];
  return rows[0] ? toStoredUser(rows[0]) : undefined;
}

export async function createUser(
  input: Omit<StoredUser, 'id' | 'createdAt'>,
): Promise<StoredUser> {
  const sql = getDb();

  const [byCpf, byPhone] = await Promise.all([
    findUserByCpf(input.cpf),
    findUserByPhone(input.phone),
  ]);

  if (byCpf) throw new Error('CPF já cadastrado.');
  if (byPhone) throw new Error('Telefone já cadastrado.');

  const id = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  const rows = (await sql`
    INSERT INTO users (id, cpf, name, birth_date, email, phone, password_hash)
    VALUES (${id}, ${input.cpf}, ${input.name}, ${input.birthDate}, ${input.email ?? null}, ${input.phone}, ${input.passwordHash})
    RETURNING *
  `) as UserRow[];

  return toStoredUser(rows[0]);
}

export function toPublicUser(user: StoredUser) {
  return {
    id: user.id,
    cpf: user.cpf,
    name: user.name,
    birthDate: user.birthDate,
    email: user.email,
    phone: user.phone,
  };
}
