import { Component, inject, Input, signal, WritableSignal } from '@angular/core'
import { UserFacadeService } from '@/shared/services/users/users.facade.service'
import { IUsuario } from '@/shared/interfaces/users.dto'
import { DataTableComponent } from '@/shared/components/ui/datatable/datatable'
import { BadgeComponent } from '@/shared/components/ui/badge/badge.component'
import { AvatarTextComponent } from '@/shared/components/ui/avatar/avatar-text.component'
import { CheckboxComponent } from '@/shared/components/ui/input/checkbox.component'
import { InputFieldComponent } from '@/shared/components/ui/input/input-field.component'
import { SelectComponent } from '@/shared/components/ui/select/select.component'
import { CreateAndEditUserComponent } from '@/shared/components/users/create-and-edit-user/create-and-edit-user.component'
import { UserDetailDrawerComponent } from '@/shared/components/users/user-detail-drawer/user-detail-drawer.component'
import { ProfilePipe } from '@/shared/pipe/profile.pipe'
import { DatePipe } from '@angular/common'
import { SituationPipe } from '@/shared/pipe/situatuin.pipe'
import {
  SolarDynamicIcon,
  MagnifierBold,
  Pen2Bold,
  EyeBold,
} from '@solar-icons/angular'

@Component({
  imports: [
    DatePipe,
    ProfilePipe,
    SituationPipe,
    DataTableComponent,
    BadgeComponent,
    AvatarTextComponent,
    CheckboxComponent,
    InputFieldComponent,
    SelectComponent,
    CreateAndEditUserComponent,
    UserDetailDrawerComponent,
    SolarDynamicIcon,
  ],
  selector: 'app-users-list-table',
  templateUrl: './users-list-table-component.html',
})
export class UsersListTableComponent {
  readonly MagnifierBold = MagnifierBold
  readonly Pen2Bold = Pen2Bold
  readonly EyeBold = EyeBold
  @Input() drawerOpen!: WritableSignal<boolean>

  readonly facade = inject(UserFacadeService)

  readonly detailDrawerOpen = signal(false)
  readonly selectedUser = signal<IUsuario | null>(null)

  openEdit(user: IUsuario): void {
    this.facade.setEditingUser(user)
    this.drawerOpen.set(true)
  }

  openDetail(user: IUsuario): void {
    this.selectedUser.set(user)
    this.detailDrawerOpen.set(true)
  }
}
