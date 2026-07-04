import type { VercelRequest, VercelResponse } from '@vercel/node';

import { SESSION_COOKIE_NAME, SESSION_TTL_SECONDS } from './env';

function parseCookies(req: VercelRequest): Record<string, string> {
  const header = req.headers.cookie;
  if (!header) return {};

  return header.split(';').reduce<Record<string, string>>((acc, part) => {
    const [key, ...rest] = part.trim().split('=');
    if (!key) return acc;
    acc[key] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
}

export function getSessionTokenFromRequest(req: VercelRequest): string | undefined {
  return parseCookies(req)[SESSION_COOKIE_NAME];
}

/** SameSite=None + Secure no Vercel permite cookie em dev local (localhost → API produção). */
function sessionCookieFlags(): { sameSite: 'Lax' | 'None'; secure: boolean } {
  if (process.env.VERCEL) {
    return { sameSite: 'None', secure: true };
  }
  const isProd = process.env.NODE_ENV === 'production';
  return { sameSite: 'Lax', secure: isProd };
}

function formatSessionCookie(token: string, maxAge: number): string {
  const { sameSite, secure } = sessionCookieFlags();
  const secureFlag = secure ? '; Secure' : '';
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=${maxAge}${secureFlag}`;
}

export function setSessionCookie(res: VercelResponse, token: string) {
  res.setHeader('Set-Cookie', formatSessionCookie(token, SESSION_TTL_SECONDS));
}

export function clearSessionCookie(res: VercelResponse) {
  res.setHeader('Set-Cookie', formatSessionCookie('', 0));
}
