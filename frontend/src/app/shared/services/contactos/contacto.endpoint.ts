import { API_URL } from '@/shared/config/http'

export const CONTACTO_ENDPOINTS = {
  BY_CLIENTE: (clienteId: number) => `${API_URL}/contactos/cliente/${clienteId}`,
} as const
