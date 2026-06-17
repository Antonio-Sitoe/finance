import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { BadgeComponent } from "@/shared/components/ui/badge/badge.component";
import { IGlobalSearchClient } from "@/shared/interfaces/global-search.dto";

@Component({
  selector: "app-search-client-item",
  imports: [CommonModule, BadgeComponent],
  template: `
    <div class="flex w-full items-center gap-3">
      <span
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold uppercase text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
      >
        {{ initials }}
      </span>
      <div class="min-w-0 flex-1">
        <p
          class="truncate text-sm font-medium text-gray-800 dark:text-white/90"
        >
          {{ client.nomeEmpresarial }}
        </p>
        @if (client.identificador) {
        <p class="truncate text-xs text-gray-400 dark:text-gray-500">
          {{ client.identificador }}
        </p>
        }
      </div>
      <app-badge
        variant="light"
        [color]="client.situacao === 'ATIVO' ? 'success' : 'light'"
        size="sm"
      >
        {{ client.situacao === "ATIVO" ? "Activo" : "Inactivo" }}
      </app-badge>
    </div>
  `,
})
export class SearchClientItemComponent {
  @Input({ required: true }) client!: IGlobalSearchClient;

  get initials(): string {
    return (this.client?.nomeEmpresarial ?? "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join("");
  }
}
