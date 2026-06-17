import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  forwardRef,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import flatpickr from "flatpickr";
import { LabelComponent } from "../label/label.component";

// @ts-ignore
import "flatpickr/dist/flatpickr.css";

@Component({
  selector: "app-date-picker",
  imports: [LabelComponent],
  templateUrl: "./date-picker.component.html",
  styles: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
})
export class DatePickerComponent
  implements ControlValueAccessor
{
  @Input() id!: string;
  @Input() mode: "single" | "multiple" | "range" | "time" = "single";
  @Input() defaultDate?: string | Date | string[] | Date[];
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() dateFormat = "Y-m-d";
  @Input() error = false;
  @Input() success = false;
  @Input() hint?: string;
  @Input() disabled = false;
  @Output() dateChange = new EventEmitter<any>();

  @ViewChild("dateInput", { static: false })
  dateInput!: ElementRef<HTMLInputElement>;

  private flatpickrInstance: flatpickr.Instance | undefined;
  private pendingValue: string | Date | string[] | Date[] | undefined;

  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};

  ngAfterViewInit() {
    this.flatpickrInstance = flatpickr(this.dateInput.nativeElement, {
      mode: this.mode,
      static: true,
      monthSelectorType: "static",
      dateFormat: this.dateFormat,
      defaultDate: this.pendingValue ?? this.defaultDate,
      onChange: (selectedDates, dateStr, instance) => {
        this._onChange(dateStr);
        this.dateChange.emit({ selectedDates, dateStr, instance });
      },
      onClose: () => this._onTouched(),
    });
    this.pendingValue = undefined;

    if (this.disabled) {
      this.dateInput.nativeElement.disabled = true;
    }
  }

  ngOnDestroy() {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }
  }

  get inputClasses(): string {
    let classes =
      "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ";
    if (this.disabled) {
      classes +=
        "border-gray-300 opacity-40 cursor-not-allowed dark:border-gray-700";
    } else if (this.error) {
      classes +=
        "border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:border-error-500 dark:focus:border-error-800";
    } else if (this.success) {
      classes +=
        "border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:border-success-500 dark:focus:border-success-800";
    } else {
      classes +=
        "border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800";
    }
    return classes;
  }

  writeValue(value: string | Date | string[] | Date[]): void {
    if (this.flatpickrInstance) {
      if (value) {
        this.flatpickrInstance.setDate(value, false);
      } else {
        this.flatpickrInstance.clear(false);
      }
    } else {
      this.pendingValue = value;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.dateInput?.nativeElement) {
      this.dateInput.nativeElement.disabled = isDisabled;
    }
  }
}
