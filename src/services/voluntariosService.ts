import { apiGet } from './api';
import type { VoluntarioApi } from '../types/api';

export function getVoluntarios(): Promise<VoluntarioApi[]> {
  return apiGet<VoluntarioApi[]>('/voluntarios');
}
