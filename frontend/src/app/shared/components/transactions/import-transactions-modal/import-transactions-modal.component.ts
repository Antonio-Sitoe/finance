import { CommonModule } from '@angular/common'
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { SolarDynamicIcon } from '@solar-icons/angular'

import { ModalComponent } from '@/shared/components/ui/modal/modal.component'
import { TransactionApiService } from '@/shared/services/transactions/transaction.api.service'
import { TransactionsFacadeService } from '@/shared/services/transactions/transactions.facade.service'
import { ToastService } from '@/shared/services/toast.service'
import { CategoryApiService } from '@/shared/services/categories/category.api.service'
import { AccountApiService } from '@/shared/services/accounts/account.api.service'
import { CustomerApiService } from '@/shared/services/customers/customer.api.service'
import { SupplierApiService } from '@/shared/services/suppliers/supplier.api.service'
import { parseCsv } from '@/shared/config/csv/csv.util'
import {
  BULK_CSV_COLUMNS,
  IBulkRow,
  TipoLancamento,
} from '@/shared/interfaces/transactions.dto'

type ImportStep = 'upload' | 'review'

/** Opção de select (id numérico + rótulo). */
interface Option {
  id: number
  label: string
}

/** Linha editável: o modelo de importação + estado de UI (id e erro). */
interface EditableRow extends IBulkRow {
  _id: number
  _error?: string
}

@Component({
  selector: 'app-import-transactions-modal',
  imports: [CommonModule, FormsModule, SolarDynamicIcon, ModalComponent],
  templateUrl: './import-transactions-modal.component.html',
})
export class ImportTransactionsModalComponent {
  private readonly api = inject(TransactionApiService)
  private readonly facade = inject(TransactionsFacadeService)
  private readonly toast = inject(ToastService)
  private readonly categoryApi = inject(CategoryApiService)
  private readonly accountApi = inject(AccountApiService)
  private readonly customerApi = inject(CustomerApiService)
  private readonly supplierApi = inject(SupplierApiService)

  @Input() set open(value: boolean) {
    this._open.set(value)
    if (value) this.onOpen()
  }
  get open(): boolean {
    return this._open()
  }
  private readonly _open = signal(false)

  @Output() openChange = new EventEmitter<boolean>()

  readonly step = signal<ImportStep>('upload')
  readonly rows = signal<EditableRow[]>([])
  readonly submitting = signal(false)
  readonly dragActive = signal(false)
  readonly showOnlyErrors = signal(false)
  readonly fileName = signal<string>('')

  // ── Opções (selects com nomes) ──────────────────────────────────────────────
  readonly contaOptions = signal<Option[]>([])
  readonly categoriaOptions = signal<Option[]>([])
  readonly clienteOptions = signal<Option[]>([])
  readonly fornecedorOptions = signal<Option[]>([])
  private optionsLoaded = false

  private nextId = 1

  readonly tipoOptions: { value: TipoLancamento; label: string }[] = [
    { value: 'RECEITA', label: 'Receita' },
    { value: 'DESPESA', label: 'Despesa' },
  ]

  readonly columnsHint = BULK_CSV_COLUMNS.join(', ')

  // ── Derivados ────────────────────────────────────────────────────────────────
  get errorCount(): number {
    return this.rows().filter((r) => r._error).length
  }

  get invalidCount(): number {
    return this.rows().filter((r) => this.isRowInvalid(r)).length
  }

  get visibleRows(): EditableRow[] {
    return this.showOnlyErrors() ? this.rows().filter((r) => r._error) : this.rows()
  }

  // ── Validação client-side ─────────────────────────────────────────────────────
  isMissing(row: EditableRow, field: 'valor' | 'dataVencimento' | 'contaId' | 'categoriaId'): boolean {
    if (field === 'valor') return row.valor == null || row.valor <= 0
    return row[field] == null || (row[field] as unknown as string) === ''
  }

  isRowInvalid(row: EditableRow): boolean {
    return (
      this.isMissing(row, 'valor') ||
      this.isMissing(row, 'dataVencimento') ||
      this.isMissing(row, 'contaId') ||
      this.isMissing(row, 'categoriaId')
    )
  }

