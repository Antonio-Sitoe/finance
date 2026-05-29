import { ColumnDef } from "../components/ui/datatable/datatable";

export const USERS_COLUMNS: ColumnDef[] = [
  { id: "user", label: "Utilizador" },
  { id: "role", label: "Função", sortable: true },
  { id: "status", label: "Estado", align: "center" },
  { id: "createdAt", label: "Data de registo", sortable: true },
  { id: "actions", label: "", width: "w-16" },
];
