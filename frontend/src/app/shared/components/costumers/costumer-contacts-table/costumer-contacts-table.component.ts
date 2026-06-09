import { Component, inject, signal } from "@angular/core";
import { DataTableComponent } from "@/shared/components/ui/datatable/datatable";
import { BadgeComponent } from "@/shared/components/ui/badge/badge.component";
import { AvatarTextComponent } from "@/shared/components/ui/avatar/avatar-text.component";
import { InputFieldComponent } from "@/shared/components/ui/input/input-field.component";
import { SelectComponent } from "@/shared/components/ui/select/select.component";
import { SolarDynamicIcon } from "@solar-icons/angular";
import { CostumerContactsFacadeService } from "@/shared/services/contactos/costumer-contacts.facade.service";
import { COSTUMER_CONTACTS_COLUMNS } from "@/shared/constants/customers.contacts.columns";
import { CreateAndEditContactComponent } from "../../contacts/create-and-edit-contact/create-and-edit-contact.component";
import { ContactDetailDrawerComponent } from "../../contacts/contact-detail-drawer/contact-detail-drawer.component";
import { IContactDTO } from "@/shared/interfaces/contacts.dto";

@Component({
  selector: "app-costumer-contacts-table",
  imports: [
    BadgeComponent,
    SelectComponent,
    SolarDynamicIcon,
    DataTableComponent,
    AvatarTextComponent,
    InputFieldComponent,
    CreateAndEditContactComponent,
    ContactDetailDrawerComponent,
  ],
  templateUrl: "./costumer-contacts-table.component.html",
})
export class CostumerContactsTableComponent {
  readonly facade = inject(CostumerContactsFacadeService);
  readonly columns = COSTUMER_CONTACTS_COLUMNS;

  readonly drawerOpen = signal(false);
  readonly detailDrawerOpen = signal(false);
  readonly selectedContact = signal<IContactDTO | null>(null);

  openCreateDrawer(): void {
    this.selectedContact.set(null);
    this.drawerOpen.set(true);
  }

  openDetailDrawer(contact: IContactDTO): void {
    this.selectedContact.set(contact);
    this.detailDrawerOpen.set(true);
  }

  openEditDrawer(contact: IContactDTO): void {
    this.selectedContact.set(contact);
    this.drawerOpen.set(true);
  }

  onDrawerClose(open: boolean): void {
    this.drawerOpen.set(open);
    if (!open) this.facade.refresh();
  }
}
