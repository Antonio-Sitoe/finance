import { Component, EventEmitter, inject, Input, Output } from '@angular/core'
import { ISupplier } from '@/shared/interfaces/suppliers.dto'
import { DrawerComponent } from '@/shared/components/ui/drawer/drawer.component'
import { BadgeComponent } from '@/shared/components/ui/badge/badge.component'
import { SuppliersFacadeService } from '@/shared/services/suppliers/suppliers.facade.service'
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
  @Output() toggleSituacao = new EventEmitter<ISupplier>()

  readonly Pen2Bold = Pen2Bold

  readonly facade = inject(SuppliersFacadeService)

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  }

  handleEdit(): void {
    if (this.supplier) {
      this.openChange.emit(false)
      this.edit.emit(this.supplier)
    }
  }

  handleToggleSituacao(): void {
    if (this.supplier) {
      this.openChange.emit(false)
      this.toggleSituacao.emit(this.supplier)
    }
  }
}
