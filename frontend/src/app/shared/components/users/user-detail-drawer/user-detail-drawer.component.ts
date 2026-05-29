import { Component, Input, Output, EventEmitter } from "@angular/core";
import { DrawerComponent } from "../../ui/drawer/drawer.component";
import { BadgeComponent } from "../../ui/badge/badge.component";

export interface UserDetail {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Activo" | "Inactivo" | "Pendente";
  createdAt: string;
}

type BadgeColor = "primary" | "success" | "error" | "warning" | "info" | "light";

@Component({
  selector: "app-user-detail-drawer",
  imports: [DrawerComponent, BadgeComponent],
  templateUrl: "./user-detail-drawer.component.html",
})
export class UserDetailDrawerComponent {
  @Input() user: UserDetail | null = null;
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() edit = new EventEmitter<UserDetail>();
  @Output() deactivate = new EventEmitter<UserDetail>();

  get initials(): string {
    if (!this.user?.name) return "";
    return this.user.name
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
    if (!this.user?.name) return colors[0];
    const idx = this.user.name
      .split("")
      .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return colors[idx % colors.length];
  }

  statusColor(status: string): BadgeColor {
    if (status === "Activo") return "success";
    if (status === "Pendente") return "warning";
    return "error";
  }

  roleColor(role: string): BadgeColor {
    if (role === "Administrador") return "primary";
    if (role === "Gestor") return "info";
    if (role === "Auditor") return "warning";
    return "light";
  }

  formatDate(date: string): string {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
}
