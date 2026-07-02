const LOWERCASE_PATTERN = /[a-z]/;
const UPPERCASE_PATTERN = /[A-Z]/;
const NUMBER_PATTERN = /\d/;
const SPECIAL_CHAR_PATTERN = /[^A-Za-z0-9]/;

function isPasswordValid(password: string): boolean {
  return (
    password.length >= 8 &&
    password.length <= 32 &&
    UPPERCASE_PATTERN.test(password) &&
    LOWERCASE_PATTERN.test(password) &&
    NUMBER_PATTERN.test(password) &&
    SPECIAL_CHAR_PATTERN.test(password)
  );
}

export function normalizeCpf(value: string): string {
  return value.replace(/\D/g, '');
}

export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('55') && digits.length >= 12) {
    return digits.slice(2);
  }
  return digits;
}

export function isValidCpf(cpf: string): boolean {
  const normalized = normalizeCpf(cpf);
  if (normalized.length !== 11 || /^(\d)\1+$/.test(normalized)) return false;

  const digits = normalized.split('').map(Number);

  let sum = 0;
  for (let i = 0; i < 9; i += 1) sum += digits[i] * (10 - i);
  let check = (sum * 10) % 11;
  if (check === 10) check = 0;
  if (check !== digits[9]) return false;

  sum = 0;
  for (let i = 0; i < 10; i += 1) sum += digits[i] * (11 - i);
  check = (sum * 10) % 11;
  if (check === 10) check = 0;
  return check === digits[10];
}

export function isValidPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return normalized.length === 10 || normalized.length === 11;
}

export function parseBirthDate(value: string): string | null {
  const trimmed = value.trim();
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  const brMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
  if (brMatch) {
    return `${brMatch[3]}-${brMatch[2]}-${brMatch[1]}`;
  }

  return null;
}

export function isValidBirthDate(isoDate: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  const now = new Date();
  const minYear = now.getFullYear() - 120;
  return year >= minYear && date <= now;
}

export function validatePassword(password: string): string | null {
  if (password.length > 32) {
    return 'A senha deve ter no máximo 32 caracteres.';
  }

  if (!isPasswordValid(password)) {
    return 'A senha não atende a todos os requisitos de segurança.';
  }

  return null;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateRegisterPayload(body: unknown):
  | { ok: true; data: RegisterPayload }
  | { ok: false; message: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, message: 'Corpo da requisição inválido.' };
  }

  const payload = body as Record<string, unknown>;
  const cpf = normalizeCpf(String(payload.cpf ?? ''));
  const name = String(payload.name ?? '').trim();
  const birthDateRaw = String(payload.birthDate ?? '').trim();
  const emailRaw = payload.email === undefined || payload.email === null ? '' : String(payload.email).trim();
  const phone = normalizePhone(String(payload.phone ?? ''));
  const password = String(payload.password ?? '');

  if (!isValidCpf(cpf)) {
    return { ok: false, message: 'CPF inválido.' };
  }

  if (name.length < 3) {
    return { ok: false, message: 'Informe o nome completo.' };
  }

  const birthDate = parseBirthDate(birthDateRaw);
  if (!birthDate || !isValidBirthDate(birthDate)) {
    return { ok: false, message: 'Data de nascimento inválida.' };
  }

  if (emailRaw && !isValidEmail(emailRaw)) {
    return { ok: false, message: 'E-mail inválido.' };
  }

  if (!isValidPhone(phone)) {
    return { ok: false, message: 'Telefone inválido.' };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return { ok: false, message: passwordError };
  }

  let vehicle: RegisterVehicle | undefined;
  if (payload.vehicle !== undefined && payload.vehicle !== null) {
    if (typeof payload.vehicle !== 'object') {
      return { ok: false, message: 'Dados do veículo inválidos.' };
    }

    const vehiclePayload = payload.vehicle as Record<string, unknown>;
    const plate = String(vehiclePayload.plate ?? '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase();
    const model = String(vehiclePayload.model ?? '').trim();

    if (plate.length !== 7 || model.length < 2) {
      return { ok: false, message: 'Placa ou modelo do veículo inválidos.' };
    }

    vehicle = { plate, model };
  }

  return {
    ok: true,
    data: {
      cpf,
      name,
      birthDate,
      email: emailRaw || undefined,
      phone,
      password,
      vehicle,
    },
  };
}

export type RegisterVehicle = {
  plate: string;
  model: string;
};

export type RegisterPayload = {
  cpf: string;
  name: string;
  birthDate: string;
  email?: string;
  phone: string;
  password: string;
  vehicle?: RegisterVehicle;
};
