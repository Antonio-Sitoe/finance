import { computed, inject, Injectable, signal } from "@angular/core";
import { forkJoin, map, Observable, tap } from "rxjs";
import { DashboardApiService } from "./dashboard.api.service";
import {
  IDashboard,
  IDashboardAlert,
  IAnnualReport,
  IMonthlyReport,
  IAccountBalance,
  IRevenueVsExpense,
  ITopCategoryExpense,
  IMonthlyChartPoint,
  ICategoryExpenseSummary,
} from "@/shared/interfaces/dashboard.dto";

@Injectable({ providedIn: "root" })
export class DashboardFacadeService {
  private readonly api = inject(DashboardApiService);

  readonly dashboard = signal<IDashboard | null>(null);
  readonly alerts = signal<IDashboardAlert | null>(null);
  readonly annualReport = signal<IAnnualReport | null>(null);
  readonly accountBalances = signal<IAccountBalance[]>([]);
  readonly revenueVsExpenses = signal<IRevenueVsExpense[]>([]);
  readonly topCategories = signal<ITopCategoryExpense[]>([]);

  readonly categoryExpenseSummaries = computed<ICategoryExpenseSummary[]>(() => {
    const items = this.topCategories();
    const total = items.reduce((sum, item) => sum + Number(item.total), 0);

    return items.map((item) => {
      const amount = Number(item.total);
      return {
        categoryName: item.nome,
        amount,
        percent: total > 0 ? Math.round((amount / total) * 100) : 0,
      };
    });
  });

  constructor() {
    this.loadAll().subscribe();
  }

  loadAll(): Observable<void> {
    return forkJoin({
      dashboard: this.api.getDashboard(),
      alerts: this.api.getAlerts(),
      annualReport: this.api.getAnnualReport(),
      accountBalances: this.api.getByAccount(),
      revenueVsExpenses: this.api.getRevenueVsExpenses(),
      topCategories: this.api.getTopCategories(),
    }).pipe(
      tap(
        ({
          dashboard,
          alerts,
          annualReport,
          accountBalances,
          revenueVsExpenses,
          topCategories,
        }) => {
          this.dashboard.set(dashboard);
          this.alerts.set(alerts);
          this.annualReport.set(annualReport);
          this.accountBalances.set(accountBalances);
          this.revenueVsExpenses.set(revenueVsExpenses);
          this.topCategories.set(topCategories);
        }
      ),
      map(() => void 0)
    );
  }

  get monthlyReports(): IMonthlyReport[] {
    return this.annualReport()?.meses ?? [];
  }

  formatAmount(value: number | null | undefined): string {
    if (value == null) return "MT 0,00";
    return `MT ${new Intl.NumberFormat("pt-MZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)}`;
  }

  monthLabel(month: number): string {
    const labels = [
      "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
      "JUL", "AGO", "SET", "OUT", "NOV", "DEZ",
    ];
    return labels[month - 1] ?? "";
  }

  get months(): IMonthlyChartPoint[] {
    return this.monthlyReports.map((report) => ({
      label: this.monthLabel(report.mes),
      revenue: report.somaReceitas,
      expense: report.somaDespesas,
    }));
  }

  refresh(): Observable<void> {
    return this.loadAll();
  }
}
