import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ISupplier } from '@/shared/interfaces/suppliers.dto'
import { DrawerComponent } from '@/shared/components/ui/drawer/drawer.component'
import { BadgeComponent } from '@/shared/components/ui/badge/badge.component'
import { SolarDynamicIcon, Pen2Bold } from '@solar-icons/angular'

@Component({
  selector: 'app-supplier-detail-drawer',
  imports: [DrawerComponent, BadgeComponent, SolarDynamicIcon],
  templateUrl: './supplier-detail-drawer.component.html',
})
export class SupplierDetailDrawerComponent {
  @Input() supplier: ISupplier | null = null
  @Input() open = false
  @Output() openChange = new EventEmitter<boolean>()
  @Output() edit = new EventEmitter<ISupplier>()

  readonly Pen2Bold = Pen2Bold

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  }

  ratingLabel(v: number): string {
    if (v >= 8) return 'Excelente'
    if (v >= 5) return 'Regular'
    return 'Risco'
  }

  ratingBadgeColor(v: number): 'success' | 'warning' | 'error' {
    if (v >= 8) return 'success'
    if (v >= 5) return 'warning'
    return 'error'
  }

  ratingBarColor(v: number): string {
    if (v >= 8) return 'bg-success-500'
    if (v >= 5) return 'bg-warning-500'
    return 'bg-error-500'
  }

  ratingTextColor(v: number): string {
    if (v >= 8) return 'text-success-600'
    if (v >= 5) return 'text-warning-600'
    return 'text-error-600'
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  handleEdit(): void {
    if (this.supplier) {
      this.openChange.emit(false)
      this.edit.emit(this.supplier)
    }
  }
}
