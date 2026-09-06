import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";

import { CategoriasRelatorioFacadeService } from "@/shared/services/categorias-relatorio/categorias-relatorio.facade.service";

@Component({
  selector: "app-categorias-relatorio-sem-categoria",
  imports: [RouterLink],
  templateUrl: "./categorias-relatorio-sem-categoria.component.html",
})
export class CategoriasRelatorioSemCategoriaComponent {
  readonly facade = inject(CategoriasRelatorioFacadeService);
}
