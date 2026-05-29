import { Component } from '@angular/core';

@Component({
  selector: 'app-card-description',
  template: `<p class="mt-1 text-sm text-gray-500 dark:text-gray-400"><ng-content></ng-content></p>`,
})
export class CardDescriptionComponent {}
