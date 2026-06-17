import { API_URL } from '@/shared/config/http'

export const TRANSACTION_ENDPOINTS = {
  LIST: `${API_URL}/lancamentos`,
  CREATE: `${API_URL}/lancamentos`,
  DETAIL: (id: number) => `${API_URL}/lancamentos/${id}`,
  UPDATE: (id: number) => `${API_URL}/lancamentos/${id}`,
  SITUACAO: (id: number) => `${API_URL}/lancamentos/${id}/situacao`,
  DELETE: (id: number) => `${API_URL}/lancamentos/${id}`,
  PARCELADO: `${API_URL}/lancamentos/parcelado`,
  RESUMO: `${API_URL}/lancamentos/resumo`,
  EXPORT_CSV: `${API_URL}/lancamentos/export/csv`,
} as const
