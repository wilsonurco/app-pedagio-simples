#!/usr/bin/env node
/**
 * BFF local para consultar débitos reais da Fiscaltech.
 * Uso: node scripts/local-bff.mjs
 */

import { createHmac, randomUUID } from 'crypto';
import { createServer } from 'http';
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
    throw new Error(`Variável ausente: ${name}`);
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

function send(res, status, body, extra = {}) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Idempotency-Key, X-Request-Id',
    ...extra,
  });
  res.end(payload);
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

loadEnvFile();

const baseUrl = requireEnv('FISCALTECH_BASE_URL').replace(/\/$/, '');
const portalId = requireEnv('FISCALTECH_PORTAL_ID');
const apiKey = requireEnv('FISCALTECH_API_KEY');
const secret = requireEnv('FISCALTECH_SECRET');
const port = Number(process.env.BFF_PORT ?? 8787);

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    send(res, 204, {});
    return;
  }

  const url = new URL(req.url ?? '/', `http://127.0.0.1:${port}`);
  if (req.method !== 'POST' || url.pathname !== '/api/debitos') {
    send(res, 404, { erro: 'NAO_ENCONTRADO', mensagem: 'Use POST /api/debitos.' });
    return;
  }

  try {
    const payload = await readJson(req);
    const placas = Array.isArray(payload.placas)
      ? [...new Set(payload.placas.map((plate) => String(plate).replace(/[^a-zA-Z0-9]/g, '').toUpperCase()).filter(Boolean))]
      : [];

    if (placas.length === 0) {
      send(res, 400, {
        erro: 'REQUISICAO_INVALIDA',
        mensagem: 'Informe ao menos uma placa para consultar.',
      });
      return;
    }

    const body = JSON.stringify({
      placas,
      placaInternacional: Boolean(payload.placaInternacional),
    });
    const timestamp = utcTimestamp();
    const requestId = randomUUID();
    const signature = sign(secret, 'POST', '/debitos', '', timestamp, body);

    const upstream = await fetch(`${baseUrl}/debitos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Portal-Id': portalId,
        'X-Api-Key': apiKey,
        'X-Signature': signature,
        'X-Timestamp': timestamp,
        'X-Request-Id': requestId,
      },
      body,
    });

    const text = await upstream.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { mensagem: text || 'Resposta inválida da API FiscalTech' };
    }

    send(res, upstream.status, data, { 'X-Request-Id': requestId });
  } catch (error) {
    send(res, 500, {
      erro: 'ERRO_INTERNO',
      mensagem: error instanceof Error ? error.message : 'Falha ao consultar débitos',
    });
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`BFF Fiscaltech em http://127.0.0.1:${port}/api/debitos`);
});
