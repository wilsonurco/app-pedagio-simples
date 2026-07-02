import { getBffBaseUrl } from '@/config/dataSource';

import type { AuthErrorBody, AuthUser, RegisterInput } from './types';
import { AuthApiError } from './types';

type AuthRequestOptions = {
  method: 'GET' | 'POST';
  path: string;
  body?: unknown;
};

async function authRequest<T>(options: AuthRequestOptions): Promise<T> {
  const baseUrl = getBffBaseUrl();
  const url = `${baseUrl}${options.path}`;

  const response = await fetch(url, {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  let data: T | AuthErrorBody;

  try {
    data = text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    throw new AuthApiError(response.status, {
      erro: 'RESPOSTA_INVALIDA',
      mensagem: text || 'Resposta inválida do servidor.',
    });
  }

  if (!response.ok) {
    throw new AuthApiError(response.status, data as AuthErrorBody);
  }

  return data as T;
}

export function fetchCurrentUser() {
  return authRequest<{ user: AuthUser }>({
    method: 'GET',
    path: '/api/auth/me',
  });
}

export function registerUser(payload: RegisterInput) {
  return authRequest<{ user: AuthUser; vehicle: RegisterInput['vehicle'] | null }>({
    method: 'POST',
    path: '/api/auth/register',
    body: payload,
  });
}

export function loginUser(cpf: string, password: string) {
  return authRequest<{ user: AuthUser }>({
    method: 'POST',
    path: '/api/auth/login',
    body: { cpf, password },
  });
}

export function logoutUser() {
  return authRequest<{ ok: boolean }>({
    method: 'POST',
    path: '/api/auth/logout',
    body: {},
  });
}
