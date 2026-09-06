import { Component, inject, OnInit } from "@angular/core";

import { CategoriasRelatorioDistribuicaoComponent } from "@/shared/components/categorias-relatorio/distribuicao/categorias-relatorio-distribuicao.component";
import { CategoriasRelatorioHierarquiaComponent } from "@/shared/components/categorias-relatorio/hierarquia/categorias-relatorio-hierarquia.component";
import { CategoriasRelatorioPagoPendenteComponent } from "@/shared/components/categorias-relatorio/pago-pendente/categorias-relatorio-pago-pendente.component";
import { CategoriasRelatorioSemCategoriaComponent } from "@/shared/components/categorias-relatorio/sem-categoria/categorias-relatorio-sem-categoria.component";
import { CategoriasRelatorioTab } from "@/shared/interfaces/categorias-relatorio.dto";
import { CategoriasRelatorioFacadeService } from "@/shared/services/categorias-relatorio/categorias-relatorio.facade.service";

@Component({
  selector: "app-categorias-relatorio",
  imports: [
    CategoriasRelatorioDistribuicaoComponent,
    CategoriasRelatorioHierarquiaComponent,
    CategoriasRelatorioPagoPendenteComponent,
    CategoriasRelatorioSemCategoriaComponent,
  ],
  templateUrl: "./categorias-relatorio.component.html",
  styles: `
    .report-tab-panel {
      animation: report-tab-in 240ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    @keyframes report-tab-in {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (prefers-reduced-motion: reduce) {
      .report-tab-panel { animation: none; }
    }
  `,
})
export class CategoriasRelatorioComponent implements OnInit {
  readonly facade = inject(CategoriasRelatorioFacadeService);

  readonly tabs: { id: CategoriasRelatorioTab; label: string }[] = [
    { id: "distribuicao", label: "Distribuição" },
    { id: "hierarquia", label: "Hierarquia" },
    { id: "pago-pendente", label: "PAGO vs PENDENTE" },
    { id: "sem-categoria", label: "Sem Categoria" },
  ];

  ngOnInit(): void {
    if (!this.facade.movimentacoes().length) {
      this.facade.loadDistribuicao().subscribe();
    }
  }
}
