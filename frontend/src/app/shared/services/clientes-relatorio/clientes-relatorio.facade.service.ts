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
  ClientesRelatorioPeriodo,
  ClientesRelatorioTab,
  IClienteClassificacaoNota,
  IClienteFaturamento,
  IClienteFaturamentoResumo,
  IClienteReceita,
  IClienteSemDados,
  IClienteStatusReport,
  IPeriodoQuery,
} from "@/shared/interfaces/clientes-relatorio.dto";
import { ICustomerDTO } from "@/shared/interfaces/costumers.dto";
import { ClientesRelatorioApiService } from "./clientes-relatorio.api.service";

@Injectable({ providedIn: "root" })
export class ClientesRelatorioFacadeService {
  private readonly api = inject(ClientesRelatorioApiService);

  readonly activeTab = signal<ClientesRelatorioTab>("visao-geral");
  readonly overviewLoading = signal(false);
  readonly financialLoading = signal(false);
  readonly overviewError = signal<string | null>(null);
  readonly financialError = signal<string | null>(null);

  readonly status = signal<IClienteStatusReport | null>(null);
  readonly classificacao = signal<IClienteClassificacaoNota[]>([]);
  readonly semDados = signal<IClienteSemDados | null>(null);
  readonly multiplosContactos = signal(0);
  readonly clientesRecentes = signal<ICustomerDTO[]>([]);

  readonly faturamento = signal<IClienteFaturamento[]>([]);
  readonly faturamentoResumo = signal<IClienteFaturamentoResumo | null>(null);
  readonly receitasPorCliente = signal<Record<number, IClienteReceita[]>>({});
  readonly receitasLoading = signal<Record<number, boolean>>({});

  readonly periodo = signal<ClientesRelatorioPeriodo>("quarter");
  readonly customDe = signal("");
  readonly customAte = signal("");
  readonly search = signal("");
  readonly page = signal(1);
  readonly pageSize = 8;

  readonly activosPercentual = computed(() => {
    const value = this.status();
    return value?.total ? Math.round((value.activos / value.total) * 100) : 0;
  });

  readonly totalClassificados = computed(() =>
    this.classificacao().reduce(
      (total, item) => total + Number(item.quantidadeClientes),
      0,
    ),
  );

  readonly taxaRecebida = computed(() => {
    const value = this.faturamentoResumo();
    if (!value?.totalFaturado) return 0;
    return (Number(value.totalRecebido) / Number(value.totalFaturado)) * 100;
  });

  readonly filteredFaturamento = computed(() => {
    const term = this.search().trim().toLocaleLowerCase("pt");
    if (!term) return this.faturamento();
    return this.faturamento().filter((item) =>
      item.nomeEmpresarial.toLocaleLowerCase("pt").includes(term),
    );
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredFaturamento().length / this.pageSize)),
  );

  readonly visibleFaturamento = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredFaturamento().slice(start, start + this.pageSize);
  });

  setTab(tab: ClientesRelatorioTab): void {
    this.activeTab.set(tab);
    if (tab === "visao-geral" && !this.status()) this.loadOverview().subscribe();
    if (tab === "analise-financeira" && !this.faturamentoResumo()) {
      this.loadFinancial().subscribe();
    }
  }

  loadOverview(): Observable<void> {
    this.overviewLoading.set(true);
    this.overviewError.set(null);
    return forkJoin({
      status: this.api.getSituacao(),
      classificacao: this.api.getClassificacao(),
      semDados: this.api.getSemDados(),
      multiplos: this.api.getMultiplosContactos(),
      recentes: this.api.getClientesRecentes(),
    }).pipe(
      tap(({ status, classificacao, semDados, multiplos, recentes }) => {
        this.status.set(status);
        this.classificacao.set(classificacao);
        this.semDados.set(semDados);
        this.multiplosContactos.set(multiplos.quantidadeClientes);
        this.clientesRecentes.set(recentes.content);
      }),
      map(() => void 0),
      catchError((error) => {
        this.overviewError.set(this.errorMessage(error));
        return EMPTY;
      }),
      finalize(() => this.overviewLoading.set(false)),
    );
  }

  loadFinancial(): Observable<void> {
    this.financialLoading.set(true);
    this.financialError.set(null);
    const query = this.periodQuery();
    return forkJoin({
      resumo: this.api.getFaturamentoResumo(query),
      faturamento: this.api.getFaturamento(query),
    }).pipe(
      tap(({ resumo, faturamento }) => {
        this.faturamentoResumo.set(resumo);
        this.faturamento.set(faturamento);
        this.page.set(1);
        this.receitasPorCliente.set({});
      }),
      map(() => void 0),
      catchError((error) => {
        this.financialError.set(this.errorMessage(error));
        return EMPTY;
      }),
      finalize(() => this.financialLoading.set(false)),
    );
  }

  setPeriodo(periodo: ClientesRelatorioPeriodo): void {
    this.periodo.set(periodo);
    if (periodo !== "custom") this.loadFinancial().subscribe();
  }

  applyCustomPeriod(): void {
    if (!this.customDe() || !this.customAte()) return;
    this.periodo.set("custom");
    this.loadFinancial().subscribe();
  }

  setSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  nextPage(): void {
    this.page.update((value) => Math.min(this.totalPages(), value + 1));
  }

  previousPage(): void {
    this.page.update((value) => Math.max(1, value - 1));
  }

  loadReceitas(clienteId: number): void {
    if (this.receitasPorCliente()[clienteId]) return;
    this.receitasLoading.update((value) => ({ ...value, [clienteId]: true }));
    this.api
      .getReceitasCliente(clienteId)
      .pipe(
        finalize(() =>
          this.receitasLoading.update((value) => ({
            ...value,
            [clienteId]: false,
          })),
        ),
      )
      .subscribe({
        next: (page) =>
          this.receitasPorCliente.update((value) => ({
            ...value,
            [clienteId]: page.content,
          })),
        error: () =>
          this.receitasPorCliente.update((value) => ({
            ...value,
            [clienteId]: [],
          })),
      });
  }

  exportFinancialCsv(): void {
    const header = [
      "Cliente",
      "Total faturado",
      "Total recebido",
      "Em aberto",
      "Percentagem recebida",
      "Prazo restante (dias)",
    ];
    const rows = this.filteredFaturamento().map((item) => [
      item.nomeEmpresarial,
      item.faturado,
      item.recebido,
      item.emAberto,
      item.percentagemRecebido,
      item.prazoQueFaltaDias ?? "",
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }),
    );
    link.download = "faturamento-clientes.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  formatAmount(value: number | null | undefined): string {
    return new Intl.NumberFormat("pt-MZ", {
      style: "currency",
      currency: "MZN",
      minimumFractionDigits: 2,
    }).format(Number(value ?? 0));
  }

  initials(name: string): string {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  private periodQuery(): IPeriodoQuery {
    if (this.periodo() === "all") return {};
    if (this.periodo() === "custom") {
      return { de: this.customDe(), ate: this.customAte() };
    }

    const now = new Date();
    let start: Date;
    if (this.periodo() === "month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (this.periodo() === "year") {
      start = new Date(now.getFullYear(), 0, 1);
    } else {
      const quarterStart = Math.floor(now.getMonth() / 3) * 3;
      start = new Date(now.getFullYear(), quarterStart, 1);
    }
    return { de: this.toIsoDate(start), ate: this.toIsoDate(now) };
  }

  private toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  private errorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse && error.error?.message) {
      return error.error.message;
    }
    return "Não foi possível carregar o relatório. Tente novamente.";
  }
}
