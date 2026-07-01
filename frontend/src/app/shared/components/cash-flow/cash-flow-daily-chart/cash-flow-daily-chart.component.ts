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
  template: `
    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
    >
      <div
        class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">
          Movimentação Diária vs Saldo Acumulado
        </h3>
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="h-3 w-3 rounded-full bg-success-500"></span>
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >Entradas</span
            >
          </div>
          <div class="flex items-center gap-2">
            <span class="h-3 w-3 rounded-full bg-error-500"></span>
            <span class="text-sm text-gray-500 dark:text-gray-400">Saídas</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="h-5 w-5 rounded-full border-2 border-brand-500"></span>
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >Saldo Acumulado</span
            >
          </div>
        </div>
      </div>

      @if (hasData()) {
        <apx-chart
          [series]="series()"
          [chart]="chart"
          [xaxis]="xaxis()"
          [yaxis]="yaxis"
          [plotOptions]="plotOptions"
          [dataLabels]="dataLabels"
          [stroke]="stroke"
          [legend]="legend"
          [grid]="grid"
          [colors]="colors"
          [tooltip]="tooltip"
        />
      } @else {
        <div
          class="flex h-72 items-center justify-center text-sm text-gray-400 dark:text-gray-500"
        >
          Sem movimentação no período seleccionado
        </div>
      }
    </div>
  `,
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
