export function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) return secret;

  if (process.env.NODE_ENV !== 'production') {
    return 'dev-only-auth-secret-min-32-chars!!';
  }

  throw new Error('AUTH_SECRET ausente ou muito curto (mínimo 32 caracteres).');
}

export const SESSION_COOKIE_NAME = 'ps_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
