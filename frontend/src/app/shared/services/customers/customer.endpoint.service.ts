import { API_URL } from "@/shared/config/http";

export const CUSTOMER_API_ENDPOINTS = {
  LIST: `${API_URL}/clientes`,
  CREATE: `${API_URL}/clientes`,
  UPDATE: (id: number) => `${API_URL}/clientes/${id}`,
  ANALYTICS: `${API_URL}/clientes/analytics`,
} as const;
