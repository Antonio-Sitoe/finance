import { API_URL } from '@/shared/config/http'

export const CUSTOMER_API_ENDPOINTS = {
  LIST: `${API_URL}/clientes`,
  CREATE: `${API_URL}/clientes`,
  DELETE: (id: number) => `${API_URL}/clientes/${id}`,
  UPDATE: (id: number) => `${API_URL}/clientes/${id}`,
  SITUACAO: (id: number) => `${API_URL}/clientes/${id}/situacao`,
  ANALYTICS: `${API_URL}/clientes/analytics`,
} as const
