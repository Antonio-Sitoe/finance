import { computed, inject, Injectable, signal } from "@angular/core";
import {
  ISupplier,
  ISupplierAnalytics,
} from "@/shared/interfaces/suppliers.dto";
import { ListStore } from "@/shared/config/listing/list.store";
import { SupplierApiService } from "./supplier.api.service";
import { SITUATION } from "@/shared/interfaces/enum.dto";
import {
  SUPPLIER_AVALIACAO_OPTIONS,
  SUPPLIER_SITUACAO_OPTIONS,
} from "@/shared/constants/suppliers.columns";

@Injectable({ providedIn: "root" })
export class SuppliersFacadeService {
  private readonly api = inject(SupplierApiService);

  readonly list = new ListStore<ISupplier>();

  readonly analytics = signal<ISupplierAnalytics>({
    total: 0,
    totalAtivos: 0,
    totalInativos: 0,
    altaConformidade: 0,
  });

  readonly searchTerm = computed(() =>
    String(this.list.query().filters?.["nome"] ?? "")
  );

  readonly filterSituacao = computed(() =>
    String(this.list.query().filters?.["situacao"] ?? "")
  );

  readonly filterAvaliacao = computed(() =>
    String(this.list.query().filters?.["avaliacao"] ?? "")
  );

  readonly situacaoOptions = SUPPLIER_SITUACAO_OPTIONS;
  readonly avaliacaoOptions = SUPPLIER_AVALIACAO_OPTIONS;

  constructor() {
    this.list.connect((query) => this.api.getAll(query));
    this.getAnalytics();
  }

  getAnalytics(): void {
    this.api.getAnalytics().subscribe({
      next: (data) => this.analytics.set(data),

      error: (err) => {
        console.error("Erro ao carregar análiticos de fornecedores", err);
      },
    });
  }

  search(value: string): void {
    this.list.setFilterDebounced("nome", value);
  }

  filterBySituacao(value: string): void {
    this.list.setFilter("situacao", value);
  }

  filterByAvaliacao(value: string): void {
    this.list.setFilter("avaliacao", value);
  }

  refresh(): void {
    this.list.reload();
  }

  badgeColor(situacao: string): "success" | "error" {
    return situacao === SITUATION.ATIVO ? "success" : "error";
  }

  ratingLabel(nota?: number | null): string {
    if (nota == null) return "Sem avaliação";
    if (nota >= 8) return "Excelente";
    if (nota >= 5) return "Regular";
    return "Risco";
  }

  ratingBadgeColor(nota?: number | null): "success" | "warning" | "error" {
    if (nota != null && nota >= 8) return "success";
    if (nota != null && nota >= 5) return "warning";
    return "error";
  }

  ratingBarColor(nota?: number | null): string {
    if (nota == null) return "bg-gray-300";
    if (nota >= 8) return "bg-success-500";
    if (nota >= 5) return "bg-warning-500";
    return "bg-error-500";
  }

  ratingTextColor(nota?: number | null): string {
    if (nota == null) return "text-gray-400";
    if (nota >= 8) return "text-success-600 dark:text-success-400";
    if (nota >= 5) return "text-warning-600 dark:text-warning-400";
    return "text-error-600 dark:text-error-400";
  }
}
