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
