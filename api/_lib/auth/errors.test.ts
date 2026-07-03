import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { mapDatabaseConflict, resolveAuthHandlerError } from './errors.ts';
import { UserStoreConfigError } from './db.ts';

describe('mapDatabaseConflict', () => {
  it('mapeia violação UNIQUE de CPF', () => {
    const error = mapDatabaseConflict({
      code: '23505',
      constraint: 'users_cpf_key',
      detail: 'Key (cpf)=(123) already exists.',
    });

    assert.equal(error?.message, 'CPF já cadastrado.');
  });

  it('mapeia violação UNIQUE de telefone', () => {
    const error = mapDatabaseConflict({
      code: '23505',
      detail: 'Key (phone)=(11999999999) already exists.',
    });

    assert.equal(error?.message, 'Telefone já cadastrado.');
  });

  it('mapeia violação UNIQUE de placa', () => {
    const error = mapDatabaseConflict({
      code: '23505',
      constraint: 'vehicles_user_id_plate_key',
      detail: 'Key (user_id, plate)=(usr_1, ABC1D23) already exists.',
    });

    assert.equal(error?.message, 'Placa já cadastrada.');
  });

  it('ignora erros que não são conflito', () => {
    assert.equal(mapDatabaseConflict({ code: '23503' }), null);
    assert.equal(mapDatabaseConflict(new Error('outro')), null);
  });
});

describe('resolveAuthHandlerError', () => {
  it('retorna 503 quando DATABASE_URL está ausente', () => {
    const resolved = resolveAuthHandlerError(new UserStoreConfigError());
    assert.equal(resolved?.status, 503);
    assert.equal(resolved?.code, 'SERVICO_INDISPONIVEL');
  });

  it('retorna 409 para conflito de CPF', () => {
    const resolved = resolveAuthHandlerError({
      code: '23505',
      constraint: 'users_cpf_key',
    });
    assert.equal(resolved?.status, 409);
    assert.equal(resolved?.code, 'CONFLITO');
  });
});
