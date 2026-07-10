import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { SolarDynamicIcon } from "@solar-icons/angular";
import {
  IRecebimentosPagamentos,
  IRecebimentosPagamentosMes,
} from "@/shared/interfaces/cash-flow.dto";

export const MOCK_RECEBIMENTOS_PAGAMENTOS: IRecebimentosPagamentos = {
  de: "2026-07-01",
  ate: "2026-07-31",
  recebimentos: {
    previsto: 480000,
    realizado: 452930,
    taxaPercentual: 94.3,
    emAtraso: 25000,
  },
  pagamentos: {
    previsto: 315000,
    realizado: 312450,
    taxaPercentual: 99.2,
    emAtraso: 8000,
  },
  evolucaoMensal: [
    { mes: "Jan", previsto: 60, realizado: 55 },
    { mes: "Fev", previsto: 75, realizado: 70 },
    { mes: "Mar", previsto: 85, realizado: 82 },
    { mes: "Abr", previsto: 65, realizado: 60 },
    { mes: "Mai", previsto: 90, realizado: 88 },
    { mes: "Jun", previsto: 80, realizado: 75 },
  ],
};

@Component({
  selector: "app-cash-flow-recebimentos-pagamentos",
  templateUrl: "./cash-flow-recebimentos-pagamentos.component.html",
  imports: [SolarDynamicIcon, RouterLink],
})
export class CashFlowRecebimentosPagamentosComponent {
  @Input() set report(value: IRecebimentosPagamentos | null) {
    this.data = value ?? MOCK_RECEBIMENTOS_PAGAMENTOS;
  }

  data: IRecebimentosPagamentos = MOCK_RECEBIMENTOS_PAGAMENTOS;

  maxBar(): number {
    return Math.max(
      ...this.data.evolucaoMensal.flatMap((m) => [m.previsto, m.realizado]),
      1
    );
  }

  barHeight(value: number): number {
    return Math.round((value / this.maxBar()) * 100);
  }

  formatAmount(value: number): string {
    return (
      "MT " +
      new Intl.NumberFormat("pt-MZ", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    );
  }

  formatPercent(value: number): string {
    return (
      new Intl.NumberFormat("pt-MZ", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(value) + "%"
    );
  }

  formatDate(iso: string): string {
    return new Date(iso + "T00:00:00").toLocaleDateString("pt-MZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  trackMes(_: number, item: IRecebimentosPagamentosMes) {
    return item.mes;
  }
}
