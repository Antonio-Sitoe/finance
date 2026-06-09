import { ColumnDef } from "../components/ui/datatable/datatable";

export const CUSTOMERS_COLUMNS: ColumnDef[] = [
  { id: "empresa", label: "Empresa" },
  { id: "telefone", label: "Telefone" },
  { id: "rating", label: "Rating" },
  { id: "situacao", label: "Estado", align: "center" },
  { id: "createdAt", label: "Data de Registo" },
  { id: "acoes", label: "", align: "right" },
];
