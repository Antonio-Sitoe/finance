import { Component, inject, signal } from "@angular/core";
import { PageHeaderComponent } from "@/shared/components/common/page-header/page-header.component";
import { AccountsListTableComponent } from "@/shared/components/accounts/accounts-list-table/accounts-list-table.component";
import { CreateAndEditAccountComponent } from "@/shared/components/accounts/create-and-edit-account/create-and-edit-account.component";
import { AccountDetailDrawerComponent } from "@/shared/components/accounts/account-detail-drawer/account-detail-drawer.component";
import { IAccount } from "@/shared/interfaces/accounts.dto";
import { AccountsFacadeService } from "@/shared/services/accounts/accounts.facade.service";

@Component({
  selector: "app-accounts",
  imports: [
    PageHeaderComponent,
    AccountsListTableComponent,
    CreateAndEditAccountComponent,
    AccountDetailDrawerComponent,
  ],
  templateUrl: "./accounts.component.html",
})
export class AccountsComponent {
  readonly facade = inject(AccountsFacadeService);

  readonly drawerOpen = signal(false);
  readonly detailDrawerOpen = signal(false);
  readonly selectedAccount = signal<IAccount | null>(null);

  openNew(): void {
    this.selectedAccount.set(null);
    this.drawerOpen.set(true);
  }

  openEdit(account: IAccount): void {
    this.selectedAccount.set(account);
    this.detailDrawerOpen.set(false);
    this.drawerOpen.set(true);
  }

  openDetail(account: IAccount): void {
    this.selectedAccount.set(account);
    this.detailDrawerOpen.set(true);
  }

  onDrawerClose(open: boolean): void {
    this.drawerOpen.set(open);
  }
}
