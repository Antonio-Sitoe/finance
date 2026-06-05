import { API_URL } from '@/shared/config/http'

export const CUSTOMER_API_ENDPOINTS = {
  LIST: `${API_URL}/clientes`,
  CREATE: `${API_URL}/clientes`,
  GET_BY_ID: (id: number) => `${API_URL}/clientes/${id}`,
  UPDATE: (id: number) => `${API_URL}/clientes/${id}`,
  DELETE: (id: number) => `${API_URL}/clientes/${id}`,
  SITUACAO: (id: number) => `${API_URL}/clientes/${id}/situacao`,
  RANKING: `${API_URL}/clientes/ranking`,
  ANALYTICS: `${API_URL}/clientes/analytics`,
} as const
