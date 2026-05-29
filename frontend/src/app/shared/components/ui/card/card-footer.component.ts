import { Component, Input } from "@angular/core";
import { NgClass } from "@angular/common";

@Component({
  selector: "app-card-footer",
  imports: [NgClass],
  template: `
    <div
      class="flex items-center gap-3 border-t border-gray-100 px-5 py-4 dark:border-white/[0.05] sm:px-6"
      [ngClass]="{ 'justify-end': align === 'end', 'justify-between': align === 'between' }"
    >
      <ng-content />
    </div>
  `,
})
export class CardFooterComponent {
  @Input() align: "start" | "end" | "between" = "start";
}
