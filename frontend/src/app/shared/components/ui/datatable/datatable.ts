import { NgTemplateOutlet } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from "@angular/core";

export interface ColumnDef {
  id: string;
  label: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  width?: string;
}

@Component({
  selector: "app-datatable",
  imports: [NgTemplateOutlet],
  templateUrl: "./datatable.html",
})
export class DataTableComponent {
  @Input() columns: ColumnDef[] = [];
  @Input() data: unknown[] = [];
  @Input() rowTemplate: TemplateRef<{ $implicit: unknown }> | null = null;
  @Input() filtersTemplate: TemplateRef<void> | null = null;
  @Input() currentPage = 1;
  @Input() totalPages = 0;
  @Input() rowsPerPage = 10;
  @Input() totalElements = 0;
  @Input() loading = false;
  @Input() showPagination = true;

  @Output() sortChange = new EventEmitter<{
    columnId: string;
    direction: "asc" | "desc";
  }>();
  @Output() nextPage = new EventEmitter<void>();
  @Output() previousPage = new EventEmitter<void>();

  sortColumnId: string | null = null;
  sortDirection: "asc" | "desc" = "asc";

  get isEmpty(): boolean {
    return !this.loading && this.data.length === 0;
  }

  get startItemIndex(): number {
    if (this.isEmpty) return 0;
    return (this.currentPage - 1) * this.rowsPerPage + 1;
  }

  get endItemIndex(): number {
    const end = this.currentPage * this.rowsPerPage;
    return end > this.totalElements ? this.totalElements : end;
  }

  get canPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  get canNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  get skeletonRows(): number[] {
    return Array.from({ length: this.rowsPerPage }, (_, i) => i);
  }

  thAlignClass(align?: string): string {
    if (align === "center") return "text-center";
    if (align === "right") return "text-right";
    return "text-left";
  }

  handleSortClick(column: ColumnDef): void {
    if (!column.sortable) return;
    if (this.sortColumnId === column.id) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortColumnId = column.id;
      this.sortDirection = "asc";
    }
    this.sortChange.emit({
      columnId: column.id,
      direction: this.sortDirection,
    });
  }
}
