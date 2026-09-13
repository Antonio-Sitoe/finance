export interface LoginResponse {
  accessToken: string
  refreshToken: string
}

export interface MeResponse {
  id: number
  nome: string
  email: string
  role: string
  permissoes: string[]
  ultimoAcesso: string | null
  criadoEm: string
}
