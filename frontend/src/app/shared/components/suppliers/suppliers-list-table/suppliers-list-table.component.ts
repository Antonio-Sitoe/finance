import { Component, EventEmitter, inject, Output } from '@angular/core'
import { ISupplier } from '@/shared/interfaces/suppliers.dto'
import { DataTableComponent } from '@/shared/components/ui/datatable/datatable'
import { BadgeComponent } from '@/shared/components/ui/badge/badge.component'
import { InputFieldComponent } from '@/shared/components/ui/input/input-field.component'
import { SelectComponent } from '@/shared/components/ui/select/select.component'
import { SuppliersFacadeService } from '@/shared/services/suppliers/suppliers.facade.service'
import { SUPPLIERS_COLUMNS } from '@/shared/constants/suppliers.columns'
import {
  SolarDynamicIcon,
  MagnifierBold,
  Pen2Bold,
  EyeBold,
} from '@solar-icons/angular'

@Component({
  selector: 'app-suppliers-list-table',
  imports: [
    DataTableComponent,
    BadgeComponent,
    InputFieldComponent,
    SelectComponent,
    SolarDynamicIcon,
  ],
  templateUrl: './suppliers-list-table.component.html',
})
export class SuppliersListTableComponent {
  readonly MagnifierBold = MagnifierBold
  readonly Pen2Bold = Pen2Bold
  readonly EyeBold = EyeBold

  readonly facade = inject(SuppliersFacadeService)
  readonly columns = SUPPLIERS_COLUMNS

  @Output() editClick = new EventEmitter<ISupplier>()
  @Output() detailClick = new EventEmitter<ISupplier>()

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  }
}
