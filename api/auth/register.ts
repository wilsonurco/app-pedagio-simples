import type { VercelRequest, VercelResponse } from '@vercel/node';

import { setSessionCookie } from '../_lib/auth/cookies';
import { hashPassword } from '../_lib/auth/password';
import { createSessionToken } from '../_lib/auth/session';
import { createUser, toPublicUser } from '../_lib/auth/users';
import { validateRegisterPayload } from '../_lib/auth/validation';
import { handleOptions, internalError, methodNotAllowed, sendJson } from '../_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;

  if (req.method !== 'POST') {
    methodNotAllowed(req, res, ['POST']);
    return;
  }

  try {
    const validation = validateRegisterPayload(req.body);
    if (!validation.ok) {
      sendJson(req, res, 422, { erro: 'DADOS_INVALIDOS', mensagem: validation.message });
      return;
    }

    const { password, vehicle, ...profile } = validation.data;

    const user = createUser({
      ...profile,
      passwordHash: hashPassword(password),
    });

    const token = createSessionToken(user.id);
    setSessionCookie(res, token);

    sendJson(req, res, 201, {
      user: toPublicUser(user),
      vehicle: vehicle ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao cadastrar.';
    if (message.includes('já cadastrado')) {
      sendJson(req, res, 409, { erro: 'CONFLITO', mensagem: message });
      return;
    }
    internalError(req, res, error);
  }
}
