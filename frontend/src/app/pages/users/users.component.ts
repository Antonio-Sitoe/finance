import { Component, signal } from "@angular/core";
import { CardStatComponent } from "@/shared/components/common/card-stat/card-stat.component";
import { PageHeaderComponent } from "@/shared/components/common/page-header/page-header.component";
import {
  DataTableComponent,
  ColumnDef,
} from "@/shared/components/ui/datatable/datatable";
import { BadgeComponent } from "@/shared/components/ui/badge/badge.component";
import { AvatarTextComponent } from "@/shared/components/ui/avatar/avatar-text.component";
import { CheckboxComponent } from "@/shared/components/ui/input/checkbox.component";
import { InputFieldComponent } from "@/shared/components/ui/input/input-field.component";
import { SelectComponent } from "@/shared/components/ui/select/select.component";
import { CreateAndEditUserComponent } from "@/shared/components/users/create-and-edit-user/create-and-edit-user.component";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Activo" | "Inactivo" | "Pendente";
  createdAt: string;
}

@Component({
  selector: "app-users",
  imports: [
    CardStatComponent,
    PageHeaderComponent,
    DataTableComponent,
    BadgeComponent,
    AvatarTextComponent,
    CheckboxComponent,
    InputFieldComponent,
    SelectComponent,
    CreateAndEditUserComponent,
  ],
  templateUrl: "./users.component.html",
})
export class UsersComponent {
  readonly toogleDrawer = signal(false);

  columns: ColumnDef[] = [
    { id: "user", label: "Utilizador" },
    { id: "role", label: "Função", sortable: true },
    { id: "status", label: "Estado", align: "center" },
    { id: "createdAt", label: "Data de registo", sortable: true },
    { id: "actions", label: "", width: "w-16" },
  ];

  searchTerm = "";
  filterStatus = "";
  filterRole = "";

  statusOptions = [
    { value: "Activo", label: "Activo" },
    { value: "Inactivo", label: "Inactivo" },
    { value: "Pendente", label: "Pendente" },
  ];

  roleOptions = [
    { value: "Administrador", label: "Administrador" },
    { value: "Gestor", label: "Gestor" },
    { value: "Operador", label: "Operador" },
    { value: "Auditor", label: "Auditor" },
  ];

  sourceUsers: UserRow[] = [
    {
      id: "U001",
      name: "António Sitoe",
      email: "antonio@empresa.ao",
      role: "Administrador",
      status: "Activo",
      createdAt: "2024-01-10",
    },
    {
      id: "U002",
      name: "Maria da Costa",
      email: "maria@empresa.ao",
      role: "Gestor",
      status: "Activo",
      createdAt: "2024-02-14",
    },
    {
      id: "U003",
      name: "João Fernandes",
      email: "joao@empresa.ao",
      role: "Operador",
      status: "Inactivo",
      createdAt: "2024-03-05",
    },
    {
      id: "U004",
      name: "Ana Paulina",
      email: "ana@empresa.ao",
      role: "Operador",
      status: "Activo",
      createdAt: "2024-03-18",
    },
    {
      id: "U005",
      name: "Carlos Mendes",
      email: "carlos@empresa.ao",
      role: "Auditor",
      status: "Pendente",
      createdAt: "2024-04-02",
    },
    {
      id: "U006",
      name: "Sofia Lopes",
      email: "sofia@empresa.ao",
      role: "Gestor",
      status: "Activo",
      createdAt: "2024-04-20",
    },
    {
      id: "U007",
      name: "Pedro Alves",
      email: "pedro@empresa.ao",
      role: "Operador",
      status: "Inactivo",
      createdAt: "2024-05-01",
    },
    {
      id: "U008",
      name: "Luísa Neto",
      email: "luisa@empresa.ao",
      role: "Auditor",
      status: "Activo",
      createdAt: "2024-05-15",
    },
    {
      id: "U009",
      name: "Fernando Cruz",
      email: "fernando@empresa.ao",
      role: "Operador",
      status: "Activo",
      createdAt: "2024-06-03",
    },
    {
      id: "U010",
      name: "Beatriz Santos",
      email: "beatriz@empresa.ao",
      role: "Gestor",
      status: "Pendente",
      createdAt: "2024-06-22",
    },
    {
      id: "U011",
      name: "Rui Baptista",
      email: "rui@empresa.ao",
      role: "Administrador",
      status: "Activo",
      createdAt: "2024-07-08",
    },
    {
      id: "U012",
      name: "Inês Correia",
      email: "ines@empresa.ao",
      role: "Operador",
      status: "Inactivo",
      createdAt: "2024-07-19",
    },
  ];

  rowsPerPage = 8;
  currentPage = 1;

  selectedRows: string[] = [];

  get filteredUsers(): UserRow[] {
    const term = this.searchTerm.toLowerCase();
    return this.sourceUsers.filter((u) => {
      const matchesSearch =
        !term ||
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term);
      const matchesStatus =
        !this.filterStatus || u.status === this.filterStatus;
      const matchesRole = !this.filterRole || u.role === this.filterRole;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.rowsPerPage);
  }

  get pagedUsers(): UserRow[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.filteredUsers.slice(start, start + this.rowsPerPage);
  }

  get selectAll(): boolean {
    return (
      this.pagedUsers.length > 0 &&
      this.pagedUsers.every((u) => this.selectedRows.includes(u.id))
    );
  }

  onSearch(value: string | number): void {
    this.searchTerm = value as string;
    this.currentPage = 1;
  }

  onFilterStatus(value: string): void {
    this.filterStatus = value;
    this.currentPage = 1;
  }

  onFilterRole(value: string): void {
    this.filterRole = value;
    this.currentPage = 1;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  handleSelectAll(): void {
    const ids = this.pagedUsers.map((u) => u.id);
    if (this.selectAll) {
      this.selectedRows = this.selectedRows.filter((id) => !ids.includes(id));
    } else {
      this.selectedRows = [...new Set([...this.selectedRows, ...ids])];
    }
  }

  handleRowSelect(id: string): void {
    if (this.selectedRows.includes(id)) {
      this.selectedRows = this.selectedRows.filter((r) => r !== id);
    } else {
      this.selectedRows = [...this.selectedRows, id];
    }
  }

  getBadgeColor(status: string): "success" | "warning" | "error" {
    if (status === "Activo") return "success";
    if (status === "Pendente") return "warning";
    return "error";
  }

  get totalActive(): number {
    return this.sourceUsers.filter((u: UserRow) => u.status === "Activo")
      .length;
  }

  get totalInactive(): number {
    return this.sourceUsers.filter((u: UserRow) => u.status === "Inactivo")
      .length;
  }

  get totalAdmins(): number {
    return this.sourceUsers.filter((u: UserRow) => u.role === "Administrador")
      .length;
  }
}
