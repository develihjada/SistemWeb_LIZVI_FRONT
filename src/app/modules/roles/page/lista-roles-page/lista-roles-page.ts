import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RolesService } from '../../../../core/services/roles/roles.service';
import { BehaviorSubject, catchError, map, Observable, of, timeout } from 'rxjs';
import { RolModel } from '../../../../core/models/rol/rol.model';
import { RequestListaRolesModel } from '../../../../core/models/rol/request/listaRoles.request';
import { ResponseListaRoles } from '../../../../core/models/rol/response/listaRoles.response';

@Component({
  selector: 'app-lista-roles-page',
  imports: [CommonModule],
  templateUrl: './lista-roles-page.html',
  styleUrl: './lista-roles-page.css'
})
export class ListaRolesPage implements OnInit {

  private location: Location;
  private router: Router;
  private api: RolesService;

  isLoading: boolean = false;
  private initialLoadDone: boolean = false;
  errorMessage: string | null = null;
  private rolesSubject = new BehaviorSubject<RolModel[]>([]);
  rolesData$: Observable<RolModel[]> = this.rolesSubject.asObservable();

  constructor() {
    this.location = inject(Location);
    this.router = inject(Router);
    this.api = inject(RolesService);
  }

  ngOnInit(): void {
    this.listarRoles();
  }

  /**
   * Lista los roles desde el API
   */
  listarRoles(): void {
    this.errorMessage = null;
    this.isLoading = true;

    const EstadoFiltro: RequestListaRolesModel = { estado: 2 };

    const api$ = this.api.listaRoles(EstadoFiltro).pipe(
      timeout({ each: 7000 }),
      map((response: ResponseListaRoles) => {
        return response.exito ? response.roles : [];
      }),
      catchError((err) => {
        this.errorMessage = 'No se pudo conectar al servidor. Revisa tu red o inténtalo más tarde.';
        return of([] as RolModel[]);
      })
    );

    const sub = api$.subscribe({
      next: (list) => {
        let toPush: RolModel[] = [];
        if (Array.isArray(list)) {
          toPush = list;
        } else if (list && typeof list === 'object') {
          toPush = [list as RolModel];
        } else {
          toPush = [];
        }

        this.rolesSubject.next(toPush);
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
    this.location.back();
  }

  // Método para el botón principal "Nuevo Rol"
  registrarRol(): void {
    this.router.navigate(['/registro-roles']);
  }

  // Método para la acción de Editar en la tabla
  editarRol(id: number): void {
    // TODO: Implementar navegación al formulario de edición
  }

  // Método para la acción de Eliminar en la tabla
  eliminarRol(id: number): void {
    if (confirm(`¿Estás seguro de eliminar el rol con ID ${id}?`)) {
      // TODO: Implementar lógica de eliminación
    }
  }

  // Método para el botón de Volver
  volverConfiguraciones(): void {
    this.location.back();
  }

  // TrackBy function para mejorar el rendimiento
  trackByFn(index: number, item: RolModel): number {
    return item.id;
  }
}
