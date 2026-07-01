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
  template: `
    <div
      class="flex flex-col gap-4 border-b border-gray-200 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex gap-6 overflow-x-auto no-scrollbar">
        @for (tab of tabs; track tab.key) {
          <button
            type="button"
            (click)="!tab.disabled && tabChange.emit(tab.key)"
            class="shrink-0 border-b-2 pb-3 text-sm font-medium transition-colors"
            [class.border-brand-500]="active === tab.key"
            [class.text-brand-600]="active === tab.key"
            [class.dark:text-brand-400]="active === tab.key"
            [class.border-transparent]="active !== tab.key"
            [class.text-gray-500]="active !== tab.key && !tab.disabled"
            [class.hover:text-gray-700]="active !== tab.key && !tab.disabled"
            [class.dark:text-gray-400]="active !== tab.key && !tab.disabled"
            [class.opacity-50]="tab.disabled"
            [class.cursor-not-allowed]="tab.disabled"
          >
            {{ tab.label }}
            @if (tab.disabled) {
              <span class="ml-1 text-[10px] uppercase tracking-wide text-gray-400"
                >em breve</span
              >
            }
          </button>
        }
      </div>
      <div class="flex shrink-0 gap-2 pb-2">
        <button
          type="button"
          (click)="exportCsv.emit()"
          [disabled]="exportDisabled"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03]"
        >
          <ng-container [solarIcon]="'DownloadMinimalisticBold'" [size]="16" />
          CSV
        </button>
      </div>
    </div>
  `,
  imports: [SolarDynamicIcon],
})
export class CashFlowTabsComponent {
  @Input() active: CashFlowTab = "fluxo-diario";
  @Input() exportDisabled = false;
  @Output() tabChange = new EventEmitter<CashFlowTab>();
  @Output() exportCsv = new EventEmitter<void>();

  readonly tabs: TabDef[] = [
    { key: "fluxo-diario", label: "Fluxo Diário" },
    { key: "dre", label: "DRE", disabled: true },
    { key: "capital-giro", label: "Capital de Giro", disabled: true },
    {
      key: "recebimentos-pagamentos",
      label: "Recebimentos vs Pagamentos",
      disabled: true,
    },
    { key: "projecao", label: "Projeção de Caixa", disabled: true },
  ];
}
