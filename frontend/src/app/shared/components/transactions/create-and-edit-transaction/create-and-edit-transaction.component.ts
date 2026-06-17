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
import { toSignal } from '@angular/core/rxjs-interop'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import {
  ITransactionParceladoPayload,
  TipoLancamento,
} from '@/shared/interfaces/transactions.dto'
import { ITransaction } from '@/shared/interfaces/transactions.dto'
import { DrawerComponent } from '@/shared/components/ui/drawer/drawer.component'
import { LabelComponent } from '@/shared/components/ui/label/label.component'
import { InputFieldComponent } from '@/shared/components/ui/input/input-field.component'
import { TextAreaComponent } from '@/shared/components/ui/input/text-area.component'
import { SelectComponent, SelectOption } from '@/shared/components/ui/select/select.component'
import { DatePickerComponent } from '@/shared/components/ui/date-picker/date-picker.component'
import { ButtonComponent } from '@/shared/components/ui/button/button.component'
import { TransactionFormService } from '@/shared/services/transactions/transaction.form.service'
import { TransactionApiService } from '@/shared/services/transactions/transaction.api.service'
import { TransactionsFacadeService } from '@/shared/services/transactions/transactions.facade.service'
import { CategoryApiService } from '@/shared/services/categories/category.api.service'
import { AccountApiService } from '@/shared/services/accounts/account.api.service'
import { CustomerApiService } from '@/shared/services/customers/customer.api.service'
import { SupplierApiService } from '@/shared/services/suppliers/supplier.api.service'
import { ToastService } from '@/shared/services/toast.service'
import { SolarDynamicIcon } from '@solar-icons/angular'

export type TransactionDrawerMode = 'normal' | 'parcelado'

const PARCELA_OPTIONS: SelectOption[] = [
  { label: '2x', value: '2' },
  { label: '3x', value: '3' },
  { label: '4x', value: '4' },
  { label: '5x', value: '5' },
  { label: '6x', value: '6' },
  { label: '8x', value: '8' },
  { label: '10x', value: '10' },
  { label: '12x', value: '12' },
  { label: '18x', value: '18' },
  { label: '24x', value: '24' },
]

@Component({
  selector: 'app-create-and-edit-transaction',
  imports: [
    DrawerComponent,
    LabelComponent,
    InputFieldComponent,
    TextAreaComponent,
    SelectComponent,
    DatePickerComponent,
    ButtonComponent,
    SolarDynamicIcon,
    ReactiveFormsModule,
  ],
  templateUrl: './create-and-edit-transaction.component.html',
  providers: [TransactionFormService],
})
export class CreateAndEditTransactionComponent implements OnChanges {
  @Input() open = false
  @Input() transaction: ITransaction | null = null
  @Input() initialMode: TransactionDrawerMode = 'normal'
  @Output() openChange = new EventEmitter<boolean>()
  @Output() saved = new EventEmitter<void>()

  readonly toast = inject(ToastService)
  readonly facade = inject(TransactionsFacadeService)
  readonly formService = inject(TransactionFormService)
  readonly api = inject(TransactionApiService)
  private readonly categoryApi = inject(CategoryApiService)
  private readonly accountApi = inject(AccountApiService)
  private readonly customerApi = inject(CustomerApiService)
  private readonly supplierApi = inject(SupplierApiService)

  // ── Shared state ─────────────────────────────────────────
  readonly tipo = signal<TipoLancamento>('DESPESA')
  readonly mode = signal<TransactionDrawerMode>('normal')
  readonly isLoading = signal(false)
  readonly isEditing = computed(() => !!this.transaction)

  // ── Normal form ───────────────────────────────────────────
  readonly normalForm = this.formService.form

  // ── Parcelado form ────────────────────────────────────────
  readonly parceladoForm = new FormGroup({
    descricao: new FormControl('', [Validators.required]),
    valorTotal: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    totalParcela: new FormControl('3', [Validators.required]),
    dataVencimento: new FormControl('', [Validators.required]),
    contaId: new FormControl('', [Validators.required]),
    categoriaId: new FormControl('', [Validators.required]),
    clienteId: new FormControl(''),
    fornecedorId: new FormControl(''),
    observacoes: new FormControl(''),
  })

  // Convert parcelado form valueChanges to a signal for reactive computed()
  private readonly parceladoValues = toSignal(this.parceladoForm.valueChanges, {
    initialValue: this.parceladoForm.value,
  })

  readonly totalParcelaNum = computed(() => Number(this.parceladoValues().totalParcela ?? 3))
  readonly valorTotalNum = computed(() => Number(this.parceladoValues().valorTotal ?? 0))
  readonly dataVencParcelado = computed(() => this.parceladoValues().dataVencimento ?? '')

  readonly valorParcela = computed(() => {
    const n = this.totalParcelaNum()
    return n > 0 ? this.valorTotalNum() / n : 0
  })

  readonly installmentPreview = computed(() => {
    const n = this.totalParcelaNum()
    const base = this.dataVencParcelado()
    const vp = this.valorParcela()
    if (!base || !n || !vp) return []
    const d = new Date(base + 'T00:00:00')
    return Array.from({ length: n }, (_, i) => {
      const dt = new Date(d)
      dt.setMonth(dt.getMonth() + i)
      return {
        num: i + 1,
        valor: vp,
        date: dt.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      }
    })
  })

