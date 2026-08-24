import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { SolarDynamicIcon } from "@solar-icons/angular";
import {
  ICapitalGiro,
  ICapitalGiroTitulo,
} from "@/shared/interfaces/cash-flow.dto";

@Component({
  selector: "app-cash-flow-capital-giro",
  templateUrl: "./cash-flow-capital-giro.component.html",
  imports: [SolarDynamicIcon, RouterLink],
})
export class CashFlowCapitalGiroComponent {
  @Input() set report(value: ICapitalGiro | null) {
    this.data = value;
  }

  data: ICapitalGiro | null = null;

  liquidezLabel(): string {
    const v = this.data?.liquidezCorrente;
    if (v == null) return "—";
    if (v >= 1.5) return "Excelente";
    if (v >= 1) return "Saudável";
    if (v >= 0.8) return "Atenção";
    return "Crítico";
  }

  liquidezBarWidth(): number {
    const v = this.data?.liquidezCorrente;
    if (v == null) return 0;
    return Math.min(100, Math.round((v / 2) * 100));
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

  formatDate(iso: string): string {
    return new Date(iso + "T00:00:00").toLocaleDateString("pt-MZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  trackTitulo(_: number, item: ICapitalGiroTitulo) {
    return item.id;
  }
}
