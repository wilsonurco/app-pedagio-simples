import type { VercelRequest, VercelResponse } from '@vercel/node';

import { sendJson } from '../http';
import { getSessionTokenFromRequest } from './cookies';
import { verifySessionToken } from './session';
import { findUserById, toPublicUser, type StoredUser } from './users';

export type AuthContext = {
  user: StoredUser;
};

export function requireAuth(
  req: VercelRequest,
  res: VercelResponse,
): AuthContext | null {
  const token = getSessionTokenFromRequest(req);
  const session = verifySessionToken(token);

  if (!session) {
    sendJson(req, res, 401, {
      erro: 'NAO_AUTENTICADO',
      mensagem: 'Sessão inválida ou expirada.',
    });
    return null;
  }

  const user = findUserById(session.userId);
  if (!user) {
    sendJson(req, res, 401, {
      erro: 'NAO_AUTENTICADO',
      mensagem: 'Usuário não encontrado.',
    });
    return null;
  }

  return { user };
}

export function getOptionalAuth(req: VercelRequest): AuthContext | null {
  const token = getSessionTokenFromRequest(req);
  const session = verifySessionToken(token);
  if (!session) return null;

  const user = findUserById(session.userId);
  return user ? { user } : null;
}

export { toPublicUser };
