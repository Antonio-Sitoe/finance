import {
  Component,
  inject,
  Input,
  OnInit,
  Output,
  EventEmitter,
  signal,
} from '@angular/core'
import { DatePipe } from '@angular/common'
import { DrawerComponent } from '@/shared/components/ui/drawer/drawer.component'
import { BadgeComponent } from '@/shared/components/ui/badge/badge.component'
import { AvatarTextComponent } from '@/shared/components/ui/avatar/avatar-text.component'
import { SwitchComponent } from '@/shared/components/ui/input/switch.component'
import { ICustomerDTO } from '@/shared/interfaces/costumers.dto'
import { SITUATION } from '@/shared/interfaces/enum.dto'
import { SolarDynamicIcon } from '@solar-icons/angular'
import { CustomerApiService } from '@/shared/services/customers/customer.api.service'
import { CustomerFacadeService } from '@/shared/services/customers/customer.listing.service'
import { ToastService } from '@/shared/services/toast.service'

@Component({
  selector: 'app-costumer-detail-drawer',
  imports: [
    DatePipe,
    DrawerComponent,
    BadgeComponent,
    AvatarTextComponent,
    SolarDynamicIcon,
    SwitchComponent,
  ],
  templateUrl: './costumer-detail-drawer.component.html',
})
export class CostumerDetailDrawerComponent implements OnInit {
  @Input() costumer: ICustomerDTO | null = null
  @Input() open = false
  @Output() openChange = new EventEmitter<boolean>()
  @Output() edit = new EventEmitter<ICustomerDTO>()

  private readonly api = inject(CustomerApiService)
  private readonly facade = inject(CustomerFacadeService)
  private readonly toast = inject(ToastService)

  readonly isLoading = signal(false)
  readonly situacao = signal<SITUATION>(SITUATION.ATIVO)

  ngOnInit(): void {
    const situacao = this.costumer?.situacao
    this.situacao.set(
      situacao === SITUATION.INATIVO ? SITUATION.INATIVO : SITUATION.ATIVO,
    )
  }

  get isActive(): boolean {
    return this.situacao() === SITUATION.ATIVO
  }

  get stars(): number {
    return Math.round((this.costumer?.nota ?? 0) / 2)
  }

  toggleSituacao(): void {
    if (!this.costumer || this.isLoading()) return
    const loadingId = this.toast.loading('A mudar o estado do cliente...')
    const nova =
      this.situacao() === SITUATION.ATIVO ? SITUATION.INATIVO : SITUATION.ATIVO
    this.isLoading.set(true)
    this.api.updateSituacao(this.costumer.id, nova).subscribe({
      next: () => {
        this.toast.dismiss(loadingId)
        this.toast.success('Estado mudado')
        this.situacao.set(nova)
        this.facade.list.reload()
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

  handleEdit(): void {
    if (this.costumer) {
      this.openChange.emit(false)
      this.edit.emit(this.costumer)
    }
  }
}
