import { Component, inject, signal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { DataTableComponent, ColumnDef } from "@/shared/components/ui/datatable/datatable";
import { BadgeComponent } from "@/shared/components/ui/badge/badge.component";
import { CheckboxComponent } from "@/shared/components/ui/input/checkbox.component";
import { InputFieldComponent } from "@/shared/components/ui/input/input-field.component";
import { SelectComponent } from "@/shared/components/ui/select/select.component";
import { CostumerDetailDrawerComponent } from "@/shared/components/costumers/costumer-detail-drawer/costumer-detail-drawer.component";
import { CreateAndEditCostumerComponent } from "@/shared/components/costumers/create-and-edit-costumer/create-and-edit-costumer.component";
import { SolarDynamicIcon } from "@solar-icons/angular";
import { CustomerFacadeService } from "@/shared/services/customers/customer.listing.service";
import { ICustomerDTO } from "@/shared/interfaces/costumers.dto";

@Component({
  selector: "app-costumers-list-table",
  imports: [
    DatePipe,
    DataTableComponent,
    BadgeComponent,
    CheckboxComponent,
    InputFieldComponent,
    SelectComponent,
    CostumerDetailDrawerComponent,
    CreateAndEditCostumerComponent,
    SolarDynamicIcon,
  ],
  templateUrl: "./costumers-list-table.component.html",
})
export class CostumersListTableComponent {
  private readonly router = inject(Router);
  readonly facade = inject(CustomerFacadeService);

  readonly drawerOpen = signal(false);
  readonly detailDrawerOpen = signal(false);

  readonly columns: ColumnDef[] = [
    { id: "empresa", label: "Empresa" },
    { id: "telefone", label: "Telefone" },
    { id: "rating", label: "Rating" },
    { id: "situacao", label: "Estado", align: "center" },
    { id: "createdAt", label: "Data de Registo" },
    { id: "acoes", label: "", align: "right" },
  ];

  openEdit(customer?: ICustomerDTO): void {
    this.facade.setEditingCustomer(customer ?? null);
    this.detailDrawerOpen.set(false);
    this.drawerOpen.set(true);
  }

  openDetail(customer: ICustomerDTO): void {
    this.facade.setEditingCustomer(customer);
    this.detailDrawerOpen.set(true);
  }

  openContacts(customer: ICustomerDTO): void {
    this.router.navigate(["/costumers", customer.id, "contacts"]);
  }
}
