import { Component, signal } from '@angular/core'
import { PageHeaderComponent } from '@/shared/components/common/page-header/page-header.component'
import { CardStatComponent } from '@/shared/components/common/card-stat/card-stat.component'
import { SuppliersListTableComponent } from '@/shared/components/suppliers/suppliers-list-table/suppliers-list-table.component'

@Component({
  selector: 'app-suppliers',
  imports: [PageHeaderComponent, CardStatComponent, SuppliersListTableComponent],
  templateUrl: './suppliers.component.html',
})
export class SuppliersComponent {
  readonly drawerOpen = signal(false)
}
