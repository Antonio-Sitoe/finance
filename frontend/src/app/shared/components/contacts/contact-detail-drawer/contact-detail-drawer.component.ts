import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { DrawerComponent } from "@/shared/components/ui/drawer/drawer.component";
import { BadgeComponent } from "@/shared/components/ui/badge/badge.component";
import { SwitchComponent } from "@/shared/components/ui/input/switch.component";
import { AvatarTextComponent } from "@/shared/components/ui/avatar/avatar-text.component";
import { IContactDTO } from "@/shared/interfaces/contacts.dto";
import { SITUATION } from "@/shared/interfaces/enum.dto";
import { ContactoApiService } from "@/shared/services/contactos/contacto.api.service";
import { ToastService } from "@/shared/services/toast.service";
import {
  SolarDynamicIcon,
  Pen2Bold,
  BuildingsBold,
  PhoneCallingBold,
  LetterBold,
  ClockCircleBold,
} from "@solar-icons/angular";

@Component({
  selector: "app-contact-detail-drawer",
  imports: [
    RouterModule,
    DrawerComponent,
    BadgeComponent,
    SwitchComponent,
    AvatarTextComponent,
    SolarDynamicIcon,
  ],
  templateUrl: "./contact-detail-drawer.component.html",
})
export class ContactDetailDrawerComponent implements OnInit {
  @Input() contact: IContactDTO | null = null;
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() edit = new EventEmitter<IContactDTO>();
  @Output() situacaoChange = new EventEmitter<IContactDTO>();

  readonly Pen2Bold = Pen2Bold;
  readonly BuildingsBold = BuildingsBold;
  readonly PhoneCallingBold = PhoneCallingBold;
  readonly LetterBold = LetterBold;
  readonly ClockCircleBold = ClockCircleBold;

  private readonly api = inject(ContactoApiService);
  private readonly toast = inject(ToastService);

  readonly isLoading = signal(false);
  readonly situacao = signal<SITUATION>(SITUATION.ATIVO);

  ngOnInit(): void {
    const situacao = this.contact?.situacao;
    this.situacao.set(
      situacao === SITUATION.INATIVO ? SITUATION.INATIVO : SITUATION.ATIVO
    );
  }

  get isActive(): boolean {
    return this.situacao() === SITUATION.ATIVO;
  }

  toggleSituacao(): void {
    if (!this.contact || this.isLoading()) return;
    const loadingId = this.toast.loading("A mudar o estado do contacto...");
    this.isLoading.set(true);
    this.api.toggleSituacao(this.contact.id).subscribe({
      next: (res) => {
        this.toast.dismiss(loadingId);
        this.toast.success(res.mensagem || "Estado mudado");
        this.situacao.set(
          res.situacao === SITUATION.INATIVO
            ? SITUATION.INATIVO
            : SITUATION.ATIVO
        );
        this.isLoading.set(false);
        if (this.contact) this.situacaoChange.emit(this.contact);
      },
      error: (err) => {
        this.toast.dismiss(loadingId);
        const msg = err?.error?.message || "Erro ao atualizar estado";
        this.toast.error("Falha", msg);
        this.isLoading.set(false);
      },
    });
  }

  getEmpresaInitials(nome?: string): string {
    if (!nome) return "?";
    return nome
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  formatDate(date: string): string {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  handleEdit(): void {
    if (this.contact) {
      this.openChange.emit(false);
      this.edit.emit(this.contact);
    }
  }
}
