import { ColumnDef } from '../components/ui/datatable/datatable'
import { SITUATION } from '../interfaces/enum.dto'

export const CATEGORIES_COLUMNS: ColumnDef[] = [
  { id: 'categoria', label: 'Categoria' },
  { id: 'tipo', label: 'Tipo' },
  { id: 'pai', label: 'Pai' },
  { id: 'descricao', label: 'Descrição' },
  { id: 'situacao', label: 'Estado', align: 'center' },
  { id: 'acoes', label: '', align: 'right' },
]

export const CATEGORY_SITUACAO_OPTIONS = [
  { label: 'Todos os estados', value: '' },
  { label: 'Activo', value: SITUATION.ATIVO },
  { label: 'Inactivo', value: SITUATION.INATIVO },
]

export const CATEGORY_TIPO_OPTIONS = [
  { label: 'Todos os tipos', value: '' },
  { label: 'Débito', value: 'debito' },
  { label: 'Crédito', value: 'credito' },
]
