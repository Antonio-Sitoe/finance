import { Component, effect, inject, OnInit, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CardStatComponent } from '@/shared/components/common/card-stat/card-stat.component'
import { PageHeaderComponent } from '@/shared/components/common/page-header/page-header.component'
import { UsersListTableComponent } from '@/shared/components/users/users-list-table/users-list-table.component'
import { UserFacadeService } from '@/shared/services/users/users.facade.service'

@Component({
  selector: 'app-users',
  imports: [CardStatComponent, PageHeaderComponent, UsersListTableComponent],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  readonly facade = inject(UserFacadeService)
  readonly drawerOpen = signal(false)

  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private paramsInitialized = false

  constructor() {
    effect(() => {
      const q = this.facade.list.query()
      if (!this.paramsInitialized) return

      const params: Record<string, string | number> = {
        page: q.page,
        size: q.size,
      }
      if (q.filters?.['search'])
        params['search'] = q.filters['search'] as string
      if (q.filters?.['situacao'])
        params['situacao'] = q.filters['situacao'] as string
      if (q.filters?.['perfil'])
        params['perfil'] = q.filters['perfil'] as string

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: params,
        replaceUrl: true,
      })
    })
  }

  ngOnInit(): void {
    const p = this.route.snapshot.queryParams
    const page = +p['page'] || 0
    const size = +p['size'] || 10
    const filters: Record<string, string> = {}
    if (p['search']) filters['search'] = p['search']
    if (p['situacao']) filters['situacao'] = p['situacao']
    if (p['perfil']) filters['perfil'] = p['perfil']

    this.facade.list.setQuery({
      page,
      size,
      ...(Object.keys(filters).length ? { filters } : {}),
    })
    this.paramsInitialized = true
  }
}
