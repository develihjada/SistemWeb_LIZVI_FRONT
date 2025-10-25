import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../../../core/services/productos/productos-service';
import { FamiliasService } from '../../../../core/services/familias/familias-service';
import { SubfamiliasService } from '../../../../core/services/subfamilias/subfamilias-service';
import { RequestListaProductosModel } from '../../../../core/models/producto/request/listaProductos.request';
import { RequestListaFamiliasModel } from '../../../../core/models/familia/request/listaFamilias.request';
import { RequestListaSubfamiliasModel } from '../../../../core/models/subfamilia/request/listaSubfamilias.request';
import { BehaviorSubject, catchError, map, Observable, of, timeout } from 'rxjs';
import { ResponseListaProductos } from '../../../../core/models/producto/response/listaProductos.response';
import { ProductoModel } from '../../../../core/models/producto/producto.model';
import { FamiliaModel } from '../../../../core/models/familia/familia.model';
import { SubfamiliaModel } from '../../../../core/models/subfamilia/subfamilia.model';


@Component({
  selector: 'app-lista-productos-page',
  imports: [CommonModule, FormsModule],
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
  private productosSubject = new BehaviorSubject<ProductoModel[]>([]);
  productosData$: Observable<ProductoModel[]> = this.productosSubject.asObservable();

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
        return of([] as ProductoModel[]);
      })
    );

    const sub = api$.subscribe({
      next: (list) => {
        let toPush: ProductoModel[] = [];
        if (Array.isArray(list)) {
          toPush = list;
        } else if (list && typeof list === 'object') {

          toPush = [list as ProductoModel];
        } else {
          toPush = [];
        }

        // Siempre empujamos el resultado (incluso vacío) para que la UI refleje la búsqueda
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

  // Método para el botón principal "Registrar Producto"
  registrarProducto(): void {
    this.router.navigate(['/registrar-productos']);
  }

  // Método para la acción de Editar en la tabla
  editarProducto(id: number): void {
    console.log(`--- ACCIÓN FUTURA: Editando el producto con ID: ${id} ---`);
  }

  // Método para la acción de Eliminar en la tabla
  eliminarProducto(id: number): void {
    if (confirm(`¿Estás seguro de eliminar el producto con ID ${id}?`)) {
      console.log(`Producto ${id} marcado para eliminación.`);
    }
  }

  // Método para manejar errores de carga de imágenes
  onImageError(producto: ProductoModel): void {
    producto.imagenError = true;
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
        console.log('Subfamilias filtradas por familia:', response);
        this.subfamilias = response.exito ? response.subFamilia : [];
      },
      error: () => {
        this.subfamilias = [];
      }
    });
  }

  onFamiliaChange(): void {
    // Convertir a número para evitar problemas de tipo
    this.filtroFamilia = Number(this.filtroFamilia) || 0;
    this.filtroSubfamilia = 0;

    // Cargar subfamilias filtradas por familia desde el backend
    this.cargarSubfamiliasPorFamilia();
    this.aplicarFiltros();
  }  onSubfamiliaChange(): void {
    // Convertir a número para evitar problemas de tipo
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

  // Método para el botón de Volver
  volverCatalogos(): void {
    this.location.back();
  }
}
