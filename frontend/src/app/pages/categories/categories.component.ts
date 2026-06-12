import { Component, inject, signal } from "@angular/core";
import { PageHeaderComponent } from "@/shared/components/common/page-header/page-header.component";
import { CardStatComponent } from "@/shared/components/common/card-stat/card-stat.component";
import { CategoriesListTableComponent } from "@/shared/components/categories/categories-list-table/categories-list-table.component";
import { CreateAndEditCategoryComponent } from "@/shared/components/categories/create-and-edit-category/create-and-edit-category.component";
import { CategoryDetailDrawerComponent } from "@/shared/components/categories/category-detail-drawer/category-detail-drawer.component";
import { ICategory } from "@/shared/interfaces/categories.dto";
import { CategoriesFacadeService } from "@/shared/services/categories/categories.facade.service";

@Component({
  selector: "app-categories",
  imports: [
    PageHeaderComponent,
    CardStatComponent,
    CategoriesListTableComponent,
    CreateAndEditCategoryComponent,
    CategoryDetailDrawerComponent,
  ],
  templateUrl: "./categories.component.html",
})
export class CategoriesComponent {
  readonly facade = inject(CategoriesFacadeService);

  readonly drawerOpen = signal(false);
  readonly detailDrawerOpen = signal(false);
  readonly selectedCategory = signal<ICategory | null>(null);

  openNew(): void {
    this.selectedCategory.set(null);
    this.drawerOpen.set(true);
  }

  openEdit(category: ICategory): void {
    this.selectedCategory.set(category);
    this.detailDrawerOpen.set(false);
    this.drawerOpen.set(true);
  }

  openDetail(category: ICategory): void {
    this.selectedCategory.set(category);
    this.detailDrawerOpen.set(true);
  }

  onDrawerClose(open: boolean): void {
    this.drawerOpen.set(open);
  }
}
