import { Component, inject, OnInit } from "@angular/core";
import { ButtonComponent } from "../../ui/button/button.component";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import {
  SolarDynamicIcon,
  LockKeyholeLineDuotone,
  EyeLineDuotone,
  EyeClosedLineDuotone,
  DangerCircleBold,
  CheckCircleBold,
  AltArrowLeftLineDuotone,
} from "@solar-icons/angular";
import { AuthService } from "@/core/auth/auth.service";

@Component({
  selector: "app-reset-password-form",
  imports: [ButtonComponent, RouterModule, FormsModule, SolarDynamicIcon],
  templateUrl: "./reset-password-form.component.html",
  styles: ``,
})
export class ResetPasswordFormComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  readonly LockKeyholeLineDuotone = LockKeyholeLineDuotone;
  readonly EyeLineDuotone = EyeLineDuotone;
  readonly EyeClosedLineDuotone = EyeClosedLineDuotone;
  readonly DangerCircleBold = DangerCircleBold;
  readonly CheckCircleBold = CheckCircleBold;
  readonly AltArrowLeftLineDuotone = AltArrowLeftLineDuotone;

  token = "";
  newPassword = "";
  confirmPassword = "";
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  isSuccess = false;
  passwordMismatch = false;
  hasError = false;
  errorMessage = "";

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get("token") ?? "";
    if (!this.token) {
      this.hasError = true;
      this.errorMessage =
        "Link inválido ou incompleto. Peça um novo email de recuperação.";
    }
  }

  toggleNewPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    this.passwordMismatch = false;
    this.hasError = false;

    if (!this.token) {
      this.hasError = true;
      this.errorMessage =
        "Link inválido ou incompleto. Peça um novo email de recuperação.";
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    if (this.isLoading) return;
    this.isLoading = true;

    this.auth
      .resetPassword(this.token, this.newPassword, this.confirmPassword)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.isSuccess = true;
        },
        error: (err) => {
          this.isLoading = false;
          this.hasError = true;
          this.errorMessage =
            err?.error?.message ??
            "Não foi possível redefinir a password. O link pode ter expirado.";
        },
      });
  }
}
