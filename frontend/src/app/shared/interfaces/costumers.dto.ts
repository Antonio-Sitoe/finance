export interface IContactoCliente {
  nome: string
  cargo: string
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
