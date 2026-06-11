import { Component, EventEmitter, inject, Output } from '@angular/core'
import { DatePipe } from '@angular/common'
import { IAccount } from '@/shared/interfaces/accounts.dto'
import { DataTableComponent } from '@/shared/components/ui/datatable/datatable'
import { BadgeComponent } from '@/shared/components/ui/badge/badge.component'
import { InputFieldComponent } from '@/shared/components/ui/input/input-field.component'
import { SelectComponent } from '@/shared/components/ui/select/select.component'
import { AccountsFacadeService } from '@/shared/services/accounts/accounts.facade.service'
import { ACCOUNTS_COLUMNS } from '@/shared/constants/accounts.columns'
import { SolarDynamicIcon } from '@solar-icons/angular'

@Component({
  selector: 'app-accounts-list-table',
  imports: [
    DataTableComponent,
    BadgeComponent,
    InputFieldComponent,
    SelectComponent,
    SolarDynamicIcon,
    DatePipe,
  ],
  templateUrl: './accounts-list-table.component.html',
})
export class AccountsListTableComponent {
  readonly facade = inject(AccountsFacadeService)
  readonly columns = ACCOUNTS_COLUMNS

  @Output() editClick = new EventEmitter<IAccount>()
  @Output() detailClick = new EventEmitter<IAccount>()
}
