import { computed, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { of, Subject } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from "rxjs/operators";
import { GlobalSearchApiService } from "./global-search.api.service";
import {
  EMPTY_GLOBAL_SEARCH_RESULTS,
  GlobalSearchTab,
  IGlobalSearchCounts,
  IGlobalSearchResults,
} from "@/shared/interfaces/global-search.dto";

@Injectable({
  providedIn: "root",
})
export class GloabalSearchFacadeService {
  private readonly api = inject(GlobalSearchApiService);

  private readonly MODAL_LIMIT = 5;

  readonly open = signal(false);
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
                .globalSearch(q, this.MODAL_LIMIT)
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

  openModal(): void {
    this.open.set(true);
  }

  closeModal(): void {
    this.open.set(false);
  }

  toggle(): void {
    this.open.update((v) => !v);
  }

  setQuery(q: string): void {
    this.query.set(q);
    this.term$.next(q);
  }

  setTab(tab: GlobalSearchTab): void {
    this.activeTab.set(tab);
  }
}
