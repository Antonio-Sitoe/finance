import { Component, inject, signal } from "@angular/core";
import { PageHeaderComponent } from "@/shared/components/common/page-header/page-header.component";
import { CardStatComponent } from "@/shared/components/common/card-stat/card-stat.component";
import { SuppliersListTableComponent } from "@/shared/components/suppliers/suppliers-list-table/suppliers-list-table.component";
import { CreateAndEditSupplierComponent } from "@/shared/components/suppliers/create-and-edit-supplier/create-and-edit-supplier.component";
import { SupplierDetailDrawerComponent } from "@/shared/components/suppliers/supplier-detail-drawer/supplier-detail-drawer.component";
import { ISupplier } from "@/shared/interfaces/suppliers.dto";
import { SuppliersFacadeService } from "@/shared/services/suppliers/suppliers.facade.service";

@Component({
  selector: "app-suppliers",
  imports: [
    PageHeaderComponent,
    CardStatComponent,
    SuppliersListTableComponent,
    CreateAndEditSupplierComponent,
    SupplierDetailDrawerComponent,
  ],
  templateUrl: "./suppliers.component.html",
})
export class SuppliersComponent {
  readonly facade = inject(SuppliersFacadeService);

  readonly drawerOpen = signal(false);
  readonly detailDrawerOpen = signal(false);
  readonly selectedSupplier = signal<ISupplier | null>(null);

  openNew(): void {
    this.selectedSupplier.set(null);
    this.drawerOpen.set(true);
  }

  openEdit(supplier: ISupplier): void {
    this.selectedSupplier.set(supplier);
    this.detailDrawerOpen.set(false);
    this.drawerOpen.set(true);
  }

  openDetail(supplier: ISupplier): void {
    this.selectedSupplier.set(supplier);
    this.detailDrawerOpen.set(true);
  }

  onDrawerClose(open: boolean): void {
    this.drawerOpen.set(open);
  }
}