  /** Classe de uma célula (borda vermelha quando obrigatória e vazia). */
  cellClass(missing: boolean): string {
    const base =
      'rounded-lg bg-transparent px-2 py-1.5 text-[13px] text-gray-800 focus:outline-none focus:ring-2 dark:bg-gray-900 dark:text-white/90'
    return missing
      ? `${base} border border-error-400 focus:ring-error-500/10 dark:border-error-500`
      : `${base} border border-gray-200 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700`
  }

  /** Garante que o id importado aparece no select mesmo que não esteja na lista. */
  withCurrent(options: Option[], id: number | null): Option[] {
    if (id == null || options.some((o) => o.id === id)) return options
    return [...options, { id, label: `#${id}` }]
  }

  // ── Abertura / opções ─────────────────────────────────────────────────────────
  private onOpen(): void {
    this.reset()
    if (!this.optionsLoaded) this.loadOptions()
  }

  private loadOptions(): void {
    this.optionsLoaded = true
    this.categoryApi.getAllOptions().subscribe({
      next: (cats) =>
        this.categoriaOptions.set(cats.map((c) => ({ id: c.id, label: c.nome }))),
    })
    this.accountApi.getAll({ page: 1, size: 100 }).subscribe({
      next: (res) =>
        this.contaOptions.set(res.content.map((a) => ({ id: a.id, label: a.nome }))),
    })
    this.customerApi.getAllCostumers().subscribe({
      next: (customers) =>
        this.clienteOptions.set(
          customers.map((c) => ({ id: c.id, label: c.nomeEmpresarial }))
        ),
    })
    this.supplierApi.getAll({ page: 1, size: 100 }).subscribe({
      next: (res) =>
        this.fornecedorOptions.set(
          res.content.map((s) => ({ id: s.id, label: s.nomeEmpresarial }))
        ),
    })
  }

  // ── Upload ─────────────────────────────────────────────────────────────────────
  onDragOver(event: DragEvent): void {
    event.preventDefault()
    this.dragActive.set(true)
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault()
    this.dragActive.set(false)
  }

  onDrop(event: DragEvent): void {
    event.preventDefault()
    this.dragActive.set(false)
    const file = event.dataTransfer?.files?.[0]
    if (file) this.readFile(file)
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (file) this.readFile(file)
    input.value = '' // permite reimportar o mesmo ficheiro
  }

