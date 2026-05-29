import { Routes } from "@angular/router";
import { EcommerceComponent } from "./pages/dashboard/ecommerce/ecommerce.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { FormElementsComponent } from "./pages/forms/form-elements/form-elements.component";
import { BasicTablesComponent } from "./pages/tables/basic-tables/basic-tables.component";
import { BlankComponent } from "./pages/blank/blank.component";
import { NotFoundComponent } from "./pages/other-page/not-found/not-found.component";
import { AppLayoutComponent } from "./shared/layout/app-layout/app-layout.component";
import { InvoicesComponent } from "./pages/invoices/invoices.component";
import { LineChartComponent } from "./pages/charts/line-chart/line-chart.component";
import { BarChartComponent } from "./pages/charts/bar-chart/bar-chart.component";
import { AlertsComponent } from "./pages/ui-elements/alerts/alerts.component";
import { AvatarElementComponent } from "./pages/ui-elements/avatar-element/avatar-element.component";
import { BadgesComponent } from "./pages/ui-elements/badges/badges.component";
import { ButtonsComponent } from "./pages/ui-elements/buttons/buttons.component";
import { SignInComponent } from "./pages/auth-pages/sign-in/sign-in.component";
import { SignUpComponent } from "./pages/auth-pages/sign-up/sign-up.component";
import { CalenderComponent } from "./pages/calender/calender.component";
import { UsersComponent } from "./pages/users/users.component";

export const routes: Routes = [
  {
    path: "",
    component: AppLayoutComponent,
    children: [
      {
        path: "",
        component: EcommerceComponent,
        pathMatch: "full",
        title: "Angular Ecommerce Dashboard | FinanceApp Administrative Panel",
      },
      {
        path: "users",
        component: UsersComponent,
        title: "Finance Users | FinanceApp Administrative Panel",
      },
      {
        path: "calendar",
        component: CalenderComponent,
        title: "Angular Calender | FinanceApp Administrative Panel",
      },
      {
        path: "profile",
        component: ProfileComponent,
        title: "Angular Profile Dashboard | FinanceApp Administrative Panel",
      },
      {
        path: "form-elements",
        component: FormElementsComponent,
        title:
          "Angular Form Elements Dashboard | FinanceApp Administrative Panel",
      },
      {
        path: "basic-tables",
        component: BasicTablesComponent,
        title:
          "Angular Basic Tables Dashboard | FinanceApp Administrative Panel",
      },
      {
        path: "blank",
        component: BlankComponent,
        title: "Angular Blank Dashboard | FinanceApp Administrative Panel",
      },
      // support tickets
      {
        path: "invoice",
        component: InvoicesComponent,
        title:
          "Angular Invoice Details Dashboard | FinanceApp Administrative Panel",
      },
      {
        path: "line-chart",
        component: LineChartComponent,
        title: "Angular Line Chart Dashboard | FinanceApp Administrative Panel",
      },
      {
        path: "bar-chart",
        component: BarChartComponent,
        title: "Angular Bar Chart Dashboard | FinanceApp Administrative Panel",
      },
      {
        path: "alerts",
        component: AlertsComponent,
        title: "Angular Alerts Dashboard | FinanceApp Administrative Panel",
      },
      {
        path: "avatars",
        component: AvatarElementComponent,
        title: "Angular Avatars Dashboard | FinanceApp Administrative Panel",
      },
      {
        path: "badge",
        component: BadgesComponent,
        title: "Angular Badges Dashboard | FinanceApp Administrative Panel",
      },
      {
        path: "buttons",
        component: ButtonsComponent,
        title: "Angular Buttons Dashboard | FinanceApp Administrative Panel",
      },
    ],
  },
  // auth pages
  {
    path: "signin",
    component: SignInComponent,
    title: "Angular Sign In Dashboard | FinanceApp Administrative Panel",
  },
  {
    path: "signup",
    component: SignUpComponent,
    title: "Angular Sign Up Dashboard | FinanceApp Administrative Panel",
  },
  // error pages
  {
    path: "**",
    component: NotFoundComponent,
    title: "Angular NotFound Dashboard | FinanceApp Administrative Panel",
  },
];
