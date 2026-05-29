import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CardTitleComponent } from "../card-title.component";
import { CardDescriptionComponent } from "../card-description.component";
import { CardComponent } from "../card.component";

@Component({
  selector: "app-card-link-two",
  imports: [RouterModule, CardTitleComponent, CardDescriptionComponent],
  templateUrl: "./card-link-two.component.html",
  styles: ``,
})
export class CardLinkTwoComponent {}
