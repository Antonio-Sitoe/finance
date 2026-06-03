import { computed, inject, Injectable, signal } from "@angular/core";
import { ICustomerDTO } from "@/shared/interfaces/costumers.dto";
import { ListStore } from "@/shared/config/listing/list.store";
import { CustomerApiService } from "./customer.api.service";
import { SITUATION } from "@/shared/interfaces/enum.dto";

@Injectable({ providedIn: "root" })
export class CustomerFacadeService {
  private api = inject(CustomerApiService);

  readonly list = new ListStore<ICustomerDTO>();
  readonly editingCustomer = signal<ICustomerDTO | null>(null);
  readonly selectedRows = signal<number[]>([]);

  readonly statusOptions = [
    { value: "", label: "Todos os estados" },
    { value: SITUATION.ATIVO, label: "Ativo" },
    { value: SITUATION.INATIVO, label: "Inativo" },
  ];

  readonly searchTerm = computed(() =>
    String(this.list.query().filters?.["search"] ?? "")
  );

  readonly filterStatus = computed(() =>
    String(this.list.query().filters?.["situacao"] ?? "")
  );

  constructor() {
    this.list.connect((query) => this.api.getCustomers(query));
    this.list.reload();
  }

  setEditingCustomer(customer: ICustomerDTO | null): void {
    this.editingCustomer.set(customer);
  }

  search(value: string): void {
    this.list.setFilter("search", value);
  }

  filterBySituacao(value: string): void {
    this.list.setFilter("situacao", value);
  }

  badgeColor(situacao: string): "success" | "error" {
    return situacao === SITUATION.ATIVO ? "success" : "error";
  }

  ratingToStars(nota: number): number {
    return Math.round(nota / 2);
  }
}
