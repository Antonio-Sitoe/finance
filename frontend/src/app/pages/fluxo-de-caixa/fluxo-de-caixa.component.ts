import { Component, inject, OnInit, signal } from "@angular/core";
import { CashFlowPeriodFilterComponent } from "@/shared/components/cash-flow/cash-flow-period-filter/cash-flow-period-filter.component";
import { CashFlowTabsComponent } from "@/shared/components/cash-flow/cash-flow-tabs/cash-flow-tabs.component";
import { CashFlowKpisComponent } from "@/shared/components/cash-flow/cash-flow-kpis/cash-flow-kpis.component";
import { CashFlowDailyChartComponent } from "@/shared/components/cash-flow/cash-flow-daily-chart/cash-flow-daily-chart.component";
import { CashFlowDailyTableComponent } from "@/shared/components/cash-flow/cash-flow-daily-table/cash-flow-daily-table.component";
import { CashFlowDreComponent } from "@/shared/components/cash-flow/cash-flow-dre/cash-flow-dre.component";
import { CashFlowFacadeService } from "@/shared/services/cash-flow/cash-flow.facade.service";
import {
  CashFlowPeriodPreset,
  CashFlowTab,
} from "@/shared/interfaces/cash-flow.dto";

@Component({
  selector: "app-fluxo-de-caixa",
  imports: [
    CashFlowPeriodFilterComponent,
    CashFlowTabsComponent,
    CashFlowKpisComponent,
    CashFlowDailyChartComponent,
    CashFlowDailyTableComponent,
    CashFlowDreComponent,
  ],
  templateUrl: "./fluxo-de-caixa.component.html",
})
export class FluxoDeCaixaComponent implements OnInit {
  readonly facade = inject(CashFlowFacadeService);

  readonly showCustomPicker = signal(false);
  readonly customDe = signal("");
  readonly customAte = signal("");

  ngOnInit() {
    this.reload();
  }

  onTabChange(tab: CashFlowTab) {
    this.facade.setActiveTab(tab);
  }

  onPresetChange(preset: CashFlowPeriodPreset) {
    this.facade.setPeriodPreset(preset);
    this.showCustomPicker.set(preset === "custom");

    if (preset === "custom") {
      const range = this.facade.periodRange();
      this.customDe.set(range.de);
      this.customAte.set(range.ate);
      return;
    }

    this.reload();
  }

  applyCustomRange() {
    const de = this.customDe();
    const ate = this.customAte();

    if (!de || !ate) return;

    this.facade.setCustomRange(de, ate);
    this.reload();
  }

  onExport() {
    if (this.facade.activeTab() === "fluxo-diario") {
      this.facade.exportCsv();
    }
    // Mini DRE: export fica para a integração
  }

  reload() {
    if (this.facade.activeTab() === "fluxo-diario") {
      this.facade.loadFluxoDiario().subscribe();
    }
  }
}
