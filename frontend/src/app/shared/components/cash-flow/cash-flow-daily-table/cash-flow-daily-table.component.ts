import { Component, inject } from "@angular/core";
import { CashFlowFacadeService } from "@/shared/services/cash-flow/cash-flow.facade.service";
import { SolarDynamicIcon } from "@solar-icons/angular";

@Component({
  selector: "app-cash-flow-daily-table",
  imports: [SolarDynamicIcon],
  template: `
    <div
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full text-left">
          <thead>
            <tr
              class="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02]"
            >
              <th
                class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Data
              </th>
              <th
                class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Entradas
              </th>
              <th
                class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Saídas
              </th>
              <th
                class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Saldo do Dia
              </th>
              <th
                class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Saldo Acumulado
              </th>
              <th class="w-10 px-5 py-4"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
            @for (dia of facade.dias(); track dia.data) {
              <tr
                class="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                [class.bg-error-50]="dia.saldoDia < 0"
                [class.dark:bg-error-500/5]="dia.saldoDia < 0"
                (click)="facade.toggleDay(dia.data)"
              >
                <td
                  class="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white/90"
                >
                  {{ facade.formatFullDate(dia.data) }}
                </td>
                <td
                  class="px-5 py-4 text-sm font-semibold tabular-nums text-success-600 dark:text-success-400"
                >
                  @if (facade.hasMovement(dia)) {
                    {{ facade.formatAmount(dia.entradas) }}
                  } @else {
                    <span class="text-gray-400">—</span>
                  }
                </td>
                <td
                  class="px-5 py-4 text-sm tabular-nums text-error-600 dark:text-error-400"
                >
                  @if (facade.hasMovement(dia)) {
                    {{ facade.formatAmount(dia.saidas) }}
                  } @else {
                    <span class="text-gray-400">—</span>
                  }
                </td>
                <td
                  class="px-5 py-4 text-sm font-semibold tabular-nums"
                  [class.text-success-600]="dia.saldoDia > 0"
                  [class.dark:text-success-400]="dia.saldoDia > 0"
                  [class.text-error-600]="dia.saldoDia < 0"
                  [class.dark:text-error-400]="dia.saldoDia < 0"
                  [class.text-gray-400]="dia.saldoDia === 0"
                >
                  @if (facade.hasMovement(dia)) {
                    {{ facade.formatAmount(dia.saldoDia, true) }}
                  } @else {
                    —
                  }
                </td>
                <td
                  class="px-5 py-4 text-sm font-medium tabular-nums text-gray-800 dark:text-white/90"
                >
                  {{ facade.formatAmount(dia.saldoAcumulado) }}
                </td>
                <td class="px-5 py-4">
                  @if (dia.lancamentos.length) {
                    <ng-container
                      [solarIcon]="
                        facade.isDayExpanded(dia.data)
                          ? 'AltArrowUpBold'
                          : 'AltArrowDownBold'
                      "
                      [size]="18"
                      class="text-gray-400"
                    />
                  }
                </td>
              </tr>

              @if (
                facade.isDayExpanded(dia.data) && dia.lancamentos.length
              ) {
                <tr class="bg-gray-50 dark:bg-white/[0.02]">
                  <td colspan="6" class="px-5 py-5">
                    <div class="space-y-4">
                      <div
                        class="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-800"
                      >
                        <h4
                          class="text-sm font-semibold text-gray-800 dark:text-white/90"
                        >
                          Lançamentos do dia
                        </h4>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                          {{ dia.lancamentos.length }} registo(s)
                        </span>
                      </div>
                      <div class="overflow-x-auto">
                        <table class="min-w-full text-left text-sm">
                          <thead>
                            <tr class="text-xs text-gray-500 dark:text-gray-400">
                              <th class="pb-2 pr-4 font-medium">Descrição</th>
                              <th class="pb-2 pr-4 font-medium">Conta</th>
                              <th class="pb-2 pr-4 font-medium">Categoria</th>
                              <th class="pb-2 pr-4 font-medium">Situação</th>
                              <th class="pb-2 font-medium text-right">Valor</th>
                            </tr>
                          </thead>
                          <tbody>
                            @for (item of dia.lancamentos; track item.id) {
                              <tr>
                                <td
                                  class="py-2 pr-4 text-gray-800 dark:text-white/90"
                                >
                                  {{ item.descricao }}
                                </td>
                                <td class="py-2 pr-4 text-gray-600 dark:text-gray-400">
                                  {{ item.conta }}
                                </td>
                                <td class="py-2 pr-4 text-gray-600 dark:text-gray-400">
                                  {{ item.categoria }}
                                </td>
                                <td class="py-2 pr-4">
                                  <span
                                    class="rounded-full px-2 py-0.5 text-xs font-medium"
                                    [class.bg-success-50]="item.situacao === 'PAGO'"
                                    [class.text-success-600]="item.situacao === 'PAGO'"
                                    [class.bg-warning-50]="item.situacao === 'PENDENTE'"
                                    [class.text-warning-600]="item.situacao === 'PENDENTE'"
                                  >
                                    {{ item.situacao }}
                                  </span>
                                </td>
                                <td
                                  class="py-2 text-right font-semibold tabular-nums"
                                  [class.text-success-600]="item.tipo === 'RECEITA'"
                                  [class.text-error-600]="item.tipo === 'DESPESA'"
                                >
                                  {{ item.tipo === "RECEITA" ? "+" : "−" }}
                                  {{ facade.formatAmount(item.valor) }}
                                </td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </td>
                </tr>
              }
            } @empty {
              <tr>
                <td
                  colspan="6"
                  class="px-5 py-10 text-center text-sm text-gray-400 dark:text-gray-500"
                >
                  Sem dados para o período seleccionado
                </td>
              </tr>
            }
          </tbody>
          @if (facade.resumo(); as resumo) {
            <tfoot>
              <tr
                class="border-t border-gray-200 bg-gray-50 font-semibold dark:border-gray-800 dark:bg-white/[0.02]"
              >
                <td class="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                  Totais
                </td>
                <td
                  class="px-5 py-4 text-sm tabular-nums text-success-600 dark:text-success-400"
                >
                  {{ facade.formatAmount(resumo.totalEntradas) }}
                </td>
                <td
                  class="px-5 py-4 text-sm tabular-nums text-error-600 dark:text-error-400"
                >
                  {{ facade.formatAmount(resumo.totalSaidas) }}
                </td>
                <td
                  class="px-5 py-4 text-sm tabular-nums text-gray-800 dark:text-white/90"
                >
                  {{
                    facade.formatAmount(
                      resumo.totalEntradas - resumo.totalSaidas,
                      true
                    )
                  }}
                </td>
                <td
                  class="px-5 py-4 text-sm tabular-nums text-gray-800 dark:text-white/90"
                >
                  {{ facade.formatAmount(resumo.saldoFinal) }}
                </td>
                <td></td>
              </tr>
            </tfoot>
          }
        </table>
      </div>
    </div>
  `,
})
export class CashFlowDailyTableComponent {
  readonly facade = inject(CashFlowFacadeService);
}
