import { Component } from "@angular/core";

@Component({
  selector: "app-card-content",
  template: `
    <div class="p-5 sm:p-6">
      <ng-content />
    </div>
  `,
})
export class CardContentComponent {}
