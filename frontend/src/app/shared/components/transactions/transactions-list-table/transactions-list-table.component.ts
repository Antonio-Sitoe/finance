import { Component, EventEmitter, inject, Output } from '@angular/core'
import { ITransaction } from '@/shared/interfaces/transactions.dto'
import { DataTableComponent } from '@/shared/components/ui/datatable/datatable'
import { BadgeComponent } from '@/shared/components/ui/badge/badge.component'
import { InputFieldComponent } from '@/shared/components/ui/input/input-field.component'
import { SelectComponent } from '@/shared/components/ui/select/select.component'
import { TransactionsFacadeService } from '@/shared/services/transactions/transactions.facade.service'
import { TRANSACTIONS_COLUMNS } from '@/shared/constants/transactions.columns'
import { SolarDynamicIcon } from '@solar-icons/angular'

@Component({
  selector: 'app-transactions-list-table',
  imports: [
    DataTableComponent,
    BadgeComponent,
    InputFieldComponent,
    SelectComponent,
    SolarDynamicIcon,
  ],
  templateUrl: './transactions-list-table.component.html',
})
export class TransactionsListTableComponent {
  readonly facade = inject(TransactionsFacadeService)
  readonly columns = TRANSACTIONS_COLUMNS

  @Output() editClick = new EventEmitter<ITransaction>()
  @Output() detailClick = new EventEmitter<ITransaction>()
  @Output() deleteClick = new EventEmitter<ITransaction>()
}
