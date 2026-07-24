import { computed, inject, Injectable, signal } from "@angular/core";
import { finalize, tap } from "rxjs";
import {
  CashFlowPeriodPreset,
  CashFlowTab,
  IDre,
  IFluxoDiario,
  IFluxoDiarioDia,
} from "@/shared/interfaces/cash-flow.dto";
import { CashFlowApiService } from "./cash-flow.api.service";

@Injectable({ providedIn: "root" })
export class CashFlowFacadeService {
  private readonly api = inject(CashFlowApiService);

  readonly loading = signal(false);
  readonly report = signal<IFluxoDiario | null>(null);
  readonly dreLoading = signal(false);
  readonly dreReport = signal<IDre | null>(null);
  readonly activeTab = signal<CashFlowTab>("fluxo-diario");
  readonly periodPreset = signal<CashFlowPeriodPreset>("month");
  readonly expandedDay = signal<string | null>(null);

  readonly customRange = signal<{ de: string; ate: string } | null>(null);

  readonly periodRange = computed(() => {
    const preset = this.periodPreset();
    const custom = this.customRange();

    if (preset === "custom" && custom) {
      return custom;
    }

    const today = new Date();
    const ate = this.toIsoDate(today);

    switch (preset) {
      case "week": {
        const deDate = new Date(today);
        deDate.setDate(today.getDate() - 6);
        return { de: this.toIsoDate(deDate), ate };
      }
      case "quarter": {
        const deDate = new Date(today);
        deDate.setMonth(today.getMonth() - 2);
        deDate.setDate(1);
        return { de: this.toIsoDate(deDate), ate };
      }
      case "year": {
        const deDate = new Date(today.getFullYear(), 0, 1);
        return { de: this.toIsoDate(deDate), ate };
      }
      case "month":
      default: {
        const deDate = new Date(today.getFullYear(), today.getMonth(), 1);
        return { de: this.toIsoDate(deDate), ate };
      }
    }
  });

  readonly resumo = computed(() => this.report()?.resumo ?? null);
  readonly dias = computed(() => this.report()?.dias ?? []);

  readonly chartCategories = computed(() =>
    this.dias().map((dia) => this.formatDayLabel(dia.data))
  );

  readonly chartEntradas = computed(() =>
    this.dias().map((dia) => Number(dia.entradas))
  );

  readonly chartSaidas = computed(() =>
    this.dias().map((dia) => Number(dia.saidas))
  );

  readonly chartSaldoAcumulado = computed(() =>
    this.dias().map((dia) => Number(dia.saldoAcumulado))
  );

  loadFluxoDiario() {
    const { de, ate } = this.periodRange();
    this.loading.set(true);

    return this.api.getFluxoDiario(de, ate, true).pipe(
      tap((report) => this.report.set(report)),
      finalize(() => this.loading.set(false))
    );
  }

  loadDre() {
    const { de, ate } = this.periodRange();
    this.dreLoading.set(true);

    return this.api.getDre(de, ate).pipe(
      tap((report) => this.dreReport.set(report)),
      finalize(() => this.dreLoading.set(false))
    );
  }

  setActiveTab(tab: CashFlowTab) {
    this.activeTab.set(tab);
  }

  setPeriodPreset(preset: CashFlowPeriodPreset) {
    this.periodPreset.set(preset);
    if (preset !== "custom") {
      this.customRange.set(null);
    }
  }

  setCustomRange(de: string, ate: string) {
    this.customRange.set({ de, ate });
    this.periodPreset.set("custom");
  }

  toggleDay(data: string) {
    this.expandedDay.update((current) => (current === data ? null : data));
  }

  isDayExpanded(data: string): boolean {
    return this.expandedDay() === data;
  }

  formatAmount(value: number | null | undefined, signed = false): string {
    if (value == null) return "—";
    const abs = Math.abs(value);
    const formatted = new Intl.NumberFormat("pt-MZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(abs);

    if (signed && value !== 0) {
      const prefix = value > 0 ? "+" : "−";
      return `${prefix} MT ${formatted}`;
    }

    return `MT ${formatted}`;
  }

  formatDayLabel(isoDate: string): string {
    const date = new Date(isoDate + "T00:00:00");
    return date.toLocaleDateString("pt-MZ", {
      day: "2-digit",
      month: "short",
    });
  }

  formatFullDate(isoDate: string): string {
    const date = new Date(isoDate + "T00:00:00");
    return date.toLocaleDateString("pt-MZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  hasMovement(dia: IFluxoDiarioDia): boolean {
    return Number(dia.entradas) > 0 || Number(dia.saidas) > 0;
  }

  exportCsv() {
    const report = this.report();
    if (!report) return;

    const header = [
      "Data",
      "Entradas",
      "Saídas",
      "Saldo do Dia",
      "Saldo Acumulado",
    ];
    const rows = report.dias.map((dia) => [
      this.formatFullDate(dia.data),
      this.hasMovement(dia) ? String(dia.entradas) : "—",
      this.hasMovement(dia) ? String(dia.saidas) : "—",
      this.hasMovement(dia) ? String(dia.saldoDia) : "—",
      String(dia.saldoAcumulado),
    ]);

    const footer = [
      "Totais",
      String(report.resumo.totalEntradas),
      String(report.resumo.totalSaidas),
      String(report.resumo.totalEntradas - report.resumo.totalSaidas),
      String(report.resumo.saldoFinal),
    ];

    const csv = [header, ...rows, footer]
      .map((row) => row.map((cell) => `"${cell}"`).join(";"))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `fluxo-caixa-${report.de}-${report.ate}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}
