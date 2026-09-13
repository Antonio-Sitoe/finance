import { Component, inject } from "@angular/core";
import { CheckboxComponent } from "../../ui/input/checkbox.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import {
  SolarDynamicIcon,
  LetterLineDuotone,
  LockKeyholeLineDuotone,
  EyeLineDuotone,
  EyeClosedLineDuotone,
  DangerCircleBold,
} from "@solar-icons/angular";
import { AuthService } from "@/core/auth/auth.service";

@Component({
  selector: "app-signin-form",
  imports: [
    CheckboxComponent,
    ButtonComponent,
    RouterModule,
    FormsModule,
    SolarDynamicIcon,
  ],
  templateUrl: "./signin-form.component.html",
  styles: ``,
})
export class SigninFormComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly LetterLineDuotone = LetterLineDuotone;
  readonly LockKeyholeLineDuotone = LockKeyholeLineDuotone;
  readonly EyeLineDuotone = EyeLineDuotone;
  readonly EyeClosedLineDuotone = EyeClosedLineDuotone;
  readonly DangerCircleBold = DangerCircleBold;

  showPassword = false;
  isChecked = false;
  hasError = false;
  isLoading = false;
  errorMessage = "Email ou senha inválidos";

  email = "";
  password = "";

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    if (!this.email || !this.password || this.isLoading) return;

    this.isLoading = true;
    this.hasError = false;

    this.auth.login(this.email.trim(), this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(["/dashboard"]);
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = "Email ou senha inválidos";
      },
    });
  }
}
