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

export interface ICustomerDTO {
  id: number
  nomeEmpresarial: string
  email: string
  telefone: string
  endereco?: string
  numero?: string
  complemento?: string
  cidade?: string
  distrito?: string
  estado?: string
  nota?: number
  situacao: 'ATIVO' | 'INATIVO'
  createdAt?: string
  contactos?: IContactoCliente[]
}

export interface ICustomerRankingResumoDTO {
  totalClientes: number
  clientesNormais: number
  clientesEmCrescimento: number
  clientesVip: number
}

export type CreateCustomerDto = Omit<
  ICustomerDTO,
  'id' | 'createdAt' | 'contactos'
>
export type UpdateCustomerDto = Partial<ICustomerDTO>
