#!/usr/bin/env node
/**
 * Sincroniza variáveis de homologação de .env.local para o Vercel.
 * Uso: node scripts/vercel-sync-homolog-env.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { spawnSync } from 'child_process';

const ENV_FILE = resolve(process.cwd(), '.env.local');
const ENVIRONMENTS = ['production', 'development'];

const REQUIRED_KEYS = [
  'FISCALTECH_BASE_URL',
  'FISCALTECH_PORTAL_ID',
  'FISCALTECH_API_KEY',
  'FISCALTECH_SECRET',
  'EXPO_PUBLIC_DATA_SOURCE',
  'EXPO_PUBLIC_BFF_URL',
];

function loadEnvFile(path) {
  if (!existsSync(path)) {
    console.error(`Arquivo não encontrado: ${path}`);
    console.error('Copie .env.example para .env.local e preencha as credenciais.');
    process.exit(1);
  }

  const values = {};
  const content = readFileSync(path, 'utf8');

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    values[key] = value;
  }

  return values;
}

function addEnvVar(name, value, environment) {
  const args = [
    'vercel',
    'env',
    'add',
    name,
    environment,
    '--value',
    value,
    '--yes',
    '--non-interactive',
  ];

  const result = spawnSync('npx', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    cwd: process.cwd(),
  });

  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;

  if (result.status === 0) {
    console.log(`✓ ${name} (${environment})`);
    return true;
  }

  if (/already exists|Environment Variable already exists/i.test(output)) {
    console.log(`• ${name} (${environment}) já existe — remova manualmente se precisar atualizar`);
    return true;
  }

  console.error(`✗ ${name} (${environment}): ${output.trim() || result.status}`);
  return false;
}

function main() {
  const values = loadEnvFile(ENV_FILE);
  const missing = REQUIRED_KEYS.filter((key) => !values[key]);

  if (missing.length > 0) {
    console.error(`Variáveis ausentes em .env.local: ${missing.join(', ')}`);
    process.exit(1);
  }

  if (!values.EXPO_PUBLIC_BFF_URL) {
    values.EXPO_PUBLIC_BFF_URL = 'https://app-pedagio-simples.vercel.app';
  }

  if (values.EXPO_PUBLIC_DATA_SOURCE !== 'fiscaltech') {
    console.warn('Aviso: EXPO_PUBLIC_DATA_SOURCE não é "fiscaltech". Homologação pode não ativar no app.');
  }

  console.log('Sincronizando variáveis de homologação para o Vercel...\n');

  let ok = true;
  for (const key of REQUIRED_KEYS) {
    for (const environment of ENVIRONMENTS) {
      const success = addEnvVar(key, values[key], environment);
      ok = ok && success;
    }
  }

  console.log('\nConcluído. Rode `npx vercel env ls` para conferir.');
  console.log('Depois faça redeploy: `npx vercel --prod`');

  if (!ok) process.exit(1);
}

main();
