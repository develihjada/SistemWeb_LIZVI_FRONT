import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-exito-actualizacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-exito-actualizacion.component.html',
  styleUrl: './modal-exito-actualizacion.component.css'
})
export class ModalExitoActualizacionComponent {

  @Input() isVisible: boolean = false;
  @Input() mensaje: string = 'La operación se completó exitosamente';
  @Input() titulo: string = '¡Actualización exitosa!';
  @Input() textoBoton: string = 'Aceptar';

  @Output() onCerrar = new EventEmitter<void>();
  @Output() onConfirmar = new EventEmitter<void>();

  cerrarModal(): void {
    this.onCerrar.emit();
  }

  confirmarYCerrar(): void {
    this.onConfirmar.emit();
  }
}
