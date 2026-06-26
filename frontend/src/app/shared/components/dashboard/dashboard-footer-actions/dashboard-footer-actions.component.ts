import { NgClass } from "@angular/common";
import { Component, computed, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ITransaction } from "@/shared/interfaces/transactions.dto";
import { TransactionsFacadeService } from "@/shared/services/transactions/transactions.facade.service";

interface RecentTransactionRow {
  type: "receita" | "despesa";
  description: string;
  date: string;
  amount: string;
  status: string;
  statusClass: string;
}

@Component({
  selector: "app-dashboard-footer-actions",
  standalone: true,
  imports: [NgClass, RouterModule],
  templateUrl: "./dashboard-footer-actions.component.html",
})
export class DashboardFooterActionsComponent {
  private readonly transactionsFacade = inject(TransactionsFacadeService);

  readonly transactions = computed<RecentTransactionRow[]>(() =>
    this.transactionsFacade
      .list
      .items()
      .slice(0, 5)
      .map((transaction) => this.mapTransaction(transaction))
  );

  private mapTransaction(transaction: ITransaction): RecentTransactionRow {
    return {
      type: transaction.tipo === "RECEITA" ? "receita" : "despesa",
      description: transaction.descricao,
      date: this.transactionsFacade.formatDate(transaction.dataVencimento),
      amount: `${this.transactionsFacade.formatValor(transaction.valor)} MZN`,
      status: this.resolveStatusLabel(transaction),
      statusClass: this.resolveStatusClass(transaction),
    };
  }

  private resolveStatusLabel(transaction: ITransaction): string {
    if (transaction.situacao === "PAGO") return "Pago";
    return "Pendente";
  }

  private resolveStatusClass(transaction: ITransaction): string {
    if (transaction.situacao === "PAGO") {
      return "bg-green-100 text-green-700";
    }
    return "bg-yellow-100 text-yellow-700";
  }
}
