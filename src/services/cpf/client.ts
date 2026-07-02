import { getBffBaseUrl } from '@/config/dataSource';

import type { ConsultarCpfResponse, CpfApiErrorBody } from './types';
import { CpfApiError } from './types';

export async function consultarCpf(cpf: string): Promise<ConsultarCpfResponse> {
  const baseUrl = getBffBaseUrl();
  const url = `${baseUrl}/api/cpf/consultar`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cpf }),
  });

  const text = await response.text();
  let data: ConsultarCpfResponse | CpfApiErrorBody;

  try {
    data = text ? (JSON.parse(text) as ConsultarCpfResponse | CpfApiErrorBody) : {};
  } catch {
    throw new CpfApiError(response.status, {
      erro: 'RESPOSTA_INVALIDA',
      mensagem: text || 'Resposta inválida do servidor',
    });
  }

  if (!response.ok) {
    throw new CpfApiError(response.status, data as CpfApiErrorBody);
  }

  return data as ConsultarCpfResponse;
}
