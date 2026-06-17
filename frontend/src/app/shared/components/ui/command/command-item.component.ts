import { Component, EventEmitter, Output } from '@angular/core'

/**
 * `app-command-item` — invólucro clicável de um resultado.
 * Fornece o estado de hover/foco consistente; o conteúdo é projectado.
 */
@Component({
  selector: 'app-command-item',
  template: `
    <button
      type="button"
      (click)="select.emit()"
      class="group flex w-full items-center gap-3 rounded-xl border border-transparent px-2 py-2 text-left transition hover:border-gray-100 hover:bg-gray-50 focus:outline-none focus-visible:border-brand-200 focus-visible:bg-gray-50 dark:hover:border-gray-800 dark:hover:bg-white/5 dark:focus-visible:bg-white/5"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class CommandItemComponent {
  @Output() select = new EventEmitter<void>()
}
