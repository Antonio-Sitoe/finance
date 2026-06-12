import { computed, inject, Injectable } from "@angular/core";
import { ICategory } from "@/shared/interfaces/categories.dto";
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
