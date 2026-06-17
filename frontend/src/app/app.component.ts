import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgxSonnerToaster } from "ngx-sonner";
import { GlobalSearchWrapperComponent } from "./shared/components/global-search/global-search-wrapper/global-search-wrapper.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterModule, NgxSonnerToaster, GlobalSearchWrapperComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "Finance App | A dashboard app to analyze your transactions";
}
