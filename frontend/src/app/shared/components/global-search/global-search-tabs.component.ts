import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  GlobalSearchTab,
  IGlobalSearchCounts,
} from "@/shared/interfaces/global-search.dto";

interface TabDef {
  key: GlobalSearchTab;
  label: string;
}

@Component({
  selector: "app-global-search-tabs",
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-1 overflow-x-auto">
      @for (tab of tabs; track tab.key) {
      <button
        type="button"
        (click)="tabChange.emit(tab.key)"
        class="flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition"
        [ngClass]="
          active === tab.key
            ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200'
        "
      >
        {{ tab.label }}
        @if (counts && count(tab.key) !== null) {
        <span
          class="rounded-full px-1.5 py-px text-[10px] font-semibold"
          [ngClass]="
            active === tab.key
              ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300'
              : 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400'
          "
        >
          {{ count(tab.key) }}
        </span>
        }
      </button>
      }
    </div>
  `,
})
export class GlobalSearchTabsComponent {
  @Input() active: GlobalSearchTab = "all";
  @Input() counts: IGlobalSearchCounts | null = null;
  @Output() tabChange = new EventEmitter<GlobalSearchTab>();

  readonly tabs: TabDef[] = [
    { key: "all", label: "Todos" },
    { key: "clientes", label: "Clientes" },
    { key: "fornecedores", label: "Fornecedores" },
    { key: "lancamentos", label: "Lançamentos" },
  ];

  count(key: GlobalSearchTab): number | null {
    if (!this.counts) return null;
    if (key === "all") return this.counts.total;
    return this.counts[key];
  }
}
