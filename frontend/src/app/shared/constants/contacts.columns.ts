import { ColumnDef } from "../components/ui/datatable/datatable";

export const CONTACTS_COLUMNS: ColumnDef[] = [
  { id: "contacto", label: "Nome / Email" },
  { id: "departamento", label: "Departamento" },
  { id: "telefone", label: "Telefone" },
  { id: "empresa", label: "Empresa" },
  { id: "situacao", label: "Estado", align: "center" },
  { id: "acoes", label: "", align: "right" },
];

export const DEPARTMENT_SHORTCUTS = [
  "Financeiro",
  "Operações",
  "TI",
  "Compliance",
  "Comercial",
  "Jurídico",
];

export const DEPARTMENT_OPTIONS = [
  { label: "Seleccionar departamento", value: "" },
  { label: "Financeiro", value: "Financeiro" },
  { label: "Operações", value: "Operações" },
  { label: "TI", value: "Tecnologia" },
  { label: "Compliance", value: "Compliance" },
  { label: "Comercial", value: "Comercial" },
  { label: "Jurídico", value: "Jurídico" },
  { label: "Administrativo", value: "Administrativo" },
  { label: "Direção", value: "Direção" },
  { label: "Compras", value: "Compras" },
];

export const department_options = [
  { label: "Todos os departamentos", value: "" },
  { label: "Financeiro", value: "Financeiro" },
  { label: "Operações", value: "Operações" },
  { label: "Tecnologia", value: "Tecnologia" },
  { label: "Compliance", value: "Compliance" },
  { label: "Comercial", value: "Comercial" },
  { label: "Jurídico", value: "Jurídico" },
  { label: "Administrativo", value: "Administrativo" },
  { label: "Direção", value: "Direção" },
  { label: "Compras", value: "Compras" },
];
