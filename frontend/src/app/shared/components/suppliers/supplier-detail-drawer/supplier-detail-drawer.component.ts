import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from "@angular/core";
import { ISupplier } from "@/shared/interfaces/suppliers.dto";
import { SITUATION } from "@/shared/interfaces/enum.dto";
import { DrawerComponent } from "@/shared/components/ui/drawer/drawer.component";
import { BadgeComponent } from "@/shared/components/ui/badge/badge.component";
import { SwitchComponent } from "@/shared/components/ui/input/switch.component";
import { SuppliersFacadeService } from "@/shared/services/suppliers/suppliers.facade.service";
import { SupplierApiService } from "@/shared/services/suppliers/supplier.api.service";
import { ToastService } from "@/shared/services/toast.service";
import { SolarDynamicIcon, Pen2Bold } from "@solar-icons/angular";

@Component({
  selector: "app-supplier-detail-drawer",
  imports: [DrawerComponent, BadgeComponent, SwitchComponent, SolarDynamicIcon],
  templateUrl: "./supplier-detail-drawer.component.html",
})
export class SupplierDetailDrawerComponent implements OnInit {
  @Input() supplier: ISupplier | null = null;
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() edit = new EventEmitter<ISupplier>();

  readonly Pen2Bold = Pen2Bold;

  readonly facade = inject(SuppliersFacadeService);
  private readonly api = inject(SupplierApiService);
  private readonly toast = inject(ToastService);

  readonly isLoading = signal(false);
  readonly situacao = signal<SITUATION>(SITUATION.ATIVO);

  ngOnInit(): void {
    const situacao = this.supplier?.situacao;
    this.situacao.set(
      situacao === SITUATION.INATIVO ? SITUATION.INATIVO : SITUATION.ATIVO
    );
  }

  get isActive(): boolean {
    return this.situacao() === SITUATION.ATIVO;
  }

  initials(name: string): string {
    return name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }

  toggleSituacao(): void {
    if (!this.supplier || this.isLoading()) return;
    const loadingId = this.toast.loading("A mudar o estado do fornecedor...");
    this.isLoading.set(true);
    this.api.toggleSituacao(this.supplier.id).subscribe({
      next: (res) => {
        this.toast.dismiss(loadingId);
        this.toast.success(res.mensagem || "Estado mudado");
        this.situacao.set(
          res.situacao === SITUATION.INATIVO
            ? SITUATION.INATIVO
            : SITUATION.ATIVO
        );
        this.facade.refresh();
        this.facade.getAnalytics();
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toast.dismiss(loadingId);
        const msg = err?.error?.message || "Erro ao atualizar estado";
        this.toast.error("Falha", msg);
        this.isLoading.set(false);
      },
    });
  }

  handleEdit(): void {
    if (this.supplier) {
      this.openChange.emit(false);
      this.edit.emit(this.supplier);
    }
  }
}
