import { API_URL } from '@/shared/config/http'

export const USERS_API_ENDPOINTS = {
  LIST: `${API_URL}/usuarios`,
  CREATE: `${API_URL}/usuarios`,
  UPDATE: (id: number) => `${API_URL}/usuarios/${id}`,
  SITUACAO: (id: number) => `${API_URL}/usuarios/${id}/situacao`,
  ANALYTICS: `${API_URL}/usuarios/analytics`,
} as const
