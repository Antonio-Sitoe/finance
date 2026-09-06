import { API_URL } from "@/shared/config/http";

export const CATEGORIAS_RELATORIO_ENDPOINTS = {
  DESPESAS_PAGAS: `${API_URL}/categorias-report/despesas-pagas`,
  RESUMO_FINANCEIRO: `${API_URL}/categorias-report/resumo-financeiro`,
  MEDIA: `${API_URL}/categorias-report/media-por-categoria`,
  MOVIMENTACAO: `${API_URL}/categorias-report/movimentacao-por-categoria`,
  HIERARQUIA: `${API_URL}/categorias-report/hierarquia`,
  PAGO_VS_PENDENTE: `${API_URL}/categorias-report/pago-vs-pendente`,
  SEM_CATEGORIA: `${API_URL}/categorias-report/sem-categoria`,
} as const;
