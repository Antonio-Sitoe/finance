import { Component, inject } from "@angular/core";
import { CashFlowFacadeService } from "@/shared/services/cash-flow/cash-flow.facade.service";

@Component({
  selector: "app-cash-flow-kpis",
  templateUrl: "./cash-flow-kpis.component.html",
})
export class CashFlowKpisComponent {
  readonly facade = inject(CashFlowFacadeService);
}
