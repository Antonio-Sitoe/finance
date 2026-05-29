import { Component } from "@angular/core";
import { ModalService } from "../../../services/modal.service";

import { InputFieldComponent } from "../../ui/input/input-field.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { ModalComponent } from "../../ui/modal/modal.component";
import { LabelComponent } from "../../ui/label/label.component";

@Component({
  selector: "app-user-info-card",
  imports: [
    InputFieldComponent,
    ButtonComponent,
    LabelComponent,
    ModalComponent,
  ],
  templateUrl: "./user-info-card.component.html",
  styles: ``,
})
export class UserInfoCardComponent {
  constructor(public modal: ModalService) {}

  isOpen = false;
  openModal() {
    this.isOpen = true;
  }
  closeModal() {
    this.isOpen = false;
  }

  user = {
    firstName: "Musharof",
    lastName: "Chowdhury",
    email: "randomuser@pimjo.com",
    phone: "+09 363 398 46",
    bio: "Team Manager",
    social: {
      facebook: "https://www.facebook.com/PimjoHQ",
      x: "https://x.com/PimjoHQ",
      linkedin: "https://www.linkedin.com/company/pimjo",
      instagram: "https://instagram.com/PimjoHQ",
    },
  };

  handleSave() {
    // Handle save logic here
    console.log("Saving changes...");
    this.modal.closeModal();
  }
}
