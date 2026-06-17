import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { GLOBAL_SEARCH_ENDPOINTS } from "./global-search.endpoint.service";
import {
  IGlobalSearchResults,
  IGlobalSearchTransaction,
  LancamentoEstado,
  RawSearchResponse,
  RawLancamento,
} from "@/shared/interfaces/global-search.dto";

@Injectable({
  providedIn: "root",
})
export class GlobalSearchApiService {
  private readonly http = inject(HttpClient);

  globalSearch(query: string, limit = 5): Observable<IGlobalSearchResults> {
    const params = new HttpParams().set("q", query).set("limit", String(limit));
    return this.http
      .get<RawSearchResponse>(GLOBAL_SEARCH_ENDPOINTS.SEARCH, { params })
      .pipe(map((raw) => this.toResults(raw)));
  }

  private toResults(raw: RawSearchResponse): IGlobalSearchResults {
    return {
      clientes: (raw.clientes ?? []).map((c) => ({
        id: c.id,
        nomeEmpresarial: c.nomeEmpresarial,
        identificador: c.email,
        situacao: c.situacao,
      })),
      fornecedores: (raw.fornecedores ?? []).map((f) => ({
        id: f.id,
        nomeEmpresarial: f.nomeEmpresarial,
        email: f.email,
        nota: f.nota,
      })),
      lancamentos: (raw.lancamentos ?? []).map((l) => this.toTransaction(l)),
    };
  }

  private toTransaction(l: RawLancamento): IGlobalSearchTransaction {
    return {
      id: l.id,
      descricao: l.descricao,
      referencia: l.referencia ?? undefined,
      data: this.formatDate(l.dataLancamento),
      estado: this.toEstado(l),
      tipo: l.tipo === "RECEITA" ? "CREDITO" : "DEBITO",
      valor: Number(l.valor),
    };
  }

  private toEstado(l: RawLancamento): LancamentoEstado {
    if (l.situacao === "PAGO") return "PAGO";
    const vencimento = l.dataVencimento ? new Date(l.dataVencimento) : null;
    if (vencimento && vencimento.getTime() < Date.now()) return "VENCIDO";
    return "PENDENTE";
  }

  private formatDate(iso: string): string {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
}
