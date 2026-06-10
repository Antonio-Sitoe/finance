import { API_URL } from '@/shared/config/http'

export const SUPPLIER_ENDPOINTS = {
  LIST: `${API_URL}/fornecedores`,
  CREATE: `${API_URL}/fornecedores`,
  DETAIL: (id: number) => `${API_URL}/fornecedores/${id}`,
  UPDATE: (id: number) => `${API_URL}/fornecedores/${id}`,
  SITUACAO: (id: number) => `${API_URL}/fornecedores/${id}/situacao`,
  ANALYTICS: `${API_URL}/fornecedores/analytics`,
} as const
