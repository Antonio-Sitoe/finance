import { PageResult } from '../config/listing/listing.dto'
import { SITUATION } from './enum.dto'

export interface IUsuario {
  id: number
  nome: string
  email: string
  roleId: number
  roleCodigo: string
  roleNome: string
  situacao: keyof typeof SITUATION
  createdAt: string
}

export interface CreateUsuarioDto {
  nome: string
  email: string
  roleId: number
  situacao: string
  senha: string
}

export interface UpdateUsuarioDto {
  nome: string
  email: string
  roleId: number
  situacao: string
  senha?: string
}

export interface UsuarioSituacaoResponse {
  id: number
  situacao: keyof typeof SITUATION
  mensagem: string
}

export type UsuariosResponse = PageResult<IUsuario>

export interface UsuarioAnalytcsResponseDto {
  totalUsuarios: number
  totalAtivos: number
  totalInativos: number
  totalAdministradores: number
}
