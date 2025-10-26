import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-conexion-api',
  imports: [CommonModule],
  templateUrl: './error-conexion-api.html',
  styleUrl: './error-conexion-api.css'
})
export class ErrorConexionApi {
  @Input() errorMessage: string = 'Ocurrió un error de conexión con el servidor.';
  @Input() mostrarBotonReintentar: boolean = true;
  @Input() textoBoton: string = 'Reintentar';

  @Output() onReintentar = new EventEmitter<void>();
  @Output() onCerrar = new EventEmitter<void>();

  reintentar(): void {
    this.onReintentar.emit();
  }

  cerrar(): void {
    this.onCerrar.emit();
  }
}
