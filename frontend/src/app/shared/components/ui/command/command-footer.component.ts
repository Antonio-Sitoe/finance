import { Component } from '@angular/core'

/** `app-command-footer` — barra de atalhos de teclado. */
@Component({
  selector: 'app-command-footer',
  template: `
    <div
      class="hidden items-center gap-5 border-t border-gray-100 px-5 py-2.5 sm:flex dark:border-gray-800"
    >
      <span class="flex items-center gap-1.5">
        <kbd
          class="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          >↵</kbd
        >
        <span class="text-[11px] text-gray-400 dark:text-gray-500">seleccionar</span>
      </span>
      <span class="flex items-center gap-1.5">
        <kbd
          class="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          >↑↓</kbd
        >
        <span class="text-[11px] text-gray-400 dark:text-gray-500">navegar</span>
      </span>
      <span class="flex items-center gap-1.5">
        <kbd
          class="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          >ESC</kbd
        >
        <span class="text-[11px] text-gray-400 dark:text-gray-500">fechar</span>
      </span>
    </div>
  `,
})
export class CommandFooterComponent {}
