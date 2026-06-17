import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { SolarDynamicIcon } from "@solar-icons/angular";
import {
  IGlobalSearchTransaction,
  LancamentoEstado,
} from "@/shared/interfaces/global-search.dto";

@Component({
  selector: "app-search-transaction-item",
  imports: [CommonModule, SolarDynamicIcon],
  template: `
    <div class="flex w-full items-center gap-3">
      <span
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        [ngClass]="
          isCredito
            ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500'
            : 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'
        "
      >
        <ng-container
          [solarIcon]="isCredito ? 'GraphNewUpBold' : 'GraphDownNewBold'"
          [size]="20"
        />
      </span>
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium text-gray-800 dark:text-white/90">
          {{ transaction.descricao }}
        </p>
        <div class="flex items-center gap-2">
          <span class="truncate text-xs text-gray-400 dark:text-gray-500">
            {{ transaction.referencia ? transaction.referencia + ' · ' + transaction.data : transaction.data }}
          </span>
          <span
            class="rounded px-1.5 py-px text-[10px] font-semibold uppercase"
            [ngClass]="estadoClass"
          >
            {{ estadoLabel }}
          </span>
        </div>
      </div>
      <span
        class="shrink-0 text-sm font-semibold"
        [ngClass]="
          isCredito
            ? 'text-success-600 dark:text-success-500'
            : 'text-error-600 dark:text-error-500'
        "
      >
        {{ isCredito ? '+' : '-' }}{{ transaction.valor | number: '1.2-2' }}
      </span>
    </div>
  `,
})
export class SearchTransactionItemComponent {
  @Input({ required: true }) transaction!: IGlobalSearchTransaction;

  get isCredito(): boolean {
    return this.transaction?.tipo === "CREDITO";
  }

  get estadoLabel(): string {
    const map: Record<LancamentoEstado, string> = {
      PAGO: "Pago",
      LIQUIDADO: "Liquidado",
      PENDENTE: "Pendente",
      VENCIDO: "Vencido",
    };
    return map[this.transaction.estado] ?? this.transaction.estado;
  }

  get estadoClass(): string {
    switch (this.transaction.estado) {
      case "PAGO":
      case "LIQUIDADO":
        return "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500";
      case "VENCIDO":
        return "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500";
      default:
        return "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400";
    }
  }
}
