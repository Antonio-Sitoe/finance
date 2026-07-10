import { Component, Input, signal } from "@angular/core";
import { SolarDynamicIcon } from "@solar-icons/angular";
import { IDre, IDreCategoria } from "@/shared/interfaces/cash-flow.dto";

/** Dados de demonstração — substituir pela API na integração */
export const MOCK_DRE: IDre = {
  de: "2026-07-01",
  ate: "2026-07-31",
  resumo: {
    totalReceitas: 45000,
    totalDespesas: 28000,
    resultado: 17000,
    margemPercentual: 37.8,
  },
  receitas: [
    {
      categoriaId: 1,
      nome: "Vendas",
      total: 30000,
      percentual: 66.7,
      lancamentos: [
        {
          id: 101,
          descricao: "Venda loja Maputo",
          conta: "Caixa Principal",
          valor: 18000,
          data: "2026-07-05",
        },
        {
          id: 102,
          descricao: "Venda online",
          conta: "Conta BCI",
          valor: 12000,
          data: "2026-07-18",
        },
      ],
    },
    {
      categoriaId: 2,
      nome: "Serviços",
      total: 12000,
      percentual: 26.7,
      lancamentos: [
        {
          id: 103,
          descricao: "Consultoria Julho",
          conta: "Conta BCI",
          valor: 12000,
          data: "2026-07-12",
        },
      ],
    },
    {
      categoriaId: 3,
      nome: "Outras Receitas",
      total: 3000,
      percentual: 6.6,
      lancamentos: [
        {
          id: 104,
          descricao: "Juros / ajustes",
          conta: "Caixa Principal",
          valor: 3000,
          data: "2026-07-22",
        },
      ],
    },
  ],
  despesas: [
    {
      categoriaId: 4,
      nome: "Fornecedores",
      total: 10000,
      percentual: 22.2,
      lancamentos: [
        {
          id: 201,
          descricao: "Stock mercadorias",
          conta: "Conta BCI",
          valor: 10000,
          data: "2026-07-08",
        },
      ],
    },
    {
      categoriaId: 5,
      nome: "Salários",
      total: 8000,
      percentual: 17.8,
      lancamentos: [
        {
          id: 202,
          descricao: "Folha Julho",
          conta: "Conta BCI",
          valor: 8000,
          data: "2026-07-28",
        },
      ],
    },
    {
      categoriaId: 6,
      nome: "Administrativas",
      total: 5000,
      percentual: 11.1,
      lancamentos: [
        {
          id: 203,
          descricao: "Renda + utilities",
          conta: "Caixa Principal",
          valor: 5000,
          data: "2026-07-03",
        },
      ],
    },
  ],
};

type DreSectionKey = "receitas" | "despesas";

@Component({
  selector: "app-cash-flow-dre",
  templateUrl: "./cash-flow-dre.component.html",
  imports: [SolarDynamicIcon],
})
export class CashFlowDreComponent {
  /** Quando a integração existir, passa o relatório aqui. Sem input → mock. */
  @Input() set report(value: IDre | null) {
    this.data = value ?? MOCK_DRE;
  }

  data: IDre = MOCK_DRE;

  private readonly openSections = signal<Set<DreSectionKey>>(
    new Set<DreSectionKey>(["receitas"])
  );
  private readonly openCategorias = signal<Set<string>>(new Set());

  toggleSection(key: DreSectionKey) {
    this.openSections.update((set) => {
      const next = new Set(set);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  isSectionOpen(key: DreSectionKey): boolean {
    return this.openSections().has(key);
  }

  toggleCategoria(section: DreSectionKey, cat: IDreCategoria) {
    const id = this.categoriaKey(section, cat);
    this.openCategorias.update((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  isCategoriaOpen(section: DreSectionKey, cat: IDreCategoria): boolean {
    return this.openCategorias().has(this.categoriaKey(section, cat));
  }

  despesasSobreReceitas(): number {
    const receitas = this.data.resumo.totalReceitas;
    if (!receitas) return 0;
    return (this.data.resumo.totalDespesas / receitas) * 100;
  }

  formatResultado(value: number): string {
    if (value < 0) {
      return `(${this.formatAmount(Math.abs(value))})`;
    }
    return this.formatAmount(value);
  }

  formatAmount(value: number): string {
    return (
      "MT " +
      new Intl.NumberFormat("pt-MZ", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    );
  }

  formatPercent(value: number): string {
    return (
      new Intl.NumberFormat("pt-MZ", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(value) + "%"
    );
  }

  formatFullDate(isoDate: string): string {
    const date = new Date(isoDate + "T00:00:00");
    return date.toLocaleDateString("pt-MZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  private categoriaKey(section: DreSectionKey, cat: IDreCategoria): string {
    return `${section}:${cat.categoriaId ?? cat.nome}`;
  }
}
