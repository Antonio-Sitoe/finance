import { Component, Input } from "@angular/core";
import { NgClass } from "@angular/common";

@Component({
  selector: "app-card",
  imports: [NgClass],
  templateUrl: "./card.component.html",
})
export class CardComponent {
  @Input() layout: "vertical" | "horizontal" = "vertical";
  @Input() padding = true;
}
