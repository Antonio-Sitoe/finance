import { PageResult } from '../config/listing/listing.dto'

export type TipoLancamento = 'RECEITA' | 'DESPESA'
export type PagamentoEnum = 'PENDENTE' | 'PAGO'

export interface ITransactionReference {
  id: number
  name: string
}

export interface ITransaction {
  id: number
  descricao: string
  parcela: number | null
  totalParcela: number | null
  valor: number
  dataLancamento: string | null
  dataVencimento: string
  situacao: PagamentoEnum
  tipo: TipoLancamento
  conta: ITransactionReference | null
  categoria: ITransactionReference | null
  cliente: ITransactionReference | null
  fornecedor: ITransactionReference | null
}

export interface ITransactionPayload {
  descricao: string
  valor: number
  dataLancamento?: string
  dataVencimento: string
  contaId: number
  categoriaId: number
  clienteId?: number
  fornecedorId?: number
  tipo: TipoLancamento
}

export interface ITransactionParceladoPayload {
  descricao: string
  valorTotal: number
  totalParcela: number
  dataLancamento?: string
  dataVencimento: string
  contaId: number
  categoriaId: number
  clienteId?: number
  fornecedorId?: number
  tipo: TipoLancamento
}

export interface ITransactionStatusResponse {
  id: number
  situacao: PagamentoEnum
  mensagem: string
}

export interface ITransactionAnalytics {
  total: number
  valorReceita: number
  valorDespesa: number
  saldo: number
}

export type ITransactionList = PageResult<ITransaction[]>
