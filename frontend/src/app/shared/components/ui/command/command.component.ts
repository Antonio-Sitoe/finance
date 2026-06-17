import { CommonModule } from '@angular/common'
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core'

/**
 * `app-command` — casca (shell) do command palette.
 *
 * Padrão de composição: este componente apenas trata do overlay, painel,
 * animação e fecho (backdrop / ESC). O conteúdo (input, grupos, itens, rodapé)
 * é projectado via `<ng-content>`, permitindo montar diferentes layouts.
 *
 * Ex.:
 *   <app-command [open]="open()" (close)="open.set(false)">
 *     <app-command-input ... />
 *     <app-command-list>
 *       <app-command-group heading="Clientes"> ... </app-command-group>
 *     </app-command-list>
 *     <app-command-footer />
 *   </app-command>
 */
@Component({
  selector: 'app-command',
  imports: [CommonModule],
  templateUrl: './command.component.html',
})
export class CommandComponent {
  @Input() open = false
  /** Fecha ao clicar fora do painel. */
  @Input() closeOnBackdrop = true
  @Output() close = new EventEmitter<void>()

  onBackdrop(): void {
    if (this.closeOnBackdrop) this.close.emit()
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) this.close.emit()
  }
}
