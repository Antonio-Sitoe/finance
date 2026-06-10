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
import { ISupplier } from '@/shared/interfaces/suppliers.dto'
import { DrawerComponent } from '@/shared/components/ui/drawer/drawer.component'
import { LabelComponent } from '@/shared/components/ui/label/label.component'
import { InputFieldComponent } from '@/shared/components/ui/input/input-field.component'
import { SwitchComponent } from '@/shared/components/ui/input/switch.component'
import { ButtonComponent } from '@/shared/components/ui/button/button.component'
import { SupplierFormService } from '@/shared/services/suppliers/supplier.form.service'
import { SupplierApiService } from '@/shared/services/suppliers/supplier.api.service'
import { SuppliersFacadeService } from '@/shared/services/suppliers/suppliers.facade.service'
import { ToastService } from '@/shared/services/toast.service'
import { SolarDynamicIcon, BuildingsBold } from '@solar-icons/angular'

@Component({
  selector: 'app-create-and-edit-supplier',
  imports: [
    DrawerComponent,
    LabelComponent,
    InputFieldComponent,
    SwitchComponent,
    ButtonComponent,
    SolarDynamicIcon,
    ReactiveFormsModule,
  ],
  templateUrl: './create-and-edit-supplier.component.html',
  providers: [SupplierFormService],
})
export class CreateAndEditSupplierComponent implements OnChanges {
  @Input() open = false
  @Input() supplier: ISupplier | null = null
  @Output() openChange = new EventEmitter<boolean>()

  readonly BuildingsBold = BuildingsBold

  readonly toast = inject(ToastService)
  readonly facade = inject(SuppliersFacadeService)
  readonly formService = inject(SupplierFormService)
  readonly api = inject(SupplierApiService)
  readonly form = this.formService.form
  readonly isEditing = computed(() => !!this.supplier)
  readonly isLoading = signal(false)

  get nota(): number {
    return Number(this.form.get('nota')?.value ?? 0)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue === true) {
      if (this.supplier) {
        this.form.patchValue({
          nomeEmpresarial: this.supplier.nomeEmpresarial,
          email: this.supplier.email ?? '',
          telefone: this.supplier.telefone ?? '',
          website: this.supplier.website ?? '',
          endereco: this.supplier.endereco ?? '',
          numero: this.supplier.numero ?? '',
          complemento: this.supplier.complemento ?? '',
          bairro: this.supplier.bairro ?? '',
          cidade: this.supplier.cidade ?? '',
          estado: this.supplier.estado ?? '',
          nota: this.supplier.nota ?? 5,
          situacao: this.supplier.situacao === 'ATIVO',
        })
      } else {
        this.form.reset({ nota: 5, situacao: true })
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

    const request$ = this.supplier
      ? this.api.update(this.supplier.id, payload)
      : this.api.create(payload)

    request$.subscribe({
      next: (response) => {
        this.toast.success(
          this.isEditing()
            ? 'Fornecedor atualizado: ' + response.nomeEmpresarial
            : 'Fornecedor criado: ' + response.nomeEmpresarial,
        )
        this.facade.refresh()
        this.facade.getAnalytics()
        this.isLoading.set(false)
        this.close()
      },
      error: (error) => {
        const body = error?.error
        const fieldErrors: Record<string, string> | undefined = body?.fieldErrors
        const msg = fieldErrors
          ? Object.values(fieldErrors).join(', ')
          : body?.message || error?.message || 'Erro ao gravar fornecedor'
        this.toast.error('Falha', msg)
        this.isLoading.set(false)
      },
    })
  }

  setNota(value: number): void {
    this.form.get('nota')?.setValue(value)
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
