import { Component, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { PageHeaderComponent } from '@/shared/components/common/page-header/page-header.component'
import { CardStatComponent } from '@/shared/components/common/card-stat/card-stat.component'
import { TransactionsListTableComponent } from '@/shared/components/transactions/transactions-list-table/transactions-list-table.component'
import {
  CreateAndEditTransactionComponent,
  TransactionDrawerMode,
} from '@/shared/components/transactions/create-and-edit-transaction/create-and-edit-transaction.component'
import { TransactionDetailDrawerComponent } from '@/shared/components/transactions/transaction-detail-drawer/transaction-detail-drawer.component'
import { TransactionsFacadeService } from '@/shared/services/transactions/transactions.facade.service'
import { ITransaction } from '@/shared/interfaces/transactions.dto'
import { DropdownComponent } from '@/shared/components/ui/dropdown/dropdown.component'
import { DropdownItemComponent } from '@/shared/components/ui/dropdown/dropdown-item/dropdown-item.component'
import { SolarDynamicIcon } from '@solar-icons/angular'

@Component({
  selector: 'app-transactions',
  imports: [
    PageHeaderComponent,
    CardStatComponent,
    TransactionsListTableComponent,
    CreateAndEditTransactionComponent,
    TransactionDetailDrawerComponent,
    DropdownComponent,
    DropdownItemComponent,
    SolarDynamicIcon,
  ],
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent {
  readonly facade = inject(TransactionsFacadeService)
  private readonly router = inject(Router)

  readonly selectedTransaction = signal<ITransaction | null>(null)
  readonly drawerOpen = signal(false)
  readonly drawerMode = signal<TransactionDrawerMode>('normal')
  readonly detailDrawerOpen = signal(false)
  readonly newDropdownOpen = signal(false)

  toggleNewDropdown(): void {
    this.newDropdownOpen.update((v) => !v)
  }

  openNew(): void {
    this.newDropdownOpen.set(false)
    this.selectedTransaction.set(null)
    this.drawerMode.set('normal')
    this.drawerOpen.set(true)
  }

  openParcelado(): void {
    this.newDropdownOpen.set(false)
    this.selectedTransaction.set(null)
    this.drawerMode.set('parcelado')
    this.drawerOpen.set(true)
  }

  openBulkImport(): void {
    this.newDropdownOpen.set(false)
    this.router.navigate(['/transactions/import'])
  }

  openEdit(transaction: ITransaction): void {
    this.selectedTransaction.set(transaction)
    this.detailDrawerOpen.set(false)
    this.drawerMode.set('normal')
    this.drawerOpen.set(true)
  }

  openDetail(transaction: ITransaction): void {
    this.selectedTransaction.set(transaction)
    this.detailDrawerOpen.set(true)
  }
}
