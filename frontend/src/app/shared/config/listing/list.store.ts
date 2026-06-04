import { Observable, Subject, switchMap, tap, finalize, filter } from "rxjs";
import { ListQuery, PageResult, SortDir } from "./listing.dto";
import { signal } from "@angular/core";

export type ListLoader<T> = (query: ListQuery) => Observable<PageResult<T>>;

export class ListStore<T> {
  readonly items = signal<T[]>([]);
  readonly total = signal<number>(0);
  readonly totalPages = signal<number>(0);
  readonly loading = signal<boolean>(false);
  readonly errors = signal<any>(null);

  readonly query = signal<ListQuery>({ size: 10, page: 1 });

  private _loader?: ListLoader<T>;
  private readonly _trigger = new Subject<ListQuery>();

  constructor() {
    this._trigger
      .pipe(
        filter(() => !!this._loader),
        switchMap((q) => {
          this.loading.set(true);
          this.errors.set(null);
          return this._loader!(q).pipe(
            tap({
              next: (res: PageResult<T>) => {
                this.items.set(res.content);
                this.total.set(res.totalElements);
                this.totalPages.set(res.totalPages);
              },
              error: (err: { messages: any }) =>
                this.errors.set(err?.messages ?? "Load failed"),
            }),
            finalize(() => this.loading.set(false))
          );
        })
      )
      .subscribe();
  }

  readonly reset = () => {
    this.items.set([]);
    this.total.set(0);
    this.totalPages.set(0);
    this.loading.set(false);
    this.errors.set(null);
  };

  connect(loader: ListLoader<T>) {
    this._loader = loader;
  }

  setQuery(patch: Partial<ListQuery>) {
    this.query.update((current) => ({ ...current, ...patch }));
    this.reload();
  }

  updateQuery(patch: Partial<ListQuery>) {
    this.query.update((current) => ({ ...current, ...patch }));
  }

  setFilter(key: string, value: unknown) {
    this.query.update((q) => ({
      ...q,
      page: 1,
      filters: { ...(q.filters ?? {}), [key]: value as any },
    }));
    this.reload();
  }

  clearFilters() {
    this.setQuery({ filters: {} });
  }

  setSort(key: string, direction: SortDir) {
    this.query.update((q) => ({
      ...q,
      sortOrder: direction,
      sortBy: key,
    }));
    this.reload();
  }

  setPagination(page: number, size: number) {
    this.query.update((q) => ({ ...q, page, size }));
    this.reload();
  }

  clearPagination() {
    this.setPagination(1, 10);
  }

  nextPage() {
    if (this.query().page >= this.totalPages()) return;
    this.query.update((q) => ({ ...q, page: q.page + 1 }));
    this.reload();
  }

  previousPage() {
    if (this.query().page <= 1) return;
    this.query.update((q) => ({ ...q, page: q.page - 1 }));
    this.reload();
  }

  reload() {
    this._trigger.next(this.query());
  }
}
