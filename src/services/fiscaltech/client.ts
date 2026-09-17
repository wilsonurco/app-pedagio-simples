import { getBffBaseUrl } from '@/config/dataSource';
import { fetchWithTimeout } from '@/utils/fetchWithTimeout';

import type {
  ConsultarDebitosRequest,
  ConsultarDebitosResponse,
  FiscalTechErrorBody,
} from './types';
import { FiscalTechApiError } from './types';

async function bffRequest<T>(path: string, body: unknown): Promise<T> {
  const url = `${getBffBaseUrl()}${path}`;

  const response = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
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
  return bffRequest<ConsultarDebitosResponse>('/api/debitos', payload);
}
