import { API_URL } from "@/shared/config/http";

export const CASH_FLOW_ENDPOINTS = {
  FLUXO_DIARIO: `${API_URL}/cash-flow/fluxo-diario`,
  DRE: `${API_URL}/cash-flow/dre`,
} as const;
