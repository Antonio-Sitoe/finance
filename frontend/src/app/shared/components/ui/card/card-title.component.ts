import { Component, Input } from "@angular/core";

@Component({
  selector: "app-card-title",
  template: `<h5
    [class]="'text-' + size + ' font-semibold text-gray-800 dark:text-white/90'"
  >
    <ng-content></ng-content>
  </h5>`,
})
export class CardTitleComponent {
  @Input() size: "sm" | "md" | "lg" = "md";
}
