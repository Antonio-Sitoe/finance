import { Component, inject, Input, Output, EventEmitter } from '@angular/core'
import { DrawerComponent } from '../../ui/drawer/drawer.component'
import { BadgeComponent } from '../../ui/badge/badge.component'
import { ModalComponent } from '../../ui/modal/modal.component'
import { IUsuario } from '@/shared/interfaces/users.dto'
import { PROFILE, SITUATION } from '@/shared/interfaces/enum.dto'
import { ProfilePipe } from '@/shared/pipe/profile.pipe'
import { SituationPipe } from '@/shared/pipe/situatuin.pipe'
import { AvatarTextComponent } from '@/shared/components/ui/avatar/avatar-text.component'
import { UserFacadeService } from '@/shared/services/users/users.facade.service'

type BadgeColor = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'light'

@Component({
  selector: 'app-user-detail-drawer',
  imports: [
    DrawerComponent,
    BadgeComponent,
    ModalComponent,
    ProfilePipe,
    SituationPipe,
    AvatarTextComponent,
  ],
  templateUrl: './user-detail-drawer.component.html',
})
export class UserDetailDrawerComponent {
  @Input() user: IUsuario | null = null

  readonly SITUATION = SITUATION
  @Input() open = false
  @Output() openChange = new EventEmitter<boolean>()
  @Output() edit = new EventEmitter<IUsuario>()
  @Output() deactivate = new EventEmitter<IUsuario>()

  private facade = inject(UserFacadeService)

  confirmModalOpen = false
  loading = false

  get isActive(): boolean {
    return this.user?.situacao === SITUATION.ATIVO
  }

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

  handleDeativate(): void {
    if (this.user) {
      this.confirmModalOpen = true
    }
  }

  confirmToggleStatus(): void {
    if (!this.user || this.loading) return
    this.loading = true
    this.facade.toggleUserStatus(this.user).subscribe({
      next: (updated) => {
        this.loading = false
        this.confirmModalOpen = false
        this.facade.list.reload()
        this.deactivate.emit(updated)
        this.openChange.emit(false)
      },
      error: () => {
        this.loading = false
      },
    })
  }
}
