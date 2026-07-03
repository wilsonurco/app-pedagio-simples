import type { VercelRequest, VercelResponse } from '@vercel/node';

import { setSessionCookie } from '../_lib/auth/cookies';
import { verifyPassword } from '../_lib/auth/password';
import { createSessionToken } from '../_lib/auth/session';
import { findUserByCpf, toPublicUser } from '../_lib/auth/users';
import { findVehiclesByUserId, toPublicVehicle } from '../_lib/auth/vehicles';
import { normalizeCpf } from '../_lib/auth/validation';
import { handleOptions, internalError, methodNotAllowed, sendJson } from '../_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;

  if (req.method !== 'POST') {
    methodNotAllowed(req, res, ['POST']);
    return;
  }

  try {
    const body = req.body as Record<string, unknown> | undefined;
    const cpf = normalizeCpf(String(body?.cpf ?? ''));
    const password = String(body?.password ?? '');

    if (!cpf || !password) {
      sendJson(req, res, 422, {
        erro: 'DADOS_INVALIDOS',
        mensagem: 'Informe CPF e senha.',
      });
      return;
    }

    const user = await findUserByCpf(cpf);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      sendJson(req, res, 401, {
        erro: 'CREDENCIAIS_INVALIDAS',
        mensagem: 'CPF ou senha incorretos.',
      });
      return;
    }

    const vehicles = await findVehiclesByUserId(user.id);
    const token = createSessionToken(user.id);
    setSessionCookie(res, token);

    sendJson(req, res, 200, {
      user: toPublicUser(user),
      vehicles: vehicles.map(toPublicVehicle),
    });
  } catch (error) {
    internalError(req, res, error);
  }
}
