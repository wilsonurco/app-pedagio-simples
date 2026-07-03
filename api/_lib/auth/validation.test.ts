import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isValidCpf, normalizeCpf, normalizePhone } from './validation.ts';

describe('normalizeCpf', () => {
  it('remove formatação', () => {
    assert.equal(normalizeCpf('098.799.398-40'), '09879939840');
  });
});

describe('isValidCpf', () => {
  it('aceita CPF válido', () => {
    assert.equal(isValidCpf('529.982.247-25'), true);
  });

  it('rejeita CPF com dígitos repetidos', () => {
    assert.equal(isValidCpf('111.111.111-11'), false);
  });

  it('rejeita CPF inválido', () => {
    assert.equal(isValidCpf('123.456.789-00'), false);
  });
});

describe('normalizePhone', () => {
  it('remove DDI 55 quando presente', () => {
    assert.equal(normalizePhone('+55 (11) 98765-4321'), '11987654321');
  });

  it('mantém DDD e número', () => {
    assert.equal(normalizePhone('(11) 98765-4321'), '11987654321');
  });
});
