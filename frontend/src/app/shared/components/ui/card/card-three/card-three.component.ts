import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CardComponent } from "../card.component";
import { CardTitleComponent } from "../card-title.component";
import { CardDescriptionComponent } from "../card-description.component";

@Component({
  selector: "app-card-three",
  imports: [
    RouterModule,
    CardComponent,
    CardTitleComponent,
    CardDescriptionComponent,
  ],
  templateUrl: "./card-three.component.html",
  styles: ``,
})
export class CardThreeComponent {}
