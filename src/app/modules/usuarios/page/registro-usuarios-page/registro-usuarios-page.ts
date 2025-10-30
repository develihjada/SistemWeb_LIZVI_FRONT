import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../../core/services/usuarios/usuarios.service';
import { RolesService } from '../../../../core/services/roles/roles.service';
import { RequestRegistroUsuarioModel } from '../../../../core/models/usuario/request/registroUsuario.request';
import { RequestListaRolesModel } from '../../../../core/models/rol/request/listaRoles.request';
import { ResponseGeneral } from '../../../../shared/model/general.response';
import { RolModel } from '../../../../core/models/rol/rol.model';
import { ResponseListaRoles } from '../../../../core/models/rol/response/listaRoles.response';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-registro-usuarios-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-usuarios-page.html',
  styleUrl: './registro-usuarios-page.css'
})
export class RegistroUsuariosPage implements OnInit {

  private fb: FormBuilder;
  private location: Location;
  private router: Router;
  private api: UsuariosService;
  private rolesApi: RolesService;

  formRegistro: FormGroup;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  rolesDisponibles: RolModel[] = [];
  loadingRoles: boolean = false;

  constructor() {
    this.fb = inject(FormBuilder);
    this.location = inject(Location);
    this.router = inject(Router);
    this.api = inject(UsuariosService);
    this.rolesApi = inject(RolesService);

    this.formRegistro = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      rolId: [0, [Validators.required, Validators.min(1)]],
      estado: [1, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarRoles();
  }

  /**
   * Carga la lista de roles disponibles
   */
  cargarRoles(): void {
    this.loadingRoles = true;
    const request: RequestListaRolesModel = { estado: 1 }; // Solo roles activos

    const api$ = this.rolesApi.listaRoles(request).pipe(
      catchError((error) => {
        return of({ exito: false, mensaje: 'Error al cargar roles', roles: [] } as ResponseListaRoles);
      })
    );

    const sub = api$.subscribe({
      next: (response: ResponseListaRoles) => {
        if (response.exito && Array.isArray(response.roles)) {
          this.rolesDisponibles = response.roles;
        } else {
          this.rolesDisponibles = [];
        }
      },
      error: (err) => {
        this.rolesDisponibles = [];
      }
    });

    sub.add(() => {
      this.loadingRoles = false;
    });
  }

  /**
   * Registra un nuevo usuario
   */
  registrarUsuario(): void {
    if (this.formRegistro.valid) {
      this.errorMessage = null;
      this.successMessage = null;
      this.isLoading = true;

      const requestData: RequestRegistroUsuarioModel = {
        nombre: this.formRegistro.value.nombre.trim(),
        email: this.formRegistro.value.email.trim(),
        rolId: parseInt(this.formRegistro.value.rolId),
        estado: this.formRegistro.value.estado
      };

      const api$ = this.api.registroUsuario(requestData).pipe(
        catchError((error) => {
          this.errorMessage = 'No se pudo conectar al servidor. Revisa tu red o inténtalo más tarde.';
          return of({ exito: false, mensaje: 'Error de conexión' } as ResponseGeneral);
        })
      );

      const sub = api$.subscribe({
        next: (response: ResponseGeneral) => {
          if (response.exito) {
            this.successMessage = 'Usuario registrado exitosamente';
            this.formRegistro.reset();
            this.formRegistro.patchValue({ estado: 1, rolId: 0 });

            // Opcional: Redirigir después de un tiempo
            setTimeout(() => {
              this.volverLista();
            }, 2000);
          } else {
            this.errorMessage = response.mensaje || 'No se pudo registrar el usuario';
          }
        },
        error: (err) => {
          this.errorMessage = this.errorMessage ?? 'No se pudo registrar el usuario.';
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
      if (field.errors['email']) {
        return 'Ingresa un email válido';
      }
      if (field.errors['min']) {
        return 'Selecciona un rol válido';
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
      'email': 'El email',
      'rolId': 'El rol',
      'estado': 'El estado'
    };
    return displayNames[fieldName] || fieldName;
  }

  /**
   * Navegar a la lista de usuarios
   */
  volverLista(): void {
    this.router.navigate(['/usuarios/lista']);
  }

  /**
   * Volver a la lista de usuarios
   */
  volverAtras(): void {
    this.router.navigate(['/usuarios/lista']);
  }
}
