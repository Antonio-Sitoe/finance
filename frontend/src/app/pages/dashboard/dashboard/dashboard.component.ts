import { MetricsCardsComponent } from "@/shared/components/dashboard/cards-metrics/cards-metrics.component";
import { Component } from "@angular/core";
import { DashboardFooterActionsComponent } from "@/shared/components/dashboard/dashboard-footer-actions/dashboard-footer-actions.component";
import { MonthlyEvolutionChartComponent } from "@/shared/components/dashboard/monthly-evolution-chart/monthly-evolution-chart.component";
import { MonthlyTargetComponent } from "@/shared/components/dashboard/monthly-target/monthly-target.component";

@Component({
  selector: "app-dashboard",
  imports: [MetricsCardsComponent, DashboardFooterActionsComponent, MonthlyEvolutionChartComponent, MonthlyTargetComponent],
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent {
  hoje = new Date();

  get diaSemana(): string {
    return this.hoje.toLocaleDateString("pt-PT", { weekday: "long" });
  }

  get dataFormatada(): string {
    return this.hoje.toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  get nomeDia(): string {
    return this.diaSemana.charAt(0).toUpperCase() + this.diaSemana.slice(1);
  }
  receitasVencidas = 0;
  despesasVencidas = 0;
  qtdLancamentosVencemHoje = 0;
}
