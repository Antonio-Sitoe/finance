import { ColumnDef } from '../components/ui/datatable/datatable'
import { SITUATION } from '../interfaces/enum.dto'

export const SUPPLIERS_COLUMNS: ColumnDef[] = [
  { id: 'fornecedor', label: 'Fornecedor' },
  { id: 'contacto', label: 'Contacto' },
  { id: 'localizacao', label: 'Localização' },
  { id: 'avaliacao', label: 'Avaliação' },
  { id: 'situacao', label: 'Estado', align: 'center' },
  { id: 'acoes', label: '', align: 'right' },
]

export const SUPPLIER_SITUACAO_OPTIONS = [
  { label: 'Todos os estados', value: '' },
  { label: 'Activo', value: SITUATION.ATIVO },
  { label: 'Inactivo', value: SITUATION.INATIVO },
]

export const SUPPLIER_AVALIACAO_OPTIONS = [
  { label: 'Todas as avaliações', value: '' },
  { label: 'Excelente (≥ 8)', value: 'excelente' },
  { label: 'Regular (5–7)', value: 'regular' },
  { label: 'Risco (< 5)', value: 'risco' },
]
