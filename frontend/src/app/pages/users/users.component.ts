import { Component, inject, signal } from '@angular/core'
import { CardStatComponent } from '@/shared/components/common/card-stat/card-stat.component'
import { PageHeaderComponent } from '@/shared/components/common/page-header/page-header.component'
import { UsersListTableComponent } from '@/shared/components/users/users-list-table/users-list-table.component'
import { UserFacadeService } from '@/shared/services/users/users.facade.service'

@Component({
  selector: 'app-users',
  imports: [CardStatComponent, PageHeaderComponent, UsersListTableComponent],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  readonly facade = inject(UserFacadeService)
  readonly drawerOpen = signal(false)
}
