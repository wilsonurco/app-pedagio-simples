import type { VercelRequest, VercelResponse } from '@vercel/node';

import { requireAuth } from '../../_lib/auth/requireAuth';
import { fiscaltechRequest } from '../../_lib/fiscaltech/client';
import { getIdempotencyKey, handleOptions, internalError, methodNotAllowed, sendJson } from '../../_lib/http';

function getReservaId(req: VercelRequest): string | null {
  const value = req.query.reservaId;
  if (typeof value === 'string' && value) return value;
  if (Array.isArray(value) && value[0]) return value[0];
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;

  const reservaId = getReservaId(req);
  if (!reservaId) {
    sendJson(req, res, 400, {
      erro: 'REQUISICAO_INVALIDA',
      mensagem: 'Parâmetro reservaId é obrigatório.',
    });
    return;
  }

  if (req.method !== 'POST') {
    methodNotAllowed(req, res, ['POST']);
    return;
  }

  if (!requireAuth(req, res)) return;

  try {
    const result = await fiscaltechRequest({
      method: 'POST',
      path: `/reservas/${reservaId}/cancelar`,
      body: req.body,
      requestId: getIdempotencyKey(req),
    });

    sendJson(req, res, result.status, result.data, { 'X-Request-Id': result.requestId });
  } catch (error) {
    internalError(req, res, error);
  }
}
