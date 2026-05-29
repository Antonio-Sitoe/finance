import { Component, Input } from "@angular/core";
import { NgClass } from "@angular/common";

@Component({
  selector: "app-card-actions",
  imports: [NgClass],
  template: `
    <div
      class="flex items-center gap-3"
      [ngClass]="{ 'mt-4': spacing, 'justify-end': align === 'end', 'justify-between': align === 'between' }"
    >
      <ng-content />
    </div>
  `,
})
export class CardActionsComponent {
  @Input() spacing = true;
  @Input() align: "start" | "end" | "between" = "start";
}
