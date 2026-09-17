import { createHmac, randomUUID } from 'crypto';

export function utcTimestamp(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export function generateRequestId(): string {
  return randomUUID();
}

export function buildCanonicalString(options: {
  method: string;
  path: string;
  queryString?: string;
  timestamp: string;
  body: string;
}): string {
  const { method, path, queryString = '', timestamp, body } = options;
  return `${method.toUpperCase()}\n${path}\n${queryString}\n${timestamp}\n${body}`;
}

export function signCanonicalString(secret: string, canonical: string): string {
  return createHmac('sha256', secret).update(canonical, 'utf8').digest('hex');
}

export function signRequest(options: {
  secret: string;
  method: string;
  path: string;
  queryString?: string;
  timestamp: string;
  body: string;
}): string {
  const canonical = buildCanonicalString(options);
  return signCanonicalString(options.secret, canonical);
}
