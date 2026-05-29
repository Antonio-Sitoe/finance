import { Component } from "@angular/core";
import { PageHeaderComponent } from "../../../shared/components/common/page-header/page-header.component";
import { DataTableComponent, ColumnDef } from "../../../shared/components/ui/datatable/datatable";
import { BadgeComponent } from "../../../shared/components/ui/badge/badge.component";
import { AvatarTextComponent } from "../../../shared/components/ui/avatar/avatar-text.component";

interface DemoRow {
  id: string;
  user: { name: string; email: string };
  product: string;
  value: string;
  date: string;
  status: "Complete" | "Pending" | "Cancel";
}

@Component({
  selector: "app-basic-tables",
  imports: [PageHeaderComponent, DataTableComponent, BadgeComponent, AvatarTextComponent],
  templateUrl: "./basic-tables.component.html",
  styles: ``,
})
export class BasicTablesComponent {
  columns: ColumnDef[] = [
    { id: "id", label: "Deal ID", sortable: true },
    { id: "user", label: "Cliente" },
    { id: "product", label: "Produto/Serviço" },
    { id: "value", label: "Valor", align: "right" },
    { id: "date", label: "Data", sortable: true },
    { id: "status", label: "Estado", align: "center" },
  ];

  allRows: DemoRow[] = [
    { id: "DE124321", user: { name: "John Doe", email: "johndoe@gmail.com" }, product: "Software License", value: "$18,500.34", date: "2024-06-15", status: "Complete" },
    { id: "DE124322", user: { name: "Jane Smith", email: "janesmith@gmail.com" }, product: "Cloud Hosting", value: "$12,990.00", date: "2024-06-18", status: "Pending" },
    { id: "DE124323", user: { name: "Michael Brown", email: "michaelbrown@gmail.com" }, product: "Web Domain", value: "$950.00", date: "2024-06-20", status: "Cancel" },
    { id: "DE124324", user: { name: "Alice Johnson", email: "alicejohnson@gmail.com" }, product: "SSL Certificate", value: "$230.45", date: "2024-06-25", status: "Pending" },
    { id: "DE124325", user: { name: "Robert Lee", email: "robertlee@gmail.com" }, product: "Premium Support", value: "$1,520.00", date: "2024-06-30", status: "Complete" },
    { id: "DE124326", user: { name: "Sara White", email: "sara@gmail.com" }, product: "Analytics Pro", value: "$890.00", date: "2024-07-01", status: "Complete" },
    { id: "DE124327", user: { name: "Tom Harris", email: "tom@gmail.com" }, product: "Storage Plan", value: "$340.00", date: "2024-07-03", status: "Pending" },
  ];

  rowsPerPage = 5;
  currentPage = 1;

  get totalPages(): number {
    return Math.ceil(this.allRows.length / this.rowsPerPage);
  }

  get pagedRows(): DemoRow[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.allRows.slice(start, start + this.rowsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  getBadgeColor(status: string): "success" | "warning" | "error" {
    if (status === "Complete") return "success";
    if (status === "Pending") return "warning";
    return "error";
  }
}
