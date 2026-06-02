import { Component } from "@angular/core";
import { InputFieldComponent } from "../../ui/input/input-field.component";
import { ModalService } from "../../../services/modal.service";

import { ModalComponent } from "../../ui/modal/modal.component";
import { ButtonComponent } from "../../ui/button/button.component";

@Component({
  selector: "app-user-meta-card",
  imports: [ModalComponent, InputFieldComponent, ButtonComponent],
  templateUrl: "./user-meta-card.component.html",
  styles: ``,
})
export class UserMetaCardComponent {
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
    initials: "MC",
    role: "GESTOR",
    cargo: "Team Manager",
    location: "Arizona, United States",
    avatar: "/images/user/owner.jpg",
    email: "randomuser@pimjo.com",
    phone: "+09 363 398 46",
    joinedDate: "15 de Janeiro de 2024",
    lastAccess: "Há 2 horas",
    active: true,
  };

  handleSave() {
    // Handle save logic here
    console.log("Saving changes...");
    this.modal.closeModal();
  }
}
