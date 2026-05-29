import { Component, Input, Output, EventEmitter } from "@angular/core";
import { DrawerComponent } from "../../ui/drawer/drawer.component";
import { BadgeComponent } from "../../ui/badge/badge.component";
import { IUsuario } from "@/shared/interfaces/users.dto";
import { PROFILE, SITUATION } from "@/shared/interfaces/enum.dto";

type BadgeColor = "primary" | "success" | "error" | "warning" | "info" | "light";

@Component({
  selector: "app-user-detail-drawer",
  imports: [DrawerComponent, BadgeComponent],
  templateUrl: "./user-detail-drawer.component.html",
})
export class UserDetailDrawerComponent {
  @Input() user: IUsuario | null = null;

  readonly SITUATION = SITUATION;
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() edit = new EventEmitter<IUsuario>();
  @Output() deactivate = new EventEmitter<IUsuario>();

  get initials(): string {
    if (!this.user?.nome) return "";
    return this.user.nome
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  get avatarColor(): string {
    const colors = [
      "bg-brand-100 text-brand-600",
      "bg-pink-100 text-pink-600",
      "bg-cyan-100 text-cyan-600",
      "bg-orange-100 text-orange-600",
      "bg-green-100 text-green-600",
      "bg-purple-100 text-purple-600",
    ];
    if (!this.user?.nome) return colors[0];
    const idx = this.user.nome
      .split("")
      .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return colors[idx % colors.length];
  }

  statusColor(situacao: string): BadgeColor {
    if (situacao === SITUATION.ATIVO) return "success";
    return "error";
  }

  roleColor(perfil: string): BadgeColor {
    if (perfil === PROFILE.ADMIN) return "primary";
    return "light";
  }

  formatDate(date: string): string {
    if (!date) return "";
    return new Date(date).toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
}
