import { CommonModule } from '@angular/common'
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core'
import { SolarDynamicIcon } from '@solar-icons/angular'

/**
 * `app-command-input` — barra de pesquisa do command palette.
 * Apenas apresentação: emite `valueChange` e `closeClick`.
 * O foco é controlado pelo pai (quando o modal abre) via `focus()`.
 */
@Component({
  selector: 'app-command-input',
  imports: [CommonModule, SolarDynamicIcon],
  templateUrl: './command-input.component.html',
})
export class CommandInputComponent {
  @Input() value = ''
  @Input() placeholder = 'Pesquisar...'
  @Input() loading = false

  @Output() valueChange = new EventEmitter<string>()
  @Output() closeClick = new EventEmitter<void>()

  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>

  /** Foca o campo (chamado quando o modal abre). */
  focus(): void {
    this.inputEl?.nativeElement.focus()
  }

  onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value)
  }
}
