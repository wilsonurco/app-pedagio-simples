#!/usr/bin/env node
/**
 * Aplica migrations SQL em db/migrations/ (ordem alfabética).
 * Uso: npm run db:migrate
 * Requer DATABASE_URL no ambiente ou em .env.local
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { neon } from '@neondatabase/serverless';

function loadEnvFile() {
  const envPath = resolve(process.cwd(), '.env.local');
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    const value = trimmed.slice(eq + 1);
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL ausente. Configure em .env.local ou no ambiente.');
  process.exit(1);
}

const migrationsDir = resolve(process.cwd(), 'db/migrations');
const files = readdirSync(migrationsDir)
  .filter((name) => name.endsWith('.sql'))
  .sort();

if (files.length === 0) {
  console.log('Nenhuma migration encontrada.');
  process.exit(0);
}

const sql = neon(url);

for (const file of files) {
  const path = join(migrationsDir, file);
  const contents = readFileSync(path, 'utf8');
  const statements = contents
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && !part.startsWith('--'));

  console.log(`Aplicando ${file}...`);
  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log(`  OK (${statements.length} statements)`);
}

console.log(`Migrations concluídas (${files.length}).`);
