import { Component, HostListener, inject } from "@angular/core";
import { GloabalSearchFacadeService } from "@/shared/services/global-search/gloabal-search.facade.service";
import {
  GlobalSearchCommandComponent,
  GlobalSearchSelection,
} from "@/shared/components/global-search/global-search-command/global-search-command.component";
import { GlobalSearchTab } from "@/shared/interfaces/global-search.dto";
import { GLOBAL_SEARCH_ROUTES } from "@/shared/services/global-search/global-search.routes";
import { Router } from "@angular/router";

@Component({
  selector: "app-global-search-wrapper",
  imports: [GlobalSearchCommandComponent],
  templateUrl: "./global-search-wrapper.component.html",
})
export class GlobalSearchWrapperComponent {
  readonly search = inject(GloabalSearchFacadeService);
  private readonly router = inject(Router);

  /** Abre/fecha com Ctrl+K (ou Cmd+K). */
  @HostListener("document:keydown", ["$event"])
  onKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      this.search.toggle();
    }
  }

  onViewAll(tab: GlobalSearchTab): void {
    this.search.closeModal();
    this.router.navigate(["/global-search"], {
      queryParams: { q: this.search.query() || null, tab },
    });
  }

  onSelect(selection: GlobalSearchSelection): void {
    this.search.closeModal();
    this.router.navigate([GLOBAL_SEARCH_ROUTES[selection.type]]);
  }
}
