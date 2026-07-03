import type { VercelRequest, VercelResponse } from '@vercel/node';

import { sendJson } from '../http';
import { getSessionTokenFromRequest } from './cookies';
import { verifySessionToken } from './session';
import { findUserById, toPublicUser, type StoredUser } from './users';

export type AuthContext = {
  user: StoredUser;
};

export async function requireAuth(
  req: VercelRequest,
  res: VercelResponse,
): Promise<AuthContext | null> {
  const token = getSessionTokenFromRequest(req);
  const session = verifySessionToken(token);

  if (!session) {
    sendJson(req, res, 401, {
      erro: 'NAO_AUTENTICADO',
      mensagem: 'Sessão inválida ou expirada.',
    });
    return null;
  }

  const user = await findUserById(session.userId);
  if (!user) {
    sendJson(req, res, 401, {
      erro: 'NAO_AUTENTICADO',
      mensagem: 'Usuário não encontrado.',
    });
    return null;
  }

  return { user };
}

export async function getOptionalAuth(req: VercelRequest): Promise<AuthContext | null> {
  const token = getSessionTokenFromRequest(req);
  const session = verifySessionToken(token);
  if (!session) return null;

  const user = await findUserById(session.userId);
  return user ? { user } : null;
}

export { toPublicUser };
