import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DrawerComponent } from "../../ui/drawer/drawer.component";

@Component({
  selector: "app-create-and-edit-user",
  imports: [DrawerComponent],
  templateUrl: "./create-and-edit-user.component.html",
})
export class CreateAndEditUserComponent {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
}
