import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FamiliaModel } from '@core/models/familia/familia.model';
import { FamiliasService } from '@core/services/familias/familias-service';
import { catchError, of, timeout } from 'rxjs';

@Component({
  selector: 'app-registro-familia-page',
  imports: [FormsModule, CommonModule],
  templateUrl: './registro-familia-page.html',
  styleUrl: './registro-familia-page.css'
})
export class RegistroFamiliaPage {

  private router = inject(Router);
  private familiasService = inject(FamiliasService);

  // Modelo de familia
  newFamilia: FamiliaModel = new FamiliaModel();

  // Estados del componente
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showSuccessModal: boolean = false;
  modalMessage: string = '';

  constructor() {
    // Inicializar familia con estado activo
    this.newFamilia.estado = 1;
  }

  /**
   * Guarda una nueva familia
   */
  guardarFamilia(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Preparar datos para enviar
    const familiaToSave: FamiliaModel = {
      id: 0, // El backend asignará el ID
      descripcion: this.newFamilia.descripcion.trim(),
      estado: this.newFamilia.estado
    };

    // Llamada al servicio
    this.familiasService.registrarFamilia(familiaToSave).pipe(
      timeout(10000), // 10 segundos de timeout
      catchError((error) => {
        console.error('Error al registrar familia:', error);
        this.errorMessage = 'Error al conectar con el servidor. Por favor, inténtelo de nuevo.';
        return of(null);
      })
    ).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response && response.exito) {
          this.modalMessage = `La familia "${familiaToSave.descripcion}" ha sido registrada exitosamente.`;
          this.showSuccessModal = true;
        } else {
          this.errorMessage = response?.mensaje || 'Error al guardar la familia. Por favor, inténtelo de nuevo.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error al guardar la familia. Por favor, inténtelo de nuevo.';
        console.error('Error en la suscripción:', error);
      }
    });
  }

  /**
   * Valida el formulario antes de guardar
   */
  private validarFormulario(): boolean {
    if (!this.newFamilia.descripcion || this.newFamilia.descripcion.trim().length < 3) {
      this.errorMessage = 'La descripción de la familia debe tener al menos 3 caracteres.';
      return false;
    }

    if (this.newFamilia.descripcion.trim().length > 100) {
      this.errorMessage = 'La descripción de la familia no puede exceder los 100 caracteres.';
      return false;
    }

    return true;
  }

  /**
   * Limpia el formulario
   */
  limpiarFormulario(): void {
    this.newFamilia = new FamiliaModel();
    this.newFamilia.estado = 1;
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
   * Cancela el registro y vuelve a la lista
   */
  cancelarRegistro(): void {
    this.router.navigate(['/lista-familia']);
  }

  /**
   * Navega de vuelta a la lista de familias
   */
  volverCatalogos(): void {
    this.router.navigate(['/lista-familia']);
  }

  /**
   * Cierra el modal de éxito
   */
  cerrarModal(): void {
    this.showSuccessModal = false;
    this.limpiarFormulario();
  }

  /**
   * Cierra el modal y navega a la lista
   */
  cerrarModalYVolver(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/lista-familia']);
  }
}
