import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { IAccount } from '@/shared/interfaces/accounts.dto'
import { DrawerComponent } from '@/shared/components/ui/drawer/drawer.component'
import { LabelComponent } from '@/shared/components/ui/label/label.component'
import { InputFieldComponent } from '@/shared/components/ui/input/input-field.component'
import { TextAreaComponent } from '@/shared/components/ui/input/text-area.component'
import { SwitchComponent } from '@/shared/components/ui/input/switch.component'
import { ButtonComponent } from '@/shared/components/ui/button/button.component'
import { AccountFormService } from '@/shared/services/accounts/account.form.service'
import { AccountApiService } from '@/shared/services/accounts/account.api.service'
import { AccountsFacadeService } from '@/shared/services/accounts/accounts.facade.service'
import { ToastService } from '@/shared/services/toast.service'
import { SolarDynamicIcon, CardBold } from '@solar-icons/angular'

@Component({
  selector: 'app-create-and-edit-account',
  imports: [
    DrawerComponent,
    LabelComponent,
    InputFieldComponent,
    TextAreaComponent,
    SwitchComponent,
    ButtonComponent,
    SolarDynamicIcon,
    ReactiveFormsModule,
  ],
  templateUrl: './create-and-edit-account.component.html',
  providers: [AccountFormService],
})
export class CreateAndEditAccountComponent implements OnChanges {
  @Input() open = false
  @Input() account: IAccount | null = null
  @Output() openChange = new EventEmitter<boolean>()

  readonly CardBold = CardBold

  readonly toast = inject(ToastService)
  readonly facade = inject(AccountsFacadeService)
  readonly formService = inject(AccountFormService)
  readonly api = inject(AccountApiService)
  readonly form = this.formService.form
  readonly isEditing = computed(() => !!this.account)
  readonly isLoading = signal(false)

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue === true) {
      if (this.account) {
        this.form.patchValue({
          nome: this.account.nome,
          agencia: this.account.agencia,
          contaCorrente: this.account.contaCorrente,
          observacao: this.account.observacao,
          situacao: this.account.situacao === 'ATIVO',
        })
      } else {
        this.form.reset({ situacao: true })
      }
    }
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched()
      return
    }
    this.isLoading.set(true)
    const payload = this.formService.getPayload()

    const request$ = this.account
      ? this.api.update(this.account.id, payload)
      : this.api.create(payload)

    request$.subscribe({
      next: (response) => {
        this.toast.success(
          this.isEditing()
            ? 'Conta atualizada: ' + response.nome
            : 'Conta criada: ' + response.nome,
        )
        this.facade.refresh()
        this.isLoading.set(false)
        this.close()
      },
      error: (error) => {
        const body = error?.error
        const fieldErrors: Record<string, string> | undefined = body?.fieldErrors
        const msg = fieldErrors
          ? Object.values(fieldErrors).join(', ')
          : body?.message || error?.message || 'Erro ao gravar conta'
        this.toast.error('Falha', msg)
        this.isLoading.set(false)
      },
    })
  }

  close(): void {
    this.openChange.emit(false)
  }

  isInvalid(field: string): boolean {
    return this.formService.isInvalid(field)
  }

  getError(field: string): string {
    return this.formService.getError(field)
  }
}
