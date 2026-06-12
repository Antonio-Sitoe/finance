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
import { ICategory } from '@/shared/interfaces/categories.dto'
import { DrawerComponent } from '@/shared/components/ui/drawer/drawer.component'
import { LabelComponent } from '@/shared/components/ui/label/label.component'
import { InputFieldComponent } from '@/shared/components/ui/input/input-field.component'
import { TextAreaComponent } from '@/shared/components/ui/input/text-area.component'
import { CheckboxComponent } from '@/shared/components/ui/input/checkbox.component'
import { SwitchComponent } from '@/shared/components/ui/input/switch.component'
import { SelectComponent, SelectOption } from '@/shared/components/ui/select/select.component'
import { ButtonComponent } from '@/shared/components/ui/button/button.component'
import { CategoryFormService } from '@/shared/services/categories/category.form.service'
import { CategoryApiService } from '@/shared/services/categories/category.api.service'
import { CategoriesFacadeService } from '@/shared/services/categories/categories.facade.service'
import { ToastService } from '@/shared/services/toast.service'
import { SolarDynamicIcon } from '@solar-icons/angular'

const NO_PARENT_OPTION: SelectOption = {
  label: 'Sem categoria pai (raiz)',
  value: '',
}

@Component({
  selector: 'app-create-and-edit-category',
  imports: [
    DrawerComponent,
    LabelComponent,
    InputFieldComponent,
    TextAreaComponent,
    CheckboxComponent,
    SwitchComponent,
    SelectComponent,
    ButtonComponent,
    SolarDynamicIcon,
    ReactiveFormsModule,
  ],
  templateUrl: './create-and-edit-category.component.html',
  providers: [CategoryFormService],
})
export class CreateAndEditCategoryComponent implements OnChanges {
  @Input() open = false
  @Input() category: ICategory | null = null
  @Output() openChange = new EventEmitter<boolean>()

  readonly toast = inject(ToastService)
  readonly facade = inject(CategoriesFacadeService)
  readonly formService = inject(CategoryFormService)
  readonly api = inject(CategoryApiService)
  readonly form = this.formService.form
  readonly isEditing = computed(() => !!this.category)
  readonly isLoading = signal(false)
  readonly parentOptions = signal<SelectOption[]>([NO_PARENT_OPTION])

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue === true) {
      this.loadParentOptions()
      if (this.category) {
        this.form.patchValue({
          nome: this.category.nome,
          debito: this.category.debito,
          credito: this.category.credito,
          categoriaPaiId: this.category.categoriaPaiId
            ? String(this.category.categoriaPaiId)
            : '',
          descricao: this.category.descricao ?? '',
          situacao: this.category.situacao === 'ATIVO',
        })
      } else {
        this.form.reset({
          debito: false,
          credito: false,
          categoriaPaiId: '',
          situacao: true,
        })
      }
    }
  }

  private loadParentOptions(): void {
    this.api.getAllOptions().subscribe({
      next: (categories) => {
        const options = categories
          .filter((c) => c.id !== this.category?.id)
          .map((c) => ({ label: c.nome, value: String(c.id) }))
        this.parentOptions.set([NO_PARENT_OPTION, ...options])
      },
      error: (err) => {
        console.error('Erro ao carregar categorias pai', err)
      },
    })
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched()
      return
    }
    this.isLoading.set(true)
    const payload = this.formService.getPayload()

    const request$ = this.category
      ? this.api.update(this.category.id, payload)
      : this.api.create(payload)

    request$.subscribe({
      next: (response) => {
        this.toast.success(
          this.isEditing()
            ? 'Categoria atualizada: ' + response.nome
            : 'Categoria criada: ' + response.nome,
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
          : body?.message || error?.message || 'Erro ao gravar categoria'
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

  hasTipoError(): boolean {
    return this.formService.hasTipoError()
  }

  getError(field: string): string {
    return this.formService.getError(field)
  }
}
