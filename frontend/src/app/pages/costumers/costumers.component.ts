import { Component } from "@angular/core";
import { PageHeaderComponent } from "@/shared/components/common/page-header/page-header.component";
import { CardStatComponent } from "@/shared/components/common/card-stat/card-stat.component";

@Component({
  selector: "app-costumers",
  imports: [PageHeaderComponent, CardStatComponent],
  templateUrl: "./costumers.component.html",
  styles: ``,
})
export class CostumersComponent {}
