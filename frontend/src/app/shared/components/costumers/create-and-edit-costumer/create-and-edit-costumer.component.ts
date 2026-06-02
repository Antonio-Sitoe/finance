import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
} from "@angular/core";
import { NgClass } from "@angular/common";
import { DrawerComponent } from "@/shared/components/ui/drawer/drawer.component";
import { LabelComponent } from "@/shared/components/ui/label/label.component";
import { InputFieldComponent } from "@/shared/components/ui/input/input-field.component";
import { SwitchComponent } from "@/shared/components/ui/input/switch.component";
import { ButtonComponent } from "@/shared/components/ui/button/button.component";
import {
  SolarDynamicIcon,
  BuildingsBold,
  MapPointBold,
  StarBold,
} from "@solar-icons/angular";

@Component({
  selector: "app-create-and-edit-costumer",
  imports: [
    NgClass,
    DrawerComponent,
    LabelComponent,
    InputFieldComponent,
    SwitchComponent,
    ButtonComponent,
    SolarDynamicIcon,
  ],
  templateUrl: "./create-and-edit-costumer.component.html",
})
export class CreateAndEditCostumerComponent {
  readonly BuildingsBold = BuildingsBold;
  readonly MapPointBold = MapPointBold;
  readonly StarBold = StarBold;

  @Input() open = false;
  @Input() isEditing = false;
  @Output() openChange = new EventEmitter<boolean>();

  readonly selectedRating = signal(0);
  readonly hoverRating = signal(0);
  readonly isActive = signal(true);

  readonly riskLabel = computed(() => {
    const r = this.selectedRating();
    if (r === 0) return "Normal";
    if (r <= 2) return "Baixo";
    if (r === 3) return "Médio";
    return "Alto";
  });

  readonly riskLabelClass = computed(() => {
    const r = this.selectedRating();
    if (r >= 4)
      return "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500";
    if (r === 3)
      return "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400";
    return "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-white/80";
  });

  setRating(value: number): void {
    this.selectedRating.set(value);
  }
}
