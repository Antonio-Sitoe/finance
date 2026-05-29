import { Component, inject, Input, signal, WritableSignal } from "@angular/core";
import { UserFacadeService } from "@/shared/services/users/users.facade.service";
import { IUsuario } from "@/shared/interfaces/users.dto";
import { DataTableComponent } from "@/shared/components/ui/datatable/datatable";
import { BadgeComponent } from "@/shared/components/ui/badge/badge.component";
import { AvatarTextComponent } from "@/shared/components/ui/avatar/avatar-text.component";
import { CheckboxComponent } from "@/shared/components/ui/input/checkbox.component";
import { InputFieldComponent } from "@/shared/components/ui/input/input-field.component";
import { SelectComponent } from "@/shared/components/ui/select/select.component";
import { CreateAndEditUserComponent } from "@/shared/components/users/create-and-edit-user/create-and-edit-user.component";
import { UserDetailDrawerComponent } from "@/shared/components/users/user-detail-drawer/user-detail-drawer.component";

@Component({
  selector: "app-users-list-table",
  imports: [
    DataTableComponent,
    BadgeComponent,
    AvatarTextComponent,
    CheckboxComponent,
    InputFieldComponent,
    SelectComponent,
    CreateAndEditUserComponent,
    UserDetailDrawerComponent,
  ],
  templateUrl: "./users-list-table-component.html",
})
export class UsersListTableComponent {
  @Input() drawerOpen!: WritableSignal<boolean>;

  readonly facade = inject(UserFacadeService);

  readonly detailDrawerOpen = signal(false);
  readonly selectedUser = signal<IUsuario | null>(null);

  openEdit(_user: IUsuario): void {
    this.drawerOpen.set(true);
  }

  openDetail(user: IUsuario): void {
    this.selectedUser.set(user);
    this.detailDrawerOpen.set(true);
  }
}
