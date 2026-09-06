import { Component, effect, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import {
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip,
  NgApexchartsModule,
} from "ng-apexcharts";

import { IClienteClassificacaoNota } from "@/shared/interfaces/clientes-relatorio.dto";
import { ClientesRelatorioFacadeService } from "@/shared/services/clientes-relatorio/clientes-relatorio.facade.service";

@Component({
  selector: "app-clientes-relatorio-visao-geral",
  imports: [RouterLink, NgApexchartsModule],
  templateUrl: "./clientes-relatorio-visao-geral.component.html",
})
export class ClientesRelatorioVisaoGeralComponent {
  readonly facade = inject(ClientesRelatorioFacadeService);
  readonly statusSeries = signal<ApexNonAxisChartSeries>([0, 0]);
  readonly statusChart: ApexChart = {
    type: "donut",
    height: 210,
    fontFamily: "Outfit, sans-serif",
  };
  readonly statusLabels = ["Ativos", "Inativos"];
  readonly statusColors = ["#10b981", "#98a2b3"];
  readonly statusDataLabels: ApexDataLabels = { enabled: false };
  readonly statusLegend: ApexLegend = { show: false };
  readonly statusStroke: ApexStroke = { width: 0 };
  readonly statusTooltip: ApexTooltip = {
    y: { formatter: (value: number) => `${value} clientes` },
  };
  readonly statusPlotOptions: ApexPlotOptions = {
    pie: {
      donut: {
        size: "72%",
        labels: {
          show: true,
          name: {
            show: true,
            offsetY: 18,
            formatter: () => "clientes",
          },
          value: {
            show: true,
            offsetY: -16,
            fontSize: "26px",
            fontWeight: 700,
            formatter: (value: string) => Number(value).toFixed(0),
          },
          total: {
            show: true,
            label: "Total",
            formatter: (context) =>
              context.globals.seriesTotals
                .reduce((sum: number, value: number) => sum + value, 0)
                .toFixed(0),
          },
        },
      },
    },
  };

  constructor() {
    effect(() => {
      const status = this.facade.status();
      this.statusSeries.set([
        Number(status?.activos ?? 0),
        Number(status?.inativos ?? 0),
      ]);
    });
  }

  classificationLabel(value: IClienteClassificacaoNota["classification"]): string {
    return {
      NORMAL: "Normal (0–3)",
      MASTER: "Master (4–5)",
      VIP: "VIP (6–10)",
    }[value];
  }

  classificationWidth(item: IClienteClassificacaoNota): number {
    const max = Math.max(
      ...this.facade.classificacao().map((value) => value.quantidadeClientes),
      1,
    );
    return Math.max(5, (item.quantidadeClientes / max) * 100);
  }

  classificationTone(value: IClienteClassificacaoNota["classification"]): string {
    return {
      NORMAL: "bg-gray-400",
      MASTER: "bg-warning-500",
      VIP: "bg-brand-500",
    }[value];
  }
}
