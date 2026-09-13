import { Component, inject, OnInit, signal } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { PageHeaderComponent } from '@/shared/components/common/page-header/page-header.component'
import { RolesApiService } from '@/shared/services/roles/roles.api.service'
import { RoleListItem } from '@/shared/interfaces/roles.dto'

@Component({
  selector: 'app-roles-list',
  imports: [PageHeaderComponent, RouterModule],
  templateUrl: './roles-list.component.html',
})
export class RolesListComponent implements OnInit {
  private readonly api = inject(RolesApiService)
  private readonly router = inject(Router)

  readonly roles = signal<RoleListItem[]>([])
  readonly loading = signal(true)
  readonly error = signal<string | null>(null)
  readonly deletingId = signal<number | null>(null)

  ngOnInit(): void {
    this.reload()
  }

  reload(): void {
    this.loading.set(true)
    this.error.set(null)
    this.api.list().subscribe({
      next: (roles) => {
        this.roles.set(roles)
        this.loading.set(false)
      },
      error: () => {
        this.error.set('Não foi possível carregar as roles.')
        this.loading.set(false)
      },
    })
  }

  create(): void {
    this.router.navigate(['/roles/new'])
  }

  edit(role: RoleListItem): void {
    this.router.navigate(['/roles', role.id])
  }

  remove(role: RoleListItem): void {
    if (role.sistema) return
    if (role.totalUsuarios > 0) {
      alert('Não é possível apagar uma role com utilizadores associados.')
      return
    }
    if (!confirm(`Apagar a role "${role.nome}"?`)) return

    this.deletingId.set(role.id)
    this.api.delete(role.id).subscribe({
      next: () => {
        this.deletingId.set(null)
        this.reload()
      },
      error: (err) => {
        this.deletingId.set(null)
        alert(err?.error?.message ?? 'Erro ao apagar role.')
      },
    })
  }
}
