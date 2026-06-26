import { API_URL } from '@/shared/config/http'

export const DASHBOARD_ENDPOINTS = {
  DASHBOARD: `${API_URL}/analitics/dashboard`,
  ALERTAS: `${API_URL}/analitics/alertas`,
  RELATORIO_ANUAL: `${API_URL}/analitics/relatorio-anual`,
  POR_CONTA: `${API_URL}/analitics/por-conta`,
} as const
