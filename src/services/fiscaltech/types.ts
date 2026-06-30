export type MetodoPagamentoFiscal = 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'DINHEIRO';

export type FiscalTechErrorBody = {
  erro?: string;
  mensagem?: string;
  timestamp?: string;
  requestId?: string;
  transacoesIndisponiveis?: Array<{ transacaoId: string; motivo: string }>;
  transacoesDisponiveis?: string[];
  valorEsperado?: number;
  valorAtual?: number;
  cooldownAte?: string;
  placasAfetadas?: string[];
  reservaId?: string;
};

export type FiscalTechTransacao = {
  transacaoId: string;
  dataPassagem: string;
  dataVencimento?: string | null;
  vencida?: boolean | null;
  praca?: string;
  pracaId?: string;
  sentido?: string;
  categoria?: number;
  categoriaRotulo?: string;
  categoriaDescricao?: string;
  valor: number;
  moeda?: string;
  disponivel: boolean;
  motivoIndisponivel?: string;
  reservadoAte?: string;
};

export type FiscalTechDebitoResultado = {
  placa: string;
  transacoes: FiscalTechTransacao[];
  totalDisponivel: number;
};

export type ConsultarDebitosResponse = {
  resultados: FiscalTechDebitoResultado[];
  consultadoEm?: string;
};

export type ConsultarDebitosRequest = {
  placas: string[];
  placaInternacional?: boolean;
};

export type CriarReservaRequest = {
  transacaoIds: string[];
  valorEsperado: number;
};

export type CriarReservaResponse = {
  reservaId: string;
  status: string;
  expiresAt: string;
  transacaoIds: string[];
  valorTotal: number;
  criadoEm: string;
};

export type ConfirmarPagamentoRequest = {
  comprovante: {
    identificadorPagamento: string;
    metodoPagamento: MetodoPagamentoFiscal;
    valorPago: number;
  };
};

export type ConfirmarPagamentoResponse = {
  reservaId: string;
  status: string;
  confirmadoEm: string;
  protocolo: string;
  transacoes: Array<{ transacaoId: string; status: string }>;
};

export type CancelarReservaResponse = {
  reservaId: string;
  status: string;
  canceladoEm?: string;
};

export type ReservaStatusResponse = CriarReservaResponse & {
  confirmadoEm?: string;
  protocolo?: string;
  transacoes?: Array<{ transacaoId: string; status: string }>;
};

export class FiscalTechApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly body: FiscalTechErrorBody;

  constructor(status: number, body: FiscalTechErrorBody) {
    super(body.mensagem ?? `Erro na API (${status})`);
    this.name = 'FiscalTechApiError';
    this.status = status;
    this.code = body.erro;
    this.body = body;
  }
}

export type PaymentReservationState = {
  reservaId: string;
  expiresAt: string;
  valorTotalCents: number;
  transacaoIds: string[];
};
