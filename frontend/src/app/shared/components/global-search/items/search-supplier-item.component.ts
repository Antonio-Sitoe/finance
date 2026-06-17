import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { SolarDynamicIcon } from "@solar-icons/angular";
import { IGlobalSearchSupplier } from "@/shared/interfaces/global-search.dto";

@Component({
  selector: "app-search-supplier-item",
  imports: [CommonModule, SolarDynamicIcon],
  template: `
    <div class="flex w-full items-center gap-3">
      <span
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
      >
        <ng-container [solarIcon]="'BuildingsBold'" [size]="20" />
      </span>
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium text-gray-800 dark:text-white/90">
          {{ supplier.nomeEmpresarial }}
        </p>
        @if (supplier.email) {
          <p class="truncate text-xs text-gray-400 dark:text-gray-500">
            {{ supplier.email }}
          </p>
        }
      </div>
      @if (supplier.nota != null) {
        <span
          class="flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold"
          [ngClass]="notaClass"
        >
          <ng-container [solarIcon]="'StarBold'" [size]="13" />
          {{ supplier.nota!.toFixed(1) }}
        </span>
      }
    </div>
  `,
})
export class SearchSupplierItemComponent {
  @Input({ required: true }) supplier!: IGlobalSearchSupplier;

  get notaClass(): string {
    const nota = this.supplier?.nota ?? 0;
    if (nota >= 7)
      return "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500";
    if (nota >= 5)
      return "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400";
    return "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500";
  }
}
