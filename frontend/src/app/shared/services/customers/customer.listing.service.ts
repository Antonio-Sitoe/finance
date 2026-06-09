import { computed, inject, Injectable, signal } from '@angular/core'
import { ICustomerDTO, ICustomerRankingResumoDTO } from '@/shared/interfaces/costumers.dto'
import { ListStore } from '@/shared/config/listing/list.store'
import { CustomerApiService } from './customer.api.service'
import { SITUATION } from '@/shared/interfaces/enum.dto'

@Injectable({
  providedIn: 'root',
})
export class CustomerFacadeService {
  private api = inject(CustomerApiService)
  readonly list = new ListStore<ICustomerDTO>()
  readonly rankingResumo = signal<ICustomerRankingResumoDTO | null>(null)

  readonly statusOptions = [
    { value: '', label: 'Todos os estados' },
    { value: SITUATION.ATIVO, label: 'Ativo' },
    { value: SITUATION.INATIVO, label: 'Inativo' },
  ]

  readonly searchTerm = computed(() =>
    String(this.list.query().filters?.['search'] ?? ''),
  )

  readonly filterStatus = computed(() =>
    String(this.list.query().filters?.['situacao'] ?? ''),
  )

  constructor() {
    this.list.connect((query) => this.api.getCustomers(query))
    this.loadRankingResumo()
  }

  loadRankingResumo(): void {
    this.api.getRankingResumo().subscribe({
      next: (resumo) => this.rankingResumo.set(resumo),
    })
  }

  search(value: string): void {
    this.list.setFilterDebounced('search', value)
  }

  filterBySituacao(value: string): void {
    this.list.setFilter('situacao', value)
  }

  badgeColor(situacao: string): 'success' | 'error' {
    return situacao === SITUATION.ATIVO ? 'success' : 'error'
  }

  ratingToStars(nota: number): number {
    return Math.round(nota / 2)
  }
  refresh(): void {
    this.list.reload()
    this.loadRankingResumo()
  }
}

