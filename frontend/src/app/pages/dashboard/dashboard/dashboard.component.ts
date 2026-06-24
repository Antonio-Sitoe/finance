import { MetricsCardsComponent } from "@/shared/components/dashboard/cards-metrics/cards-metrics.component";
import { Component } from "@angular/core";

@Component({
  selector: "app-dashboard",
  imports: [MetricsCardsComponent],
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent {}
