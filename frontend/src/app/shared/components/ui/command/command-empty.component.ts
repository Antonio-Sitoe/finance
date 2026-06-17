import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { SolarDynamicIcon } from '@solar-icons/angular'

/** `app-command-empty` — estado vazio / sem resultados. */
@Component({
  selector: 'app-command-empty',
  imports: [CommonModule, SolarDynamicIcon],
  template: `
    <div class="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span
        class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500"
      >
        <ng-container [solarIcon]="icon" [size]="24" />
      </span>
      <div>
        <p class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ title }}</p>
        @if (description) {
          <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">{{ description }}</p>
        }
      </div>
    </div>
  `,
})
export class CommandEmptyComponent {
  @Input() icon = 'MagnifierBold'
  @Input() title = 'Sem resultados'
  @Input() description = ''
}
