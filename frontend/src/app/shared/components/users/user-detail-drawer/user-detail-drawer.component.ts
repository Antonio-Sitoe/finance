import { Component, inject, Input, Output, EventEmitter } from '@angular/core'
import { DrawerComponent } from '../../ui/drawer/drawer.component'
import { BadgeComponent } from '../../ui/badge/badge.component'
import { IUsuario } from '@/shared/interfaces/users.dto'
import { PROFILE, SITUATION } from '@/shared/interfaces/enum.dto'
import { ProfilePipe } from '@/shared/pipe/profile.pipe'
import { SituationPipe } from '@/shared/pipe/situatuin.pipe'
import { AvatarTextComponent } from '@/shared/components/ui/avatar/avatar-text.component'
import {
  SolarDynamicIcon,
  InfoCircleBold,
  ClockCircleBold,
  AddCircleBold,
  KeyMinimalisticBold,
  Pen2Bold,
} from '@solar-icons/angular'

type BadgeColor = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'light'

@Component({
  selector: 'app-user-detail-drawer',
  imports: [
    DrawerComponent,
    BadgeComponent,
    ProfilePipe,
    SituationPipe,
    AvatarTextComponent,
    SolarDynamicIcon,
  ],
  templateUrl: './user-detail-drawer.component.html',
})
export class UserDetailDrawerComponent {
  readonly InfoCircleBold = InfoCircleBold
  readonly ClockCircleBold = ClockCircleBold
  readonly AddCircleBold = AddCircleBold
  readonly KeyMinimalisticBold = KeyMinimalisticBold
  readonly Pen2Bold = Pen2Bold
  @Input() user: IUsuario | null = null

  readonly SITUATION = SITUATION
  @Input() open = false
  @Output() openChange = new EventEmitter<boolean>()
  @Output() edit = new EventEmitter<IUsuario>()

  statusColor(situacao: string): BadgeColor {
    if (situacao === SITUATION.ATIVO) return 'success'
    return 'error'
  }

  roleColor(perfil: string): BadgeColor {
    if (perfil === PROFILE.ADMIN) return 'primary'
    return 'light'
  }

  formatDate(date: string): string {
    if (!date) return ''
    return new Date(date).toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  handleEditUser(user: IUsuario | null): void {
    if (user) {
      this.openChange.emit(false)
      this.edit.emit(user)
    }
  }
}
