import { DashboardFacadeService } from "@/shared/services/dashboard/dashboard.facade.service";
import { Component, inject } from "@angular/core";

@Component({
  selector: "app-monthly-target",
  imports: [],
  templateUrl: "./monthly-target.component.html",
})
export class MonthlyTargetComponent {
  readonly facade = inject(DashboardFacadeService);
}
