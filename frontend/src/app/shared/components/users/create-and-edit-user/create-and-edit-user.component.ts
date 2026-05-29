import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DrawerComponent } from "@/shared/components/ui/drawer/drawer.component";
import { LabelComponent } from "@/shared/components/ui/label/label.component";
import { InputFieldComponent } from "@/shared/components/ui/input/input-field.component";
import { SelectComponent, SelectOption } from "@/shared/components/ui/select/select.component";
import { SwitchComponent } from "@/shared/components/ui/input/switch.component";
import { ButtonComponent } from "@/shared/components/ui/button/button.component";
import { SolarDynamicIcon } from "@solar-icons/angular";
import { EyeBold, EyeClosedBold } from "@solar-icons/angular";

@Component({
  selector: "app-create-and-edit-user",
  imports: [
    DrawerComponent,
    LabelComponent,
    InputFieldComponent,
    SelectComponent,
    SwitchComponent,
    ButtonComponent,
    SolarDynamicIcon,
  ],
  templateUrl: "./create-and-edit-user.component.html",
})
export class CreateAndEditUserComponent {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  readonly EyeBold = EyeBold;
  readonly EyeClosedBold = EyeClosedBold;

  showPassword = false;
  showConfirmPassword = false;
  password = "";
  accountActive = true;

  roleOptions: SelectOption[] = [
    { value: "Administrador", label: "Administrador" },
    { value: "Gestor", label: "Gestor" },
    { value: "Operador", label: "Operador" },
    { value: "Auditor", label: "Auditor" },
  ];

  selectedRole = "";

  get passwordStrength(): number {
    const p = this.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  }

  get strengthInfo(): { text: string; textColor: string; barColor: string } {
    const s = this.passwordStrength;
    if (s <= 1) return { text: "Fraca",  textColor: "text-error-500",   barColor: "bg-error-500" };
    if (s === 2) return { text: "Média",  textColor: "text-warning-500", barColor: "bg-warning-500" };
    if (s === 3) return { text: "Boa",    textColor: "text-brand-500",   barColor: "bg-brand-500" };
    return              { text: "Forte",  textColor: "text-success-500", barColor: "bg-success-500" };
  }
}
