import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { DASHBOARD_ENDPOINTS } from "./dashboard.endpoint";
import {
  IDashboard,
  IDashboardAlert,
  IAnnualReport,
  IAccountBalance,
} from "@/shared/interfaces/dashboard.dto";

@Injectable({ providedIn: "root" })
export class DashboardApiService {
  private readonly http = inject(HttpClient);

  getDashboard(): Observable<IDashboard> {
    return this.http.get<IDashboard>(DASHBOARD_ENDPOINTS.DASHBOARD);
  }

  getAlertas(): Observable<IDashboardAlert> {
    return this.http.get<IDashboardAlert>(DASHBOARD_ENDPOINTS.ALERTAS);
  }

  getRelatorioAnual(): Observable<IAnnualReport> {
    return this.http.get<IAnnualReport>(DASHBOARD_ENDPOINTS.RELATORIO_ANUAL);
  }

  getPorConta(): Observable<IAccountBalance[]> {
    return this.http.get<IAccountBalance[]>(DASHBOARD_ENDPOINTS.POR_CONTA);
  }
}
