import { Component, computed, effect, inject, signal } from "@angular/core";
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from "ng-apexcharts";
import { CashFlowFacadeService } from "@/shared/services/cash-flow/cash-flow.facade.service";

@Component({
  selector: "app-cash-flow-daily-chart",
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: "./cash-flow-daily-chart.component.html",
})
export class CashFlowDailyChartComponent {
  private readonly facade = inject(CashFlowFacadeService);

  readonly hasData = computed(() => this.facade.dias().length > 0);

  readonly series = signal<ApexAxisChartSeries>([]);
  readonly xaxis = signal<ApexXAxis>({
    categories: [],
    axisBorder: { show: false },
    axisTicks: { show: false },
  });

  readonly chart: ApexChart = {
    fontFamily: "Outfit, sans-serif",
    type: "line",
    height: 320,
    toolbar: { show: false },
    zoom: { enabled: false },
  };

  readonly plotOptions: ApexPlotOptions = {
    bar: {
      columnWidth: "55%",
      borderRadius: 4,
      borderRadiusApplication: "end",
    },
  };

  readonly dataLabels: ApexDataLabels = { enabled: false };
  readonly stroke: ApexStroke = {
    width: [0, 0, 3],
    curve: "smooth",
  };
  readonly legend: ApexLegend = { show: false };
  readonly yaxis: ApexYAxis = {
    labels: {
      formatter: (value: number) =>
        value >= 1000
          ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`
          : value.toFixed(0),
    },
  };
  readonly grid: ApexGrid = {
    padding: { left: 8, right: 8 },
    yaxis: { lines: { show: true } },
  };
  readonly colors = ["#10b981", "#ef4444", "#465fff"];
  readonly tooltip: ApexTooltip = {
    shared: true,
    intersect: false,
    y: {
      formatter: (value: number) =>
        `MT ${new Intl.NumberFormat("pt-MZ", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value)}`,
    },
  };

  constructor() {
    effect(() => {
      const categories = this.facade.chartCategories();
      const entradas = this.facade.chartEntradas();
      const saidas = this.facade.chartSaidas();
      const saldo = this.facade.chartSaldoAcumulado();

      this.xaxis.set({
        categories,
        axisBorder: { show: false },
        axisTicks: { show: false },
      });

      this.series.set([
        { name: "Entradas", type: "column", data: entradas },
        { name: "Saídas", type: "column", data: saidas },
        { name: "Saldo Acumulado", type: "line", data: saldo },
      ]);
    });
  }
}
