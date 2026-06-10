import { Component, inject, signal } from "@angular/core";
import { PageHeaderComponent } from "@/shared/components/common/page-header/page-header.component";
import { CardStatComponent } from "@/shared/components/common/card-stat/card-stat.component";
import { ContactsListTableComponent } from "@/shared/components/contacts/contacts-list-table/contacts-list-table.component";
import { CreateAndEditContactComponent } from "@/shared/components/contacts/create-and-edit-contact/create-and-edit-contact.component";
import { ContactDetailDrawerComponent } from "@/shared/components/contacts/contact-detail-drawer/contact-detail-drawer.component";
import { IContactDTO } from "@/shared/interfaces/contacts.dto";
import { ContactsFacadeService } from "@/shared/services/contactos/contacts.facade.service";

@Component({
  imports: [
    PageHeaderComponent,
    CardStatComponent,
    ContactsListTableComponent,
    CreateAndEditContactComponent,
    ContactDetailDrawerComponent,
  ],
  templateUrl: "./contacts.component.html",
})
export class ContactsComponent {
  readonly facade = inject(ContactsFacadeService);

  readonly drawerOpen = signal(false);
  readonly detailDrawerOpen = signal(false);
  readonly selectedContact = signal<IContactDTO | null>(null);

  openNew(): void {
    this.selectedContact.set(null);
    this.drawerOpen.set(true);
  }

  openEdit(contact: IContactDTO): void {
    this.selectedContact.set(contact);
    this.detailDrawerOpen.set(false);
    this.drawerOpen.set(true);
  }

  openDetail(contact: IContactDTO): void {
    this.selectedContact.set(contact);
    this.detailDrawerOpen.set(true);
  }

  onDrawerClose(open: boolean): void {
    this.drawerOpen.set(open);
  }
}
