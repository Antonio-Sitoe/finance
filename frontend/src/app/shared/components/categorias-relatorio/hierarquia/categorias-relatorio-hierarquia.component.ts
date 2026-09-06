import { DecimalPipe } from "@angular/common";
import { Component, inject } from "@angular/core";

import { CategoriasRelatorioFacadeService } from "@/shared/services/categorias-relatorio/categorias-relatorio.facade.service";

@Component({
  selector: "app-categorias-relatorio-hierarquia",
  imports: [DecimalPipe],
  templateUrl: "./categorias-relatorio-hierarquia.component.html",
})
export class CategoriasRelatorioHierarquiaComponent {
  readonly facade = inject(CategoriasRelatorioFacadeService);

  barWidth(valor: number): number {
    const top = this.facade.hierarquia()?.top5Filhas ?? [];
    const max = Math.max(...top.map((item) => Number(item.valor)), 1);
    return Math.max(8, (Number(valor) / max) * 100);
  }
}
