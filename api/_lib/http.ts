import type { VercelRequest, VercelResponse } from '@vercel/node';

const BASE_CORS_HEADERS = {
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Idempotency-Key, X-Request-Id',
};

export function applyCors(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  Object.entries(BASE_CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

export function handleOptions(req: VercelRequest, res: VercelResponse): boolean {
  applyCors(req, res);
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
  req: VercelRequest,
  res: VercelResponse,
  status: number,
  body: unknown,
  extraHeaders?: Record<string, string>,
) {
  applyCors(req, res);
  if (extraHeaders) {
    Object.entries(extraHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
  }
  res.status(status).json(body);
}

export function methodNotAllowed(req: VercelRequest, res: VercelResponse, allowed: string[]) {
  sendJson(req, res, 405, {
    erro: 'METODO_NAO_PERMITIDO',
    mensagem: `Use ${allowed.join(' ou ')}.`,
  });
}

export function internalError(req: VercelRequest, res: VercelResponse, error: unknown) {
  const message = error instanceof Error ? error.message : 'Erro interno do servidor';
  console.error('[bff]', message);
  sendJson(req, res, 500, {
    erro: 'ERRO_INTERNO',
    mensagem: message,
  });
}
