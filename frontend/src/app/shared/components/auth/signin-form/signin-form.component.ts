import { Component } from "@angular/core";
import { CheckboxComponent } from "../../ui/input/checkbox.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { InputFieldComponent } from "../../ui/input/input-field.component";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { LabelComponent } from "../../ui/label/label.component";

@Component({
  selector: "app-signin-form",
  imports: [
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule,
  ],
  templateUrl: "./signin-form.component.html",
  styles: ``,
})
export class SigninFormComponent {
  showPassword = false;
  isChecked = false;

  email = "";
  password = "";

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    console.log("Email:", this.email);
    console.log("Password:", this.password);
    console.log("Remember Me:", this.isChecked);
  }
}
