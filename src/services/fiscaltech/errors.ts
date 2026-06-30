import { FiscalTechApiError } from './types';

export type FiscalTechUserMessage = {
  title: string;
  message: string;
  action?: 'refresh' | 'retry-reservation' | 'wait-cooldown' | 'go-back';
  cooldownAte?: string;
};

const ERROR_MESSAGES: Record<string, Omit<FiscalTechUserMessage, 'cooldownAte'>> = {
  TRANSACOES_INDISPONIVEIS: {
    title: 'Passagens indisponíveis',
    message: 'Uma ou mais passagens não estão disponíveis no momento. Atualize a lista e tente novamente.',
    action: 'refresh',
  },
  VALOR_ALTERADO: {
    title: 'Valor atualizado',
    message: 'O valor de uma ou mais passagens mudou. Atualizamos a lista — confira antes de pagar.',
    action: 'refresh',
  },
  RESERVA_EXPIRADA: {
    title: 'Reserva expirada',
    message: 'O tempo para concluir o pagamento acabou. Inicie o pagamento novamente.',
    action: 'retry-reservation',
  },
  RESERVA_INVALIDADA: {
    title: 'Reserva invalidada',
    message: 'A reserva não é mais válida. Consulte os débitos novamente antes de pagar.',
    action: 'refresh',
  },
  COOLDOWN_RESERVA: {
    title: 'Aguarde para tentar de novo',
    message: 'Há um bloqueio temporário para novas reservas desta placa. Tente novamente mais tarde.',
    action: 'wait-cooldown',
  },
  REQUISICAO_INVALIDA: {
    title: 'Dados inválidos',
    message: 'Verifique a placa informada e tente novamente.',
    action: 'go-back',
  },
  ERRO_INTERNO: {
    title: 'Falha de comunicação',
    message: 'Não foi possível concluir a operação. Tente novamente em instantes.',
    action: 'retry-reservation',
  },
};

export function getFiscalTechUserMessage(error: unknown): FiscalTechUserMessage {
  if (error instanceof FiscalTechApiError) {
    const mapped = error.code ? ERROR_MESSAGES[error.code] : undefined;
    if (mapped) {
      return {
        ...mapped,
        cooldownAte: error.body.cooldownAte,
      };
    }

    return {
      title: 'Não foi possível continuar',
      message: error.message,
      action: 'refresh',
    };
  }

  if (error instanceof Error) {
    return {
      title: 'Erro inesperado',
      message: error.message,
      action: 'go-back',
    };
  }

  return {
    title: 'Erro inesperado',
    message: 'Ocorreu um problema. Tente novamente.',
    action: 'go-back',
  };
}

export function formatCooldownMessage(cooldownAte?: string): string | undefined {
  if (!cooldownAte) return undefined;
  const date = new Date(cooldownAte);
  if (Number.isNaN(date.getTime())) return undefined;
  return `Disponível novamente após ${date.toLocaleString('pt-BR')}.`;
}
