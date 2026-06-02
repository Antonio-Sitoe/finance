import { Component } from "@angular/core";
import { CheckboxComponent } from "../../ui/input/checkbox.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import {
  SolarDynamicIcon,
  LetterLineDuotone,
  LockKeyholeLineDuotone,
  EyeLineDuotone,
  EyeClosedLineDuotone,
  DangerCircleBold,
} from "@solar-icons/angular";

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
  readonly LetterLineDuotone = LetterLineDuotone;
  readonly LockKeyholeLineDuotone = LockKeyholeLineDuotone;
  readonly EyeLineDuotone = EyeLineDuotone;
  readonly EyeClosedLineDuotone = EyeClosedLineDuotone;
  readonly DangerCircleBold = DangerCircleBold;

  showPassword = false;
  isChecked = false;
  hasError = false;
  isLoading = false;

  email = "";
  password = "";

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    this.isLoading = true;
    this.hasError = false;
    console.log("Email:", this.email);
    console.log("Password:", this.password);
    console.log("Remember Me:", this.isChecked);

    // simulação — remover quando integrar com API
    setTimeout(() => {
      this.isLoading = false;
      this.hasError = true;
    }, 1200);
  }
}
