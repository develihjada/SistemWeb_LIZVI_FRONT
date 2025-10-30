import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../../core/services/usuarios/usuarios.service';
import { BehaviorSubject, catchError, map, Observable, of, timeout } from 'rxjs';
import { UsuarioModel } from '../../../../core/models/usuario/usuario.model';
import { RequestListaUsuariosModel } from '../../../../core/models/usuario/request/listaUsuarios.request';
import { ResponseListaUsuarios } from '../../../../core/models/usuario/response/listaUsuarios.response';

@Component({
  selector: 'app-lista-usuarios-page',
  imports: [CommonModule],
  templateUrl: './lista-usuarios-page.html',
  styleUrl: './lista-usuarios-page.css'
})
export class ListaUsuariosPage implements OnInit {

  private location: Location;
  private router: Router;
  private api: UsuariosService;

  isLoading: boolean = false;
  private initialLoadDone: boolean = false;
  errorMessage: string | null = null;
  private usuariosSubject = new BehaviorSubject<UsuarioModel[]>([]);
  usuariosData$: Observable<UsuarioModel[]> = this.usuariosSubject.asObservable();

  constructor() {
    this.location = inject(Location);
    this.router = inject(Router);
    this.api = inject(UsuariosService);
  }

  ngOnInit(): void {
    this.listarUsuarios();
  }

  /**
   * Lista los usuarios desde el API
   */
  listarUsuarios(): void {
    this.errorMessage = null;
    this.isLoading = true;

    const EstadoFiltro: RequestListaUsuariosModel = { estado: 2 };

    const api$ = this.api.listaUsuarios(EstadoFiltro).pipe(
      timeout({ each: 7000 }),
      map((response: ResponseListaUsuarios) => {
        return response.exito ? response.usuario : [];
      }),
      catchError((err) => {
        this.errorMessage = 'No se pudo conectar al servidor. Revisa tu red o inténtalo más tarde.';
        return of([] as UsuarioModel[]);
      })
    );

    const sub = api$.subscribe({
      next: (list) => {
        let toPush: UsuarioModel[] = [];
        if (Array.isArray(list)) {
          toPush = list;
        } else if (list && typeof list === 'object') {
          toPush = [list as UsuarioModel];
        } else {
          toPush = [];
        }

        this.usuariosSubject.next(toPush);
        this.initialLoadDone = true;
      },
      error: (err) => {
        this.errorMessage = this.errorMessage ?? 'No se pudo conectar al servidor.';
      },
    });

    sub.add(() => {
      this.isLoading = false;
    });
  }

  /**
   * Volver a la página anterior
   */
  volverInicio(): void {
    this.router.navigate(['/inicio']);
  }

  // Método para el botón principal "Nuevo Usuario"
  registrarUsuario(): void {
    this.router.navigate(['/usuarios/registro']);
  }

  // Método para la acción de Editar en la tabla
  editarUsuario(id: number): void {
    // TODO: Implementar navegación al formulario de edición
  }

  // Método para la acción de Eliminar en la tabla
  eliminarUsuario(id: number): void {
    if (confirm(`¿Estás seguro de eliminar el usuario con ID ${id}?`)) {
      // TODO: Implementar lógica de eliminación
    }
  }

  // Método para el botón de Volver
  volverConfiguraciones(): void {
    this.router.navigate(['/configuraciones']);
  }

  // TrackBy function para mejorar el rendimiento
  trackByFn(index: number, item: UsuarioModel): number {
    return item.id;
  }
}
