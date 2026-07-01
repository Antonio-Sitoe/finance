import { Component, computed, inject } from "@angular/core";
import { BadgeComponent } from "../../ui/badge/badge.component";
import { SafeHtmlPipe } from "../../../pipe/safe-html.pipe";
import { DashboardFacadeService } from "@/shared/services/dashboard/dashboard.facade.service";
import { SolarDynamicIcon, SolarIconName } from "@solar-icons/angular";

type IconAccent = "brand" | "success" | "error" | "warning";

interface MetricCard {
  label: string;
  icon: SolarIconName;
  accent: IconAccent;
  value: () => string;
}

interface AlertCard {
  label: string;
  iconHtml: string;
  accent: IconAccent;
  badgeText: string;
  badgeColor: "error" | "warning";
  value: () => string;
}

@Component({
  selector: "app-cards-metrics",
  imports: [BadgeComponent, SafeHtmlPipe, SolarDynamicIcon],
  templateUrl: "./cards-metrics.component.html",
})
export class MetricsCardsComponent {
  readonly facade = inject(DashboardFacadeService);

  readonly accentIconClasses: Record<IconAccent, string> = {
    brand:
      "bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400",
    success:
      "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400",
    error: "bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-400",
    warning:
      "bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400",
  };

  readonly accentBorderClasses: Record<IconAccent, string> = {
    brand: "border-l-brand-500",
    success: "border-l-success-500",
    error: "border-l-error-500",
    warning: "border-l-warning-500",
  };

  readonly metricCards = computed<MetricCard[]>(() => {
    const dashboard = this.facade.dashboard();
    const resultado = dashboard?.resultadoMes ?? 0;

    return [
      {
        label: "Saldo Actual",
        icon: "WalletMoneyBold",
        accent: "brand",
        value: () => this.facade.formatAmount(dashboard?.saldoAtual),
      },
      {
        label: "Contas a Receber",
        icon: "DownloadMinimalisticBold",
        accent: "success",
        value: () => this.facade.formatAmount(dashboard?.contasAReceber),
      },
      {
        label: "Contas a Pagar",
        icon: "UploadMinimalisticBold",
        accent: "error",
        value: () => this.facade.formatAmount(dashboard?.contasAPagar),
      },
      {
        label: "Receitas do Mês",
        icon: "GraphNewUpBold",
        accent: "success",
        value: () => this.facade.formatAmount(dashboard?.totalReceitasMes),
      },
      {
        label: "Despesas do Mês",
        icon: "GraphDownNewBold",
        accent: "error",
        value: () => this.facade.formatAmount(dashboard?.totalDespesasMes),
      },
      {
        label: "Resultado Líquido",
        icon: "WalletBold",
        accent: resultado >= 0 ? "success" : "error",
        value: () => this.facade.formatAmount(dashboard?.resultadoMes),
      },
    ];
  });

  readonly alertCards = computed<AlertCard[]>(() => {
    const alerts = this.facade.alerts();

    return [
      {
        label: "Receitas Vencidas",
        iconHtml: this.icons.warningIcon,
        accent: "error",
        badgeText: "Vencido",
        badgeColor: "error",
        value: () => this.facade.formatAmount(alerts?.receitasVencidas),
      },
      {
        label: "Despesas Vencidas",
        iconHtml: this.icons.alertIcon,
        accent: "error",
        badgeText: "Vencido",
        badgeColor: "error",
        value: () => this.facade.formatAmount(alerts?.despesasVencidas),
      {
        label: "Vencem Hoje",
        iconHtml: this.icons.calendarIcon,
        accent: "warning",
        badgeText: "Pendente",
        badgeColor: "warning",
        value: () => String(alerts?.qtdLancamentosVencemHoje ?? 0),
      },
    ];
  });

  private readonly icons = {
    warningIcon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3 2 21h20L12 3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 9v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>`,
    alertIcon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 7v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="16.5" r=".75" fill="currentColor"/></svg>`,
    calendarIcon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M3 10h18M7 3v3M17 3v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="15" r="2" fill="currentColor" opacity="0.4"/></svg>`,
  };
}
