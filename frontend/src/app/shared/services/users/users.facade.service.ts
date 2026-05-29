import { computed, inject, Injectable, signal } from "@angular/core";
import { UsersApiService } from "./users.api.service";
import { ListStore } from "@/shared/config/listing/list.store";
import { IUsuario } from "@/shared/interfaces/users.dto";
import { PROFILE, SITUATION } from "@/shared/interfaces/enum.dto";
import { ColumnDef } from "@/shared/components/ui/datatable/datatable";
import { USERS_COLUMNS } from "@/shared/constants/users.columns";

@Injectable({ providedIn: "root" })
export class UserFacadeService {
  private api = inject(UsersApiService);

  readonly list = new ListStore<IUsuario>();
  readonly selectedRows = signal<number[]>([]);

  readonly searchTerm = computed(() =>
    String(this.list.query().filters?.["search"] ?? "")
  );
  readonly filterStatus = computed(() =>
    String(this.list.query().filters?.["situacao"] ?? "")
  );
  readonly filterRole = computed(() =>
    String(this.list.query().filters?.["perfil"] ?? "")
  );

  readonly selectAll = computed(() => {
    const items = this.list.items();
    return (
      items.length > 0 && items.every((u) => this.selectedRows().includes(u.id))
    );
  });

  readonly columns: ColumnDef[] = USERS_COLUMNS;

  readonly statusOptions = [
    { value: SITUATION.ATIVO, label: "Activo" },
    { value: SITUATION.INATIVO, label: "Inactivo" },
  ];

  readonly roleOptions = [
    { value: PROFILE.ADMIN, label: "Administrador" },
    { value: PROFILE.USER, label: "Utilizador" },
  ];

  constructor() {
    this.list.connect((query) => this.api.getUsers(query));
  }

  search(value: string): void {
    this.list.setFilter("search", value);
  }

  filterBySituacao(value: string): void {
    this.list.setFilter("situacao", value);
  }

  filterByPerfil(value: string): void {
    this.list.setFilter("perfil", value);
  }

  toggleSelectAll(): void {
    const ids = this.list.items().map((u) => u.id);
    if (this.selectAll()) {
      this.selectedRows.update((r) => r.filter((id) => !ids.includes(id)));
    } else {
      this.selectedRows.update((r) => [...new Set([...r, ...ids])]);
    }
  }

  toggleRowSelect(id: number): void {
    this.selectedRows.update((r) =>
      r.includes(id) ? r.filter((x) => x !== id) : [...r, id]
    );
  }

  badgeColor(situacao: string): "success" | "warning" | "error" {
    if (situacao === SITUATION.ATIVO) return "success";
    return "error";
  }
}
