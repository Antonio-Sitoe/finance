import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-radio',
  imports: [
    CommonModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true,
    },
  ],
  template: `
  <label
  [attr.for]="id"
  [ngClass]="
    'relative flex cursor-pointer select-none items-center gap-3 text-sm font-medium ' +
    (disabled
      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
      : 'text-gray-700 dark:text-gray-400') +
    ' ' +
    className
  "
>
  <input
    [id]="id"
    [name]="name"
    type="radio"
    [value]="value"
    [checked]="checked"
    (change)="onChange()"
    class="sr-only"
    [disabled]="disabled"
  />
  <span
    [ngClass]="
      'flex h-5 w-5 items-center justify-center rounded-full border-[1.25px] ' +
      (checked
        ? 'border-brand-500 bg-brand-500'
        : 'bg-transparent border-gray-300 dark:border-gray-700') +
      ' ' +
      (disabled
        ? 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-700'
        : '')
    "
  >
    <span
      [ngClass]="
        'h-2 w-2 rounded-full bg-white ' + (checked ? 'block' : 'hidden')
      "
    ></span>
  </span>
  {{ label }}
</label>
  `,
})
export class RadioComponent implements ControlValueAccessor {

  @Input() id!: string;
  @Input() name!: string;
  @Input() value!: string;
  @Input() checked: boolean = false;
  @Input() label!: string;
  @Input() className: string = '';
  @Input() disabled: boolean = false;

  @Output() valueChange = new EventEmitter<string>();

  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.checked = value === this.value;
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

  onChange() {
    if (!this.disabled) {
      this.checked = true;
      this.valueChange.emit(this.value);
      this._onChange(this.value);
      this._onTouched();
    }
  }
}
