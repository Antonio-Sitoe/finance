import { Component, Input, Output, EventEmitter } from "@angular/core";
import { DrawerComponent } from "@/shared/components/ui/drawer/drawer.component";
import { BadgeComponent } from "@/shared/components/ui/badge/badge.component";
import { AvatarTextComponent } from "@/shared/components/ui/avatar/avatar-text.component";
import { ICustomerDTO } from "@/shared/interfaces/costumers.dto";
import { SolarDynamicIcon } from "@solar-icons/angular";

@Component({
  selector: "app-costumer-detail-drawer",
  imports: [
    DrawerComponent,
    BadgeComponent,
    AvatarTextComponent,
    SolarDynamicIcon,
  ],
  templateUrl: "./costumer-detail-drawer.component.html",
})
export class CostumerDetailDrawerComponent {
  @Input() costumer: ICustomerDTO | null = null;
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() edit = new EventEmitter<ICustomerDTO>();

  handleEdit(): void {
    if (this.costumer) {
      this.openChange.emit(false);
      this.edit.emit(this.costumer);
    }
  }
}
