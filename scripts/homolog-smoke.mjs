#!/usr/bin/env node
/**
 * Smoke test da API FiscalTech (homologação).
 * Uso: npm run homolog:smoke -- ABC1D23
 * Requer variáveis FISCALTECH_* (carregue de .env.local ou export no shell).
 */

import { createHmac, randomUUID } from 'crypto';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

function loadEnvFile() {
  const envPath = resolve(process.cwd(), '.env.local');
  if (!existsSync(envPath)) return;

  const content = readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Variável ausente: ${name}`);
    process.exit(1);
  }
  return value;
}

function utcTimestamp() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function sign(secret, method, path, queryString, timestamp, body) {
  const canonical = `${method}\n${path}\n${queryString}\n${timestamp}\n${body}`;
  return createHmac('sha256', secret).update(canonical, 'utf8').digest('hex');
}

async function callApi(options) {
  const requestId = randomUUID();
  const timestamp = utcTimestamp();
  const body = options.body ? JSON.stringify(options.body) : '';
  const signature = sign(
    options.secret,
    options.method,
    options.path,
    options.queryString ?? '',
    timestamp,
    body,
  );

  const url = options.queryString
    ? `${options.baseUrl}${options.path}?${options.queryString}`
    : `${options.baseUrl}${options.path}`;

  const response = await fetch(url, {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
      'X-Portal-Id': options.portalId,
      'X-Api-Key': options.apiKey,
      'X-Signature': signature,
      'X-Timestamp': timestamp,
      'X-Request-Id': requestId,
    },
    body: options.method === 'POST' ? body : undefined,
  });

  const text = await response.text();
  let data = text;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    // mantém texto bruto
  }

  return { status: response.status, data, requestId };
}

async function main() {
  loadEnvFile();

  const baseUrl = requireEnv('FISCALTECH_BASE_URL').replace(/\/$/, '');
  const portalId = requireEnv('FISCALTECH_PORTAL_ID');
  const apiKey = requireEnv('FISCALTECH_API_KEY');
  const secret = requireEnv('FISCALTECH_SECRET');
  const plate = (process.argv[2] ?? 'ABC1D23').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  console.log('=== FiscalTech Homolog Smoke Test ===');
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Portal: ${portalId}`);
  console.log(`Placa: ${plate}`);
  console.log('');

  console.log('1) POST /debitos');
  const debitos = await callApi({
    baseUrl,
    portalId,
    apiKey,
    secret,
    method: 'POST',
    path: '/debitos',
    body: { placas: [plate], placaInternacional: false },
  });
  console.log(`   Status: ${debitos.status}`);
  console.log(`   Request-Id: ${debitos.requestId}`);
  console.log(JSON.stringify(debitos.data, null, 2));
  console.log('');

  console.log('2) POST /debitos (placa inválida — esperado 400)');
  const invalid = await callApi({
    baseUrl,
    portalId,
    apiKey,
    secret,
    method: 'POST',
    path: '/debitos',
    body: { placas: ['abc-1d23'] },
  });
  console.log(`   Status: ${invalid.status}`);
  console.log(JSON.stringify(invalid.data, null, 2));

  if (debitos.status >= 400) {
    process.exit(1);
  }

  console.log('\nSmoke test concluído.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
