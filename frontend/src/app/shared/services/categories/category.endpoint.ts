import { API_URL } from "@/shared/config/http";

export const CATEGORY_ENDPOINTS = {
  LIST: `${API_URL}/categorias`,
  ALL: `${API_URL}/categorias/all`,
  CREATE: `${API_URL}/categorias`,
  DETAIL: (id: number) => `${API_URL}/categorias/${id}`,
  UPDATE: (id: number) => `${API_URL}/categorias/${id}`,
  SITUACAO: (id: number) => `${API_URL}/categorias/${id}/situacao`,
} as const;
