import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  inject,
  SimpleChanges,
  OnChanges,
} from '@angular/core'
import { NgClass } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { DrawerComponent } from '@/shared/components/ui/drawer/drawer.component'
import { LabelComponent } from '@/shared/components/ui/label/label.component'
import { InputFieldComponent } from '@/shared/components/ui/input/input-field.component'
import { SwitchComponent } from '@/shared/components/ui/input/switch.component'
import { ButtonComponent } from '@/shared/components/ui/button/button.component'
import { SolarDynamicIcon } from '@solar-icons/angular'
import { CustumerFormService } from '@/shared/services/customers/custumer.form.service'
import { CustomerApiService } from '@/shared/services/customers/customer.api.service'
import { CustomerFacadeService } from '@/shared/services/customers/customer.listing.service'
import { ToastService } from '@/shared/services/toast.service'
import { ICustomerDTO } from '@/shared/interfaces/costumers.dto'

@Component({
  selector: 'app-create-and-edit-costumer',
  imports: [
    NgClass,
    ReactiveFormsModule,
    DrawerComponent,
    LabelComponent,
    InputFieldComponent,
    SwitchComponent,
    ButtonComponent,
    SolarDynamicIcon,
  ],
  templateUrl: './create-and-edit-costumer.component.html',
  providers: [CustumerFormService],
})
export class CreateAndEditCostumerComponent implements OnChanges {
  @Input() open = false
  @Input() customer: ICustomerDTO | null = null
  @Output() openChange = new EventEmitter<boolean>()

  readonly customerService = inject(CustumerFormService)
  readonly api = inject(CustomerApiService)
  readonly facade = inject(CustomerFacadeService)
  readonly toast = inject(ToastService)
  readonly isLoading = signal(false)
  readonly isEditing = computed(() => !!this.customer)
  readonly form = this.customerService.form
  readonly selectedRating = signal(0)
  readonly hoverRating = signal(0)

  readonly riskLabel = computed(() => {
    const r = this.selectedRating()
    if (r === 0) return 'Normal'
    if (r <= 2) return 'Baixo'
    if (r === 3) return 'Médio'
    return 'Alto'
  })

  readonly riskLabelClass = computed(() => {
    const r = this.selectedRating()
    if (r >= 4)
      return 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'
    if (r === 3)
      return 'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400'
    return 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-white/80'
  })

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched()
      return
    }
    this.isLoading.set(true)

    const formData = this.form.value
    const request$ = this.isEditing()
      ? this.api.updateCustomer(this.customer!.id, formData)
      : this.api.createCustomer(formData)

    request$.subscribe({
      next: (response) => {
        this.toast.success(
          this.isEditing()
            ? 'Cliente atualizado: ' + response.nomeEmpresarial
            : 'Cliente criado: ' + response.nomeEmpresarial,
        )
        this.facade.list.reload()
        this.openChange.emit(false)
        this.isLoading.set(false)
      },
      error: (error) => {
        const body = error?.error
        const fieldErrors: Record<string, string> | undefined =
          body?.fieldErrors
        const msg = fieldErrors
          ? Object.values(fieldErrors).join(', ')
          : body?.message || error?.message || 'Erro ao gravar cliente'
        this.toast.error('Falha', msg)
        this.isLoading.set(false)
      },
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue === true) {
      if (this.isEditing() && !!this.customer) {
        const stars = Math.round((this.customer.nota ?? 0) / 2)
        this.form.patchValue({
          ...this.customer,
          nota: this.customer.nota ?? 0,
        })
        this.selectedRating.set(stars)
      }
    }
  }

  isInvalid(field: string): boolean {
    return this.customerService.isInvalid(field)
  }

  getError(field: string): string {
    return this.customerService.getError(field)
  }
  setRating(stars: number): void {
    this.selectedRating.set(stars)
    this.form.patchValue({ nota: stars * 2 })
  }

  setActive(value: boolean): void {
    this.form.patchValue({ situacao: value ? 'ATIVO' : 'INATIVO' })
  }

  get isActive(): boolean {
    return this.form.get('situacao')?.value === 'ATIVO'
  }
}
