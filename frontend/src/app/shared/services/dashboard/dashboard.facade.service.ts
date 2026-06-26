import { inject, Injectable, signal } from "@angular/core";
import { DashboardApiService } from "./dashboard.api.service";
import {
  IDashboard,
  IDashboardAlert,
  IAnnualReport,
  IMonthlyReport,
  IAccountBalance,
} from "@/shared/interfaces/dashboard.dto";

@Injectable({ providedIn: "root" })
export class DashboardFacadeService {
  private readonly api = inject(DashboardApiService);

  readonly dashboard = signal<IDashboard | null>(null);
  readonly alertas = signal<IDashboardAlert | null>(null);
  readonly relatorioAnual = signal<IAnnualReport | null>(null);
  readonly porConta = signal<IAccountBalance[]>([]);

  constructor() {
    this.loadAll();
  }

  loadAll(): void {
    this.api.getDashboard().subscribe((data) => this.dashboard.set(data));
    this.api.getAlertas().subscribe((data) => this.alertas.set(data));
    this.api.getRelatorioAnual().subscribe((data) => this.relatorioAnual.set(data));
    this.api.getPorConta().subscribe((data) => this.porConta.set(data));
  }

  get monthlyReports(): IMonthlyReport[] {
    return this.relatorioAnual()?.meses ?? [];
  }

  formatCurrency(value: number | null | undefined): string {
    if (value == null) return "€ 0,00";
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  }

  monthLabel(mes: number): string {
    const labels = [
      "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
      "JUL", "AGO", "SET", "OUT", "NOV", "DEZ",
    ];
    return labels[mes - 1] ?? "";
  }

  get months(): { label: string; receita: number; despesa: number }[] {
    return this.monthlyReports.map((m) => ({
      label: this.monthLabel(m.mes),
      receita: m.somaReceitas,
      despesa: m.somaDespesas,
    }));
  }

  refresh(): void {
    this.loadAll();
  }
}
