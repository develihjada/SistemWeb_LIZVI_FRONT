import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RolesService } from '../../../../core/services/roles/roles.service';
import { RequestRegistroRolModel } from '../../../../core/models/rol/request/registroRol.request';
import { ResponseGeneral } from '../../../../shared/model/general.response';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-registro-roles-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-roles-page.html',
  styleUrl: './registro-roles-page.css'
})
export class RegistroRolesPage {

  private fb: FormBuilder;
  private location: Location;
  private router: Router;
  private api: RolesService;

  formRegistro: FormGroup;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor() {
    this.fb = inject(FormBuilder);
    this.location = inject(Location);
    this.router = inject(Router);
    this.api = inject(RolesService);

    this.formRegistro = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      estado: [1, [Validators.required]]
    });
  }

  /**
   * Registra un nuevo rol
   */
  registrarRol(): void {
    if (this.formRegistro.valid) {
      this.errorMessage = null;
      this.successMessage = null;
      this.isLoading = true;

      const requestData: RequestRegistroRolModel = {
        nombre: this.formRegistro.value.nombre.trim(),
        descripcion: this.formRegistro.value.descripcion.trim(),
        estado: this.formRegistro.value.estado
      };

      const api$ = this.api.registroRol(requestData).pipe(
        catchError((error) => {
          this.errorMessage = 'No se pudo conectar al servidor. Revisa tu red o inténtalo más tarde.';
          return of({ exito: false, mensaje: 'Error de conexión' } as ResponseGeneral);
        })
      );

      const sub = api$.subscribe({
        next: (response: ResponseGeneral) => {
          if (response.exito) {
            this.successMessage = 'Rol registrado exitosamente';
            this.formRegistro.reset();
            this.formRegistro.patchValue({ estado: 1 });

            // Opcional: Redirigir después de un tiempo
            setTimeout(() => {
              this.volverLista();
            }, 2000);
          } else {
            this.errorMessage = response.mensaje || 'No se pudo registrar el rol';
          }
        },
        error: (err) => {
          this.errorMessage = this.errorMessage ?? 'No se pudo registrar el rol.';
        }
      });

      sub.add(() => {
        this.isLoading = false;
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Marca todos los campos del formulario como touched para mostrar errores
   */
  private markFormGroupTouched(): void {
    Object.keys(this.formRegistro.controls).forEach(key => {
      const control = this.formRegistro.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Verifica si un campo tiene errores y ha sido touched
   */
  hasError(fieldName: string): boolean {
    const field = this.formRegistro.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  getErrorMessage(fieldName: string): string {
    const field = this.formRegistro.get(fieldName);

    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} es requerido`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} no puede exceder ${field.errors['maxlength'].requiredLength} caracteres`;
      }
    }

    return '';
  }

  /**
   * Obtiene el nombre de visualización del campo
   */
  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'nombre': 'El nombre',
      'descripcion': 'La descripción',
      'estado': 'El estado'
    };
    return displayNames[fieldName] || fieldName;
  }

  /**
   * Navegar a la lista de roles
   */
  volverLista(): void {
    this.router.navigate(['/lista-roles']);
  }

  /**
   * Volver a la lista de roles
   */
  volverAtras(): void {
    this.router.navigate(['/lista-roles']);
  }
}
