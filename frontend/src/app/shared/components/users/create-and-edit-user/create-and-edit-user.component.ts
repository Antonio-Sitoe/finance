import {
  Input,
  Output,
  inject,
  signal,
  computed,
  Component,
  OnChanges,
  EventEmitter,
  SimpleChanges,
} from "@angular/core";

import { SelectComponent } from "@/shared/components/ui/select/select.component";

import { LabelComponent } from "@/shared/components/ui/label/label.component";
import { DrawerComponent } from "@/shared/components/ui/drawer/drawer.component";
import { SwitchComponent } from "@/shared/components/ui/input/switch.component";
import { ButtonComponent } from "@/shared/components/ui/button/button.component";
import { UsersFormService } from "@/shared/services/users/users.form.service";
import { SolarDynamicIcon } from "@solar-icons/angular";
import { UserFacadeService } from "@/shared/services/users/users.facade.service";
import { ReactiveFormsModule } from "@angular/forms";
import { InputFieldComponent } from "@/shared/components/ui/input/input-field.component";
import { EyeBold, EyeClosedBold } from "@solar-icons/angular";

@Component({
  selector: "app-create-and-edit-user",
  imports: [
    DrawerComponent,
    LabelComponent,
    SelectComponent,
    SwitchComponent,
    ButtonComponent,
    SolarDynamicIcon,
    InputFieldComponent,
    ReactiveFormsModule,
  ],
  templateUrl: "./create-and-edit-user.component.html",
  providers: [UsersFormService],
})
export class CreateAndEditUserComponent implements OnChanges {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  readonly EyeBold = EyeBold;
  readonly EyeClosedBold = EyeClosedBold;

  readonly facade = inject(UserFacadeService);
  readonly userForm = inject(UsersFormService);

  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);

  readonly isEditing = computed(() => !!this.facade.editingUser());

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["open"]?.currentValue === true) {
      const user = this.facade.editingUser();
      if (user) {
        this.userForm.initEdit(user);
      } else {
        this.userForm.initCreate();
      }
      this.showPassword.set(false);
      this.showConfirmPassword.set(false);
    }
  }

  close(): void {
    this.openChange.emit(false);
  }

  submit(): void {
    this.userForm.submit().subscribe({ next: () => this.close() });
  }
}
