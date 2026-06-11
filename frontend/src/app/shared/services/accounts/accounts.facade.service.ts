import { computed, inject, Injectable } from "@angular/core";
import { IAccount } from "@/shared/interfaces/accounts.dto";
import { ListStore } from "@/shared/config/listing/list.store";
import { AccountApiService } from "./account.api.service";
import { SITUATION } from "@/shared/interfaces/enum.dto";
import { ACCOUNT_SITUACAO_OPTIONS } from "@/shared/constants/accounts.columns";

@Injectable({ providedIn: "root" })
export class AccountsFacadeService {
  private readonly api = inject(AccountApiService);

  readonly list = new ListStore<IAccount>();

  readonly searchTerm = computed(() =>
    String(this.list.query().filters?.["nome"] ?? "")
  );

  readonly filterSituacao = computed(() =>
    String(this.list.query().filters?.["situacao"] ?? "")
  );

  readonly situacaoOptions = ACCOUNT_SITUACAO_OPTIONS;

  constructor() {
    this.list.connect((query) => this.api.getAll(query));
  }

  search(value: string): void {
    this.list.setFilterDebounced("nome", value);
  }

  filterBySituacao(value: string): void {
    this.list.setFilter("situacao", value);
  }

  refresh(): void {
    this.list.reload();
  }

  badgeColor(situacao: string): "success" | "error" {
    return situacao === SITUATION.ATIVO ? "success" : "error";
  }
}
