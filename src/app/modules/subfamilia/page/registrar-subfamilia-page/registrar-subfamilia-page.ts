import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SubfamiliaModel } from '@core/models/subfamilia/subfamilia.model';
import { FamiliaModel } from '@core/models/familia/familia.model';
import { FamiliasService } from '@core/services/familias/familias-service';
import { catchError, of, timeout } from 'rxjs';
import { RequestListaFamiliasModel } from '@core/models/familia/request/listaFamilias.request';

@Component({
  selector: 'app-registrar-subfamilia-page',
  imports: [FormsModule, CommonModule],
  templateUrl: './registrar-subfamilia-page.html',
  styleUrl: './registrar-subfamilia-page.css'
})
export class RegistrarSubfamiliaPage implements OnInit {

  private router = inject(Router);
  private familiasService = inject(FamiliasService);

  // Modelo de subfamilia
  newSubfamilia: SubfamiliaModel = new SubfamiliaModel();

  // Lista de familias disponibles
  familias: FamiliaModel[] = [];

  // Estados del componente
  isLoading: boolean = false;
  isLoadingFamilias: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showSuccessModal: boolean = false;
  modalMessage: string = '';

  constructor() {
    // Inicializar subfamilia con estado activo
    this.newSubfamilia.estado = 1;
  }

  ngOnInit(): void {
    this.cargarFamilias();
  }

  /**
   * Carga la lista de familias disponibles
   */
  cargarFamilias(): void {
    this.isLoadingFamilias = true;
    const request: RequestListaFamiliasModel = { estado: 1 }; // Solo familias activas

    const api$ = this.familiasService.listaFamilias(request).pipe(
      timeout({ each: 7000 }),
      catchError((error) => {
        console.error('Error al cargar familias:', error);
        this.errorMessage = 'Error al cargar las familias. Por favor, inténtelo de nuevo.';
        return of({ exito: false, familia: [] });
      })
    );

    api$.subscribe({
      next: (response) => {
        if (response.exito && response.familia) {
          this.familias = Array.isArray(response.familia) ? response.familia : [response.familia];
        } else {
          this.familias = [];
          if (!this.errorMessage) {
            this.errorMessage = 'No se encontraron familias disponibles.';
          }
        }
        this.isLoadingFamilias = false;
      },
      error: (error) => {
        this.isLoadingFamilias = false;
        this.errorMessage = 'Error al cargar las familias.';
        console.error('Error en la suscripción:', error);
      }
    });
  }

  /**
   * Guarda una nueva subfamilia
   */
  guardarSubfamilia(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simular guardado (aquí irá el servicio real cuando esté disponible)
    setTimeout(() => {
      try {
        console.log('Guardando subfamilia:', this.newSubfamilia);

        const familiaSeleccionada = this.familias.find(f => f.id === this.newSubfamilia.idFamilia);
        const nombreFamilia = familiaSeleccionada ? familiaSeleccionada.descripcion : 'Desconocida';

        this.modalMessage = `La subfamilia "${this.newSubfamilia.descripcion}" ha sido registrada exitosamente en la familia "${nombreFamilia}".`;
        this.showSuccessModal = true;
        this.isLoading = false;

      } catch (error) {
        this.errorMessage = 'Error al guardar la subfamilia. Por favor, inténtelo de nuevo.';
        this.isLoading = false;
      }
    }, 1500);
  }

  /**
   * Valida el formulario antes de guardar
   */
  private validarFormulario(): boolean {
    if (!this.newSubfamilia.descripcion || this.newSubfamilia.descripcion.trim().length < 3) {
      this.errorMessage = 'La descripción de la subfamilia debe tener al menos 3 caracteres.';
      return false;
    }

    if (this.newSubfamilia.descripcion.trim().length > 100) {
      this.errorMessage = 'La descripción de la subfamilia no puede exceder los 100 caracteres.';
      return false;
    }

    if (!this.newSubfamilia.idFamilia || this.newSubfamilia.idFamilia === 0) {
      this.errorMessage = 'Debe seleccionar una familia para la subfamilia.';
      return false;
    }

    return true;
  }

  /**
   * Limpia el formulario
   */
  limpiarFormulario(): void {
    this.newSubfamilia = new SubfamiliaModel();
    this.newSubfamilia.estado = 1;
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
   * Cancela el registro y navega de vuelta a la lista
   */
  cancelarRegistro(): void {
    this.router.navigate(['/lista-subfamilia']);
  }

  /**
   * Navega de vuelta a la lista de subfamilias
   */
  volverCatalogos(): void {
    this.router.navigate(['/lista-subfamilia']);
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
    this.router.navigate(['/lista-subfamilia']);
  }
}
