import { Component, Input, signal } from "@angular/core";
import { SolarDynamicIcon } from "@solar-icons/angular";
import { IDre, IDreCategoria } from "@/shared/interfaces/cash-flow.dto";

type DreSectionKey = "receitas" | "despesas";

@Component({
  selector: "app-cash-flow-dre",
  templateUrl: "./cash-flow-dre.component.html",
  imports: [SolarDynamicIcon],
})
export class CashFlowDreComponent {
  @Input() set report(value: IDre | null) {
    this.data = value;
  }

  data: IDre | null = null;

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
    const receitas = this.data?.resumo.totalReceitas;
    if (!receitas) return 0;
    return ((this.data?.resumo.totalDespesas ?? 0) / receitas) * 100;
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
