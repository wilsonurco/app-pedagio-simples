import type { VercelRequest, VercelResponse } from '@vercel/node';

import { requireAuth, toPublicUser } from '../_lib/auth/requireAuth';
import { resolveAuthHandlerError } from '../_lib/auth/errors';
import {
  createVehicle,
  deleteVehicle,
  findVehiclesByUserId,
  toPublicVehicle,
} from '../_lib/auth/vehicles';
import { normalizePlate } from '../_lib/auth/validation';
import { handleOptions, internalError, methodNotAllowed, sendJson } from '../_lib/http';

function parseVehicleBody(body: unknown): { plate: string; model: string } | null {
  if (!body || typeof body !== 'object') return null;
  const payload = body as Record<string, unknown>;
  const plate = normalizePlate(String(payload.plate ?? ''));
  const model = String(payload.model ?? '').trim();
  if (plate.length !== 7 || model.length < 2) return null;
  return { plate, model };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;

  const auth = await requireAuth(req, res);
  if (!auth) return;

  if (req.method === 'GET') {
    try {
      const vehicles = await findVehiclesByUserId(auth.user.id);
      sendJson(req, res, 200, { vehicles: vehicles.map(toPublicVehicle) });
    } catch (error) {
      internalError(req, res, error);
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const parsed = parseVehicleBody(req.body);
      if (!parsed) {
        sendJson(req, res, 422, {
          erro: 'DADOS_INVALIDOS',
          mensagem: 'Informe placa e modelo válidos.',
        });
        return;
      }

      const vehicle = await createVehicle(auth.user.id, parsed);
      sendJson(req, res, 201, { vehicle: toPublicVehicle(vehicle) });
    } catch (error) {
      const resolved = resolveAuthHandlerError(error);
      if (resolved) {
        sendJson(req, res, resolved.status, {
          erro: resolved.code,
          mensagem: resolved.message,
        });
        return;
      }
      internalError(req, res, error);
    }
    return;
  }

  if (req.method === 'DELETE') {
    try {
      const plate = normalizePlate(String(req.query.plate ?? ''));
      if (plate.length !== 7) {
        sendJson(req, res, 422, {
          erro: 'DADOS_INVALIDOS',
          mensagem: 'Informe a placa a remover.',
        });
        return;
      }

      const removed = await deleteVehicle(auth.user.id, plate);
      if (!removed) {
        sendJson(req, res, 404, {
          erro: 'NAO_ENCONTRADO',
          mensagem: 'Veículo não encontrado.',
        });
        return;
      }

      sendJson(req, res, 200, { ok: true });
    } catch (error) {
      internalError(req, res, error);
    }
    return;
  }

  methodNotAllowed(req, res, ['GET', 'POST', 'DELETE']);
}
