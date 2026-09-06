import { computed, inject, Injectable, signal } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import {
  catchError,
  EMPTY,
  finalize,
  forkJoin,
  map,
  Observable,
  tap,
} from "rxjs";

import {
  CategoriasRelatorioTab,
  ICategoriaDistribuicaoRow,
  ICategoriaHierarquia,
  ICategoriaMedia,
  ICategoriaMovimentacao,
  ICategoriaPagoPendente,
  ICategoriaResumoFinanceiro,
  ICategoriaValorTotal,
  ISemCategoria,
} from "@/shared/interfaces/categorias-relatorio.dto";
import { CategoriasRelatorioApiService } from "./categorias-relatorio.api.service";

@Injectable({ providedIn: "root" })
export class CategoriasRelatorioFacadeService {
  private readonly api = inject(CategoriasRelatorioApiService);

  readonly activeTab = signal<CategoriasRelatorioTab>("distribuicao");

  readonly distribuicaoLoading = signal(false);
  readonly hierarquiaLoading = signal(false);
  readonly pagoPendenteLoading = signal(false);
  readonly semCategoriaLoading = signal(false);

  readonly distribuicaoError = signal<string | null>(null);
  readonly hierarquiaError = signal<string | null>(null);
  readonly pagoPendenteError = signal<string | null>(null);
  readonly semCategoriaError = signal<string | null>(null);

  readonly despesasPagas = signal<ICategoriaValorTotal[]>([]);
  readonly resumoFinanceiro = signal<ICategoriaResumoFinanceiro[]>([]);
  readonly medias = signal<ICategoriaMedia[]>([]);
  readonly movimentacoes = signal<ICategoriaMovimentacao[]>([]);
  readonly hierarquia = signal<ICategoriaHierarquia | null>(null);
  readonly pagoPendente = signal<ICategoriaPagoPendente[]>([]);
  readonly semCategoria = signal<ISemCategoria | null>(null);

  readonly expandedPais = signal<Record<number, boolean>>({});
  readonly page = signal(1);
  readonly pageSize = 8;
  readonly semCatPage = signal(1);
  readonly semCatPageSize = 8;

  readonly totalReceita = computed(() =>
    this.resumoFinanceiro().reduce(
      (sum, row) => sum + Number(row.totalCredito ?? 0),
      0,
    ),
  );

  readonly totalDespesa = computed(() =>
    this.resumoFinanceiro().reduce(
      (sum, row) => sum + Number(row.totalDebito ?? 0),
      0,
    ),
  );

  readonly categoriasComReceita = computed(
    () =>
      this.resumoFinanceiro().filter((row) => Number(row.totalCredito) > 0)
        .length,
  );

  readonly categoriasComDespesa = computed(
    () =>
      this.resumoFinanceiro().filter((row) => Number(row.totalDebito) > 0)
        .length,
  );

  readonly maiorReceita = computed((): ICategoriaResumoFinanceiro | null => {
    const rows = [...this.resumoFinanceiro()].sort(
      (a, b) => Number(b.totalCredito) - Number(a.totalCredito),
    );
    return rows[0] ?? null;
  });

  readonly maiorDespesa = computed((): ICategoriaValorTotal | null => {
    const rows = [...this.despesasPagas()].sort(
      (a, b) => Number(b.valorTotal) - Number(a.valorTotal),
    );
    return rows[0] ?? null;
  });

