import { Component, inject, signal } from '@angular/core'
import { PageHeaderComponent } from '@/shared/components/common/page-header/page-header.component'
import { CardStatComponent } from '@/shared/components/common/card-stat/card-stat.component'
import { ContactsListTableComponent } from '@/shared/components/contacts/contacts-list-table/contacts-list-table.component'
import { CreateAndEditContactComponent } from '@/shared/components/contacts/create-and-edit-contact/create-and-edit-contact.component'
import { ContactDetailDrawerComponent } from '@/shared/components/contacts/contact-detail-drawer/contact-detail-drawer.component'
import { Router } from '@angular/router'
import { IContact } from '@/shared/interfaces/contacts.dto'

@Component({
  imports: [
    PageHeaderComponent,
    CardStatComponent,
    ContactsListTableComponent,
    ContactDetailDrawerComponent,
    CreateAndEditContactComponent,
  ],
  templateUrl: './contacts.component.html',
})
export class ContactsComponent {
  private readonly router = inject(Router)

  readonly drawerOpen = signal(false)
  readonly detailDrawerOpen = signal(false)
  readonly deactivateOpen = signal(false)
  readonly selectedContact = signal<IContact | null>(null)

  openEdit(contact?: IContact): void {
    this.selectedContact.set(contact ?? null)
    this.detailDrawerOpen.set(false)
    this.deactivateOpen.set(false)
    this.drawerOpen.set(true)
  }

  openDetail(contact: IContact): void {
    this.selectedContact.set(contact)
    this.detailDrawerOpen.set(true)
  }
  openDeactivate(contact: IContact): void {
    this.selectedContact.set(contact)
    this.detailDrawerOpen.set(false)
    this.deactivateOpen.set(true)
  }
}
