import { API_URL } from "@/shared/config/http";

export const CASH_FLOW_ENDPOINTS = {
  FLUXO_DIARIO: `${API_URL}/analitics/fluxo-diario`,
} as const;
