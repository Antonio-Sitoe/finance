import { Component, inject } from "@angular/core";
import { CashFlowFacadeService } from "@/shared/services/cash-flow/cash-flow.facade.service";
import { SolarDynamicIcon } from "@solar-icons/angular";

@Component({
  selector: "app-cash-flow-daily-table",
  templateUrl: "./cash-flow-daily-table.component.html",
  imports: [SolarDynamicIcon],
})
export class CashFlowDailyTableComponent {
  readonly facade = inject(CashFlowFacadeService);
}
