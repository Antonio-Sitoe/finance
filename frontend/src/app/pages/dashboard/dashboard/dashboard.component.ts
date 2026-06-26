import { MetricsCardsComponent } from "@/shared/components/dashboard/cards-metrics/cards-metrics.component";
import { Component, inject } from "@angular/core";
import { DashboardFooterActionsComponent } from "@/shared/components/dashboard/dashboard-footer-actions/dashboard-footer-actions.component";
import { MonthlyEvolutionChartComponent } from "@/shared/components/dashboard/monthly-evolution-chart/monthly-evolution-chart.component";
import { MonthlyTargetComponent } from "@/shared/components/dashboard/monthly-target/monthly-target.component";
import { DashboardFacadeService } from "@/shared/services/dashboard/dashboard.facade.service";
import { TransactionsFacadeService } from "@/shared/services/transactions/transactions.facade.service";

@Component({
  selector: "app-dashboard",
  imports: [
    MetricsCardsComponent,
    DashboardFooterActionsComponent,
    MonthlyEvolutionChartComponent,
    MonthlyTargetComponent,
  ],
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent {
  private readonly facade = inject(DashboardFacadeService);
  private readonly transactionsFacade = inject(TransactionsFacadeService);

  readonly today = new Date();

  get weekdayName(): string {
    return this.today.toLocaleDateString("pt-PT", { weekday: "long" });
  }

  get formattedDate(): string {
    return this.today.toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  get displayDayName(): string {
    return this.weekdayName.charAt(0).toUpperCase() + this.weekdayName.slice(1);
  }

  onRefresh(): void {
    this.facade.refresh();
    this.transactionsFacade.refresh();
  }
}
