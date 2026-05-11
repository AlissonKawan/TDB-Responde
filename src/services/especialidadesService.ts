import { apiGet } from './api';
import type { EspecialidadeApi } from '../types/api';

export function getEspecialidades(): Promise<EspecialidadeApi[]> {
  return apiGet<EspecialidadeApi[]>('/especialidades');
}
