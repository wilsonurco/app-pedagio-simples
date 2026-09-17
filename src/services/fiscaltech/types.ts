export type FiscalTechErrorBody = {
  erro?: string;
  mensagem?: string;
  timestamp?: string;
  requestId?: string;
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
