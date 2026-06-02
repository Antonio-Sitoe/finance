import { Component, Input, Output, EventEmitter } from "@angular/core";
import { DrawerComponent } from "@/shared/components/ui/drawer/drawer.component";
import { BadgeComponent } from "@/shared/components/ui/badge/badge.component";
import { AvatarTextComponent } from "@/shared/components/ui/avatar/avatar-text.component";
import { ICliente } from "@/shared/interfaces/costumers.dto";
import {
  SolarDynamicIcon,
  BuildingsBold,
  StarBold,
  LetterBold,
  PhoneCallingBold,
  GraphNewUpBold,
  MapPointBold,
  MapBold,
  UsersGroupRoundedBold,
  Pen2Bold,
  ForbiddenCircleBold,
} from "@solar-icons/angular";

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
  readonly BuildingsBold = BuildingsBold;
  readonly StarBold = StarBold;
  readonly LetterBold = LetterBold;
  readonly PhoneCallingBold = PhoneCallingBold;
  readonly GraphNewUpBold = GraphNewUpBold;
  readonly MapPointBold = MapPointBold;
  readonly MapBold = MapBold;
  readonly UsersGroupRoundedBold = UsersGroupRoundedBold;
  readonly Pen2Bold = Pen2Bold;
  readonly ForbiddenCircleBold = ForbiddenCircleBold;

  @Input() costumer: ICliente | null = null;
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() edit = new EventEmitter<ICliente>();

  handleEdit(): void {
    if (this.costumer) {
      this.openChange.emit(false);
      this.edit.emit(this.costumer);
    }
  }
}
