import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { SolarDynamicIcon } from "@solar-icons/angular";
import { GlobalSearchTabsComponent } from "../global-search-tabs.component";
import {
  GlobalSearchTab,
  IGlobalSearchCounts,
} from "@/shared/interfaces/global-search.dto";

@Component({
  selector: "app-global-search-fields",
  imports: [CommonModule, SolarDynamicIcon, GlobalSearchTabsComponent],
  templateUrl: "./global-search-fields.component.html",
})
export class GlobalSearchFieldsComponent {
  @Input() query = "";
  @Input() activeTab: GlobalSearchTab = "all";
  @Input() counts: IGlobalSearchCounts | null = null;

  @Output() queryChange = new EventEmitter<string>();
  @Output() tabChange = new EventEmitter<GlobalSearchTab>();

  onInput(event: Event): void {
    this.queryChange.emit((event.target as HTMLInputElement).value);
  }
}
