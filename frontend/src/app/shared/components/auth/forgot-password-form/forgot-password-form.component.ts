import { Component } from "@angular/core";
import { ButtonComponent } from "../../ui/button/button.component";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import {
  SolarDynamicIcon,
  LetterLineDuotone,
  AltArrowLeftLineDuotone,
  CheckCircleBold,
} from "@solar-icons/angular";

@Component({
  selector: "app-forgot-password-form",
  imports: [ButtonComponent, RouterModule, FormsModule, SolarDynamicIcon],
  templateUrl: "./forgot-password-form.component.html",
  styles: ``,
})
export class ForgotPasswordFormComponent {
  readonly LetterLineDuotone = LetterLineDuotone;
  readonly AltArrowLeftLineDuotone = AltArrowLeftLineDuotone;
  readonly CheckCircleBold = CheckCircleBold;

  email = "";
  isLoading = false;
  isSubmitted = false;

  onSubmit() {
    if (!this.email) return;
    this.isLoading = true;

    // simulação — remover quando integrar com API
    setTimeout(() => {
      this.isLoading = false;
      this.isSubmitted = true;
    }, 1200);
  }

  resend() {
    this.isSubmitted = false;
  }
}
