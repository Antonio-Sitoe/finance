import { API_URL } from '@/shared/config/http'

export const USERS_API_ENDPOINTS = {
  LIST: `${API_URL}/usuarios`,
  CREATE: `${API_URL}/usuarios`,
  UPDATE: (id: number) => `${API_URL}/usuarios/${id}`,
  ANALYTICS: `${API_URL}/usuarios/analytics`,
} as const
