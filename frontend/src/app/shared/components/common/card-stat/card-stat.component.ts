import { Component, input } from "@angular/core";
import { CardTitleComponent } from "../../ui/card/card-title.component";
import { CardDescriptionComponent } from "../../ui/card/card-description.component";
import {
  SolarDynamicIcon,
  IconComponent,
  SolarIconName,
} from "@solar-icons/angular";

@Component({
  selector: "app-card-stat",
  imports: [CardDescriptionComponent, SolarDynamicIcon, CardTitleComponent],
  templateUrl: "./card-stat.component.html",
})
export class CardStatComponent {
  icon = input<IconComponent | SolarIconName | null>(null);
  iconSize = input<number>(24);
  title = input<string>("");
  value = input<string>("");
  description = input<string>("");
}
