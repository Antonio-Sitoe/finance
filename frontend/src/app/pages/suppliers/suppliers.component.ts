import { Component, inject, signal } from "@angular/core";
import { PageHeaderComponent } from "@/shared/components/common/page-header/page-header.component";
import { CardStatComponent } from "@/shared/components/common/card-stat/card-stat.component";
import { SuppliersListTableComponent } from "@/shared/components/suppliers/suppliers-list-table/suppliers-list-table.component";
import { CreateAndEditSupplierComponent } from "@/shared/components/suppliers/create-and-edit-supplier/create-and-edit-supplier.component";
import { SupplierDetailDrawerComponent } from "@/shared/components/suppliers/supplier-detail-drawer/supplier-detail-drawer.component";
import { ISupplier } from "@/shared/interfaces/suppliers.dto";
import { SuppliersFacadeService } from "@/shared/services/suppliers/suppliers.facade.service";
import { SupplierApiService } from "@/shared/services/suppliers/supplier.api.service";
import { ToastService } from "@/shared/services/toast.service";
import { DangerTriangleBold } from "@solar-icons/angular";

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
  readonly DangerTriangleBold = DangerTriangleBold;

  readonly facade = inject(SuppliersFacadeService);
  readonly api = inject(SupplierApiService);
  readonly toast = inject(ToastService);

  readonly drawerOpen = signal(false);
  readonly detailDrawerOpen = signal(false);
  readonly toggleSituacaoOpen = signal(false);
  readonly isToggling = signal(false);
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

  openToggleSituacao(supplier: ISupplier): void {
    this.selectedSupplier.set(supplier);
    this.toggleSituacaoOpen.set(true);
  }

  onDrawerClose(open: boolean): void {
    this.drawerOpen.set(open);
  }

  confirmToggleSituacao(): void {
    const supplier = this.selectedSupplier();
    if (!supplier) return;
    this.isToggling.set(true);
    this.api.toggleSituacao(supplier.id).subscribe({
      next: (res) => {
        this.toast.success(
          res.mensagem ||
            (res.situacao === "INATIVO"
              ? "Fornecedor desactivado"
              : "Fornecedor activado")
        );
        this.facade.refresh();
        this.facade.getAnalytics();
        this.isToggling.set(false);
        this.toggleSituacaoOpen.set(false);
      },
      error: (error) => {
        this.toast.error(
          "Falha",
          error?.error?.message ?? "Erro ao alterar a situação do fornecedor"
        );
        this.isToggling.set(false);
      },
    });
  }
}
