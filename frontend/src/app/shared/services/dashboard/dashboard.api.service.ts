import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { DASHBOARD_ENDPOINTS } from "./dashboard.endpoint";
import {
  IDashboard,
  IDashboardAlert,
  IAnnualReport,
  IAccountBalance,
  IRevenueVsExpense,
  ITopCategoryExpense,
} from "@/shared/interfaces/dashboard.dto";

@Injectable({ providedIn: "root" })
export class DashboardApiService {
  private readonly http = inject(HttpClient);

  getDashboard(): Observable<IDashboard> {
    return this.http.get<IDashboard>(DASHBOARD_ENDPOINTS.DASHBOARD);
  }

  getAlerts(): Observable<IDashboardAlert> {
    return this.http.get<IDashboardAlert>(DASHBOARD_ENDPOINTS.ALERTS);
  }

  getAnnualReport(): Observable<IAnnualReport> {
    return this.http.get<IAnnualReport>(DASHBOARD_ENDPOINTS.ANNUAL_REPORT);
  }

  getByAccount(): Observable<IAccountBalance[]> {
    return this.http.get<IAccountBalance[]>(DASHBOARD_ENDPOINTS.BY_ACCOUNT);
  }

  getRevenueVsExpenses(): Observable<IRevenueVsExpense[]> {
    return this.http.get<IRevenueVsExpense[]>(
      DASHBOARD_ENDPOINTS.REVENUE_VS_EXPENSES
    );
  }

  getTopCategories(): Observable<ITopCategoryExpense[]> {
    return this.http.get<ITopCategoryExpense[]>(
      DASHBOARD_ENDPOINTS.TOP_CATEGORIES
    );
  }
}