  readonly distribuicaoRows = computed((): ICategoriaDistribuicaoRow[] => {
    const mediaById = new Map(
      this.medias().map((row) => [row.idCategoria, row]),
    );
    const total = this.movimentacoes().reduce(
      (sum, row) => sum + Number(row.somaValores ?? 0),
      0,
    );

    return this.movimentacoes()
      .map((mov) => {
        const media = mediaById.get(mov.idCategoria);
        const resumo = this.resumoFinanceiro().find(
          (row) => row.idCategoria === mov.idCategoria,
        );
        let tipo: ICategoriaDistribuicaoRow["tipo"] = "MISTO";
        if (resumo) {
          if (Number(resumo.totalCredito) > 0 && Number(resumo.totalDebito) === 0) {
            tipo = "RECEITA";
          } else if (
            Number(resumo.totalDebito) > 0 &&
            Number(resumo.totalCredito) === 0
          ) {
            tipo = "DESPESA";
          }
        } else if (mov.tipo === "CREDITO") {
          tipo = "RECEITA";
        } else if (mov.tipo === "DEBITO") {
          tipo = "DESPESA";
        }

        const soma = Number(mov.somaValores ?? 0);
        return {
          idCategoria: mov.idCategoria,
          nomeCategoria: mov.nomeCategoria,
          tipo,
          quantidade: Number(media?.quantidade ?? mov.totalMovimentacoes ?? 0),
          soma,
          media: Number(media?.media ?? 0),
          pctDoTotal: total > 0 ? (soma / total) * 100 : 0,
        };
      })
      .sort((a, b) => b.soma - a.soma);
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.distribuicaoRows().length / this.pageSize)),
  );

  readonly visibleDistribuicao = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.distribuicaoRows().slice(start, start + this.pageSize);
  });

  readonly receitaDonut = computed(() => {
    const rows = this.resumoFinanceiro()
      .filter((row) => Number(row.totalCredito) > 0)
      .sort((a, b) => Number(b.totalCredito) - Number(a.totalCredito))
      .slice(0, 5);
    return {
      labels: rows.map((row) => row.nomeCategoria),
      series: rows.map((row) => Number(row.totalCredito)),
    };
  });

  readonly despesaDonut = computed(() => {
    const rows = this.despesasPagas().slice(0, 5);
    return {
      labels: rows.map((row) => row.nomeCategoria),
      series: rows.map((row) => Number(row.valorTotal)),
    };
  });

  readonly semCatTotalPages = computed(() => {
    const total = this.semCategoria()?.lancamentos.length ?? 0;
    return Math.max(1, Math.ceil(total / this.semCatPageSize));
  });

  readonly visibleSemCatLancamentos = computed(() => {
    const items = this.semCategoria()?.lancamentos ?? [];
    const start = (this.semCatPage() - 1) * this.semCatPageSize;
    return items.slice(start, start + this.semCatPageSize);
  });

  setTab(tab: CategoriasRelatorioTab): void {
    this.activeTab.set(tab);
    if (tab === "distribuicao" && !this.movimentacoes().length) {
      this.loadDistribuicao().subscribe();
    }
    if (tab === "hierarquia" && !this.hierarquia()) {
      this.loadHierarquia().subscribe();
    }
    if (tab === "pago-pendente" && !this.pagoPendente().length) {
      this.loadPagoPendente().subscribe();
    }
    if (tab === "sem-categoria" && !this.semCategoria()) {
      this.loadSemCategoria().subscribe();
    }
  }

  loadDistribuicao(): Observable<void> {
    this.distribuicaoLoading.set(true);
    this.distribuicaoError.set(null);
    return forkJoin({
      despesas: this.api.getDespesasPagas(),
      resumo: this.api.getResumoFinanceiro(),
      medias: this.api.getMedia(),
      movimentacoes: this.api.getMovimentacao(),
    }).pipe(
      tap(({ despesas, resumo, medias, movimentacoes }) => {
        this.despesasPagas.set(despesas);
        this.resumoFinanceiro.set(resumo);
        this.medias.set(medias);
        this.movimentacoes.set(movimentacoes);
        this.page.set(1);
      }),
      map(() => void 0),
      catchError((error) => {
        this.distribuicaoError.set(this.errorMessage(error));
        return EMPTY;
      }),
      finalize(() => this.distribuicaoLoading.set(false)),
    );
  }

  loadHierarquia(): Observable<void> {
    this.hierarquiaLoading.set(true);
    this.hierarquiaError.set(null);
    return this.api.getHierarquia().pipe(
      tap((data) => {
        this.hierarquia.set(data);
        const expanded: Record<number, boolean> = {};
        data.pais.forEach((pai, index) => {
          expanded[pai.idCategoria] = index === 0;
        });
        this.expandedPais.set(expanded);
      }),
      map(() => void 0),
      catchError((error) => {
        this.hierarquiaError.set(this.errorMessage(error));
        return EMPTY;
      }),
      finalize(() => this.hierarquiaLoading.set(false)),
    );
  }

  loadPagoPendente(): Observable<void> {
    this.pagoPendenteLoading.set(true);
    this.pagoPendenteError.set(null);
    return this.api.getPagoVsPendente().pipe(
      tap((data) => this.pagoPendente.set(data)),
      map(() => void 0),
      catchError((error) => {
        this.pagoPendenteError.set(this.errorMessage(error));
        return EMPTY;
      }),
      finalize(() => this.pagoPendenteLoading.set(false)),
    );
  }

  loadSemCategoria(): Observable<void> {
    this.semCategoriaLoading.set(true);
    this.semCategoriaError.set(null);
    return this.api.getSemCategoria().pipe(
      tap((data) => {
        this.semCategoria.set(data);
        this.semCatPage.set(1);
      }),
      map(() => void 0),
      catchError((error) => {
        this.semCategoriaError.set(this.errorMessage(error));
        return EMPTY;
      }),
      finalize(() => this.semCategoriaLoading.set(false)),
    );
  }

  togglePai(id: number): void {
    this.expandedPais.update((value) => ({
      ...value,
      [id]: !value[id],
    }));
  }

  nextPage(): void {
    this.page.update((value) => Math.min(this.totalPages(), value + 1));
  }

  previousPage(): void {
    this.page.update((value) => Math.max(1, value - 1));
  }

  nextSemCatPage(): void {
    this.semCatPage.update((value) =>
      Math.min(this.semCatTotalPages(), value + 1),
    );
  }

  previousSemCatPage(): void {
    this.semCatPage.update((value) => Math.max(1, value - 1));
  }

  exportCsv(): void {
    const tab = this.activeTab();
    if (tab === "distribuicao") {
      this.downloadCsv(
        "distribuicao-categorias.csv",
        [
          "Categoria",
          "Tipo",
          "Quantidade",
          "Soma",
          "Media",
          "% do total",
        ],
        this.distribuicaoRows().map((row) => [
          row.nomeCategoria,
          row.tipo,
          row.quantidade,
          row.soma,
          row.media,
          row.pctDoTotal.toFixed(2),
        ]),
      );
      return;
    }
    if (tab === "hierarquia") {
      const rows =
        this.hierarquia()?.pais.flatMap((pai) =>
          pai.filhas.map((filha) => [
            pai.nomeCategoria,
            filha.nomeCategoria,
            filha.valor,
            filha.quantidade,
            filha.pctDoPai,
          ]),
        ) ?? [];
      this.downloadCsv(
        "hierarquia-categorias.csv",
        ["Pai", "Filha", "Valor", "Quantidade", "% do pai"],
        rows,
      );
      return;
    }
    if (tab === "pago-pendente") {
      this.downloadCsv(
        "pago-vs-pendente-categorias.csv",
        [
          "Categoria",
          "Qtd pago",
          "Qtd pendente",
          "Valor pago",
          "Valor pendente",
          "% pago",
          "% pendente",
        ],
        this.pagoPendente().map((row) => [
          row.nomeCategoria,
          row.qtdPago,
          row.qtdPendente,
          row.valorPago,
          row.valorPendente,
          row.pctPago,
          row.pctPendente,
        ]),
      );
      return;
    }
    const items = this.semCategoria()?.lancamentos ?? [];
    this.downloadCsv(
      "sem-categoria.csv",
      ["ID", "Descricao", "Conta", "Valor", "Vencimento", "Tipo", "Situacao"],
      items.map((row) => [
        row.id,
        row.descricao,
        row.nomeConta,
        row.valor,
        row.dataVencimento,
        row.tipo,
        row.situacao,
      ]),
    );
  }

  formatAmount(value: number | null | undefined): string {
    return new Intl.NumberFormat("pt-MZ", {
      style: "currency",
      currency: "MZN",
      minimumFractionDigits: 2,
    }).format(Number(value ?? 0));
  }

  formatDate(value: string | null | undefined): string {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  private downloadCsv(
    filename: string,
    header: string[],
    rows: (string | number)[][],
  ): void {
    const csv = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }),
    );
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  private errorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse && error.error?.message) {
      return error.error.message;
    }
    return "Não foi possível carregar o relatório. Tente novamente.";
  }
}
