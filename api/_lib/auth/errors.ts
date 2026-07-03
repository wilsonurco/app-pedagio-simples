import { UserStoreConfigError } from './db';

type PostgresErrorLike = {
  code?: string;
  constraint?: string;
  detail?: string;
  message?: string;
};

export function isUserStoreConfigError(error: unknown): error is UserStoreConfigError {
  return error instanceof UserStoreConfigError;
}

/** Converte violações UNIQUE do Postgres em mensagens amigáveis (409). */
export function mapDatabaseConflict(error: unknown): Error | null {
  if (!error || typeof error !== 'object') return null;

  const pg = error as PostgresErrorLike;
  if (pg.code !== '23505') return null;

  const hint = `${pg.constraint ?? ''} ${pg.detail ?? ''} ${pg.message ?? ''}`.toLowerCase();

  if (hint.includes('cpf')) return new Error('CPF já cadastrado.');
  if (hint.includes('phone')) return new Error('Telefone já cadastrado.');
  if (hint.includes('plate') || hint.includes('placa')) return new Error('Placa já cadastrada.');

  return new Error('Registro duplicado.');
}

export function resolveAuthHandlerError(error: unknown): {
  status: number;
  code: string;
  message: string;
} | null {
  if (isUserStoreConfigError(error)) {
    return {
      status: 503,
      code: 'SERVICO_INDISPONIVEL',
      message: 'Cadastro temporariamente indisponível. Tente novamente em instantes.',
    };
  }

  const conflict = mapDatabaseConflict(error);
  if (conflict) {
    return { status: 409, code: 'CONFLITO', message: conflict.message };
  }

  if (error instanceof Error && error.message.includes('já cadastrad')) {
    return { status: 409, code: 'CONFLITO', message: error.message };
  }

  return null;
}
