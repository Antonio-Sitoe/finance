export interface IFluxoDiarioLancamento {
  id: number;
  descricao: string;
  conta: string;
  categoria: string;
  valor: number;
  tipo: "RECEITA" | "DESPESA";
  situacao: "PAGO" | "PENDENTE";
}

export interface IFluxoDiarioDia {
  data: string;
  entradas: number;
  saidas: number;
  saldoDia: number;
  saldoAcumulado: number;
  lancamentos: IFluxoDiarioLancamento[];
}

export interface IFluxoDiarioResumo {
  saldoInicial: number;
  totalEntradas: number;
  totalSaidas: number;
  saldoFinal: number;
}

export interface IFluxoDiario {
  de: string;
  ate: string;
  resumo: IFluxoDiarioResumo;
  dias: IFluxoDiarioDia[];
}

export type CashFlowPeriodPreset =
  | "week"
  | "month"
  | "quarter"
  | "year"
  | "custom";

export type CashFlowTab =
  | "fluxo-diario"
  | "dre"
  | "capital-giro"
  | "recebimentos-pagamentos"
  | "projecao";

/** Mini DRE — contratos prontos para integração futura */
export interface IDreLancamento {
  id: number;
  descricao: string;
  conta: string;
  valor: number;
  data: string;
}

export interface IDreCategoria {
  categoriaId: number | null;
  nome: string;
  total: number;
  percentual: number;
  lancamentos: IDreLancamento[];
}

export interface IDreResumo {
  totalReceitas: number;
  totalDespesas: number;
  resultado: number;
  margemPercentual: number;
}

export interface IDre {
  de: string;
  ate: string;
  resumo: IDreResumo;
  receitas: IDreCategoria[];
  despesas: IDreCategoria[];
}

/** Capital de Giro */
export interface ICapitalGiroTitulo {
  id: number;
  nome: string;
  vencimento: string;
  valor: number;
}

export interface ICapitalGiro {
  activoCirculante: number;
  passivoCirculante: number;
  capitalGiro: number;
  liquidezCorrente: number | null;
  aReceber: ICapitalGiroTitulo[];
  aPagar: ICapitalGiroTitulo[];
}

/** Recebimentos vs Pagamentos */
export interface IRecebimentosPagamentosBloco {
  previsto: number;
  realizado: number;
  taxaPercentual: number;
  emAtraso: number;
}

export interface IRecebimentosPagamentosMes {
  mes: string;
  previsto: number;
  realizado: number;
}

export interface IRecebimentosPagamentos {
  de: string;
  ate: string;
  recebimentos: IRecebimentosPagamentosBloco;
  pagamentos: IRecebimentosPagamentosBloco;
  evolucaoMensal: IRecebimentosPagamentosMes[];
}

/** Projecção de Caixa */
export type ProjecaoHorizonte = 30 | 60 | 90;
export type ProjecaoRiscoNivel = "BAIXO" | "MEDIO" | "ALTO";

export interface IProjecaoHorizonte {
  dias: ProjecaoHorizonte;
  entradas: number;
  saidas: number;
  saldoProjetado: number;
  risco: ProjecaoRiscoNivel;
  riscoPercentual: number;
}

export interface IProjecaoDevedor {
  id: number;
  nome: string;
  valor: number;
  venceEmDias: number;
  risco: ProjecaoRiscoNivel;
}

export interface IProjecaoInsight {
  tipo: "oportunidade" | "alerta";
  titulo: string;
  descricao: string;
}

export interface IProjecaoCaixa {
  horizonteActivo: ProjecaoHorizonte;
  saldoAtual: number;
  entradasPrevistas: number;
  saidasPrevistas: number;
  saldoProjetado: number;
  variacaoPercentual: number;
  riscoInadimplenciaPercentual: number;
  impactoRisco: number;
  horizontes: IProjecaoHorizonte[];
  insights: IProjecaoInsight[];
  principaisDevedores: IProjecaoDevedor[];
}
