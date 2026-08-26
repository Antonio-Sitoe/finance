import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { SolarDynamicIcon } from "@solar-icons/angular";
import {
  IRecebimentosPagamentos,
  IRecebimentosPagamentosMes,
} from "@/shared/interfaces/cash-flow.dto";

@Component({
  selector: "app-cash-flow-recebimentos-pagamentos",
  templateUrl: "./cash-flow-recebimentos-pagamentos.component.html",
  imports: [SolarDynamicIcon, RouterLink],
})
export class CashFlowRecebimentosPagamentosComponent {
  @Input() set report(value: IRecebimentosPagamentos | null) {
    this.data = value;
  }

  data: IRecebimentosPagamentos | null = null;

  maxBar(): number {
    if (!this.data) return 1;
    return Math.max(
      ...this.data.evolucaoMensal.flatMap((m) => [m.previsto, m.realizado]),
      1,
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
