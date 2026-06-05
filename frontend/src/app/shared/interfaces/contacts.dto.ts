export interface IContact {
  id: number
  nome: string
  cargo: string
  departamento?: string
  empresaNome?: string
  empresaId?: number
  telefone?: string
  email?: string
  situacao: 'ATIVO' | 'INATIVO'
  createdAt: string
  ultimaAtividade?: string
}

export interface IContactoDTO {
  id: number
  nome: string
  departamento?: string
  email: string
  telefone: string
  situacao: 'ATIVO' | 'INATIVO'
  clienteId: number
  clienteNome: string
  createdAt?: string
  updatedAt?: string
}
