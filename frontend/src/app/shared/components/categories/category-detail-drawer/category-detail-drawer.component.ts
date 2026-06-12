import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from "@angular/core";
import { ICategory } from "@/shared/interfaces/categories.dto";
import { SITUATION } from "@/shared/interfaces/enum.dto";
import { DrawerComponent } from "@/shared/components/ui/drawer/drawer.component";
import { BadgeComponent } from "@/shared/components/ui/badge/badge.component";
import { SwitchComponent } from "@/shared/components/ui/input/switch.component";
import { CategoriesFacadeService } from "@/shared/services/categories/categories.facade.service";
import { CategoryApiService } from "@/shared/services/categories/category.api.service";
import { ToastService } from "@/shared/services/toast.service";
import { SolarDynamicIcon } from "@solar-icons/angular";

@Component({
  selector: "app-category-detail-drawer",
  imports: [DrawerComponent, BadgeComponent, SwitchComponent, SolarDynamicIcon],
  templateUrl: "./category-detail-drawer.component.html",
})
export class CategoryDetailDrawerComponent implements OnInit {
  @Input() category: ICategory | null = null;
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() edit = new EventEmitter<ICategory>();

  readonly facade = inject(CategoriesFacadeService);
  private readonly api = inject(CategoryApiService);
  private readonly toast = inject(ToastService);

  readonly isLoading = signal(false);
  readonly situacao = signal<SITUATION>(SITUATION.ATIVO);

  ngOnInit(): void {
    const situacao = this.category?.situacao;
    this.situacao.set(
      situacao === SITUATION.INATIVO ? SITUATION.INATIVO : SITUATION.ATIVO
    );
  }

  get isActive(): boolean {
    return this.situacao() === SITUATION.ATIVO;
  }

  toggleSituacao(): void {
    if (!this.category || this.isLoading()) return;
    const loadingId = this.toast.loading("A mudar o estado da categoria...");
    this.isLoading.set(true);
    this.api.toggleSituacao(this.category.id).subscribe({
      next: (res) => {
        this.toast.dismiss(loadingId);
        this.toast.success(res.mensagem || "Estado mudado");
        this.situacao.set(
          res.situacao === SITUATION.INATIVO
            ? SITUATION.INATIVO
            : SITUATION.ATIVO
        );
        this.facade.refresh();
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
    if (this.category) {
      this.openChange.emit(false);
      this.edit.emit(this.category);
    }
  }
}
