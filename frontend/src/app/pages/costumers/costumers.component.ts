import { Component, signal, inject } from '@angular/core'
import { PageHeaderComponent } from '@/shared/components/common/page-header/page-header.component'
import { CardStatComponent } from '@/shared/components/common/card-stat/card-stat.component'
import { CostumersListTableComponent } from '@/shared/components/costumers/costumers-list-table/costumers-list-table.component'
import { CreateAndEditCostumerComponent } from '@/shared/components/costumers/create-and-edit-costumer/create-and-edit-costumer.component'
import { CostumerDetailDrawerComponent } from '@/shared/components/costumers/costumer-detail-drawer/costumer-detail-drawer.component'
import { ICustomerDTO } from '@/shared/interfaces/costumers.dto'
import { CustomerFacadeService } from '@/shared/services/customers/customer.listing.service'

@Component({
  selector: 'app-costumers',
  imports: [
    PageHeaderComponent,
    CardStatComponent,
    CostumersListTableComponent,
    CreateAndEditCostumerComponent,
    CostumerDetailDrawerComponent,
  ],
  templateUrl: './costumers.component.html',
})
export class CostumersComponent {
  readonly facade = inject(CustomerFacadeService)
  readonly customerDrawer = signal(false)
  readonly detailDrawerOpen = signal(false)
  readonly selectedCustomer = signal<ICustomerDTO | null>(null)

  openCreate(): void {
    this.selectedCustomer.set(null)
    this.customerDrawer.set(true)
  }

  openEdit(customer: ICustomerDTO): void {
    this.selectedCustomer.set(customer)
    this.detailDrawerOpen.set(false)
    this.customerDrawer.set(true)
  }

  openDetail(customer: ICustomerDTO): void {
    this.selectedCustomer.set(customer)
    this.detailDrawerOpen.set(true)
  }
}