  private readFile(file: File): void {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      this.toast.error('Ficheiro inválido', 'Selecione um ficheiro .csv')
      return
    }
    this.fileName.set(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      const rows = this.matrixToRows(parseCsv(String(reader.result ?? '')))
      if (!rows.length) {
        this.toast.error('CSV vazio', 'Não foram encontradas linhas válidas.')
        return
      }
      this.rows.set(rows)
      this.step.set('review')
    }
    reader.onerror = () => this.toast.error('Erro ao ler o ficheiro', 'Tente novamente.')
    reader.readAsText(file)
  }

  /** Converte a matriz CSV em linhas editáveis, ignorando o cabeçalho. */
  private matrixToRows(matrix: string[][]): EditableRow[] {
    if (!matrix.length) return []
    const first = matrix[0].map((c) => c.trim().toLowerCase())
    const looksLikeHeader =
      first.includes('descricao') ||
      first.includes('descrição') ||
      isNaN(Number(matrix[0][1]))
    const dataRows = looksLikeHeader ? matrix.slice(1) : matrix
    return dataRows.map((cols) => this.colsToRow(cols))
  }

  private colsToRow(cols: string[]): EditableRow {
    const at = (i: number) => (cols[i] ?? '').trim()
    const num = (i: number) => (at(i) === '' ? null : Number(at(i)))
    const date = (i: number) => {
      const v = at(i)
      return v === '' ? null : v.slice(0, 10)
    }
    const tipoRaw = at(9).toUpperCase()
    const tipo: TipoLancamento | null =
      tipoRaw === 'RECEITA' || tipoRaw === 'DESPESA' ? tipoRaw : null

    return {
      _id: this.nextId++,
      descricao: at(0) || null,
      valor: num(1),
      totalParcelas: num(2),
      dataLancamento: date(3),
      dataVencimento: date(4),
      contaId: num(5),
      categoriaId: num(6),
      clienteId: num(7),
      fornecedorId: num(8),
      tipo,
    }
  }

  downloadTemplate(): void {
    const header = BULK_CSV_COLUMNS.join(',')
    const exemplo = 'Renda do escritório,15000,,2026-06-01,2026-06-30,1,1,,,DESPESA'
    const blob = new Blob([`${header}\n${exemplo}\n`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'modelo-lancamentos.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Edição da tabela ───────────────────────────────────────────────────────────
  addRow(): void {
    this.rows.update((rows) => [
      ...rows,
      {
        _id: this.nextId++,
        descricao: null,
        valor: null,
        totalParcelas: null,
        dataLancamento: null,
        dataVencimento: null,
        contaId: null,
        categoriaId: null,
        clienteId: null,
        fornecedorId: null,
        tipo: null,
      },
    ])
  }

  removeRow(id: number): void {
    this.rows.update((rows) => rows.filter((r) => r._id !== id))
  }

  // ── Submissão ───────────────────────────────────────────────────────────────────
  submit(): void {
    const current = this.rows()
    if (!current.length) {
      this.toast.warning('Nada para importar', 'Adicione pelo menos uma linha.')
      return
    }
    if (this.invalidCount > 0) {
      this.toast.warning(
        'Campos obrigatórios em falta',
        `${this.invalidCount} linha(s) sem valor, vencimento, conta ou categoria.`
      )
      return
    }

    const payload: IBulkRow[] = current.map((r) => ({
      descricao: r.descricao,
      valor: r.valor,
      totalParcelas: r.totalParcelas,
      dataLancamento: this.toIso(r.dataLancamento),
      dataVencimento: this.toIso(r.dataVencimento),
      contaId: r.contaId,
      categoriaId: r.categoriaId,
      clienteId: r.clienteId,
      fornecedorId: r.fornecedorId,
      tipo: r.tipo,
    }))

    this.submitting.set(true)
    this.api.bulkJson(payload).subscribe({
      next: (res) => {
        this.submitting.set(false)
        const erros = res.erros ?? []
        const criados = res.criados?.length ?? 0

        if (!erros.length) {
          this.toast.success('Importação concluída', `${criados} lançamento(s) criado(s).`)
          this.facade.refresh()
          this.closeModal()
          return
        }

        // Mantém só as linhas com erro, anotadas com o motivo (posição 1-based).
        const motivoPorPos = new Map(erros.map((e) => [e.posicao, e.motivo]))
        const restantes = current
          .map((row, i) => ({ row, motivo: motivoPorPos.get(i + 1) }))
          .filter((x) => x.motivo)
          .map((x) => ({ ...x.row, _error: x.motivo }))

        this.rows.set(restantes)
        this.showOnlyErrors.set(false)

        if (criados > 0) {
          this.toast.warning(
            'Importação parcial',
            `${criados} criado(s), ${erros.length} com erro. Corrija e reenvie.`
          )
          this.facade.refresh()
        } else {
          this.toast.error(
            'Nenhum lançamento criado',
            `${erros.length} linha(s) com erro. Corrija e reenvie.`
          )
        }
      },
      error: () => {
        this.submitting.set(false)
        this.toast.error('Falha na importação', 'Tente novamente mais tarde.')
      },
    })
  }

  /** yyyy-MM-dd → ISO LocalDateTime; mantém valores já com hora. */
  private toIso(value: string | null): string | null {
    if (!value) return null
    return value.length === 10 ? `${value}T00:00:00` : value
  }

  // ── Fecho / reset ───────────────────────────────────────────────────────────────
  closeModal(): void {
    this._open.set(false)
    this.openChange.emit(false)
  }

  backToUpload(): void {
    this.step.set('upload')
    this.rows.set([])
    this.fileName.set('')
  }

  private reset(): void {
    this.step.set('upload')
    this.rows.set([])
    this.fileName.set('')
    this.showOnlyErrors.set(false)
    this.submitting.set(false)
  }
}
