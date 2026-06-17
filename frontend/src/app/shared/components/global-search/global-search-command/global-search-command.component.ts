import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";

import { CommandComponent } from "../../ui/command/command.component";
import { CommandInputComponent } from "../../ui/command/command-input.component";
import { CommandListComponent } from "../../ui/command/command-list.component";
import { CommandGroupComponent } from "../../ui/command/command-group.component";
import { CommandItemComponent } from "../../ui/command/command-item.component";
import { CommandEmptyComponent } from "../../ui/command/command-empty.component";
import { CommandFooterComponent } from "../../ui/command/command-footer.component";
import { GlobalSearchTabsComponent } from "../global-search-tabs.component";
import { SearchClientItemComponent } from "../items/search-client-item.component";
import { SearchSupplierItemComponent } from "../items/search-supplier-item.component";
import { SearchTransactionItemComponent } from "../items/search-transaction-item.component";

import {
  EMPTY_GLOBAL_SEARCH_RESULTS,
  GlobalSearchTab,
  IGlobalSearchCounts,
  IGlobalSearchResults,
} from "@/shared/interfaces/global-search.dto";

export interface GlobalSearchSelection {
  type: "cliente" | "fornecedor" | "lancamento";
  id: number;
}

@Component({
  selector: "app-global-search-command",
  imports: [
    CommonModule,
    CommandComponent,
    CommandInputComponent,
    CommandListComponent,
    CommandGroupComponent,
    CommandItemComponent,
    CommandEmptyComponent,
    CommandFooterComponent,
    GlobalSearchTabsComponent,
    SearchClientItemComponent,
    SearchSupplierItemComponent,
    SearchTransactionItemComponent,
  ],
  templateUrl: "./global-search-command.component.html",
})
export class GlobalSearchCommandComponent implements OnChanges {
  @ViewChild(CommandInputComponent) commandInput?: CommandInputComponent;

  @Input() open = false;
  @Input() query = "";
  @Input() loading = false;
  @Input() activeTab: GlobalSearchTab = "all";
  @Input() counts: IGlobalSearchCounts | null = null;
  @Input() results: IGlobalSearchResults = EMPTY_GLOBAL_SEARCH_RESULTS;
  @Input() limit = 5;

  @Output() openChange = new EventEmitter<boolean>();
  @Output() queryChange = new EventEmitter<string>();
  @Output() tabChange = new EventEmitter<GlobalSearchTab>();
  @Output() viewAll = new EventEmitter<GlobalSearchTab>();
  @Output() select = new EventEmitter<GlobalSearchSelection>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["open"]?.currentValue === true) {
      setTimeout(() => this.commandInput?.focus());
    }
  }

  close(): void {
    this.openChange.emit(false);
  }

  show(tab: GlobalSearchTab): boolean {
    return this.activeTab === "all" || this.activeTab === tab;
  }

  get clientes() {
    return this.results.clientes.slice(0, this.limit);
  }
  get fornecedores() {
    return this.results.fornecedores.slice(0, this.limit);
  }
  get lancamentos() {
    return this.results.lancamentos.slice(0, this.limit);
  }

  get hasResults(): boolean {
    return (
      this.results.clientes.length > 0 ||
      this.results.fornecedores.length > 0 ||
      this.results.lancamentos.length > 0
    );
  }
}
