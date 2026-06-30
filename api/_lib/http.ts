import type { VercelRequest, VercelResponse } from '@vercel/node';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Idempotency-Key, X-Request-Id',
};

export function applyCors(res: VercelResponse) {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

export function handleOptions(req: VercelRequest, res: VercelResponse): boolean {
  applyCors(res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

export function getIdempotencyKey(req: VercelRequest): string | undefined {
  const header = req.headers['x-idempotency-key'];
  if (typeof header === 'string' && header.length > 0) return header;
  if (Array.isArray(header) && header[0]) return header[0];
  return undefined;
}

export function sendJson(
  res: VercelResponse,
  status: number,
  body: unknown,
  extraHeaders?: Record<string, string>,
) {
  applyCors(res);
  if (extraHeaders) {
    Object.entries(extraHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
  }
  res.status(status).json(body);
}

export function methodNotAllowed(res: VercelResponse, allowed: string[]) {
  sendJson(res, 405, {
    erro: 'METODO_NAO_PERMITIDO',
    mensagem: `Use ${allowed.join(' ou ')}.`,
  });
}

export function internalError(res: VercelResponse, error: unknown) {
  const message = error instanceof Error ? error.message : 'Erro interno do servidor';
  console.error('[bff]', message);
  sendJson(res, 500, {
    erro: 'ERRO_INTERNO',
    mensagem: message,
  });
}
