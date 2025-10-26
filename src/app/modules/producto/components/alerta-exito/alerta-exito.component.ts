import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerta-exito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerta-exito.component.html',
  styleUrl: './alerta-exito.component.css'
})
export class AlertaExitoComponent implements OnInit, OnDestroy, OnChanges {

  @Input() isVisible: boolean = false;
  @Input() mensaje: string = 'Operación realizada exitosamente';
  @Input() duracionMs: number = 3000; // Duración en milisegundos
  @Input() posicion: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right';
  @Input() autoClose: boolean = true; // Si se cierra automáticamente

  @Output() onCerrar = new EventEmitter<void>();
  @Output() onTimeout = new EventEmitter<void>();

  private timeoutId?: number;

  ngOnInit(): void {
    if (this.isVisible && this.autoClose) {
      this.iniciarTimeout();
    }
  }

  ngOnDestroy(): void {
    this.limpiarTimeout();
  }

  // Detectar cambios en isVisible para manejar el timeout
  ngOnChanges(): void {
    if (this.isVisible && this.autoClose) {
      this.iniciarTimeout();
    } else {
      this.limpiarTimeout();
    }
  }

  private iniciarTimeout(): void {
    this.limpiarTimeout();
    this.timeoutId = window.setTimeout(() => {
      this.cerrarAlerta();
      this.onTimeout.emit();
    }, this.duracionMs);
  }

  private limpiarTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  cerrarAlerta(): void {
    this.limpiarTimeout();
    this.onCerrar.emit();
  }

  // Obtener las clases CSS para la posición
  get posicionClasses(): string {
    const baseClasses = 'fixed z-50';

    switch (this.posicion) {
      case 'top-right':
        return `${baseClasses} top-4 right-4`;
      case 'top-left':
        return `${baseClasses} top-4 left-4`;
      case 'bottom-right':
        return `${baseClasses} bottom-4 right-4`;
      case 'bottom-left':
        return `${baseClasses} bottom-4 left-4`;
      default:
        return `${baseClasses} top-4 right-4`;
    }
  }
}
