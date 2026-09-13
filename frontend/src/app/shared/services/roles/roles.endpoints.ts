import { API_URL } from '@/shared/config/http'

export const ROLES_API_ENDPOINTS = {
  LIST: `${API_URL}/roles`,
  CREATE: `${API_URL}/roles`,
  BY_ID: (id: number) => `${API_URL}/roles/${id}`,
  PERMISSOES: `${API_URL}/permissoes`,
} as const
