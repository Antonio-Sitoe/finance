import { Component, effect, inject } from "@angular/core";
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
import { IRevenueVsExpense } from "@/shared/interfaces/dashboard.dto";

@Component({
  selector: "app-monthly-evolution-chart",
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: "./monthly-evolution-chart.component.html",
})
export class MonthlyEvolutionChartComponent {
  private readonly facade = inject(DashboardFacadeService);

  public series: ApexAxisChartSeries = [];
  public chart: ApexChart = {
    fontFamily: "Outfit, sans-serif",
    type: "bar",
    height: 256,
    toolbar: { show: false },
  };
  public xaxis: ApexXAxis = {
    categories: [],
    axisBorder: { show: false },
    axisTicks: { show: false },
  };
  public plotOptions: ApexPlotOptions = {
    bar: {
      horizontal: false,
      columnWidth: "39%",
      borderRadius: 5,
      borderRadiusApplication: "end",
    },
  };
  public dataLabels: ApexDataLabels = { enabled: false };
  public stroke: ApexStroke = {
    show: true,
    width: 4,
    colors: ["transparent"],
  };
  public legend: ApexLegend = {
    show: false,
  };
  public yaxis: ApexYAxis = { title: { text: undefined } };
  public grid: ApexGrid = { yaxis: { lines: { show: true } } };
  public fill: ApexFill = { opacity: 1 };
  public tooltip: ApexTooltip = {
    x: { show: false },
    y: {
      formatter: (value: number) =>
        `MT ${new Intl.NumberFormat("pt-MZ", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value)}`,
    },
  };
  public colors: string[] = ["#10b981", "#ef4444"];

  constructor() {
    effect(() => {
      this.updateChart(this.facade.revenueVsExpenses());
    });
  }

  private updateChart(months: IRevenueVsExpense[]): void {
    if (!months.length) {
      this.series = [];
      this.xaxis = { ...this.xaxis, categories: [] };
      return;
    }

    this.series = [
      {
        name: "Receitas",
        data: months.map((month) => Number(month.receitas)),
      },
      {
        name: "Despesas",
        data: months.map((month) => Number(month.despesas)),
      },
    ];
    this.xaxis = {
      ...this.xaxis,
      categories: months.map((month) => this.formatMonthLabel(month.mes)),
    };
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
