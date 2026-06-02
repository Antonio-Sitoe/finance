import { Component, computed, Input, Output, EventEmitter, signal, OnChanges, SimpleChanges } from '@angular/core'
import { DrawerComponent } from '@/shared/components/ui/drawer/drawer.component'
import { LabelComponent } from '@/shared/components/ui/label/label.component'
import { InputFieldComponent } from '@/shared/components/ui/input/input-field.component'
import { SelectComponent } from '@/shared/components/ui/select/select.component'
import { SwitchComponent } from '@/shared/components/ui/input/switch.component'
import { ButtonComponent } from '@/shared/components/ui/button/button.component'
import { IContact } from '@/shared/interfaces/contacts.dto'
import {
  SolarDynamicIcon,
  UserRoundedBold,
  LetterBold,
  BuildingsBold,
  LockKeyholeMinimalisticBold,
} from '@solar-icons/angular'

@Component({
  selector: 'app-create-and-edit-contact',
  imports: [
    DrawerComponent,
    LabelComponent,
    InputFieldComponent,
    SelectComponent,
    SwitchComponent,
    ButtonComponent,
    SolarDynamicIcon,
  ],
  templateUrl: './create-and-edit-contact.component.html',
})
export class CreateAndEditContactComponent implements OnChanges {
  @Input() open = false
  @Input() contact: IContact | null = null
  @Output() openChange = new EventEmitter<boolean>()

  readonly UserRoundedBold = UserRoundedBold
  readonly LetterBold = LetterBold
  readonly BuildingsBold = BuildingsBold
  readonly LockKeyholeMinimalisticBold = LockKeyholeMinimalisticBold

  readonly isEditing = computed(() => !!this.contact)

  readonly nome = signal('')
  readonly cargo = signal('')
  readonly email = signal('')
  readonly telefone = signal('')
  readonly departamento = signal('')
  readonly empresa = signal('')
  readonly isAtivo = signal(true)

  readonly departamentosRapidos = ['Financeiro', 'Operações', 'TI', 'Compliance', 'Comercial', 'Jurídico']

  readonly departamentoOptions = [
    { label: 'Seleccionar departamento', value: '' },
    { label: 'Financeiro', value: 'Financeiro' },
    { label: 'Operações', value: 'Operações' },
    { label: 'TI', value: 'Tecnologia' },
    { label: 'Compliance', value: 'Compliance' },
    { label: 'Comercial', value: 'Comercial' },
    { label: 'Jurídico', value: 'Jurídico' },
    { label: 'Administrativo', value: 'Administrativo' },
    { label: 'Direção', value: 'Direção' },
    { label: 'Compras', value: 'Compras' },
  ]

  readonly empresaOptions = [
    { label: 'Seleccionar empresa', value: '' },
    { label: 'Global Trade Solutions S.A.', value: 'Global Trade Solutions S.A.' },
    { label: 'TechVision Lda.', value: 'TechVision Lda.' },
    { label: 'Construtora Norte S.A.', value: 'Construtora Norte S.A.' },
  ]

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue === true) {
      if (this.contact) {
        this.nome.set(this.contact.nome)
        this.cargo.set(this.contact.cargo)
        this.email.set(this.contact.email ?? '')
        this.telefone.set(this.contact.telefone ?? '')
        this.departamento.set(this.contact.departamento ?? '')
        this.empresa.set(this.contact.empresaNome ?? '')
        this.isAtivo.set(this.contact.situacao === 'ATIVO')
      } else {
        this.nome.set('')
        this.cargo.set('')
        this.email.set('')
        this.telefone.set('')
        this.departamento.set('')
        this.empresa.set('')
        this.isAtivo.set(true)
      }
    }
  }

  setDepartamento(value: string): void {
    this.departamento.set(value)
  }

  close(): void {
    this.openChange.emit(false)
  }
}
