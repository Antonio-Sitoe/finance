import { API_URL } from "@/shared/config/http";

export const ACCOUNT_ENDPOINTS = {
  LIST: `${API_URL}/contas`,
  CREATE: `${API_URL}/contas`,
  DETAIL: (id: number) => `${API_URL}/contas/${id}`,
  UPDATE: (id: number) => `${API_URL}/contas/${id}`,
  SITUACAO: (id: number) => `${API_URL}/contas/${id}/situacao`,
} as const;
