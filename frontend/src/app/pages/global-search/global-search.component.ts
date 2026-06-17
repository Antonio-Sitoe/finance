import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { of, Subject } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from "rxjs/operators";

import { PageHeaderComponent } from "@/shared/components/common/page-header/page-header.component";
import { GlobalSearchFieldsComponent } from "@/shared/components/global-search/global-search-fields/global-search-fields.component";
import { CommandItemComponent } from "@/shared/components/ui/command/command-item.component";
import { CommandEmptyComponent } from "@/shared/components/ui/command/command-empty.component";
import { SearchClientItemComponent } from "@/shared/components/global-search/items/search-client-item.component";
import { SearchSupplierItemComponent } from "@/shared/components/global-search/items/search-supplier-item.component";
import { SearchTransactionItemComponent } from "@/shared/components/global-search/items/search-transaction-item.component";
import { GlobalSearchApiService } from "@/shared/services/global-search/global-search.api.service";

import {
  EMPTY_GLOBAL_SEARCH_RESULTS,
  GlobalSearchTab,
  IGlobalSearchCounts,
  IGlobalSearchResults,
} from "@/shared/interfaces/global-search.dto";

@Component({
  selector: "app-global-search",
  imports: [
    CommonModule,
    PageHeaderComponent,
    GlobalSearchFieldsComponent,
    CommandItemComponent,
    CommandEmptyComponent,
    SearchClientItemComponent,
    SearchSupplierItemComponent,
    SearchTransactionItemComponent,
  ],
  templateUrl: "./global-search.component.html",
})
export class GlobalSearchComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(GlobalSearchApiService);

  readonly query = signal("");
  readonly activeTab = signal<GlobalSearchTab>("all");
  readonly loading = signal(false);
  readonly results = signal<IGlobalSearchResults>(EMPTY_GLOBAL_SEARCH_RESULTS);

  readonly counts = computed<IGlobalSearchCounts>(() => {
    const r = this.results();
    return {
      clientes: r.clientes.length,
      fornecedores: r.fornecedores.length,
      lancamentos: r.lancamentos.length,
      total: r.clientes.length + r.fornecedores.length + r.lancamentos.length,
    };
  });

  readonly hasResults = computed(() => this.counts().total > 0);

  private readonly term$ = new Subject<string>();

  constructor() {
    this.term$
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((q) =>
          q.trim()
            ? this.api
                .globalSearch(q, 0)
                .pipe(catchError(() => of(EMPTY_GLOBAL_SEARCH_RESULTS)))
            : of(EMPTY_GLOBAL_SEARCH_RESULTS)
        ),
        takeUntilDestroyed()
      )
      .subscribe((res) => {
        this.results.set(res);
        this.loading.set(false);
      });
  }

  ngOnInit(): void {
    // Pré-preenche a partir dos query params (ex.: vindo do "Ver todos" do modal).
    const params = this.route.snapshot.queryParamMap;
    const q = params.get("q");
    const tab = params.get("tab") as GlobalSearchTab | null;
    if (tab) this.activeTab.set(tab);
    if (q) {
      this.query.set(q);
      this.term$.next(q);
    }
  }

  show(tab: GlobalSearchTab): boolean {
    return this.activeTab() === "all" || this.activeTab() === tab;
  }

  onQueryChange(value: string): void {
    this.query.set(value);
    this.term$.next(value);
  }

  onTabChange(tab: GlobalSearchTab): void {
    this.activeTab.set(tab);
  }
}
