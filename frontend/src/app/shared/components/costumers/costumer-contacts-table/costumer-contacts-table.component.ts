import { Component, inject } from '@angular/core'
import { DataTableComponent } from '@/shared/components/ui/datatable/datatable'
import { BadgeComponent } from '@/shared/components/ui/badge/badge.component'
import { AvatarTextComponent } from '@/shared/components/ui/avatar/avatar-text.component'
import { InputFieldComponent } from '@/shared/components/ui/input/input-field.component'
import { SelectComponent } from '@/shared/components/ui/select/select.component'
import { SolarDynamicIcon } from '@solar-icons/angular'
import { CostumerContactsFacadeService } from '@/shared/services/contactos/costumer-contacts.facade.service'
import { COSTUMER_CONTACTS_COLUMNS } from '@/shared/constants/customers.contacts.columns'

@Component({
  selector: 'app-costumer-contacts-table',
  imports: [
    DataTableComponent,
    BadgeComponent,
    AvatarTextComponent,
    InputFieldComponent,
    SelectComponent,
    SolarDynamicIcon,
  ],
  templateUrl: './costumer-contacts-table.component.html',
})
export class CostumerContactsTableComponent {
  readonly facade = inject(CostumerContactsFacadeService)
  readonly columns = COSTUMER_CONTACTS_COLUMNS
}
