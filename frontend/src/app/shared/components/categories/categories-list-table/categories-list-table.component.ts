import { Component, EventEmitter, inject, Output } from '@angular/core'
import { ICategory } from '@/shared/interfaces/categories.dto'
import { DataTableComponent } from '@/shared/components/ui/datatable/datatable'
import { BadgeComponent } from '@/shared/components/ui/badge/badge.component'
import { InputFieldComponent } from '@/shared/components/ui/input/input-field.component'
import { SelectComponent } from '@/shared/components/ui/select/select.component'
import { CategoriesFacadeService } from '@/shared/services/categories/categories.facade.service'
import { CATEGORIES_COLUMNS } from '@/shared/constants/categories.columns'
import { SolarDynamicIcon } from '@solar-icons/angular'

@Component({
  selector: 'app-categories-list-table',
  imports: [
    DataTableComponent,
    BadgeComponent,
    InputFieldComponent,
    SelectComponent,
    SolarDynamicIcon,
  ],
  templateUrl: './categories-list-table.component.html',
})
export class CategoriesListTableComponent {
  readonly facade = inject(CategoriesFacadeService)
  readonly columns = CATEGORIES_COLUMNS

  @Output() editClick = new EventEmitter<ICategory>()
  @Output() detailClick = new EventEmitter<ICategory>()
}
