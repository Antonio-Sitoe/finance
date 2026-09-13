export interface RoleListItem {
  id: number
  codigo: string
  nome: string
  descricao: string | null
  sistema: boolean
  totalUsuarios: number
}

export interface PermissaoItem {
  id: number
  codigo: string
  acao: string
  metodo: string
  path: string
  descricao: string | null
}

export interface PermissaoGranted {
  id: number
  codigo: string
  acao: string
  metodo: string
  path: string
  granted: boolean
}

export interface RoleDetail {
  id: number
  codigo: string
  nome: string
  descricao: string | null
  sistema: boolean
  matriz: Record<string, PermissaoGranted[]>
}

export interface PermissaoCatalog {
  modulos: Record<string, PermissaoItem[]>
}

export interface RoleCreateRequest {
  codigo: string
  nome: string
  descricao?: string | null
}

export interface RoleUpdateRequest {
  nome: string
  descricao?: string | null
  permissaoIds: number[]
}
