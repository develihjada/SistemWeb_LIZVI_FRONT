import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '@core/services/productos/productos-service';
import { FamiliasService } from '@core/services/familias/familias-service';
import { SubfamiliasService } from '@core/services/subfamilias/subfamilias-service';
import { RequestListaProductosModel } from '@core/models/producto/request/listaProductos.request';
import { BehaviorSubject, catchError, map, Observable, of, timeout } from 'rxjs';
import { MapingListaProductos, ResponseListaProductos } from '@core/models/producto/response/listaProductos.response';
import { ProductoModel } from '@core/models/producto/producto.model';
import { FamiliaModel } from '@core/models/familia/familia.model';
import { SubfamiliaModel } from '@core/models/subfamilia/subfamilia.model';
import { RequestActualizarEstadoProducto } from '@core/models/producto/request/actualizarEstadoProducto.request';
import { AlertaExitoComponent } from '../../components/alerta-exito/alerta-exito.component';
import { LoadingDatos } from '@shared/components/loading-datos/loading-datos';
import { ErrorConexionApi } from '@shared/components/error-conexion-api/error-conexion-api';


@Component({
  selector: 'app-lista-productos-page',
  imports: [CommonModule, FormsModule, AlertaExitoComponent, LoadingDatos, ErrorConexionApi],
  templateUrl: './lista-productos-page.html',
  styleUrl: './lista-productos-page.css'
})
export class ListaProductosPage {

  private location: Location;
  private api: ProductosService;
  private familiasApi: FamiliasService;
  private subfamiliasApi: SubfamiliasService;
  private router: Router;

  isLoading: boolean = false;
  private initialLoadDone: boolean = false;
  errorMessage: string | null = null;
  private productosSubject = new BehaviorSubject<MapingListaProductos[]>([]);
  productosData$: Observable<MapingListaProductos[]> = this.productosSubject.asObservable();

  // Propiedades para alerta de éxito
  showSuccessAlert: boolean = false;
  alertMessage: string = '';

  // Datos para filtros
  familias: FamiliaModel[] = [];
  todasLasSubfamilias: SubfamiliaModel[] = [];
  subfamilias: SubfamiliaModel[] = [];

  // Filtros seleccionados
  filtroFamilia: number = 0;
  filtroSubfamilia: number = 0;

  constructor() {
    this.location = inject(Location);
    this.api = inject(ProductosService);
    this.familiasApi = inject(FamiliasService);
    this.subfamiliasApi = inject(SubfamiliasService);
    this.router = inject(Router);
  }

  ngOnInit(): void {
    this.listarFamilias();
    this.listarSubfamilias();
    this.listarProductos();
  }

  listarProductos() {
    this.errorMessage = null;
    this.isLoading = true;

    const EstadoFiltro: RequestListaProductosModel = {
      estado: 2,
      idfamilia: Number(this.filtroFamilia) || 0,
      idsubfamilia: Number(this.filtroSubfamilia) || 0
    };
    console.log('Request enviado al backend:', EstadoFiltro);

    const api$ = this.api.listaProductos(EstadoFiltro).pipe(
      timeout({ each: 7000 }),
      map((response: ResponseListaProductos) => {
        console.log('Response del backend:', response);
        return response.exito ? response.productos : [];
      }),
      catchError((err) => {
        console.error('Error en la petición:', err);
        this.errorMessage = 'Error del servidor: ' + (err.error?.mensaje || err.message || 'No se pudo conectar al servidor');
        return of([] as MapingListaProductos[]);
      })
    );

    const sub = api$.subscribe({
      next: (list) => {
        let toPush: MapingListaProductos[] = [];
        if (Array.isArray(list)) {
          toPush = list;
        } else if (list && typeof list === 'object') {

          toPush = [list as MapingListaProductos];
        } else {
          toPush = [];
        }

        this.productosSubject.next(toPush);
        console.log('productosSubject after search:', this.productosSubject.getValue());
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

  registrarProducto(): void {
    this.router.navigate(['/registrar-productos']);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/detalle-productos', id]);
  }

  editarProducto(id: number): void {
    this.router.navigate(['/editar-productos', id]);
  }

  cambiarEstadoProducto(producto: MapingListaProductos): void {
    const nuevoEstado = producto.estado === 1 ? 0 : 1;
    const request = new RequestActualizarEstadoProducto();
    request.id = producto.id;
    request.estado = nuevoEstado;

    this.api.actualizarEstadoProducto(request).subscribe({
      next: (response) => {
        if (response.exito) {
          // Actualizar el estado en el array local
          producto.estado = nuevoEstado;
          this.productosSubject.next(this.productosSubject.value);

          // Mostrar alerta de éxito
          const estadoTexto = nuevoEstado === 1 ? 'activado' : 'desactivado';
          this.mostrarAlertaExito(`Producto ${estadoTexto} correctamente`);
        }
      },
      error: (error) => {
        console.error('Error al actualizar estado:', error);
        this.mostrarAlertaExito('Error al actualizar el estado del producto');
      }
    });
  }

  mostrarAlertaExito(mensaje: string): void {
    this.alertMessage = mensaje;
    this.showSuccessAlert = true;

    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 3000);
  }

  cerrarAlerta(): void {
    this.showSuccessAlert = false;
  }

  cerrarError(): void {
    this.errorMessage = '';
  }

  onImageError(producto: ProductoModel): void {
    producto.imagenError = true;
  }

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

  listarSubfamilias(): void {
    const request = { estado: 2, idfamilia: 0 };
    this.subfamiliasApi.listaSubfamilias(request).subscribe({
      next: (response) => {
        this.todasLasSubfamilias = response.exito ? response.subFamilia : [];
        this.subfamilias = [...this.todasLasSubfamilias];
      },
      error: () => {
        this.todasLasSubfamilias = [];
        this.subfamilias = [];
      }
    });
  }

  cargarSubfamiliasPorFamilia(): void {
    const request = { estado: 2, idfamilia: this.filtroFamilia };
    this.subfamiliasApi.listaSubfamilias(request).subscribe({
      next: (response) => {
        this.subfamilias = response.exito ? response.subFamilia : [];
      },
      error: () => {
        this.subfamilias = [];
      }
    });
  }

  onFamiliaChange(): void {
    this.filtroFamilia = Number(this.filtroFamilia) || 0;
    this.filtroSubfamilia = 0;
    this.cargarSubfamiliasPorFamilia();
    this.aplicarFiltros();
  }

  onSubfamiliaChange(): void {
    this.filtroSubfamilia = Number(this.filtroSubfamilia) || 0;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.listarProductos();
  }

  limpiarFiltros(): void {
    this.filtroFamilia = 0;
    this.filtroSubfamilia = 0;
    this.subfamilias = [...this.todasLasSubfamilias];
    this.listarProductos();
  }

  volverCatalogos(): void {
    this.router.navigate(['/configuraciones']);
  }
}
