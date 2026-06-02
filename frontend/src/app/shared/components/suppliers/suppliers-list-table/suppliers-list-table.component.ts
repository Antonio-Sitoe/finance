import { Component, computed, Input, signal, WritableSignal } from '@angular/core'
import { ISupplier } from '@/shared/interfaces/suppliers.dto'
import { DataTableComponent } from '@/shared/components/ui/datatable/datatable'
import { BadgeComponent } from '@/shared/components/ui/badge/badge.component'
import { InputFieldComponent } from '@/shared/components/ui/input/input-field.component'
import { SelectComponent } from '@/shared/components/ui/select/select.component'
import { ModalComponent } from '@/shared/components/ui/modal/modal.component'
import { ButtonComponent } from '@/shared/components/ui/button/button.component'
import { CreateAndEditSupplierComponent } from '@/shared/components/suppliers/create-and-edit-supplier/create-and-edit-supplier.component'
import { SupplierDetailDrawerComponent } from '@/shared/components/suppliers/supplier-detail-drawer/supplier-detail-drawer.component'
import {
  SolarDynamicIcon,
  MagnifierBold,
  Pen2Bold,
  EyeBold,
  MenuDotsBold,
  DangerTriangleBold,
} from '@solar-icons/angular'

@Component({
  selector: 'app-suppliers-list-table',
  imports: [
    DataTableComponent,
    BadgeComponent,
    InputFieldComponent,
    SelectComponent,
    ModalComponent,
    ButtonComponent,
    CreateAndEditSupplierComponent,
    SupplierDetailDrawerComponent,
    SolarDynamicIcon,
  ],
  templateUrl: './suppliers-list-table.component.html',
})
export class SuppliersListTableComponent {
  @Input() drawerOpen!: WritableSignal<boolean>

  readonly MagnifierBold = MagnifierBold
  readonly Pen2Bold = Pen2Bold
  readonly EyeBold = EyeBold
  readonly MenuDotsBold = MenuDotsBold
  readonly DangerTriangleBold = DangerTriangleBold

  readonly columns = [
    { id: 'fornecedor',   label: 'Fornecedor' },
    { id: 'contacto',    label: 'Contacto' },
    { id: 'localizacao', label: 'Localização' },
    { id: 'avaliacao',   label: 'Avaliação' },
    { id: 'situacao',    label: 'Estado', align: 'center' as const },
    { id: 'acoes',       label: '',        align: 'right' as const },
  ]

  readonly statusOptions = [
    { label: 'Todos os estados', value: '' },
    { label: 'Activo',           value: 'ATIVO' },
    { label: 'Inactivo',         value: 'INATIVO' },
  ]

  readonly ratingFilterOptions = [
    { label: 'Todas as avaliações', value: '' },
    { label: 'Excelente (≥ 8)',    value: 'excelente' },
    { label: 'Regular (5–7)',       value: 'regular' },
    { label: 'Risco (< 5)',         value: 'risco' },
  ]

  readonly mockData: ISupplier[] = [
    { id: 1, nomeEmpresarial: 'Logitech Global SA',     emailFinanceiro: '',                          telefone: '+351 912 345 678', cidade: 'Lisboa', distrito: 'Lisboa', classificacaoRisco: 9.2, situacao: 'ATIVO',   createdAt: '2024-01-15' },
    { id: 2, nomeEmpresarial: 'Office Depot Lda',       emailFinanceiro: 'compras@officedepot.pt',    telefone: '+351 210 987 654', cidade: 'Porto',  distrito: 'Porto',  classificacaoRisco: 6.4, situacao: 'ATIVO',   createdAt: '2024-02-10' },
    { id: 3, nomeEmpresarial: 'TechSupply Co.',         emailFinanceiro: 'financeiro@techsupply.com', telefone: '+351 229 111 222', cidade: 'Maia',   distrito: 'Porto',  classificacaoRisco: 3.8, situacao: 'INATIVO', createdAt: '2023-11-05' },
    { id: 4, nomeEmpresarial: 'Global Tech Solutions',  emailFinanceiro: 'finance@globaltech.com',    telefone: '+351 934 567 890', cidade: 'Lisboa', distrito: 'Lisboa', classificacaoRisco: 8.5, situacao: 'ATIVO',   createdAt: '2024-03-20' },
  ]

  readonly detailDrawerOpen  = signal(false)
  readonly deactivateOpen    = signal(false)
  readonly selectedSupplier  = signal<ISupplier | null>(null)
  readonly editingSupplier   = signal<ISupplier | null>(null)

  readonly searchTerm      = signal('')
  readonly filterSituacao  = signal('')
  readonly filterAvaliacao = signal('')

  readonly filtered = computed(() => {
    const term = this.searchTerm().toLowerCase()
    const sit  = this.filterSituacao()
    const aval = this.filterAvaliacao()

    return this.mockData.filter(s => {
      const matchTerm = !term ||
        s.nomeEmpresarial.toLowerCase().includes(term) ||
        (s.emailFinanceiro ?? '').toLowerCase().includes(term)
      const matchSit  = !sit  || s.situacao === sit
      const matchAval = !aval ||
        (aval === 'excelente' && s.classificacaoRisco >= 8) ||
        (aval === 'regular'   && s.classificacaoRisco >= 5 && s.classificacaoRisco < 8) ||
        (aval === 'risco'     && s.classificacaoRisco < 5)
      return matchTerm && matchSit && matchAval
    })
  })

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  }

  ratingLabel(v: number): string {
    if (v >= 8) return 'Excelente'
    if (v >= 5) return 'Regular'
    return 'Risco'
  }

  ratingBarColor(v: number): string {
    if (v >= 8) return 'bg-success-500'
    if (v >= 5) return 'bg-warning-500'
    return 'bg-error-500'
  }

  ratingTextColor(v: number): string {
    if (v >= 8) return 'text-success-600 dark:text-success-400'
    if (v >= 5) return 'text-warning-600 dark:text-warning-400'
    return 'text-error-600 dark:text-error-400'
  }

  openEdit(s: ISupplier): void {
    this.editingSupplier.set(s)
    this.drawerOpen.set(true)
  }

  openDetail(s: ISupplier): void {
    this.selectedSupplier.set(s)
    this.detailDrawerOpen.set(true)
  }

  openDeactivate(s: ISupplier): void {
    this.selectedSupplier.set(s)
    this.deactivateOpen.set(true)
  }

  onDrawerChange(open: boolean): void {
    this.drawerOpen.set(open)
    if (!open) this.editingSupplier.set(null)
  }
}
