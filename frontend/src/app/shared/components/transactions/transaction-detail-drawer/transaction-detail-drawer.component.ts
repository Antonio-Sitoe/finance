import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core'
import { ITransaction } from '@/shared/interfaces/transactions.dto'
import { DrawerComponent } from '@/shared/components/ui/drawer/drawer.component'
import { BadgeComponent } from '@/shared/components/ui/badge/badge.component'
import { TransactionsFacadeService } from '@/shared/services/transactions/transactions.facade.service'
import { TransactionApiService } from '@/shared/services/transactions/transaction.api.service'
import { ToastService } from '@/shared/services/toast.service'
import { SolarDynamicIcon } from '@solar-icons/angular'

@Component({
  selector: 'app-transaction-detail-drawer',
  imports: [DrawerComponent, BadgeComponent, SolarDynamicIcon],
  templateUrl: './transaction-detail-drawer.component.html',
})
export class TransactionDetailDrawerComponent implements OnChanges {
  @Input() transaction: ITransaction | null = null
  @Input() open = false
  @Output() openChange = new EventEmitter<boolean>()
  @Output() edit = new EventEmitter<ITransaction>()
  @Output() deleted = new EventEmitter<void>()

  readonly facade = inject(TransactionsFacadeService)
  private readonly api = inject(TransactionApiService)
  private readonly toast = inject(ToastService)

  readonly isToggling = signal(false)
  readonly isDeleting = signal(false)
  readonly localSituacao = signal<'PAGO' | 'PENDENTE'>('PENDENTE')

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transaction']?.currentValue) {
      this.localSituacao.set(changes['transaction'].currentValue.situacao)
    }
  }

  get isPago(): boolean {
    return this.localSituacao() === 'PAGO'
  }

  toggleSituacao(): void {
    if (!this.transaction || this.isToggling()) return
    this.isToggling.set(true)
    const loadingId = this.toast.loading('A actualizar estado...')
    this.api.toggleSituacao(this.transaction.id).subscribe({
      next: (res) => {
        this.toast.dismiss(loadingId)
        this.toast.success(res.mensagem || 'Estado actualizado')
        this.localSituacao.set(res.situacao)
        this.facade.refresh()
        this.isToggling.set(false)
      },
      error: (err) => {
        this.toast.dismiss(loadingId)
        this.toast.error('Falha', err?.error?.message || 'Erro ao actualizar estado')
        this.isToggling.set(false)
      },
    })
  }

  handleEdit(): void {
    if (this.transaction) {
      this.openChange.emit(false)
      this.edit.emit(this.transaction)
    }
  }

  handleDelete(): void {
    if (!this.transaction || this.isDeleting()) return
    this.isDeleting.set(true)
    const loadingId = this.toast.loading('A eliminar lançamento...')
    this.api.delete(this.transaction.id).subscribe({
      next: () => {
        this.toast.dismiss(loadingId)
        this.toast.success('Lançamento eliminado')
        this.facade.refresh()
        this.isDeleting.set(false)
        this.openChange.emit(false)
        this.deleted.emit()
      },
      error: (err) => {
        this.toast.dismiss(loadingId)
        this.toast.error('Falha', err?.error?.message || 'Erro ao eliminar lançamento')
        this.isDeleting.set(false)
      },
    })
  }
}
