import type { VercelRequest, VercelResponse } from '@vercel/node';

import { fiscaltechRequest } from './_lib/fiscaltech/client';
import { getIdempotencyKey, handleOptions, internalError, methodNotAllowed, sendJson } from './_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;

  if (req.method !== 'GET') {
    methodNotAllowed(req, res, ['GET']);
    return;
  }

  try {
    const query = req.query ?? {};
    const params = new URLSearchParams();

    if (typeof query.ultimaAtualizacao === 'string' && query.ultimaAtualizacao) {
      params.set('ultimaAtualizacao', query.ultimaAtualizacao);
    }

    const queryString = params.toString();

    const result = await fiscaltechRequest({
      method: 'GET',
      path: '/placas-com-debito',
      queryString,
      requestId: getIdempotencyKey(req),
    });

    sendJson(req, res, result.status, result.data, { 'X-Request-Id': result.requestId });
  } catch (error) {
    internalError(req, res, error);
  }
}
