import { DatePipe } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

import {
  ClientesRelatorioPeriodo,
  IClienteFaturamento,
  IClienteReceita,
} from "@/shared/interfaces/clientes-relatorio.dto";
import { ClientesRelatorioFacadeService } from "@/shared/services/clientes-relatorio/clientes-relatorio.facade.service";

@Component({
  selector: "app-clientes-relatorio-analise-financeira",
  imports: [FormsModule, DatePipe],
  templateUrl: "./clientes-relatorio-analise-financeira.component.html",
})
export class ClientesRelatorioAnaliseFinanceiraComponent {
  readonly facade = inject(ClientesRelatorioFacadeService);
  readonly expandedClient = signal<number | null>(null);

  readonly periods: { id: ClientesRelatorioPeriodo; label: string }[] = [
    { id: "month", label: "Este mês" },
    { id: "quarter", label: "Este trimestre" },
    { id: "year", label: "Este ano" },
    { id: "all", label: "Sempre" },
    { id: "custom", label: "Personalizado" },
  ];

  toggleClient(clienteId: number): void {
    if (this.expandedClient() === clienteId) {
      this.expandedClient.set(null);
      return;
    }
    this.expandedClient.set(clienteId);
    this.facade.loadReceitas(clienteId);
  }

  prazoLabel(value: number | null): string {
    if (value == null) return "Sem pendências";
    if (value < 0) return `${Math.abs(value)} dias em atraso`;
    if (value === 0) return "Vence hoje";
    return `${value} dias`;
  }

  prazoClasses(value: number | null): string {
    if (value == null) {
      return "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400";
    }
    if (value < 0) {
      return "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400";
    }
    if (value <= 15) {
      return "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400";
    }
    return "bg-blue-light-50 text-blue-light-700 dark:bg-blue-light-500/10 dark:text-blue-light-400";
  }

  rowPosition(item: IClienteFaturamento): number {
    return this.facade.faturamento().indexOf(item) + 1;
  }

  receitas(clienteId: number): IClienteReceita[] {
    return this.facade.receitasPorCliente()[clienteId] ?? [];
  }

  startItem(): number {
    if (!this.facade.filteredFaturamento().length) return 0;
    return (this.facade.page() - 1) * this.facade.pageSize + 1;
  }

  endItem(): number {
    return Math.min(
      this.facade.page() * this.facade.pageSize,
      this.facade.filteredFaturamento().length,
    );
  }
}
