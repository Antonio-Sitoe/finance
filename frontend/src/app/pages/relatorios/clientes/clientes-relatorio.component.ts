import { Component, inject, OnInit } from "@angular/core";

import { ClientesRelatorioVisaoGeralComponent } from "@/shared/components/clientes-relatorio/visao-geral/clientes-relatorio-visao-geral.component";
import { ClientesRelatorioAnaliseFinanceiraComponent } from "@/shared/components/clientes-relatorio/analise-financeira/clientes-relatorio-analise-financeira.component";
import { ClientesRelatorioFacadeService } from "@/shared/services/clientes-relatorio/clientes-relatorio.facade.service";
import { ClientesRelatorioTab } from "@/shared/interfaces/clientes-relatorio.dto";

@Component({
  selector: "app-clientes-relatorio",
  imports: [
    ClientesRelatorioVisaoGeralComponent,
    ClientesRelatorioAnaliseFinanceiraComponent,
  ],
  templateUrl: "./clientes-relatorio.component.html",
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
export class ClientesRelatorioComponent implements OnInit {
  readonly facade = inject(ClientesRelatorioFacadeService);

  readonly tabs: { id: ClientesRelatorioTab; label: string }[] = [
    { id: "visao-geral", label: "Visão Geral" },
    { id: "analise-financeira", label: "Análise Financeira" },
  ];

  ngOnInit(): void {
    if (!this.facade.status()) this.facade.loadOverview().subscribe();
  }
}
