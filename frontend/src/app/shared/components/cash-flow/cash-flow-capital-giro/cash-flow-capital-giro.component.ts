import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { SolarDynamicIcon } from "@solar-icons/angular";
import {
  ICapitalGiro,
  ICapitalGiroTitulo,
} from "@/shared/interfaces/cash-flow.dto";

export const MOCK_CAPITAL_GIRO: ICapitalGiro = {
  activoCirculante: 1240500,
  passivoCirculante: 845200,
  capitalGiro: 395300,
  liquidezCorrente: 1.47,
  aReceber: [
    {
      id: 1,
      nome: "Tecnologia Global SA",
      vencimento: "2026-07-12",
      valor: 45000,
    },
    {
      id: 2,
      nome: "Logística Express Ltda",
      vencimento: "2026-07-15",
      valor: 12800,
    },
    {
      id: 3,
      nome: "Consultoria Estratégica",
      vencimento: "2026-07-18",
      valor: 8500,
    },
    {
      id: 4,
      nome: "Indústria Têxtil Modelo",
      vencimento: "2026-07-22",
      valor: 125000,
    },
    {
      id: 5,
      nome: "Varejo Central Corp",
      vencimento: "2026-07-25",
      valor: 32200,
    },
  ],
  aPagar: [
    {
      id: 11,
      nome: "Amazon Web Services",
      vencimento: "2026-07-11",
      valor: 4200,
    },
    {
      id: 12,
      nome: "Aluguel Office Tower",
      vencimento: "2026-07-15",
      valor: 22000,
    },
    {
      id: 13,
      nome: "Energia Elétrica",
      vencimento: "2026-07-18",
      valor: 1850,
    },
    {
      id: 14,
      nome: "Softwares de Gestão",
      vencimento: "2026-07-24",
      valor: 12300,
    },
    {
      id: 15,
      nome: "Folha de Pagamento",
      vencimento: "2026-07-30",
      valor: 156000,
    },
  ],
};

@Component({
  selector: "app-cash-flow-capital-giro",
  templateUrl: "./cash-flow-capital-giro.component.html",
  imports: [SolarDynamicIcon, RouterLink],
})
export class CashFlowCapitalGiroComponent {
  @Input() set report(value: ICapitalGiro | null) {
    this.data = value ?? MOCK_CAPITAL_GIRO;
  }

  data: ICapitalGiro = MOCK_CAPITAL_GIRO;

  liquidezLabel(): string {
    const v = this.data.liquidezCorrente;
    if (v == null) return "—";
    if (v >= 1.5) return "Excelente";
    if (v >= 1) return "Saudável";
    if (v >= 0.8) return "Atenção";
    return "Crítico";
  }

  liquidezBarWidth(): number {
    const v = this.data.liquidezCorrente;
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
