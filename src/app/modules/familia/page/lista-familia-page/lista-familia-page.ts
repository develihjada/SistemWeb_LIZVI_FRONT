import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FamiliasService } from '../../../../core/services/familias/familias-service';
import { BehaviorSubject, catchError, map, Observable, of, timeout } from 'rxjs';
import { FamiliaModel } from '../../../../core/models/familia/familia.model';
import { RequestListaFamiliasModel } from '../../../../core/models/familia/request/listaFamilias.request';
import { ResponseListaFamilias } from '../../../../core/models/familia/response/listaFamilias.response';

@Component({
  selector: 'app-lista-familia-page',
  imports: [CommonModule],
  templateUrl: './lista-familia-page.html',
  styleUrl: './lista-familia-page.css'
})
export class ListaFamiliaPage implements OnInit {

  private location: Location;
  private router: Router;
  private api: FamiliasService;

  isLoading: boolean = false;
  private initialLoadDone: boolean = false;
  errorMessage: string | null = null;
  private familiasSubject = new BehaviorSubject<FamiliaModel[]>([]);
  familiasData$: Observable<FamiliaModel[]> = this.familiasSubject.asObservable();

  constructor() {
    this.location = inject(Location);
    this.router = inject(Router);
    this.api = inject(FamiliasService);
  }

  ngOnInit(): void {
    this.listarFamilias();
  }

  /**
   * Lista las familias desde el API
   */
  listarFamilias(): void {
    this.errorMessage = null;
    this.isLoading = true;

    const EstadoFiltro: RequestListaFamiliasModel = { estado: 2 };

    const api$ = this.api.listaFamilias(EstadoFiltro).pipe(
      timeout({ each: 7000 }),
      map((response: ResponseListaFamilias) => {
        return response.exito ? response.familia : [];
      }),
      catchError((err) => {
        this.errorMessage = 'No se pudo conectar al servidor. Revisa tu red o inténtalo más tarde.';
        return of([] as FamiliaModel[]);
      })
    );

    const sub = api$.subscribe({
      next: (list) => {
        let toPush: FamiliaModel[] = [];
        if (Array.isArray(list)) {
          toPush = list;
        } else if (list && typeof list === 'object') {
          toPush = [list as FamiliaModel];
        } else {
          toPush = [];
        }
        this.familiasSubject.next(toPush);
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

  // Método para el botón principal "Nueva Familia"
  registrarFamilia(): void {
    this.router.navigate(['/registro-familia']);
  }

  // Método para la acción de Editar en la tabla
  editarFamilia(id: number): void {
    this.router.navigate(['/editar-familia', id]);
  }

  // Método para la acción de Eliminar en la tabla
  eliminarFamilia(id: number): void {
    if (confirm(`¿Estás seguro de eliminar la familia con ID ${id}? Esto afectará a sus productos asociados.`)) {
      // TODO: Implementar lógica de eliminación
    }
  }

  // Método para el botón de Volver
  volverConfiguraciones(): void {
    this.location.back();
  }
}
