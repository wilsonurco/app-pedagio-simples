import { getFiscalTechEnv } from './env';
import { generateRequestId, signRequest, utcTimestamp } from './sign';

export type FiscalTechRequestOptions = {
  method: 'GET' | 'POST';
  path: string;
  queryString?: string;
  body?: unknown;
  requestId?: string;
};

export type FiscalTechResponse<T = unknown> = {
  status: number;
  data: T;
  requestId: string;
};

function serializeBody(body: unknown): string {
  if (body === undefined || body === null) return '';
  return JSON.stringify(body);
}

export async function fiscaltechRequest<T = unknown>(
  options: FiscalTechRequestOptions,
): Promise<FiscalTechResponse<T>> {
  const env = getFiscalTechEnv();
  const requestId = options.requestId ?? generateRequestId();
  const timestamp = utcTimestamp();
  const body = serializeBody(options.body);
  const signature = signRequest({
    secret: env.secret,
    method: options.method,
    path: options.path,
    queryString: options.queryString ?? '',
    timestamp,
    body,
  });

  const url = options.queryString
    ? `${env.baseUrl}${options.path}?${options.queryString}`
    : `${env.baseUrl}${options.path}`;

  console.info(
    `[fiscaltech] ${options.method} ${options.path} requestId=${requestId}`,
  );

  const response = await fetch(url, {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
      'X-Portal-Id': env.portalId,
      'X-Api-Key': env.apiKey,
      'X-Signature': signature,
      'X-Timestamp': timestamp,
      'X-Request-Id': requestId,
    },
    body: options.method === 'POST' ? body : undefined,
  });

  const text = await response.text();
  let data: T;

  try {
    data = text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    data = { mensagem: text || 'Resposta inválida da API FiscalTech' } as T;
  }

  return {
    status: response.status,
    data,
    requestId,
  };
}
