import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core'
import { ITransaction, ITransactionAnalytics } from '@/shared/interfaces/transactions.dto'
import { ListStore } from '@/shared/config/listing/list.store'
import { TransactionApiService } from './transaction.api.service'
import {
  TRANSACTION_SITUACAO_OPTIONS,
  TRANSACTION_TIPO_OPTIONS,
} from '@/shared/constants/transactions.columns'

@Injectable({ providedIn: 'root' })
export class TransactionsFacadeService {
  private readonly api = inject(TransactionApiService)

  readonly list = new ListStore<ITransaction>()

  readonly analytics = signal<ITransactionAnalytics>({
    total: 0,
    valorReceita: 0,
    valorDespesa: 0,
    saldo: 0,
  })

  readonly searchTerm = computed(() =>
    String(this.list.query().filters?.['descricao'] ?? '')
  )

  readonly filterTipo = computed(() =>
    String(this.list.query().filters?.['tipo'] ?? '')
  )

  readonly filterSituacao = computed(() =>
    String(this.list.query().filters?.['situacao'] ?? '')
  )

  readonly tipoOptions = TRANSACTION_TIPO_OPTIONS
  readonly situacaoOptions = TRANSACTION_SITUACAO_OPTIONS

  constructor() {
    this.list.connect((query) => this.api.getAll(query))
    this.computeAnalytics()
  }

  private computeAnalytics(): void {
    effect(() => {
      this.list.items() // reactive dependency — re-runs after each page load
      untracked(() => {
        this.api.getResumo().subscribe((data) => this.analytics.set(data))
      })
    })
  }

  search(value: string): void {
    this.list.setFilterDebounced('descricao', value)
  }

  filterByTipo(value: string): void {
    this.list.setFilter('tipo', value)
  }

  filterBySituacao(value: string): void {
    this.list.setFilter('situacao', value)
  }

  refresh(): void {
    this.list.reload()
  }

  exportCsv(): void {
    this.api.exportCsv().subscribe((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lancamentos-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  rowBorderClass(row: ITransaction): string {
    if (row.tipo === 'RECEITA') return 'border-l-4 border-l-success-500'
    if (row.situacao === 'PENDENTE') return 'border-l-4 border-l-warning-500'
    return 'border-l-4 border-l-error-500'
  }

  valorClass(row: ITransaction): string {
    return row.tipo === 'RECEITA' ? 'text-success-600' : 'text-error-600'
  }

  situacaoBadgeColor(row: ITransaction): 'success' | 'warning' | 'error' {
    if (row.situacao === 'PAGO') return 'success'
    return 'warning'
  }

  situacaoLabel(row: ITransaction): string {
    return row.situacao === 'PAGO' ? 'Pago' : 'Pendente'
  }

  formatValor(valor: number): string {
    return new Intl.NumberFormat('pt-MZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valor)
  }

  formatDate(date: string | null): string {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }
}
