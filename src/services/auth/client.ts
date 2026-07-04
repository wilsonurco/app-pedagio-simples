import { getBffBaseUrl } from '@/config/dataSource';
import { fetchWithTimeout } from '@/utils/fetchWithTimeout';

import type {
  AuthErrorBody,
  AuthSessionResponse,
  AuthVehicle,
  RegisterInput,
  RegisterResponse,
} from './types';
import { AuthApiError } from './types';

type AuthRequestOptions = {
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
  body?: unknown;
};

async function authRequest<T>(options: AuthRequestOptions): Promise<T> {
  const baseUrl = getBffBaseUrl();
  const url = `${baseUrl}${options.path}`;

  const response = await fetchWithTimeout(url, {
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
  return authRequest<AuthSessionResponse>({
    method: 'GET',
    path: '/api/auth/me',
  });
}

export function registerUser(payload: RegisterInput) {
  return authRequest<RegisterResponse>({
    method: 'POST',
    path: '/api/auth/register',
    body: payload,
  });
}

export function loginUser(cpf: string, password: string) {
  return authRequest<AuthSessionResponse>({
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

export function fetchVehicles() {
  return authRequest<{ vehicles: AuthVehicle[] }>({
    method: 'GET',
    path: '/api/vehicles',
  });
}

export function addVehicleRemote(vehicle: AuthVehicle) {
  return authRequest<{ vehicle: AuthVehicle }>({
    method: 'POST',
    path: '/api/vehicles',
    body: vehicle,
  });
}

export function removeVehicleRemote(plate: string) {
  return authRequest<{ ok: boolean }>({
    method: 'DELETE',
    path: `/api/vehicles?plate=${encodeURIComponent(plate)}`,
  });
}
