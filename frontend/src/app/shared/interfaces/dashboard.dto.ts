export interface IDashboard {
  totalReceitasMes: number;
  totalDespesasMes: number;
  saldoAtual: number;
  resultadoMes: number;
  contasAPagar: number;
  contasAReceber: number;
}

export interface IDashboardAlert {
  receitasVencidas: number;
  despesasVencidas: number;
  qtdLancamentosVencemHoje: number;
}

export interface IMonthlyReport {
  ano: number;
  mes: number;
  totalLancamentos: number;
  somaReceitas: number;
  somaDespesas: number;
  saldoMes: number;
}

export interface IAnnualReport {
  ano: number;
  meses: IMonthlyReport[];
  totalAnual: number;
  saldoTotalAnual: number;
}

export interface IAccountBalance {
  label: string;
  value: number;
}
