export interface VoluntarioApi {
  id: number;
  nome: string;
  usuario: string;
  senha?: string;
  especialidade: string;
  disponivel: boolean;
  acessoSigilo: boolean;
}

export type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};
