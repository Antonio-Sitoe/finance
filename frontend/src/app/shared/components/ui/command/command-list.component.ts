import { Component } from '@angular/core'

/** `app-command-list` — área de resultados com scroll. */
@Component({
  selector: 'app-command-list',
  template: `
    <div class="flex-1 overflow-y-auto overscroll-contain">
      <ng-content></ng-content>
    </div>
  `,
})
export class CommandListComponent {}
