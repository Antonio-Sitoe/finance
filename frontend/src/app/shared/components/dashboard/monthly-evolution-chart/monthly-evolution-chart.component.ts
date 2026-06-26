import { Component, computed, effect, inject, signal } from "@angular/core";
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexPlotOptions,
  ApexDataLabels,
  ApexStroke,
  ApexLegend,
  ApexYAxis,
  ApexGrid,
  ApexFill,
  ApexTooltip,
} from "ng-apexcharts";
import { DashboardFacadeService } from "@/shared/services/dashboard/dashboard.facade.service";

@Component({
  selector: "app-monthly-evolution-chart",
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: "./monthly-evolution-chart.component.html",
  host: { class: "block h-full w-full" },
})
export class MonthlyEvolutionChartComponent {
  private readonly facade = inject(DashboardFacadeService);

  readonly hasChartData = computed(
    () => this.facade.revenueVsExpenses().length > 0
  );

  readonly series = signal<ApexAxisChartSeries>([]);
  readonly xaxis = signal<ApexXAxis>({
    categories: [],
    axisBorder: { show: false },
    axisTicks: { show: false },
  });

  readonly chart: ApexChart = {
    fontFamily: "Outfit, sans-serif",
    type: "bar",
    height: 320,
    width: "100%",
    toolbar: { show: false },
    redrawOnParentResize: true,
  };
  readonly plotOptions: ApexPlotOptions = {
    bar: {
      horizontal: false,
      columnWidth: "72%",
      borderRadius: 4,
      borderRadiusApplication: "end",
    },
  };
  readonly dataLabels: ApexDataLabels = { enabled: false };
  readonly stroke: ApexStroke = { show: false };
  readonly legend: ApexLegend = {
    show: false,
  };
  readonly yaxis: ApexYAxis = {
    title: { text: undefined },
    min: 0,
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
  readonly fill: ApexFill = { opacity: 1 };
  readonly tooltip: ApexTooltip = {
    x: { show: false },
    y: {
      formatter: (value: number) =>
        `MT ${new Intl.NumberFormat("pt-MZ", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value)}`,
    },
  };
  readonly colors: string[] = ["#10b981", "#ef4444"];

  constructor() {
    effect(() => {
      const months = this.facade.revenueVsExpenses();

      if (!months.length) {
        this.series.set([]);
        this.xaxis.set({
          categories: [],
          axisBorder: { show: false },
          axisTicks: { show: false },
        });
        return;
      }

      this.series.set([
        {
          name: "Receitas",
          data: months.map((month) => Number(month.receitas)),
        },
        {
          name: "Despesas",
          data: months.map((month) => Number(month.despesas)),
        },
      ]);
      this.xaxis.set({
        categories: months.map((month) => this.formatMonthLabel(month.mes)),
        axisBorder: { show: false },
        axisTicks: { show: false },
      });
    });
  }

  private formatMonthLabel(yearMonth: string): string {
    const [, month] = yearMonth.split("-");
    const labels = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez",
    ];
    return labels[Number(month) - 1] ?? yearMonth;
  }
}
