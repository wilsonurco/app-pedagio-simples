export type AuthUser = {
  id: string;
  cpf: string;
  name: string;
  birthDate: string;
  email?: string;
  phone: string;
};

export type AuthVehicle = {
  plate: string;
  model: string;
};

export type RegisterVehicleInput = AuthVehicle;

export type RegisterInput = {
  cpf: string;
  name: string;
  birthDate: string;
  email?: string;
  phone: string;
  password: string;
  vehicle?: RegisterVehicleInput;
};

export type AuthSessionResponse = {
  user: AuthUser;
  vehicles: AuthVehicle[];
};

export type RegisterResponse = AuthSessionResponse & {
  vehicle: AuthVehicle | null;
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

export type AccountHolderInfo = {
  name: string;
  email: string;
};
