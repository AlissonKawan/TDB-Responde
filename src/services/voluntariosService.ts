import { apiGet, apiRequest } from './api';
import type { VoluntarioApi, VoluntarioRequestApi } from '../types/api';

export function getVoluntarios(): Promise<VoluntarioApi[]> {
  return apiGet<VoluntarioApi[]>('/voluntarios');
}

export function createVoluntario(payload: VoluntarioRequestApi): Promise<VoluntarioApi> {
  return apiRequest<VoluntarioApi>('/voluntarios', {
    method: 'POST',
    body: payload,
  });
}
