import { Component, Input } from "@angular/core";
import { NgClass } from "@angular/common";

@Component({
  selector: "app-card-header",
  imports: [NgClass],
  template: `
    <div
      class="flex items-start justify-between px-5 pt-5 sm:px-6 sm:pt-6"
      [ngClass]="{ 'border-b border-gray-100 pb-4 dark:border-white/[0.05]': divider }"
    >
      <ng-content />
    </div>
  `,
})
export class CardHeaderComponent {
  @Input() divider = false;
}
