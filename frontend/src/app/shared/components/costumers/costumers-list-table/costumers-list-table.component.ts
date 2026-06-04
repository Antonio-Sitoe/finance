import { Component, inject, Output, EventEmitter } from '@angular/core'
import { DatePipe } from '@angular/common'
import { Router } from '@angular/router'
import {
  DataTableComponent,
  ColumnDef,
} from '@/shared/components/ui/datatable/datatable'
import { BadgeComponent } from '@/shared/components/ui/badge/badge.component'
import { CheckboxComponent } from '@/shared/components/ui/input/checkbox.component'
import { InputFieldComponent } from '@/shared/components/ui/input/input-field.component'
import { SelectComponent } from '@/shared/components/ui/select/select.component'
import { SolarDynamicIcon } from '@solar-icons/angular'
import { CustomerFacadeService } from '@/shared/services/customers/customer.listing.service'
import { ICustomerDTO } from '@/shared/interfaces/costumers.dto'
import { CUSTOMERS_COLUMNS } from '@/shared/constants/customers.columns'

@Component({
  selector: 'app-costumers-list-table',
  imports: [
    DatePipe,
    DataTableComponent,
    BadgeComponent,
    CheckboxComponent,
    InputFieldComponent,
    SelectComponent,
    SolarDynamicIcon,
  ],
  templateUrl: './costumers-list-table.component.html',
})
export class CostumersListTableComponent {
  private readonly router = inject(Router)
  readonly facade = inject(CustomerFacadeService)
  readonly columns: ColumnDef[] = CUSTOMERS_COLUMNS

  @Output() editClick = new EventEmitter<ICustomerDTO>()
  @Output() detailClick = new EventEmitter<ICustomerDTO>()

  openContacts = (customer: number) =>
    this.router.navigate(['/costumers', customer, 'contacts'])
}
