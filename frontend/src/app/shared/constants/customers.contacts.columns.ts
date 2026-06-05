import { ColumnDef } from '../components/ui/datatable/datatable'

export const COSTUMER_CONTACTS_COLUMNS: ColumnDef[] = [
  { id: 'contacto', label: 'Nome' },
  { id: 'departamento', label: 'Departamento' },
  { id: 'telefone', label: 'Telefone' },
  { id: 'email', label: 'Email' },
  { id: 'situacao', label: 'Estado', align: 'center' },
  { id: 'acoes', label: '', align: 'right' },
]
