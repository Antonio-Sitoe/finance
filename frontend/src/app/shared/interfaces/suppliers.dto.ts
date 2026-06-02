export interface ISupplier {
  id: number
  nomeEmpresarial: string
  emailFinanceiro?: string
  telefone?: string
  website?: string
  rua?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  distrito?: string
  classificacaoRisco: number
  situacao: 'ATIVO' | 'INATIVO'
  createdAt: string
}
