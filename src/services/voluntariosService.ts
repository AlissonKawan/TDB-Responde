import { apiClient } from './apiClient';
import type { VoluntarioApi, VoluntarioRequestApi } from '../types/api';

export const voluntariosService = {
  listar: () => apiClient.get<VoluntarioApi[]>('/voluntarios'),
  buscarPorId: (id: number) => apiClient.get<VoluntarioApi>(`/voluntarios/${id}`),
  criar: (payload: VoluntarioRequestApi) => apiClient.post<VoluntarioApi>('/voluntarios', payload),
  atualizar: (id: number, payload: VoluntarioRequestApi) =>
    apiClient.put<VoluntarioApi>(`/voluntarios/${id}`, payload),
  excluir: (id: number) => apiClient.delete<void>(`/voluntarios/${id}`),
};

export const getVoluntarios = voluntariosService.listar;
export const createVoluntario = voluntariosService.criar;
