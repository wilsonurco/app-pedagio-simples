import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

import { getAuthSecret, SESSION_TTL_SECONDS } from './env';

type SessionPayload = {
  userId: string;
  exp: number;
};

function sign(value: string): string {
  return createHmac('sha256', getAuthSecret()).update(value).digest('base64url');
}

export function createSessionToken(userId: string): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = Buffer.from(JSON.stringify({ userId, exp } satisfies SessionPayload)).toString(
    'base64url',
  );
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (sigBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(sigBuffer, expectedBuffer)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as SessionPayload;
    if (!parsed.userId || typeof parsed.exp !== 'number') return null;
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function createRegistrationChallenge(): string {
  return randomBytes(24).toString('base64url');
}
