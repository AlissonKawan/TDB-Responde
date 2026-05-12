import { API_BASE_URL } from '../config/api';
import type { ApiRequestOptions } from '../types/api';

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status = 0, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function friendlyMessage(status: number, path: string) {
  if (status === 400) return 'Dados invalidos. Confira os campos e tente novamente.';
  if (status === 401) return 'Credenciais invalidas ou sessao expirada.';
  if (status === 404) return 'Registro nao encontrado.';
  if (status === 409) return 'Registro em conflito. Verifique os dados enviados.';
  if (status >= 500) return 'Erro interno da API. Tente novamente em instantes.';
  return `Nao foi possivel concluir a chamada ${path}.`;
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) return null;

  const text = await response.text();
  if (!text.trim()) return null;

  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) return text;

  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError('A API retornou um JSON invalido.', response.status, text);
  }
}

export async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, headers, ...requestOptions } = options;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...requestOptions,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Nao foi possivel conectar com a API. Verifique se o back-end esta rodando.');
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      typeof data === 'object' && data && 'message' in data
        ? String((data as { message: unknown }).message)
        : friendlyMessage(response.status, path);
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  del: <T>(path: string, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
  delete: <T>(path: string, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
