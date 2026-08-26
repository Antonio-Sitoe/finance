import { Component, Input, signal } from "@angular/core";
import { SolarDynamicIcon } from "@solar-icons/angular";
import {
  IProjecaoCaixa,
  IProjecaoHorizonte,
  ProjecaoHorizonte,
  ProjecaoRiscoNivel,
} from "@/shared/interfaces/cash-flow.dto";

@Component({
  selector: "app-cash-flow-projecao",
  templateUrl: "./cash-flow-projecao.component.html",
  imports: [SolarDynamicIcon],
})
export class CashFlowProjecaoComponent {
  @Input() set report(value: IProjecaoCaixa | null) {
    this.data = value;
    if (value) this.horizonte.set(value.horizonteActivo);
  }

  data: IProjecaoCaixa | null = null;
  readonly horizonte = signal<ProjecaoHorizonte>(90);
  readonly horizontesDisponiveis: ProjecaoHorizonte[] = [30, 60, 90];

  setHorizonte(dias: ProjecaoHorizonte) {
    this.horizonte.set(dias);
  }

  horizonteActivo(): IProjecaoHorizonte {
    const hs = this.data!.horizontes;
    return hs.find((h) => h.dias === this.horizonte()) ?? hs[hs.length - 1];
  }

  riscoLabel(risco: ProjecaoRiscoNivel): string {
    switch (risco) {
      case "BAIXO":
        return "Baixo";
      case "MEDIO":
        return "Médio";
      case "ALTO":
        return "Alto";
    }
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

  trackHorizonte(_: number, item: IProjecaoHorizonte) {
    return item.dias;
  }
}
