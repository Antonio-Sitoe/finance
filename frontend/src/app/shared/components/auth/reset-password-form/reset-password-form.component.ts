import { Component } from "@angular/core";
import { ButtonComponent } from "../../ui/button/button.component";
import { RouterModule } from "@angular/router";
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

@Component({
  selector: "app-reset-password-form",
  imports: [ButtonComponent, RouterModule, FormsModule, SolarDynamicIcon],
  templateUrl: "./reset-password-form.component.html",
  styles: ``,
})
export class ResetPasswordFormComponent {
  readonly LockKeyholeLineDuotone = LockKeyholeLineDuotone;
  readonly EyeLineDuotone = EyeLineDuotone;
  readonly EyeClosedLineDuotone = EyeClosedLineDuotone;
  readonly DangerCircleBold = DangerCircleBold;
  readonly CheckCircleBold = CheckCircleBold;
  readonly AltArrowLeftLineDuotone = AltArrowLeftLineDuotone;

  newPassword = "";
  confirmPassword = "";
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  isSuccess = false;
  passwordMismatch = false;

  toggleNewPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    this.passwordMismatch = false;

    if (this.newPassword !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    this.isLoading = true;

    // simulação — remover quando integrar com API
    setTimeout(() => {
      this.isLoading = false;
      this.isSuccess = true;
    }, 1200);
  }
}
