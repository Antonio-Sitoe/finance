import { API_URL } from '@/shared/config/http'

export const AUTH_API_ENDPOINTS = {
  LOGIN: `${API_URL}/auth/login`,
  REFRESH: `${API_URL}/auth/refresh`,
  LOGOUT: `${API_URL}/auth/logout`,
  ME: `${API_URL}/auth/me`,
  FORGOT_PASSWORD: `${API_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_URL}/auth/reset-password`,
  CHANGE_PASSWORD: `${API_URL}/auth/change-password`,
} as const
