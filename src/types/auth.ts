export type TipoUsuario = 'VOLUNTARIO' | 'BENEFICIARIO' | 'ADMIN';

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  tipoUsuario: TipoUsuario;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface AuthUser {
  id: number;
  nome: string;
  email: string;
  tipoUsuario: TipoUsuario;
  ativo: boolean;
  dataCriacao?: string;
}

