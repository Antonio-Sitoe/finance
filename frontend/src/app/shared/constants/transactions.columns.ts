import { ColumnDef } from '../components/ui/datatable/datatable'

export const TRANSACTIONS_COLUMNS: ColumnDef[] = [
  { id: 'tipo', label: 'Tipo', align: 'center' },
  { id: 'descricao', label: 'Descrição' },
  { id: 'categoria', label: 'Categoria' },
  { id: 'conta', label: 'Conta' },
  { id: 'valor', label: 'Valor' },
  { id: 'vencimento', label: 'Vencimento' },
  { id: 'situacao', label: 'Estado', align: 'center' },
  { id: 'acoes', label: '', align: 'right' },
]

export const TRANSACTION_TIPO_OPTIONS = [
  { label: 'Todos os tipos', value: '' },
  { label: 'Receita', value: 'RECEITA' },
  { label: 'Despesa', value: 'DESPESA' },
]

export const TRANSACTION_SITUACAO_OPTIONS = [
  { label: 'Todos os estados', value: '' },
  { label: 'Pago', value: 'PAGO' },
  { label: 'Pendente', value: 'PENDENTE' },
]
