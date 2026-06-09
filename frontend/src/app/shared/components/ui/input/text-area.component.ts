import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'app-text-area',
  imports: [CommonModule],
  template: `
    <div class="relative">
      <textarea
        [placeholder]="placeholder"
        [rows]="rows"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
        [disabled]="disabled"
        [ngClass]="textareaClasses"
      ></textarea>
      @if (hint) {
      <p
        class="mt-2 text-sm"
        [ngClass]="error ? 'text-error-500' : 'text-gray-500 dark:text-gray-400'">
        {{ hint }}
      </p>
      }
    </div>
  `,
  styles: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaComponent),
      multi: true,
    },
  ],
})
export class TextAreaComponent implements ControlValueAccessor {

  @Input() placeholder = 'Enter your message';
  @Input() rows = 3;
  @Input() value = '';
  @Input() className = '';
  @Input() disabled = false;
  @Input() error = false;
  @Input() hint = '';

  @Output() valueChange = new EventEmitter<string>();

  private _onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event) {
    const val = (event.target as HTMLTextAreaElement).value;
    this.value = val;
    this.valueChange.emit(val);
    this._onChange(val);
  }

  get textareaClasses(): string {
    let base = `w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden ${this.className} `;
    if (this.disabled) {
      base += 'bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed opacity40 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
    } else if (this.error) {
      base += 'bg-transparent border-gray-300 focus:border-error-300 focus:ring-3 focus:ring-error-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-error-800';
    } else {
      base += 'bg-transparent text-gray-900 dark:text-gray-300 text-gray-900 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800';
    }
    return base;
  }
}
