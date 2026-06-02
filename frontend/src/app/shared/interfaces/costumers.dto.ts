export interface IContactoCliente {
  id?: number
  nome: string
  cargo: string
  departamento?: string
  telefone?: string
  email?: string
  situacao?: 'ATIVO' | 'INATIVO'
  ultimaAtividade?: string
}

export interface ICliente {
  id: number
  nomeEmpresarial: string
  email: string
  telefone: string
  endereco?: string
  numero?: string
  complemento?: string
  cidade?: string
  distrito?: string
  classificacaoRisco?: number
  classificacao?: string
  situacao: 'ATIVO' | 'INATIVO'
  vip?: boolean
  createdAt: string
  contactos?: IContactoCliente[]
}
