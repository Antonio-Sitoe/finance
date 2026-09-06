import { Routes } from "@angular/router";
import { ProfileComponent } from "./pages/profile/profile.component";

import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { AppLayoutComponent } from "./shared/layout/app-layout/app-layout.component";
import { LineChartComponent } from "./pages/charts/line-chart/line-chart.component";
import { BarChartComponent } from "./pages/charts/bar-chart/bar-chart.component";
import { SignInComponent } from "./pages/auth-pages/sign-in/sign-in.component";
import { ForgotPasswordComponent } from "./pages/auth-pages/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./pages/auth-pages/reset-password/reset-password.component";
import { UsersComponent } from "./pages/users/users.component";
import { CostumersComponent } from "./pages/costumers/costumers.component";
import { CostumerContactsComponent } from "./pages/costumer-contacts/costumer-contacts.component";
import { ContactsComponent } from "./pages/contacts/contacts.component";
import { SuppliersComponent } from "./pages/suppliers/suppliers.component";
import { AccountsComponent } from "./pages/accounts/accounts.component";
import { CategoriesComponent } from "./pages/categories/categories.component";
import { TransactionsComponent } from "./pages/transactions/transactions.component";
import { TransactionsImportComponent } from "./pages/transactions/import/transactions-import.component";
import { GlobalSearchComponent } from "./pages/global-search/global-search.component";
import { DashboardComponent } from "./pages/dashboard/dashboard/dashboard.component";
import { FluxoDeCaixaComponent } from "./pages/fluxo-de-caixa/fluxo-de-caixa.component";

export const routes: Routes = [
  {
    path: "",
    component: AppLayoutComponent,
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "dashboard",
      },
      {
        path: "dashboard",
        component: DashboardComponent,
        title: "Finance Dashboard | FinanceApp Administrative Panel",
      },
      {
        path: "users",
        component: UsersComponent,
        title: "Finance Users | FinanceApp Administrative Panel",
      },
      {
        path: "costumers",
        component: CostumersComponent,
        title: "Finance Costumers | FinanceApp Administrative Panel",
      },
      {
        path: "costumers/:id/contacts",
        component: CostumerContactsComponent,
        title: "Contactos do Cliente | FinanceApp Administrative Panel",
      },
      {
        path: "contactos",
        component: ContactsComponent,
        title: "Contactos | FinanceApp Administrative Panel",
      },
      {
        path: "suppliers",
        component: SuppliersComponent,
        title: "Fornecedores | FinanceApp Administrative Panel",
      },
      {
        path: "accounts",
        component: AccountsComponent,
        title: "Contas Bancárias | FinanceApp Administrative Panel",
      },
      {
        path: "categories",
        component: CategoriesComponent,
        title: "Categorias | FinanceApp Administrative Panel",
      },
      {
        path: "transactions",
        component: TransactionsComponent,
        title: "Lançamentos | FinanceApp Administrative Panel",
      },
      {
        path: "transactions/import",
        component: TransactionsImportComponent,
        title: "Importar Lançamentos | FinanceApp Administrative Panel",
      },
      {
        path: "fluxo-de-caixa",
        component: FluxoDeCaixaComponent,
        title: "Fluxo de Caixa | FinanceApp Administrative Panel",
      },
      {
        path: "global-search",
        component: GlobalSearchComponent,
        title: "Pesquisa Global | FinanceApp Administrative Panel",
      },
      {
        path: "profile",
        component: ProfileComponent,
        title: "Angular Profile Dashboard | FinanceApp Administrative Panel",
      },

      {
        path: "basic-tables",
        component: LineChartComponent,
        title: "Angular Line Chart Dashboard | FinanceApp Administrative Panel",
      },
      {
        path: "bar-chart",
        component: BarChartComponent,
        title: "Angular Bar Chart Dashboard | FinanceApp Administrative Panel",
      },
    ],
  },
  // auth pages
  {
    path: "signin",
    component: SignInComponent,
    title: "Iniciar Sessão | FinanceApp",
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
    title: "Recuperar Password | FinanceApp",
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
    title: "Nova Password | FinanceApp",
  },
  // error pages
  {
    path: "**",
    component: NotFoundComponent,
    title: "Página não encontrada | FinanceApp Administrative Panel",
  },
];
