export type ConsultarCpfResponse = {
  cpf: string;
  name: string;
  birthDate: string;
};

export type CpfApiErrorBody = {
  erro?: string;
  mensagem?: string;
};

export class CpfApiError extends Error {
  status: number;
  body: CpfApiErrorBody;

  constructor(status: number, body: CpfApiErrorBody) {
    super(body.mensagem ?? 'Erro ao consultar CPF');
    this.name = 'CpfApiError';
    this.status = status;
    this.body = body;
  }
}
