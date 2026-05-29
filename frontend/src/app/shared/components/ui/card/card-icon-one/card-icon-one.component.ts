import { Component } from "@angular/core";
import { CardTitleComponent } from "../card-title.component";
import { CardDescriptionComponent } from "../card-description.component";

@Component({
  selector: "app-card-icon-one",
  imports: [CardTitleComponent, CardDescriptionComponent],
  templateUrl: "./card-icon-one.component.html",
  styles: ``,
})
export class CardIconOneComponent {}
