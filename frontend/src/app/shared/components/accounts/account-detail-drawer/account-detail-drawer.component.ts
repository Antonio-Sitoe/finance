import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { IAccount } from "@/shared/interfaces/accounts.dto";
import { SITUATION } from "@/shared/interfaces/enum.dto";
import { DrawerComponent } from "@/shared/components/ui/drawer/drawer.component";
import { BadgeComponent } from "@/shared/components/ui/badge/badge.component";
import { SwitchComponent } from "@/shared/components/ui/input/switch.component";
import { AccountsFacadeService } from "@/shared/services/accounts/accounts.facade.service";
import { AccountApiService } from "@/shared/services/accounts/account.api.service";
import { ToastService } from "@/shared/services/toast.service";
import { SolarDynamicIcon, Pen2Bold, CardBold } from "@solar-icons/angular";

@Component({
  selector: "app-account-detail-drawer",
  imports: [
    DrawerComponent,
    BadgeComponent,
    SwitchComponent,
    SolarDynamicIcon,
    DatePipe,
  ],
  templateUrl: "./account-detail-drawer.component.html",
})
export class AccountDetailDrawerComponent implements OnInit {
  @Input() account: IAccount | null = null;
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() edit = new EventEmitter<IAccount>();

  readonly Pen2Bold = Pen2Bold;
  readonly CardBold = CardBold;

  readonly facade = inject(AccountsFacadeService);
  private readonly api = inject(AccountApiService);
  private readonly toast = inject(ToastService);

  readonly isLoading = signal(false);
  readonly situacao = signal<SITUATION>(SITUATION.ATIVO);

  ngOnInit(): void {
    const situacao = this.account?.situacao;
    this.situacao.set(
      situacao === SITUATION.INATIVO ? SITUATION.INATIVO : SITUATION.ATIVO
    );
  }

  get isActive(): boolean {
    return this.situacao() === SITUATION.ATIVO;
  }

  toggleSituacao(): void {
    if (!this.account || this.isLoading()) return;
    const loadingId = this.toast.loading("A mudar o estado da conta...");
    this.isLoading.set(true);
    this.api.toggleSituacao(this.account.id).subscribe({
      next: (res) => {
        this.toast.dismiss(loadingId);
        this.toast.success(res.mensagem || "Estado mudado");
        this.situacao.set(
          res.situacao === SITUATION.INATIVO
            ? SITUATION.INATIVO
            : SITUATION.ATIVO
        );
        this.facade.refresh();
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toast.dismiss(loadingId);
        const msg = err?.error?.message || "Erro ao atualizar estado";
        this.toast.error("Falha", msg);
        this.isLoading.set(false);
      },
    });
  }

  handleEdit(): void {
    if (this.account) {
      this.openChange.emit(false);
      this.edit.emit(this.account);
    }
  }
}
