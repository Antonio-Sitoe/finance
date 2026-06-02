import { Component } from '@angular/core'
import { PageHeaderComponent } from '@/shared/components/common/page-header/page-header.component'
import { CardStatComponent } from '@/shared/components/common/card-stat/card-stat.component'
import { ContactsListTableComponent } from '@/shared/components/contacts/contacts-list-table/contacts-list-table.component'

@Component({
  selector: 'app-contacts',
  imports: [PageHeaderComponent, CardStatComponent, ContactsListTableComponent],
  templateUrl: './contacts.component.html',
})
export class ContactsComponent {}
