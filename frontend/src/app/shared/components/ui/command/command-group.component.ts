import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'

/**
 * `app-command-group` — secção com cabeçalho e acção "Ver todos".
 * Os itens são projectados via `<ng-content>`.
 */
@Component({
  selector: 'app-command-group',
  imports: [CommonModule],
  template: `
    <section class="border-b border-gray-100 px-3 py-3 last:border-b-0 dark:border-gray-800">
      <header class="flex items-center justify-between px-2 pb-2">
        <h3
          class="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500"
        >
          {{ heading }}
        </h3>
        @if (showViewAll) {
          <button
            type="button"
            (click)="viewAll.emit()"
            class="text-xs font-medium text-brand-500 transition hover:text-brand-600 hover:underline dark:text-brand-400"
          >
            {{ viewAllLabel }}
          </button>
        }
      </header>
      <div class="space-y-1">
        <ng-content></ng-content>
      </div>
    </section>
  `,
})
export class CommandGroupComponent {
  @Input() heading = ''
  @Input() viewAllLabel = 'Ver todos'
  @Input() showViewAll = true
  @Output() viewAll = new EventEmitter<void>()
}
