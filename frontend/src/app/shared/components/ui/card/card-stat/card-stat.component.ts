import { Component, input, TemplateRef } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { CardTitleComponent } from "../card-title.component";
import { CardDescriptionComponent } from "../card-description.component";

@Component({
  selector: "app-card-stat",
  imports: [CardTitleComponent, CardDescriptionComponent, NgTemplateOutlet],
  templateUrl: "./card-stat.component.html",
})
export class CardStatComponent {
  icon = input<TemplateRef<void> | null>(null);
  title = input<string>("");
  description = input<string>("");
}
