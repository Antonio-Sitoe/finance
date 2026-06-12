import { computed, inject, Injectable, signal } from "@angular/core";
import {
  ICategory,
  ICategoryAnalytics,
} from "@/shared/interfaces/categories.dto";
import { ListStore } from "@/shared/config/listing/list.store";
import { CategoryApiService } from "./category.api.service";
import { SITUATION } from "@/shared/interfaces/enum.dto";
import {
  CATEGORY_SITUACAO_OPTIONS,
  CATEGORY_TIPO_OPTIONS,
} from "@/shared/constants/categories.columns";

@Injectable({ providedIn: "root" })
export class CategoriesFacadeService {
  private readonly api = inject(CategoryApiService);

  readonly list = new ListStore<ICategory>();

  readonly analytics = signal<ICategoryAnalytics>({
    total: 0,
    totalDebito: 0,
    totalCredito: 0,
    totalInativos: 0,
  });

  readonly searchTerm = computed(() =>
    String(this.list.query().filters?.["nome"] ?? "")
  );

  readonly filterSituacao = computed(() =>
    String(this.list.query().filters?.["situacao"] ?? "")
  );

  readonly filterTipo = computed(() =>
    String(this.list.query().filters?.["tipo"] ?? "")
  );

  readonly situacaoOptions = CATEGORY_SITUACAO_OPTIONS;
  readonly tipoOptions = CATEGORY_TIPO_OPTIONS;

  constructor() {
    this.list.connect((query) => this.api.getAll(query));
    this.getAnalytics();
  }

  getAnalytics(): void {
    this.api.getAnalytics().subscribe({
      next: (data) => this.analytics.set(data),
      error: (err) => {
        console.error("Erro ao carregar análiticos de categorias", err);
      },
    });
  }

  search(value: string): void {
    this.list.setFilterDebounced("nome", value);
  }

  filterBySituacao(value: string): void {
    this.list.setFilter("situacao", value);
  }

  filterByTipo(value: string): void {
    this.list.setFilter("tipo", value);
  }

  refresh(): void {
    this.list.reload();
  }

  badgeColor(situacao: string): "success" | "error" {
    return situacao === SITUATION.ATIVO ? "success" : "error";
  }

  typeLabel(category: ICategory): string {
    if (category.debito && category.credito) return "Débito e Crédito";
    if (category.debito) return "Débito";
    if (category.credito) return "Crédito";
    return "Sem tipo";
  }
}
