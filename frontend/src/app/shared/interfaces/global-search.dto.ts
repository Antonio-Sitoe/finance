/**
 * Tipos de UI da Pesquisa Global.
 * A camada de serviços/HTTP deve mapear as respostas do backend para estes modelos.
 */

export type GlobalSearchTab =
  | "all"
  | "clientes"
  | "fornecedores"
  | "lancamentos";

export type LancamentoTipo = "CREDITO" | "DEBITO";

export type LancamentoEstado = "PAGO" | "PENDENTE" | "VENCIDO" | "LIQUIDADO";

export interface IGlobalSearchClient {
  id: number;
  nomeEmpresarial: string;
  /** Texto identificador apresentado por baixo do nome (ex.: "ID: CL-90821"). */
  identificador?: string;
  situacao: "ATIVO" | "INATIVO";
}

export interface IGlobalSearchSupplier {
  id: number;
  nomeEmpresarial: string;
  /** Subtítulo apresentado por baixo do nome (ex.: email). */
  email?: string;
  /** Avaliação 0–10. */
  nota?: number | null;
}

export interface IGlobalSearchTransaction {
  id: number;
  descricao: string;
  /** Nome do cliente/fornecedor associado, opcional. */
  referencia?: string;
  data: string;
  estado: LancamentoEstado;
  tipo: LancamentoTipo;
  valor: number;
}

export interface IGlobalSearchResults {
  clientes: IGlobalSearchClient[];
  fornecedores: IGlobalSearchSupplier[];
  lancamentos: IGlobalSearchTransaction[];
}

export interface IGlobalSearchCounts {
  total: number;
  clientes: number;
  fornecedores: number;
  lancamentos: number;
}

export const EMPTY_GLOBAL_SEARCH_RESULTS: IGlobalSearchResults = {
  clientes: [],
  fornecedores: [],
  lancamentos: [],
};

export interface RawCliente {
  id: number;
  nomeEmpresarial: string;
  email: string;
  nota: number | null;
  situacao: "ATIVO" | "INATIVO";
}
export interface RawFornecedor {
  id: number;
  nomeEmpresarial: string;
  email: string;
  nota: number | null;
  situacao: "ATIVO" | "INATIVO";
}
export interface RawLancamento {
  id: number;
  descricao: string;
  referencia: string | null;
  valor: number;
  dataLancamento: string;
  dataVencimento: string;
  situacao: "PAGO" | "PENDENTE";
  tipo: "RECEITA" | "DESPESA";
}
export interface RawSearchResponse {
  clientes: RawCliente[];
  fornecedores: RawFornecedor[];
  lancamentos: RawLancamento[];
}
