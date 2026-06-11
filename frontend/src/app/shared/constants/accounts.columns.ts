import { ColumnDef } from '../components/ui/datatable/datatable'
import { SITUATION } from '../interfaces/enum.dto'

export const ACCOUNTS_COLUMNS: ColumnDef[] = [
  { id: 'conta', label: 'Conta' },
  { id: 'agencia', label: 'Agência' },
  { id: 'contaCorrente', label: 'Conta Corrente' },
  { id: 'dataInclusao', label: 'Inclusão' },
  { id: 'situacao', label: 'Estado', align: 'center' },
  { id: 'acoes', label: '', align: 'right' },
]

export const ACCOUNT_SITUACAO_OPTIONS = [
  { label: 'Todos os estados', value: '' },
  { label: 'Activo', value: SITUATION.ATIVO },
  { label: 'Inactivo', value: SITUATION.INATIVO },
]
