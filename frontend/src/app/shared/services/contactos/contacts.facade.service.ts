import { computed, inject, Injectable } from "@angular/core";
import { IContactDTO } from "@/shared/interfaces/contacts.dto";
import { ListStore } from "@/shared/config/listing/list.store";
import { ContactoApiService } from "./contacto.api.service";
import { SITUATION } from "@/shared/interfaces/enum.dto";
import { department_options } from "@/shared/constants/contacts.columns";

@Injectable({ providedIn: "root" })
export class ContactsFacadeService {
  private readonly api = inject(ContactoApiService);

  readonly list = new ListStore<IContactDTO>();

  readonly searchTerm = computed(() =>
    String(this.list.query().filters?.["nome"] ?? "")
  );

  readonly filterDepartamento = computed(() =>
    String(this.list.query().filters?.["departamento"] ?? "")
  );

  readonly filterSituacao = computed(() =>
    String(this.list.query().filters?.["situacao"] ?? "")
  );

  readonly departamentoOptions = department_options;

  readonly situacaoOptions = [
    { label: "Todos os estados", value: "" },
    { label: "Ativo", value: SITUATION.ATIVO },
    { label: "Inativo", value: SITUATION.INATIVO },
  ];

  constructor() {
    this.list.connect((query) => this.api.getAll(query));
  }

  search(value: string): void {
    this.list.setFilterDebounced("nome", value);
  }

  filterByDepartamento(value: string): void {
    this.list.setFilter("departamento", value);
  }

  filterBySituacao(value: string): void {
    this.list.setFilter("situacao", value);
  }

  badgeColor(situacao: string): "success" | "error" {
    return situacao === SITUATION.ATIVO ? "success" : "error";
  }

  refresh(): void {
    this.list.reload();
  }
}
