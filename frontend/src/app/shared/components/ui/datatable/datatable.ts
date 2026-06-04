import { NgTemplateOutlet } from "@angular/common";
import {
  Component,
  EventEmitter,
  inject,
  Injector,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { toObservable } from "@angular/core/rxjs-interop";
import { skip } from "rxjs";
import { ListStore } from "@/shared/config/listing/list.store";
import { FilterMap } from "@/shared/config/listing/listing.dto";

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
export class DataTableComponent implements OnInit {
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
  @Input() store?: ListStore<unknown>;
  @Input() syncUrl = false;

  @Output() sortChange = new EventEmitter<{
    columnId: string;
    direction: "asc" | "desc";
  }>();
  @Output() nextPage = new EventEmitter<void>();
  @Output() previousPage = new EventEmitter<void>();

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private injector = inject(Injector);

  sortColumnId: string | null = null;
  sortDirection: "asc" | "desc" = "asc";

  ngOnInit(): void {
    if (!this.store) return;

    if (this.syncUrl) {
      const p = this.route.snapshot.queryParams;
      const page = +p["page"] || 1;
      const size = +p["size"] || 10;
      const filters: FilterMap = {};
      Object.keys(p).forEach((k) => {
        if (k !== "page" && k !== "size" && p[k] !== "") filters[k] = p[k];
      });
      this.store.updateQuery({ page, size, filters });

      toObservable(this.store.query, { injector: this.injector })
        .pipe(skip(1))
        .subscribe((q) => {
          const params: Record<string, string | number> = {
            page: q.page,
            size: q.size,
          };
          if (q.filters) {
            Object.entries(q.filters).forEach(([k, v]) => {
              if (v !== "" && v != null) params[k] = v as string | number;
            });
          }
          this.router.navigate([], { queryParams: params, replaceUrl: true });
        });
    }

    this.store.reload();
  }

  get resolvedData(): unknown[] {
    return this.store ? this.store.items() : this.data;
  }

  get resolvedLoading(): boolean {
    return this.store ? this.store.loading() : this.loading;
  }

  get resolvedCurrentPage(): number {
    return this.store ? this.store.query().page : this.currentPage;
  }

  get resolvedTotalPages(): number {
    return this.store ? this.store.totalPages() : this.totalPages;
  }

  get resolvedTotalElements(): number {
    return this.store ? this.store.total() : this.totalElements;
  }

  get resolvedRowsPerPage(): number {
    return this.store ? this.store.query().size : this.rowsPerPage;
  }

  handleNextPage(): void {
    this.store ? this.store.nextPage() : this.nextPage.emit();
  }

  handlePreviousPage(): void {
    this.store ? this.store.previousPage() : this.previousPage.emit();
  }

  get isEmpty(): boolean {
    return !this.resolvedLoading && this.resolvedData.length === 0;
  }

  get startItemIndex(): number {
    if (this.isEmpty) return 0;
    return (this.resolvedCurrentPage - 1) * this.resolvedRowsPerPage + 1;
  }

  get endItemIndex(): number {
    const end = this.resolvedCurrentPage * this.resolvedRowsPerPage;
    return end > this.resolvedTotalElements ? this.resolvedTotalElements : end;
  }

  get canPreviousPage(): boolean {
    return this.resolvedCurrentPage > 1;
  }

  get canNextPage(): boolean {
    return this.resolvedCurrentPage < this.resolvedTotalPages;
  }

  get skeletonRows(): number[] {
    return Array.from({ length: this.resolvedRowsPerPage }, (_, i) => i);
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
