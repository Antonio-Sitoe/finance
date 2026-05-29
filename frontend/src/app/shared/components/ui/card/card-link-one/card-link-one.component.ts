import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CardTitleComponent } from "../card-title.component";
import { CardDescriptionComponent } from "../card-description.component";

@Component({
  selector: "app-card-link-one",
  imports: [RouterModule, CardTitleComponent, CardDescriptionComponent],
  templateUrl: "./card-link-one.component.html",
  styles: ``,
})
export class CardLinkOneComponent {}
