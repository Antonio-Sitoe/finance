import { Component } from "@angular/core";
import { SelectInputsComponent } from "../../../shared/components/form/form-elements/select-inputs/select-inputs.component";
import { FileInputExampleComponent } from "../../../shared/components/form/form-elements/file-input-example/file-input-example.component";
import { CheckboxComponentsComponent } from "../../../shared/components/form/form-elements/checkbox-components/checkbox-components.component";
import { RadioButtonsComponent } from "../../../shared/components/form/form-elements/radio-buttons/radio-buttons.component";
import { ToggleSwitchComponent } from "../../../shared/components/form/form-elements/toggle-switch/toggle-switch.component";
import { DropzoneComponent } from "../../../shared/components/form/form-elements/dropzone/dropzone.component";

@Component({
  selector: "app-form-elements",
  imports: [
    SelectInputsComponent,

    FileInputExampleComponent,
    CheckboxComponentsComponent,
    RadioButtonsComponent,
    ToggleSwitchComponent,
    DropzoneComponent,
  ],
  templateUrl: "./form-elements.component.html",
  styles: ``,
})
export class FormElementsComponent {}
