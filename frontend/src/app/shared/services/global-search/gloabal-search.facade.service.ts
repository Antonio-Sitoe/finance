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

/**
 * Estado e orquestração do command palette global (modal).
 * Mantém aberto/fechado, termo, tab activa e resultados (limitados a 5/grupo),
 * com pesquisa debounced. A página de pesquisa usa o `GlobalSearchApiService`
 * directamente (sem limite).
 */
@Injectable({
  providedIn: "root",
})
export class GloabalSearchFacadeService {
  private readonly api = inject(GlobalSearchApiService);

  /** Nº máximo de itens por grupo no modal. */
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
            ? this.api.globalSearch(q, this.MODAL_LIMIT).pipe(
                catchError(() => of(EMPTY_GLOBAL_SEARCH_RESULTS))
              )
            : of(EMPTY_GLOBAL_SEARCH_RESULTS)
        ),
        takeUntilDestroyed()
      )
      .subscribe((res) => {
        this.results.set(res);
        this.loading.set(false);
      });
  }

  // ── Abrir / fechar ──────────────────────────────────────────
  openModal(): void {
    this.open.set(true);
  }

  closeModal(): void {
    this.open.set(false);
  }

  toggle(): void {
    this.open.update((v) => !v);
  }

  // ── Pesquisa ────────────────────────────────────────────────
  setQuery(q: string): void {
    this.query.set(q);
    this.term$.next(q);
  }

  setTab(tab: GlobalSearchTab): void {
    this.activeTab.set(tab);
  }
}
