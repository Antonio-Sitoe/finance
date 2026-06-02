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
