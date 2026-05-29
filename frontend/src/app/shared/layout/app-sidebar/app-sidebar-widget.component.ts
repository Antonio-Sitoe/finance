import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-widget',
  template: `
    <div
      class="mx-auto mb-10 w-full max-w-60 rounded-lg border border-gray-200 bg-white px-4 py-5 dark:border-white/[0.06] dark:bg-white/[0.03]"
    >
      <div class="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 dark:bg-brand-500/10">
        <svg class="h-4 w-4 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5h18M3 12h18M3 16.5h18" />
        </svg>
      </div>
      <h3 class="mb-1 text-theme-sm font-semibold text-gray-900 dark:text-white">
        Lançamentos
      </h3>
      <p class="mb-4 text-theme-xs text-gray-600 dark:text-gray-400">
        Registe receitas, despesas e transferências entre contas.
      </p>
      <button
        type="button"
        class="flex w-full items-center justify-center gap-1.5 rounded p-2.5 text-theme-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 transition-colors"
      >
        Novo Lançamento
        <span class="text-base leading-none">+</span>
      </button>
    </div>
  `
})
export class SidebarWidgetComponent {}