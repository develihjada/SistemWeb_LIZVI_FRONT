import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SubfamiliasService } from '../../../../core/services/subfamilias/subfamilias-service';
import { FamiliasService } from '../../../../core/services/familias/familias-service';
import { BehaviorSubject, catchError, map, Observable, of, timeout } from 'rxjs';
import { SubfamiliaModel } from '../../../../core/models/subfamilia/subfamilia.model';
import { FamiliaModel } from '../../../../core/models/familia/familia.model';
import { RequestListaSubfamiliasModel } from '../../../../core/models/subfamilia/request/listaSubfamilias.request';
import { ResponseListaSubfamilias } from '../../../../core/models/subfamilia/response/listaSubfamilias.response';
import { RequestListaFamiliasModel } from '../../../../core/models/familia/request/listaFamilias.request';
import { ResponseListaFamilias } from '../../../../core/models/familia/response/listaFamilias.response';
@Component({
  selector: 'app-listar-subfamilia-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './listar-subfamilia-page.html',
  styleUrl: './listar-subfamilia-page.css'
})
export class ListarSubfamiliaPage implements OnInit {

  private location: Location;
  private router: Router;
  private api: SubfamiliasService;
  private familiasApi: FamiliasService;

  isLoading: boolean = false;
  private initialLoadDone: boolean = false;
  errorMessage: string | null = null;
  private subfamiliasSubject = new BehaviorSubject<SubfamiliaModel[]>([]);
  subfamiliasData$: Observable<SubfamiliaModel[]> = this.subfamiliasSubject.asObservable();

  // Datos para filtros
  familias: FamiliaModel[] = [];

  // Filtros seleccionados
  filtroFamilia: number = 0;
  filtroEstado: number = 2;

  constructor() {
    this.location = inject(Location);
    this.router = inject(Router);
    this.api = inject(SubfamiliasService);
    this.familiasApi = inject(FamiliasService);
  }

  ngOnInit(): void {
    this.listarFamilias();
    this.listarSubfamilias();
  }

  /**
   * Lista las subfamilias desde el API
   */
  listarSubfamilias(): void {
    this.errorMessage = null;
    this.isLoading = true;

    const EstadoFiltro: RequestListaSubfamiliasModel = {
      estado: this.filtroEstado,
      idfamilia: this.filtroFamilia
    };

    const api$ = this.api.listaSubfamilias(EstadoFiltro).pipe(
      timeout({ each: 7000 }),
      map((response: ResponseListaSubfamilias) => {
        return response.exito ? response.subFamilia : [];
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
    this.router.navigate(['/inicio']);
  }

  // Método para el botón principal "Nueva Subfamilia"
  registrarSubfamilia(): void {
    this.router.navigate(['/registro-subfamilia']);
  }

  // Método para la acción de Editar en la tabla
  editarSubfamilia(id: number): void {
    this.router.navigate(['/editar-subfamilia', id]);
  }

  // Método para la acción de Eliminar en la tabla
  eliminarSubfamilia(id: number): void {
    if (confirm(`¿Estás seguro de eliminar la subfamilia con ID ${id}? Esto afectará a sus productos asociados.`)) {
      // TODO: Implementar lógica de eliminación
    }
  }

  // Métodos para filtros
  listarFamilias(): void {
    const request = { estado: 2 };
    this.familiasApi.listaFamilias(request).subscribe({
      next: (response) => {
        this.familias = response.exito ? response.familia : [];
      },
      error: () => {
        this.familias = [];
      }
    });
  }

  onFamiliaChange(): void {
    this.aplicarFiltros();
  }

  onEstadoChange(): void {
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.listarSubfamilias();
  }

  limpiarFiltros(): void {
    this.filtroFamilia = 0;
    this.filtroEstado = 2;
    this.listarSubfamilias();
  }

  // Método para el botón de Volver
  volverConfiguraciones(): void {
    this.router.navigate(['/configuraciones']);
  }
}
