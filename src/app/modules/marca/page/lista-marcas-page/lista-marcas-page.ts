import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MarcasService } from '../../../../core/services/marcas/marcas-service';
import { BehaviorSubject, catchError, map, Observable, of, timeout } from 'rxjs';
import { MarcaModel } from '../../../../core/models/marca/marca.model';
import { RequestListaMarcasModel } from '../../../../core/models/marca/request/listaMarcas.request';
import { ResponseListaMarcas } from '../../../../core/models/marca/response/listaMarcas.response';

@Component({
  selector: 'app-lista-marcas-page',
  imports: [CommonModule],
  templateUrl: './lista-marcas-page.html',
  styleUrl: './lista-marcas-page.css'
})
export class ListaMarcasPage implements OnInit {

  private location: Location;
  private api: MarcasService;

  isLoading: boolean = false;
  private initialLoadDone: boolean = false;
  errorMessage: string | null = null;
  private marcasSubject = new BehaviorSubject<MarcaModel[]>([]);
  marcasData$: Observable<MarcaModel[]> = this.marcasSubject.asObservable();

  constructor() {
    this.location = inject(Location);
    this.api = inject(MarcasService);
  }

  ngOnInit(): void {
    this.listarMarcas();
  }

  /**
   * Lista las marcas desde el API
   */
  listarMarcas(): void {
    this.errorMessage = null;
    this.isLoading = true;

    const EstadoFiltro: RequestListaMarcasModel = { estado: 2 };

    const api$ = this.api.listaMarcas(EstadoFiltro).pipe(
      timeout({ each: 7000 }),
      map((response: ResponseListaMarcas) => {
        return response.exito ? response.marca : [];
      }),
      catchError((err) => {
        this.errorMessage = 'No se pudo conectar al servidor. Revisa tu red o inténtalo más tarde.';
        return of([] as MarcaModel[]);
      })
    );

    const sub = api$.subscribe({
      next: (list) => {
        let toPush: MarcaModel[] = [];
        if (Array.isArray(list)) {
          toPush = list;
        } else if (list && typeof list === 'object') {
          toPush = [list as MarcaModel];
        } else {
          toPush = [];
        }

        this.marcasSubject.next(toPush);
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

  // Método para el botón principal "Nueva Marca"
  registrarMarca(): void {
    // TODO: Implementar navegación al formulario de registro
  }

  // Método para la acción de Editar en la tabla
  editarMarca(id: number): void {
    // TODO: Implementar navegación al formulario de edición
  }

  // Método para la acción de Eliminar en la tabla
  eliminarMarca(id: number): void {
    if (confirm(`¿Estás seguro de eliminar la marca con ID ${id}? Esto afectará a sus productos asociados.`)) {
      // TODO: Implementar lógica de eliminación
    }
  }

  // Método para el botón de Volver
  volverConfiguraciones(): void {
    this.location.back();
  }
}