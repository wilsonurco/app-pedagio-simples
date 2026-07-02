import type { VercelRequest, VercelResponse } from '@vercel/node';

import { clearSessionCookie } from '../_lib/auth/cookies';
import { handleOptions, methodNotAllowed, sendJson } from '../_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;

  if (req.method !== 'POST') {
    methodNotAllowed(req, res, ['POST']);
    return;
  }

  clearSessionCookie(res);
  sendJson(req, res, 200, { ok: true });
}
