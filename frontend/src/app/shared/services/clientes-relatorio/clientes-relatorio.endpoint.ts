import { API_URL } from "@/shared/config/http";

export const CLIENTES_RELATORIO_ENDPOINTS = {
  SITUACAO: `${API_URL}/clientes-report/situacao-por-estado`,
  CLASSIFICACAO: `${API_URL}/clientes-report/classificacao-por-nota`,
  SEM_DADOS: `${API_URL}/clientes-report/sem-dados-contactos`,
  MULTIPLOS_CONTACTOS: `${API_URL}/clientes-report/multiplos-contactos`,
  FATURAMENTO: `${API_URL}/clientes-report/faturamento-por-cliente`,
  FATURAMENTO_RESUMO: `${API_URL}/clientes-report/faturamento-resumo`,
  CLIENTES: `${API_URL}/clientes`,
  LANCAMENTOS: `${API_URL}/lancamentos`,
} as const;
