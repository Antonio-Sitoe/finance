import { DecimalPipe } from "@angular/common";
import { Component, effect, inject, signal } from "@angular/core";
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

import { CategoriasRelatorioFacadeService } from "@/shared/services/categorias-relatorio/categorias-relatorio.facade.service";

@Component({
  selector: "app-categorias-relatorio-distribuicao",
  imports: [NgApexchartsModule, DecimalPipe],
  templateUrl: "./categorias-relatorio-distribuicao.component.html",
})
export class CategoriasRelatorioDistribuicaoComponent {
  readonly facade = inject(CategoriasRelatorioFacadeService);

  readonly receitaSeries = signal<ApexNonAxisChartSeries>([]);
  readonly despesaSeries = signal<ApexNonAxisChartSeries>([]);
  readonly receitaLabels = signal<string[]>([]);
  readonly despesaLabels = signal<string[]>([]);

  readonly chart: ApexChart = {
    type: "donut",
    height: 220,
    fontFamily: "Outfit, sans-serif",
  };
  readonly dataLabels: ApexDataLabels = { enabled: false };
  readonly legend: ApexLegend = { show: false };
  readonly stroke: ApexStroke = { width: 0 };
  readonly plotOptions: ApexPlotOptions = {
    pie: {
      donut: {
        size: "72%",
        labels: {
          show: true,
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
  readonly receitaColors = ["#12b76a", "#465fff", "#f79009", "#ee46bc", "#717680"];
  readonly despesaColors = ["#f04438", "#fdb022", "#9b8afb", "#36bffa", "#98a2b3"];
  readonly tooltip: ApexTooltip = {
    y: {
      formatter: (value: number) => this.facade.formatAmount(value),
    },
  };

  constructor() {
    effect(() => {
      const receita = this.facade.receitaDonut();
      this.receitaSeries.set(receita.series);
      this.receitaLabels.set(receita.labels);
      const despesa = this.facade.despesaDonut();
      this.despesaSeries.set(despesa.series);
      this.despesaLabels.set(despesa.labels);
    });
  }
}
