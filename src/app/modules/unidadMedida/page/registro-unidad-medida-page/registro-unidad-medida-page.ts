import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UnidadMedidaModel } from '../../../../core/models/unidadMedida/unidadmedida.model';
import { UnidadesMedidaService } from '../../../../core/services/unidadesMedida/unidades-medida-service';
import { ResponseGeneral } from '../../../../shared/model/general.response';

@Component({
  selector: 'app-registro-unidad-medida-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-unidad-medida-page.html',
  styleUrl: './registro-unidad-medida-page.css'
})
export class RegistroUnidadMedidaPage {

  private router: Router;
  private location: Location;
  private unidadesMedidaService: UnidadesMedidaService;

  // Modelo para nueva unidad de medida
  newUnidadMedida: UnidadMedidaModel = new UnidadMedidaModel();

  // Estados de carga y modal
  isLoading: boolean = false;
  showSuccessModal: boolean = false;

  // Mensajes
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor() {
    this.router = inject(Router);
    this.location = inject(Location);
    this.unidadesMedidaService = inject(UnidadesMedidaService);

    // Inicializar valores por defecto
    this.newUnidadMedida.estado = 1; // Activo por defecto
  }

  /**
   * Valida si el formulario es válido antes de enviar
   */
  isFormValid(): boolean {
    return this.newUnidadMedida.descripcion.trim().length >= 2 &&
           this.newUnidadMedida.descripcion.trim().length <= 100;
  }

  /**
   * Guarda la nueva unidad de medida
   */
  guardarUnidadMedida(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.isLoading = true;

    // Preparar datos para envío
    const unidadMedidaParaGuardar = {
      ...this.newUnidadMedida,
      descripcion: this.newUnidadMedida.descripcion.trim()
    };

    this.unidadesMedidaService.registroUnidadMedida(unidadMedidaParaGuardar).subscribe({
      next: (response: ResponseGeneral) => {
        this.isLoading = false;
        if (response.exito) {
          this.showSuccessModal = true;
        } else {
          alert('Error al guardar la unidad de medida: ' + (response.mensaje || 'Error desconocido'));
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error al guardar unidad de medida:', error);
        alert('Error de conexión. No se pudo guardar la unidad de medida.');
      }
    });
  }

  /**
   * Limpia el formulario restaurando valores por defecto
   */
  limpiarFormulario(): void {
    this.newUnidadMedida = new UnidadMedidaModel();
    this.newUnidadMedida.estado = 1; // Activo por defecto
  }

  /**
   * Cancela el registro y navega de vuelta a la lista
   */
  cancelarRegistro(): void {
    this.router.navigate(['/lista-unidad-medida']);
  }

  /**
   * Navega de vuelta a la lista de unidades de medida
   */
  volverCatalogos(): void {
    this.router.navigate(['/lista-unidad-medida']);
  }

  /**
   * Cierra el modal y navega a la lista
   */
  cerrarModalYVolver(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/lista-unidad-medida']);
  }
}
