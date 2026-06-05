import { computed, inject, Injectable, signal } from '@angular/core'
import { ICustomerDTO } from '@/shared/interfaces/costumers.dto'
import { IContactoDTO } from '@/shared/interfaces/contacts.dto'
import { SITUATION } from '@/shared/interfaces/enum.dto'
import { ListStore } from '@/shared/config/listing/list.store'
import { CustomerApiService } from '@/shared/services/customers/customer.api.service'
import { ContactoApiService } from './contacto.api.service'

@Injectable()
export class CostumerContactsFacadeService {
  private readonly customerApi = inject(CustomerApiService)
  private readonly contactoApi = inject(ContactoApiService)

  readonly cliente = signal<ICustomerDTO | null>(null)
  readonly loadingCliente = signal(false)

  readonly list = new ListStore<IContactoDTO>()

  readonly searchTerm = computed(() =>
    String(this.list.query().filters?.['nome'] ?? ''),
  )

  readonly filterSituacao = computed(() =>
    String(this.list.query().filters?.['situacao'] ?? ''),
  )

  readonly situacaoOptions = [
    { label: 'Todos os estados', value: '' },
    { label: 'Ativo', value: SITUATION.ATIVO },
    { label: 'Inativo', value: SITUATION.INATIVO },
  ]

  load(clienteId: number): void {
    this.loadingCliente.set(true)
    this.customerApi.getById(clienteId).subscribe({
      next: (cliente) => {
        this.cliente.set(cliente)
        this.loadingCliente.set(false)
      },
      error: () => this.loadingCliente.set(false),
    })

    this.list.connect((query) => this.contactoApi.getByCliente(clienteId, query))
  }

  search(value: string): void {
    this.list.setFilter('nome', value)
  }

  filterBySituacao(value: string): void {
    this.list.setFilter('situacao', value)
  }
}
