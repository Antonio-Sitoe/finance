import { Component } from "@angular/core";
import { CardTitleComponent } from "../card-title.component";
import { CardDescriptionComponent } from "../card-description.component";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-card-four",
  imports: [CardTitleComponent, CardDescriptionComponent, RouterModule],
  templateUrl: "./card-four.component.html",
  styles: ``,
})
export class CardFourComponent {}
