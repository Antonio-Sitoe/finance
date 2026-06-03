import { Component, signal } from "@angular/core";
import { PageHeaderComponent } from "@/shared/components/common/page-header/page-header.component";
import { CardStatComponent } from "@/shared/components/common/card-stat/card-stat.component";
import { CostumersListTableComponent } from "@/shared/components/costumers/costumers-list-table/costumers-list-table.component";
import { CreateAndEditCostumerComponent } from "@/shared/components/costumers/create-and-edit-costumer/create-and-edit-costumer.component";
// import { CostumerDetailDrawerComponent } from "@/shared/components/costumers/costumer-detail-drawer/costumer-detail-drawer.component";

@Component({
  selector: "app-costumers",
  imports: [
    PageHeaderComponent,
    CardStatComponent,
    CostumersListTableComponent,
    CreateAndEditCostumerComponent,
  ],
  templateUrl: "./costumers.component.html",
  styles: ``,
})
export class CostumersComponent {
  readonly createAndEditDrawerOpen = signal(false);
  readonly detailDrawerOpen = signal(false);
  readonly isEditing = signal(false);
  readonly selectedCostumerId = signal<string | null>(null);
}
