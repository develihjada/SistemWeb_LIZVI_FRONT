import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UnidadesMedidaService } from '../../../../core/services/unidadesMedida/unidades-medida-service';
import { BehaviorSubject, catchError, map, Observable, of, timeout } from 'rxjs';
import { UnidadMedidaModel } from '../../../../core/models/unidadMedida/unidadmedida.model';
import { RequestListaUnidadesMedidaModel } from '../../../../core/models/unidadMedida/request/listaUnidadesMedida.request';
import { ResponseListaUnidadesMedida } from '../../../../core/models/unidadMedida/response/listaUnidadesMedida.response';

@Component({
  selector: 'app-lista-unidades-medida-page',
  imports: [CommonModule],
  templateUrl: './lista-unidades-medida-page.html',
  styleUrl: './lista-unidades-medida-page.css'
})
export class ListaUnidadesMedidaPage implements OnInit {

  private location: Location;
  private router: Router;
  private api: UnidadesMedidaService;

  isLoading: boolean = false;
  private initialLoadDone: boolean = false;
  errorMessage: string | null = null;
  private unidadesMedidaSubject = new BehaviorSubject<UnidadMedidaModel[]>([]);
  unidadesMedidaData$: Observable<UnidadMedidaModel[]> = this.unidadesMedidaSubject.asObservable();

  constructor() {
    this.location = inject(Location);
    this.router = inject(Router);
    this.api = inject(UnidadesMedidaService);
  }

  ngOnInit(): void {
    this.listarUnidadesMedida();
  }

  /**
   * Lista las unidades de medida desde el API
   */
  listarUnidadesMedida(): void {
    this.errorMessage = null;
    this.isLoading = true;

    const EstadoFiltro: RequestListaUnidadesMedidaModel = { estado: 2 };

    const api$ = this.api.listaUnidadesMedida(EstadoFiltro).pipe(
      timeout({ each: 7000 }),
      map((response: ResponseListaUnidadesMedida) => {
        return response.exito ? response.unidadmedida : [];
      }),
      catchError((err) => {
        this.errorMessage = 'No se pudo conectar al servidor. Revisa tu red o inténtalo más tarde.';
        return of([] as UnidadMedidaModel[]);
      })
    );

    const sub = api$.subscribe({
      next: (list) => {
        let toPush: UnidadMedidaModel[] = [];
        if (Array.isArray(list)) {
          toPush = list;
        } else if (list && typeof list === 'object') {
          toPush = [list as UnidadMedidaModel];
        } else {
          toPush = [];
        }

        this.unidadesMedidaSubject.next(toPush);
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

  // Método para el botón principal "Nueva Unidad de Medida"
  registrarUnidadMedida(): void {
    this.router.navigate(['/registro-unidad-medida']);
  }

  // Método para la acción de Editar en la tabla
  editarUnidadMedida(id: number): void {
    // TODO: Implementar navegación al formulario de edición
  }

  // Método para la acción de Eliminar en la tabla
  eliminarUnidadMedida(id: number): void {
    if (confirm(`¿Estás seguro de eliminar la unidad de medida con ID ${id}?`)) {
      // TODO: Implementar lógica de eliminación
    }
  }

  // Método para el botón de Volver
  volverConfiguraciones(): void {
    this.router.navigate(['/configuraciones']);
  }
}
