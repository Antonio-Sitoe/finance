import { Component } from '@angular/core';

@Component({
  selector: 'app-card-title',
  template: `<h5 class="text-base font-semibold text-gray-800 dark:text-white/90"><ng-content></ng-content></h5>`,
})
export class CardTitleComponent {}
