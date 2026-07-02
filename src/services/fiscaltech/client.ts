import { getBffBaseUrl } from '@/config/dataSource';

import type {
  CancelarReservaResponse,
  ConfirmarPagamentoRequest,
  ConfirmarPagamentoResponse,
  ConsultarDebitosRequest,
  ConsultarDebitosResponse,
  CriarReservaRequest,
  CriarReservaResponse,
  FiscalTechErrorBody,
  ReservaStatusResponse,
} from './types';
import { FiscalTechApiError } from './types';

type RequestOptions = {
  method: 'GET' | 'POST';
  path: string;
  body?: unknown;
  idempotencyKey?: string;
  /** Só rotas autenticadas (reservas) — consulta de débitos permanece pública. */
  withCredentials?: boolean;
};

async function bffRequest<T>(options: RequestOptions): Promise<T> {
  const baseUrl = getBffBaseUrl();
  const url = `${baseUrl}${options.path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.idempotencyKey) {
    headers['X-Idempotency-Key'] = options.idempotencyKey;
  }

  const response = await fetch(url, {
    method: options.method,
    headers,
    ...(options.withCredentials ? { credentials: 'include' as const } : {}),
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  let data: T | FiscalTechErrorBody;

  try {
    data = text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    throw new FiscalTechApiError(response.status, {
      erro: 'RESPOSTA_INVALIDA',
      mensagem: text || 'Resposta inválida do BFF',
    });
  }

  if (!response.ok) {
    throw new FiscalTechApiError(response.status, data as FiscalTechErrorBody);
  }

  return data as T;
}

export function consultarDebitos(payload: ConsultarDebitosRequest) {
  return bffRequest<ConsultarDebitosResponse>({
    method: 'POST',
    path: '/api/debitos',
    body: payload,
  });
}

export function criarReserva(payload: CriarReservaRequest, idempotencyKey?: string) {
  return bffRequest<CriarReservaResponse>({
    method: 'POST',
    path: '/api/reservas',
    body: payload,
    idempotencyKey,
    withCredentials: true,
  });
}

export function confirmarReserva(
  reservaId: string,
  payload: ConfirmarPagamentoRequest,
  idempotencyKey?: string,
) {
  return bffRequest<ConfirmarPagamentoResponse>({
    method: 'POST',
    path: `/api/reservas/${encodeURIComponent(reservaId)}/confirmar`,
    body: payload,
    idempotencyKey,
    withCredentials: true,
  });
}

export function cancelarReserva(reservaId: string, idempotencyKey?: string) {
  return bffRequest<CancelarReservaResponse>({
    method: 'POST',
    path: `/api/reservas/${encodeURIComponent(reservaId)}/cancelar`,
    body: {},
    idempotencyKey,
    withCredentials: true,
  });
}

export function consultarReserva(reservaId: string) {
  return bffRequest<ReservaStatusResponse>({
    method: 'GET',
    path: `/api/reservas/${encodeURIComponent(reservaId)}`,
    withCredentials: true,
  });
}
