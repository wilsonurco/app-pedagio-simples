export type AuthUser = {
  id: string;
  cpf: string;
  name: string;
  birthDate: string;
  email?: string;
  phone: string;
};

export type RegisterVehicleInput = {
  plate: string;
  model: string;
};

export type RegisterInput = {
  cpf: string;
  name: string;
  birthDate: string;
  email?: string;
  phone: string;
  password: string;
  vehicle?: RegisterVehicleInput;
};

export type AuthErrorBody = {
  erro: string;
  mensagem: string;
};

export class AuthApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, body: AuthErrorBody) {
    super(body.mensagem);
    this.status = status;
    this.code = body.erro;
  }
}
