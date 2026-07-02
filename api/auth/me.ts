import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getOptionalAuth, toPublicUser } from '../_lib/auth/requireAuth';
import { handleOptions, internalError, methodNotAllowed, sendJson } from '../_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;

  if (req.method !== 'GET') {
    methodNotAllowed(req, res, ['GET']);
    return;
  }

  try {
    const auth = getOptionalAuth(req);

    if (!auth) {
      sendJson(req, res, 401, {
        erro: 'NAO_AUTENTICADO',
        mensagem: 'Sessão inválida ou expirada.',
      });
      return;
    }

    sendJson(req, res, 200, { user: toPublicUser(auth.user) });
  } catch (error) {
    internalError(req, res, error);
  }
}
