import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core'
import { DrawerComponent } from '../../ui/drawer/drawer.component'
import { BadgeComponent } from '../../ui/badge/badge.component'
import { SwitchComponent } from '@/shared/components/ui/input/switch.component'
import { IUsuario } from '@/shared/interfaces/users.dto'
import { PROFILE, SITUATION } from '@/shared/interfaces/enum.dto'
import { ProfilePipe } from '@/shared/pipe/profile.pipe'
import { SituationPipe } from '@/shared/pipe/situatuin.pipe'
import { AvatarTextComponent } from '@/shared/components/ui/avatar/avatar-text.component'
import { UsersApiService } from '@/shared/services/users/users.api.service'
import { UserFacadeService } from '@/shared/services/users/users.facade.service'
import { ToastService } from '@/shared/services/toast.service'
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
    SwitchComponent,
    ProfilePipe,
    SituationPipe,
    AvatarTextComponent,
    SolarDynamicIcon,
  ],
  templateUrl: './user-detail-drawer.component.html',
})
export class UserDetailDrawerComponent implements OnInit {
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

  private readonly api = inject(UsersApiService)
  private readonly facade = inject(UserFacadeService)
  private readonly toast = inject(ToastService)

  readonly isLoading = signal(false)
  readonly situacao = signal<SITUATION>(SITUATION.ATIVO)

  ngOnInit(): void {
    const situacao = this.user?.situacao
    this.situacao.set(
      situacao === SITUATION.INATIVO ? SITUATION.INATIVO : SITUATION.ATIVO,
    )
  }

  get isActive(): boolean {
    return this.situacao() === SITUATION.ATIVO
  }

  toggleSituacao(): void {
    if (!this.user || this.isLoading()) return
    const loadingId = this.toast.loading('A mudar o estado do utilizador...')
    this.isLoading.set(true)
    this.api.toggleSituacao(this.user.id).subscribe({
      next: (res) => {
        this.toast.dismiss(loadingId)
        this.toast.success(res.mensagem || 'Estado mudado')
        this.situacao.set(
          res.situacao === SITUATION.INATIVO
            ? SITUATION.INATIVO
            : SITUATION.ATIVO,
        )
        this.facade.list.reload()
        this.facade.getUserAnalytics()
        this.isLoading.set(false)
      },
      error: (err) => {
        this.toast.dismiss(loadingId)
        const msg = err?.error?.message || 'Erro ao atualizar estado'
        this.toast.error('Falha', msg)
        this.isLoading.set(false)
      },
    })
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
}
