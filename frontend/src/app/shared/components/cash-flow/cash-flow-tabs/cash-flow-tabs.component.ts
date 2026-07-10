import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CashFlowTab } from "@/shared/interfaces/cash-flow.dto";
import { SolarDynamicIcon } from "@solar-icons/angular";

interface TabDef {
  key: CashFlowTab;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: "app-cash-flow-tabs",
  templateUrl: "./cash-flow-tabs.component.html",
  imports: [SolarDynamicIcon],
})
export class CashFlowTabsComponent {
  @Input() active: CashFlowTab = "fluxo-diario";
  @Input() exportDisabled = false;
  @Output() tabChange = new EventEmitter<CashFlowTab>();
  @Output() exportCsv = new EventEmitter<void>();

  readonly tabs: TabDef[] = [
    { key: "fluxo-diario", label: "Fluxo Diário" },
    { key: "dre", label: "Mini DRE" },
    { key: "capital-giro", label: "Capital de Giro", disabled: true },
    {
      key: "recebimentos-pagamentos",
      label: "Recebimentos vs Pagamentos",
      disabled: true,
    },
    { key: "projecao", label: "Projeção de Caixa", disabled: true },
  ];
}
