import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeToggleTwoComponent } from '../../components/common/theme-toggle-two/theme-toggle-two.component';
import { SolarDynamicIcon, BuildingsBold, CheckCircleBold } from '@solar-icons/angular';

@Component({
  selector: 'app-auth-page-layout',
  imports: [
    RouterModule,
    ThemeToggleTwoComponent,
    SolarDynamicIcon,
  ],
  templateUrl: './auth-page-layout.component.html',
  styles: ``
})
export class AuthPageLayoutComponent {
  readonly BuildingsBold = BuildingsBold;
  readonly CheckCircleBold = CheckCircleBold;
}
