import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getOptionalAuth, toPublicUser } from '../_lib/auth/requireAuth';
import { findVehiclesByUserId, toPublicVehicle } from '../_lib/auth/vehicles';
import { handleOptions, internalError, methodNotAllowed, sendJson } from '../_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;

  if (req.method !== 'GET') {
    methodNotAllowed(req, res, ['GET']);
    return;
  }

  try {
    const auth = await getOptionalAuth(req);

    if (!auth) {
      sendJson(req, res, 401, {
        erro: 'NAO_AUTENTICADO',
        mensagem: 'Sessão inválida ou expirada.',
      });
      return;
    }

    const vehicles = await findVehiclesByUserId(auth.user.id);

    sendJson(req, res, 200, {
      user: toPublicUser(auth.user),
      vehicles: vehicles.map(toPublicVehicle),
    });
  } catch (error) {
    internalError(req, res, error);
  }
}
