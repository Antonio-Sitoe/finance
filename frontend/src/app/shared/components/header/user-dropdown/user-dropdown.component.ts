import { Component, computed, inject } from '@angular/core'
import { DropdownComponent } from '../../ui/dropdown/dropdown.component'
import { CommonModule } from '@angular/common'
import { Router, RouterModule } from '@angular/router'
import { DropdownItemTwoComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component-two'
import { AuthService } from '@/core/auth/auth.service'

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  imports: [
    CommonModule,
    RouterModule,
    DropdownComponent,
    DropdownItemTwoComponent,
  ],
})
export class UserDropdownComponent {
  private readonly auth = inject(AuthService)
  private readonly router = inject(Router)

  isOpen = false
  isLoggingOut = false

  readonly user = this.auth.currentUser

  readonly displayName = computed(() => this.user()?.nome ?? 'Utilizador')
  readonly displayEmail = computed(() => this.user()?.email ?? '')
  readonly initials = computed(() => {
    const nome = this.user()?.nome?.trim()
    if (!nome) return '?'
    const parts = nome.split(/\s+/).filter(Boolean)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  })

  toggleDropdown() {
    this.isOpen = !this.isOpen
  }

  closeDropdown() {
    this.isOpen = false
  }

  onLogout(event: Event) {
    event.preventDefault()
    if (this.isLoggingOut) return
    this.isLoggingOut = true
    this.closeDropdown()

    this.auth.logout().subscribe({
      next: () => {
        this.isLoggingOut = false
        this.router.navigate(['/signin'])
      },
      error: () => {
        this.auth.clearSession()
        this.isLoggingOut = false
        this.router.navigate(['/signin'])
      },
    })
  }
}
