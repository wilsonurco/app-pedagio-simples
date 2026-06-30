import type { VercelRequest, VercelResponse } from '@vercel/node';

import { fiscaltechRequest } from './_lib/fiscaltech/client';
import { getIdempotencyKey, handleOptions, internalError, methodNotAllowed, sendJson } from './_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;

  if (req.method !== 'POST') {
    methodNotAllowed(res, ['POST']);
    return;
  }

  try {
    const result = await fiscaltechRequest({
      method: 'POST',
      path: '/debitos',
      body: req.body,
      requestId: getIdempotencyKey(req),
    });

    sendJson(res, result.status, result.data, { 'X-Request-Id': result.requestId });
  } catch (error) {
    internalError(res, error);
  }
}
