import { Component, Input, Output, EventEmitter } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DrawerComponent } from "@/shared/components/ui/drawer/drawer.component";
import { BadgeComponent } from "@/shared/components/ui/badge/badge.component";
import { AvatarTextComponent } from "@/shared/components/ui/avatar/avatar-text.component";
import { IContactDTO } from "@/shared/interfaces/contacts.dto";
import {
  SolarDynamicIcon,
  Pen2Bold,
  BuildingsBold,
  PhoneCallingBold,
  LetterBold,
  ClockCircleBold,
} from "@solar-icons/angular";

@Component({
  selector: "app-contact-detail-drawer",
  imports: [
    RouterModule,
    DrawerComponent,
    BadgeComponent,
    AvatarTextComponent,
    SolarDynamicIcon,
  ],
  templateUrl: "./contact-detail-drawer.component.html",
})
export class ContactDetailDrawerComponent {
  @Input() contact: IContactDTO | null = null;
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() edit = new EventEmitter<IContactDTO>();

  readonly Pen2Bold = Pen2Bold;
  readonly BuildingsBold = BuildingsBold;
  readonly PhoneCallingBold = PhoneCallingBold;
  readonly LetterBold = LetterBold;
  readonly ClockCircleBold = ClockCircleBold;

  getEmpresaInitials(nome?: string): string {
    if (!nome) return "?";
    return nome.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  }

  formatDate(date: string): string {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  handleEdit(): void {
    if (this.contact) {
      this.openChange.emit(false);
      this.edit.emit(this.contact);
    }
  }
}
