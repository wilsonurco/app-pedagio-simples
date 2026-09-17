import type { VercelRequest, VercelResponse } from '@vercel/node';

import { fiscaltechRequest } from './_lib/fiscaltech/client';
import { getIdempotencyKey, handleOptions, internalError, methodNotAllowed, sendJson } from './_lib/http';

function parsePlates(body: unknown): string[] | null {
  if (!body || typeof body !== 'object') return null;
  const placas = (body as { placas?: unknown }).placas;
  if (!Array.isArray(placas) || placas.length === 0) return null;

  const normalized = placas
    .map((plate) => String(plate).replace(/[^a-zA-Z0-9]/g, '').toUpperCase())
    .filter((plate) => plate.length > 0);

  return normalized.length > 0 ? [...new Set(normalized)] : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;

  if (req.method !== 'POST') {
    methodNotAllowed(req, res, ['POST']);
    return;
  }

  const placas = parsePlates(req.body);
  if (!placas) {
    sendJson(req, res, 400, {
      erro: 'REQUISICAO_INVALIDA',
      mensagem: 'Informe ao menos uma placa para consultar.',
    });
    return;
  }

  try {
    const result = await fiscaltechRequest({
      method: 'POST',
      path: '/debitos',
      body: {
        placas,
        placaInternacional: Boolean((req.body as { placaInternacional?: unknown })?.placaInternacional),
      },
      requestId: getIdempotencyKey(req),
    });

    sendJson(req, res, result.status, result.data, { 'X-Request-Id': result.requestId });
  } catch (error) {
    internalError(req, res, error);
  }
}
