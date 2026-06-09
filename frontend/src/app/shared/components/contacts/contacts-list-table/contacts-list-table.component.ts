import { Component, inject, Output, EventEmitter } from "@angular/core";
import { DataTableComponent } from "@/shared/components/ui/datatable/datatable";
import { BadgeComponent } from "@/shared/components/ui/badge/badge.component";
import { AvatarTextComponent } from "@/shared/components/ui/avatar/avatar-text.component";
import { CheckboxComponent } from "@/shared/components/ui/input/checkbox.component";
import { InputFieldComponent } from "@/shared/components/ui/input/input-field.component";
import { SelectComponent } from "@/shared/components/ui/select/select.component";
import { IContactDTO } from "@/shared/interfaces/contacts.dto";
import { ContactsFacadeService } from "@/shared/services/contactos/contacts.facade.service";
import { CONTACTS_COLUMNS } from "@/shared/constants/contacts.columns";
import {
  SolarDynamicIcon,
  MagnifierBold,
  Pen2Bold,
  EyeBold,
} from "@solar-icons/angular";

@Component({
  selector: "app-contacts-list-table",
  imports: [
    DataTableComponent,
    BadgeComponent,
    AvatarTextComponent,
    CheckboxComponent,
    InputFieldComponent,
    SelectComponent,
    SolarDynamicIcon,
  ],
  templateUrl: "./contacts-list-table.component.html",
})
export class ContactsListTableComponent {
  readonly MagnifierBold = MagnifierBold;
  readonly Pen2Bold = Pen2Bold;
  readonly EyeBold = EyeBold;

  readonly facade = inject(ContactsFacadeService);
  readonly columns = CONTACTS_COLUMNS;

  @Output() editClick = new EventEmitter<IContactDTO>();
  @Output() detailClick = new EventEmitter<IContactDTO>();

  getEmpresaInitials(nome?: string): string {
    if (!nome) return "?";
    return nome.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  }
}