  // ── Options ───────────────────────────────────────────────
  readonly contaOptions = signal<SelectOption[]>([])
  readonly categoriaOptions = signal<SelectOption[]>([])
  readonly clienteOptions = signal<SelectOption[]>([])
  readonly fornecedorOptions = signal<SelectOption[]>([])
  readonly parcelaOptions = PARCELA_OPTIONS

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue === true) {
      this.loadOptions()
      if (this.transaction) {
        this.mode.set('normal')
        this.tipo.set(this.transaction.tipo)
        this.formService.patchFromTransaction(this.transaction)
      } else {
        this.mode.set(this.initialMode)
        this.tipo.set('DESPESA')
        this.formService.reset()
        this.parceladoForm.reset({ totalParcela: '3' })
      }
    }
  }

  private loadOptions(): void {
    this.categoryApi.getAllOptions().subscribe({
      next: (cats) =>
        this.categoriaOptions.set(cats.map((c) => ({ label: c.nome, value: String(c.id) }))),
    })
    this.accountApi.getAll({ page: 1, size: 100 }).subscribe({
      next: (res) =>
        this.contaOptions.set(res.content.map((a) => ({ label: a.nome, value: String(a.id) }))),
    })
    this.customerApi.getAllCostumers().subscribe({
      next: (customers) =>
        this.clienteOptions.set(
          customers.map((c) => ({ label: c.nomeEmpresarial, value: String(c.id) }))
        ),
    })
    this.supplierApi.getAll({ page: 1, size: 100 }).subscribe({
      next: (res) =>
        this.fornecedorOptions.set(
          res.content.map((s) => ({ label: s.nomeEmpresarial, value: String(s.id) }))
        ),
    })
  }

  setMode(m: TransactionDrawerMode): void {
    this.mode.set(m)
  }

  setTipo(tipo: TipoLancamento): void {
    this.tipo.set(tipo)
    this.formService.setTipo(tipo)
    this.parceladoForm.patchValue({ clienteId: '', fornecedorId: '' })
  }

  onSubmit(): void {
    if (this.mode() === 'normal') {
      this.submitNormal()
    } else {
      this.submitParcelado()
    }
  }

  private submitNormal(): void {
    if (!this.normalForm.valid) {
      this.normalForm.markAllAsTouched()
      return
    }
    this.isLoading.set(true)
    const payload = this.formService.getPayload()
    const request$ = this.transaction
      ? this.api.update(this.transaction.id, payload)
      : this.api.create(payload)

    request$.subscribe({
      next: (res) => {
        this.toast.success(
          this.isEditing() ? 'Lançamento actualizado: ' + res.descricao : 'Lançamento criado: ' + res.descricao
        )
        this.facade.refresh()
        this.isLoading.set(false)
        this.saved.emit()
        this.close()
      },
      error: (err) => {
        this.handleError(err)
        this.isLoading.set(false)
      },
    })
  }

  private submitParcelado(): void {
    if (!this.parceladoForm.valid) {
      this.parceladoForm.markAllAsTouched()
      return
    }
    this.isLoading.set(true)
    const v = this.parceladoForm.value
    const payload: ITransactionParceladoPayload = {
      tipo: this.tipo(),
      descricao: v.descricao!,
      valorTotal: Number(v.valorTotal),
      totalParcela: Number(v.totalParcela),
      dataVencimento: `${v.dataVencimento}T00:00:00`,
      contaId: Number(v.contaId),
      categoriaId: Number(v.categoriaId),
      clienteId: v.clienteId ? Number(v.clienteId) : undefined,
      fornecedorId: v.fornecedorId ? Number(v.fornecedorId) : undefined,
    }
    this.api.createParcelado(payload).subscribe({
      next: (res) => {
        this.toast.success(`${res.length} lançamentos criados com sucesso`)
        this.facade.refresh()
        this.isLoading.set(false)
        this.saved.emit()
        this.close()
      },
      error: (err) => {
        this.handleError(err)
        this.isLoading.set(false)
      },
    })
  }

  private handleError(err: unknown): void {
    const body = (err as { error?: { fieldErrors?: Record<string, string>; message?: string } })?.error
    const fieldErrors = body?.fieldErrors
    const msg = fieldErrors
      ? Object.values(fieldErrors).join(', ')
      : body?.message || 'Erro ao gravar lançamento'
    this.toast.error('Falha', msg)
  }

  close(): void {
    this.openChange.emit(false)
  }

  isNormalInvalid(field: string): boolean {
    return this.formService.isInvalid(field)
  }

  getNormalError(field: string): string {
    return this.formService.getError(field)
  }

  isParceladoInvalid(field: string): boolean {
    const c = this.parceladoForm.get(field)
    return !!(c?.invalid && (c.dirty || c.touched))
  }

  formatValor(v: number): string {
    return new Intl.NumberFormat('pt-MZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(v)
  }
}
