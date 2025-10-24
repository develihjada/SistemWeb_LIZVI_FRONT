import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SubfamiliasService } from '../../../../core/services/subfamilias/subfamilias-service';
import { BehaviorSubject, catchError, map, Observable, of, timeout } from 'rxjs';
import { SubfamiliaModel } from '../../../../core/models/subfamilia/subfamilia.model';
import { RequestListaSubfamiliasModel } from '../../../../core/models/subfamilia/request/listaSubfamilias.request';
import { ResponseListaSubfamilias } from '../../../../core/models/subfamilia/response/listaSubfamilias.response';
@Component({
  selector: 'app-listar-subfamilia-page',
  imports: [CommonModule],
  templateUrl: './listar-subfamilia-page.html',
  styleUrl: './listar-subfamilia-page.css'
})
export class ListarSubfamiliaPage implements OnInit {

  private location: Location;
  private api: SubfamiliasService;

  isLoading: boolean = false;
  private initialLoadDone: boolean = false;
  errorMessage: string | null = null;
  private subfamiliasSubject = new BehaviorSubject<SubfamiliaModel[]>([]);
  subfamiliasData$: Observable<SubfamiliaModel[]> = this.subfamiliasSubject.asObservable();

  constructor() {
    this.location = inject(Location);
    this.api = inject(SubfamiliasService);
  }

  ngOnInit(): void {
    this.listarSubfamilias();
  }

  /**
   * Lista las subfamilias desde el API
   */
  listarSubfamilias(): void {
    this.errorMessage = null;
    this.isLoading = true;

    const EstadoFiltro: RequestListaSubfamiliasModel = { estado: 2 };

    const api$ = this.api.listaSubfamilias(EstadoFiltro).pipe(
      timeout({ each: 7000 }),
      map((response: ResponseListaSubfamilias) => {
        return response.exito ? response.subfamilias : [];
      }),
      catchError((err) => {
        this.errorMessage = 'No se pudo conectar al servidor. Revisa tu red o inténtalo más tarde.';
        return of([] as SubfamiliaModel[]);
      })
    );

    const sub = api$.subscribe({
      next: (list) => {
        let toPush: SubfamiliaModel[] = [];
        if (Array.isArray(list)) {
          toPush = list;
        } else if (list && typeof list === 'object') {
          toPush = [list as SubfamiliaModel];
        } else {
          toPush = [];
        }

        this.subfamiliasSubject.next(toPush);
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

  // Método para el botón principal "Nueva Subfamilia"
  registrarSubfamilia(): void {
    // TODO: Implementar navegación al formulario de registro
  }

  // Método para la acción de Editar en la tabla
  editarSubfamilia(id: number): void {
    // TODO: Implementar navegación al formulario de edición
  }

  // Método para la acción de Eliminar en la tabla
  eliminarSubfamilia(id: number): void {
    if (confirm(`¿Estás seguro de eliminar la subfamilia con ID ${id}? Esto afectará a sus productos asociados.`)) {
      // TODO: Implementar lógica de eliminación
    }
  }

  // Método para el botón de Volver
  volverConfiguraciones(): void {
    this.location.back();
  }
}
