import { Component } from "@angular/core";
import { CardComponent } from "../card.component";
import { CardTitleComponent } from "../card-title.component";
import { CardDescriptionComponent } from "../card-description.component";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-card-one",
  imports: [
    CardComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    RouterModule,
  ],
  templateUrl: "./card-one.component.html",
  styles: ``,
})
export class CardOneComponent {}
