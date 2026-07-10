import { Component, Input, signal } from "@angular/core";
import { SolarDynamicIcon } from "@solar-icons/angular";
import {
  IProjecaoCaixa,
  IProjecaoHorizonte,
  ProjecaoHorizonte,
  ProjecaoRiscoNivel,
} from "@/shared/interfaces/cash-flow.dto";

export const MOCK_PROJECAO: IProjecaoCaixa = {
  horizonteActivo: 90,
  saldoAtual: 142500,
  entradasPrevistas: 85230,
  saidasPrevistas: 62180,
  saldoProjetado: 165550,
  variacaoPercentual: 16.1,
  riscoInadimplenciaPercentual: 8.2,
  impactoRisco: 6980,
  horizontes: [
    {
      dias: 30,
      entradas: 28000,
      saidas: 22000,
      saldoProjetado: 148500,
      risco: "BAIXO",
      riscoPercentual: 5,
    },
    {
      dias: 60,
      entradas: 55000,
      saidas: 41000,
      saldoProjetado: 156500,
      risco: "MEDIO",
      riscoPercentual: 18,
    },
    {
      dias: 90,
      entradas: 85230,
      saidas: 62180,
      saldoProjetado: 165550,
      risco: "BAIXO",
      riscoPercentual: 8,
    },
  ],
  insights: [
    {
      tipo: "oportunidade",
      titulo: "Oportunidade de aplicação",
      descricao:
        "Excesso de liquidez projectado para D+45. Considere aplicar o excedente.",
    },
    {
      tipo: "alerta",
      titulo: "Pico de saídas",
      descricao:
        "Semana a meio do horizonte concentra impostos e folha. Saldo em alerta.",
    },
  ],
  principaisDevedores: [
    {
      id: 1,
      nome: "Construtora Alvorada Ltda",
      valor: 12450,
      venceEmDias: 3,
      risco: "ALTO",
    },
    {
      id: 2,
      nome: "Logística Express S.A.",
      valor: 8200,
      venceEmDias: 12,
      risco: "MEDIO",
    },
    {
      id: 3,
      nome: "Tecnologia Horizonte",
      valor: 5100,
      venceEmDias: 25,
      risco: "BAIXO",
    },
  ],
};

@Component({
  selector: "app-cash-flow-projecao",
  templateUrl: "./cash-flow-projecao.component.html",
  imports: [SolarDynamicIcon],
})
export class CashFlowProjecaoComponent {
  @Input() set report(value: IProjecaoCaixa | null) {
    this.data = value ?? MOCK_PROJECAO;
    this.horizonte.set(this.data.horizonteActivo);
  }

  data: IProjecaoCaixa = MOCK_PROJECAO;
  readonly horizonte = signal<ProjecaoHorizonte>(90);
  readonly horizontesDisponiveis: ProjecaoHorizonte[] = [30, 60, 90];

  setHorizonte(dias: ProjecaoHorizonte) {
    this.horizonte.set(dias);
  }

  horizonteActivo(): IProjecaoHorizonte {
    return (
      this.data.horizontes.find((h) => h.dias === this.horizonte()) ??
      this.data.horizontes[this.data.horizontes.length - 1]
    );
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
