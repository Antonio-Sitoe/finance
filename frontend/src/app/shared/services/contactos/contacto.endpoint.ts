import { API_URL } from '@/shared/config/http'

export const CONTACTO_ENDPOINTS = {
  LIST: `${API_URL}/contactos`,
  BY_CLIENTE: (clienteId: number) => `${API_URL}/contactos/cliente/${clienteId}`,
  CREATE: `${API_URL}/contactos`,
  UPDATE: (id: number) => `${API_URL}/contactos/${id}`,
} as const
