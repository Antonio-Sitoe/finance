export type CategoriasRelatorioTab =
  | "distribuicao"
  | "hierarquia"
  | "pago-pendente"
  | "sem-categoria";

export interface ICategoriaValorTotal {
  idCategoria: number | null;
  nomeCategoria: string;
  valorTotal: number;
}

export interface ICategoriaResumoFinanceiro {
  idCategoria: number | null;
  nomeCategoria: string;
  totalDebito: number;
  totalCredito: number;
  saldo: number;
  pctDebito: number;
  pctCredito: number;
}

export interface ICategoriaMedia {
  idCategoria: number | null;
  nomeCategoria: string;
  quantidade: number;
  soma: number;
  media: number;
}

export interface ICategoriaMovimentacao {
  idCategoria: number | null;
  nomeCategoria: string;
  totalMovimentacoes: number;
  somaValores: number;
  tipo: "DEBITO" | "CREDITO" | string;
}

export interface ICategoriaFilha {
  idCategoria: number;
  nomeCategoria: string;
  valor: number;
  quantidade: number;
  pctDoPai: number;
}

export interface ICategoriaPai {
  idCategoria: number;
  nomeCategoria: string;
  valor: number;
  quantidade: number;
  filhas: ICategoriaFilha[];
}

export interface ICategoriaHierarquia {
  pais: ICategoriaPai[];
  top5Filhas: ICategoriaFilha[];
}

export interface ICategoriaPagoPendente {
  idCategoria: number | null;
  nomeCategoria: string;
  qtdPago: number;
  qtdPendente: number;
  valorPago: number;
  valorPendente: number;
  pctPago: number;
  pctPendente: number;
}

export interface ISemCategoriaPorConta {
  idConta: number | null;
  nomeConta: string;
  quantidade: number;
  valorTotal: number;
  primeiroVencimento: string | null;
  primeiraDescricao: string | null;
}

export interface ISemCategoriaLancamento {
  id: number;
  descricao: string;
  valor: number;
  dataVencimento: string;
  idConta: number | null;
  nomeConta: string;
  tipo: string;
  situacao: string;
}

export interface ISemCategoria {
  totalLancamentos: number;
  valorTotal: number;
  porConta: ISemCategoriaPorConta[];
  lancamentos: ISemCategoriaLancamento[];
}

export interface ICategoriaDistribuicaoRow {
  idCategoria: number | null;
  nomeCategoria: string;
  tipo: "DESPESA" | "RECEITA" | "MISTO";
  quantidade: number;
  soma: number;
  media: number;
  pctDoTotal: number;
}
