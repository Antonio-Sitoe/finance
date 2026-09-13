import { Component, inject } from "@angular/core";
import { ButtonComponent } from "../../ui/button/button.component";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import {
  SolarDynamicIcon,
  LetterLineDuotone,
  AltArrowLeftLineDuotone,
  CheckCircleBold,
} from "@solar-icons/angular";
import { AuthService } from "@/core/auth/auth.service";

@Component({
  selector: "app-forgot-password-form",
  imports: [ButtonComponent, RouterModule, FormsModule, SolarDynamicIcon],
  templateUrl: "./forgot-password-form.component.html",
  styles: ``,
})
export class ForgotPasswordFormComponent {
  private readonly auth = inject(AuthService);

  readonly LetterLineDuotone = LetterLineDuotone;
  readonly AltArrowLeftLineDuotone = AltArrowLeftLineDuotone;
  readonly CheckCircleBold = CheckCircleBold;

  email = "";
  isLoading = false;
  isSubmitted = false;

  onSubmit() {
    if (!this.email || this.isLoading) return;
    this.isLoading = true;

    this.auth.forgotPassword(this.email.trim()).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSubmitted = true;
      },
      error: () => {
        // Backend devolve sempre 200; se falhar validação/rede, mostrar mesmo o ecrã de sucesso
        // para não revelar se o email existe (excepto erros de rede óbvios — UX do guia).
        this.isLoading = false;
        this.isSubmitted = true;
      },
    });
  }

  resend() {
    this.isSubmitted = false;
  }
}
