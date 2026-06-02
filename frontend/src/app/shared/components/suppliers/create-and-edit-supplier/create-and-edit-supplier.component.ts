import {
  Component,
  computed,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
  EventEmitter,
} from '@angular/core'
import { ISupplier } from '@/shared/interfaces/suppliers.dto'
import { DrawerComponent } from '@/shared/components/ui/drawer/drawer.component'
import { LabelComponent } from '@/shared/components/ui/label/label.component'
import { InputFieldComponent } from '@/shared/components/ui/input/input-field.component'
import { SwitchComponent } from '@/shared/components/ui/input/switch.component'
import { ButtonComponent } from '@/shared/components/ui/button/button.component'
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
  ],
  templateUrl: './create-and-edit-supplier.component.html',
})
export class CreateAndEditSupplierComponent implements OnChanges {
  @Input() open = false
  @Input() supplier: ISupplier | null = null
  @Output() openChange = new EventEmitter<boolean>()

  readonly BuildingsBold = BuildingsBold

  readonly isEditing = computed(() => !!this.supplier)

  readonly nomeEmpresarial = signal('')
  readonly emailFinanceiro = signal('')
  readonly telefone = signal('')
  readonly website = signal('')
  readonly rua = signal('')
  readonly numero = signal('')
  readonly complemento = signal('')
  readonly bairro = signal('')
  readonly cidade = signal('')
  readonly distrito = signal('')
  readonly ratingValue = signal(5)
  readonly isActive = signal(true)

  readonly ratingLabel = computed(() => {
    const v = this.ratingValue()
    if (v < 5) return { text: 'Risco Elevado', cls: 'text-error-500' }
    if (v < 8) return { text: 'Regular', cls: 'text-warning-500' }
    return { text: 'Excelente', cls: 'text-success-500' }
  })

  readonly ratingBarColor = computed(() => {
    const v = this.ratingValue()
    if (v < 5) return 'bg-error-500'
    if (v < 8) return 'bg-warning-500'
    return 'bg-success-500'
  })

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue === true) {
      if (this.supplier) {
        this.nomeEmpresarial.set(this.supplier.nomeEmpresarial)
        this.emailFinanceiro.set(this.supplier.emailFinanceiro ?? '')
        this.telefone.set(this.supplier.telefone ?? '')
        this.website.set(this.supplier.website ?? '')
        this.rua.set(this.supplier.rua ?? '')
        this.numero.set(this.supplier.numero ?? '')
        this.complemento.set(this.supplier.complemento ?? '')
        this.bairro.set(this.supplier.bairro ?? '')
        this.cidade.set(this.supplier.cidade ?? '')
        this.distrito.set(this.supplier.distrito ?? '')
        this.ratingValue.set(this.supplier.classificacaoRisco)
        this.isActive.set(this.supplier.situacao === 'ATIVO')
      } else {
        this.nomeEmpresarial.set('')
        this.emailFinanceiro.set('')
        this.telefone.set('')
        this.website.set('')
        this.rua.set('')
        this.numero.set('')
        this.complemento.set('')
        this.bairro.set('')
        this.cidade.set('')
        this.distrito.set('')
        this.ratingValue.set(5)
        this.isActive.set(true)
      }
    }
  }

  close(): void {
    this.openChange.emit(false)
  }

  submit(): void {
    this.close()
  }
}
