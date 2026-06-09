import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  forwardRef,
  signal,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: "app-select",
  imports: [],
  templateUrl: "./select.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements OnChanges, ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  @Input() placeholder = "Seleccionar";
  @Input() className = "";
  @Input() defaultValue = "";
  @Input() value = "";
  @Input() disabled = false;
  @Input() error = false;
  @Input() success = false;
  @Input() hint?: string;

  @Output() valueChange = new EventEmitter<string>();

  isOpen = signal(false);

  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};

  ngOnChanges(): void {
    if (!this.value && this.defaultValue) {
      this.value = this.defaultValue;
    }
  }

  writeValue(value: string): void {
    this.value = value ?? "";
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get buttonClasses(): string {
    let classes =
      "flex h-11 w-full items-center justify-between gap-2 rounded-lg border bg-transparent px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 ";
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
        "border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800";
    }
    return classes;
  }

  get selectedLabel(): string {
    return this.options.find((o) => o.value === this.value)?.label ?? "";
  }

  toggle(): void {
    if (this.disabled) return;
    this.isOpen.update((v) => !v);
  }

  select(option: SelectOption): void {
    this.value = option.value;
    this.valueChange.emit(option.value);
    this._onChange(option.value);
    this._onTouched();
    this.isOpen.set(false);
  }

  @HostListener("document:click")
  onDocumentClick(): void {
    if (this.isOpen()) {
      this._onTouched();
      this.isOpen.set(false);
    }
  }
}
