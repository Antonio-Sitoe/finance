import { Component, Input } from "@angular/core";
import { NgClass } from "@angular/common";

@Component({
  selector: "app-card-media",
  imports: [NgClass],
  template: `
    <div class="overflow-hidden" [ngClass]="rounded ? 'rounded-lg' : ''">
      @if (src) {
        <img [src]="src" [alt]="alt" class="w-full object-cover" />
      } @else {
        <ng-content />
      }
    </div>
  `,
})
export class CardMediaComponent {
  @Input() src?: string;
  @Input() alt = "";
  @Input() rounded = false;
}
