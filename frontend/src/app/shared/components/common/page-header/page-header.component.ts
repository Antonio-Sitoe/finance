import { Component, input } from "@angular/core";
import { RouterModule } from "@angular/router";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

@Component({
  selector: "app-page-header",
  imports: [RouterModule],
  templateUrl: "./page-header.component.html",
})
export class PageHeaderComponent {
  title = input<string>("");
  description = input<string>("");
  breadcrumbs = input<BreadcrumbItem[]>([]);
}
