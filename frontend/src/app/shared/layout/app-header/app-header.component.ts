import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeToggleButtonComponent } from '../../components/common/theme-toggle/theme-toggle-button.component';
import { UserDropdownComponent } from '../../components/header/user-dropdown/user-dropdown.component';
import { GloabalSearchFacadeService } from '../../services/global-search/gloabal-search.facade.service';
import {
  SolarDynamicIcon,
  HamburgerMenuBold,
  CloseCircleBold,
  MenuDotsBold,
  MagnifierBold,
} from '@solar-icons/angular';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterModule,
    ThemeToggleButtonComponent,
    UserDropdownComponent,
    SolarDynamicIcon,
  ],
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent {
  readonly HamburgerMenuBold = HamburgerMenuBold;
  readonly CloseCircleBold = CloseCircleBold;
  readonly MenuDotsBold = MenuDotsBold;
  readonly MagnifierBold = MagnifierBold;

  isApplicationMenuOpen = false;
  readonly isMobileOpen$;

  // Abre o command palette global. O atalho ⌘/Ctrl+K é tratado no AppComponent.
  readonly search = inject(GloabalSearchFacadeService);

  constructor(public sidebarService: SidebarService) {
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  handleToggle() {
    if (window.innerWidth >= 1280) {
      this.sidebarService.toggleExpanded();
    } else {
      this.sidebarService.toggleMobileOpen();
    }
  }

  toggleApplicationMenu() {
    this.isApplicationMenuOpen = !this.isApplicationMenuOpen;
  }
}
