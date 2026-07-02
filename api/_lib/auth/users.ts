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

type UserStoreGlobal = typeof globalThis & {
  __psUserStore?: Map<string, StoredUser>;
  __psUserByCpf?: Map<string, string>;
  __psUserByPhone?: Map<string, string>;
};

function getStore() {
  const globalStore = globalThis as UserStoreGlobal;

  if (!globalStore.__psUserStore) {
    globalStore.__psUserStore = new Map();
    globalStore.__psUserByCpf = new Map();
    globalStore.__psUserByPhone = new Map();
  }

  return {
    users: globalStore.__psUserStore,
    byCpf: globalStore.__psUserByCpf!,
    byPhone: globalStore.__psUserByPhone!,
  };
}

export function findUserById(id: string): StoredUser | undefined {
  return getStore().users.get(id);
}

export function findUserByCpf(cpf: string): StoredUser | undefined {
  const id = getStore().byCpf.get(cpf);
  return id ? getStore().users.get(id) : undefined;
}

export function findUserByPhone(phone: string): StoredUser | undefined {
  const id = getStore().byPhone.get(phone);
  return id ? getStore().users.get(id) : undefined;
}

export function createUser(input: Omit<StoredUser, 'id' | 'createdAt'>): StoredUser {
  const { users, byCpf, byPhone } = getStore();

  if (byCpf.has(input.cpf)) {
    throw new Error('CPF já cadastrado.');
  }

  if (byPhone.has(input.phone)) {
    throw new Error('Telefone já cadastrado.');
  }

  const user: StoredUser = {
    ...input,
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date().toISOString(),
  };

  users.set(user.id, user);
  byCpf.set(user.cpf, user.id);
  byPhone.set(user.phone, user.id);

  return user;
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
