import { Routes } from "@angular/router";
import { EcommerceComponent } from "./pages/dashboard/ecommerce/ecommerce.component";
import { ProfileComponent } from "./pages/profile/profile.component";

import { NotFoundComponent } from "./pages/other-page/not-found/not-found.component";
import { AppLayoutComponent } from "./shared/layout/app-layout/app-layout.component";
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
import { CostumersComponent } from "./pages/costumers/costumers.component";

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
        path: "costumers",
        component: CostumersComponent,
        title: "Finance Costumers | FinanceApp Administrative Panel",
        children: [
          {
            path: ":id/contacts",
            component: CalenderComponent,
            title: "Finance company Contacts | FinanceApp Administrative Panel",
          },
        ],
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
