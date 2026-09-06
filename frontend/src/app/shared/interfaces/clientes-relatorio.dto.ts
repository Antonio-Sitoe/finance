import { ICustomerDTO } from "@/shared/interfaces/costumers.dto";

export type ClientesRelatorioTab = "visao-geral" | "analise-financeira";
export type ClientesRelatorioPeriodo =
  | "month"
  | "quarter"
  | "year"
  | "all"
  | "custom";

export interface IClienteStatusReport {
  total: number;
  activos: number;
  inativos: number;
  semDadosContactos: number;
}

export interface IClienteClassificacaoNota {
  classification: "NORMAL" | "MASTER" | "VIP";
  quantidadeClientes: number;
  recebiveisPendentes: number;
}

export interface IClienteSemDados {
  semContactos: number;
  semTelefone: number;
}

export interface IClienteMultiplosContactos {
  quantidadeClientes: number;
}

export interface IClienteFaturamento {
  idCliente: number;
  nomeEmpresarial: string;
  faturado: number;
  recebido: number;
  emAberto: number;
  percentagemRecebido: number;
  prazoQueFaltaDias: number | null;
}

export interface IClienteFaturamentoResumo {
  totalFaturado: number;
  totalRecebido: number;
  totalEmAberto: number;
  quantidadeFaturasPendentes: number;
}

export interface IReportPage<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface IClienteReceita {
  id: number;
  descricao: string;
  valor: number;
  dataLancamento: string;
  dataVencimento: string;
  situacao: "PAGO" | "PENDENTE";
  tipo: "RECEITA" | "DESPESA";
  parcela: number;
  totalParcela: number;
}

export interface IClientesVisaoGeral {
  status: IClienteStatusReport;
  classificacao: IClienteClassificacaoNota[];
  semDados: IClienteSemDados;
  multiplosContactos: IClienteMultiplosContactos;
  clientesRecentes: IReportPage<ICustomerDTO>;
}

export interface IPeriodoQuery {
  de?: string;
  ate?: string;
}
