import { DashboardFacadeService } from '@/shared/services/dashboard/dashboard.facade.service';
import { Component, inject } from '@angular/core';
import {

  NgApexchartsModule,
} from 'ng-apexcharts';
import { TransactionsFacadeService } from '@/shared/services/transactions/transactions.facade.service';


@Component({
  selector: 'app-monthly-target',
  imports: [
    NgApexchartsModule,

  ],
  templateUrl: './monthly-target.component.html',
})
export class MonthlyTargetComponent {
  readonly facade = inject(DashboardFacadeService);
  readonly transactionsFacade = inject(TransactionsFacadeService);

  hoje = new Date();

  get diaSemana(): string {
    return this.hoje.toLocaleDateString("pt-PT", { weekday: "long" });
  }

  get dataFormatada(): string {
    return this.hoje.toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  get nomeDia(): string {
    return this.diaSemana.charAt(0).toUpperCase() + this.diaSemana.slice(1);
  }

  maxReceita(): number {
    const meses = this.facade.months;
    if (meses.length === 0) return 100;
    return Math.max(...meses.map((m) => Math.max(m.receita, m.despesa)), 1);
  }

  barHeight(valor: number): string {
    const max = this.maxReceita();
    return (valor / max) * 100 + "%";
  }

  readonly transactions = this.transactionsFacade.list.items;

  topDespesas: { categoria: string; valor: number; percent: number }[] = [];

  constructor() {
    this.loadTopDespesas();
  }

  private loadTopDespesas(): void {
    const valorTotal = this.facade.dashboard()?.totalDespesasMes ?? 0;
    this.topDespesas = [
      { categoria: "Recursos Humanos", valor: Math.round(valorTotal * 0.42), percent: 42 },
      { categoria: "Software & SaaS", valor: Math.round(valorTotal * 0.28), percent: 28 },
      { categoria: "Infraestrutura", valor: Math.round(valorTotal * 0.18), percent: 18 },
    ];
  }
}
