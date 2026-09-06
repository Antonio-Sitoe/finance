import { DecimalPipe } from "@angular/common";
import { Component, inject } from "@angular/core";

import { CategoriasRelatorioFacadeService } from "@/shared/services/categorias-relatorio/categorias-relatorio.facade.service";

@Component({
  selector: "app-categorias-relatorio-pago-pendente",
  imports: [DecimalPipe],
  templateUrl: "./categorias-relatorio-pago-pendente.component.html",
})
export class CategoriasRelatorioPagoPendenteComponent {
  readonly facade = inject(CategoriasRelatorioFacadeService);
}
