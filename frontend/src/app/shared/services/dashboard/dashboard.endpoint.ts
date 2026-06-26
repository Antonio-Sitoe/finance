import { API_URL } from '@/shared/config/http'

export const DASHBOARD_ENDPOINTS = {
  DASHBOARD: `${API_URL}/analitics/dashboard`,
  ALERTS: `${API_URL}/analitics/alertas`,
  ANNUAL_REPORT: `${API_URL}/analitics/relatorio-anual`,
  BY_ACCOUNT: `${API_URL}/analitics/por-conta`,
  REVENUE_VS_EXPENSES: `${API_URL}/analitics/receita-vs-despesas`,
  TOP_CATEGORIES: `${API_URL}/analitics/top-categoria`,
} as const
