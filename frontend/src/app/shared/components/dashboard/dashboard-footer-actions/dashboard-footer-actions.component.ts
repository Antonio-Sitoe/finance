import { Component } from "@angular/core";

@Component({
  selector: "app-dashboard-footer-actions",
  standalone: true,
  imports: [],
  templateUrl: "./dashboard-footer-actions.component.html",
})
export class DashboardFooterActionsComponent {
  transactions = [
    {
      tipo: "receita",
      descricao: "Venda de Software Enterprise - TechCorp",
      data: "25 Mai, 2026",
      valor: "MT 12.000,00",
      status: "Pago",
      statusClass: "bg-green-100 text-green-700",
    },
    {
      tipo: "despesa",
      descricao: "Aluguer Escritório Central",
      data: "24 Mai, 2026",
      valor: "MT 4.500,00",
      status: "Agendado",
      statusClass: "bg-yellow-100 text-yellow-700",
    },
    {
      tipo: "despesa",
      descricao: "AWS Cloud Services - Abril",
      data: "24 Mai, 2026",
      valor: "MT 1.250,40",
      status: "Pago",
      statusClass: "bg-green-100 text-green-700",
    },
    {
      tipo: "receita",
      descricao: "Reembolso IVA - Q1",
      data: "23 Mai, 2026",
      valor: "MT 2.800,00",
      status: "Conciliado",
      statusClass: "bg-blue-100 text-blue-700",
    },
    {
      tipo: "despesa",
      descricao: "Fornecedor Mobiliário - Parcela 2/3",
      data: "22 Mai, 2026",
      valor: "MT 850,00",
      status: "Atrasado",
      statusClass: "bg-red-100 text-red-700",
    },
  ];
}
