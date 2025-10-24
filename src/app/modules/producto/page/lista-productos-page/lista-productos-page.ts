import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProductosService } from '../../../../core/services/productos/productos-service';
import { RequestListaProductosModel } from '../../../../core/models/producto/request/listaProductos.request';
import { BehaviorSubject, catchError, map, Observable, of, timeout } from 'rxjs';
import { ResponseListaProductos } from '../../../../core/models/producto/response/listaProductos.response';
import { ProductoModel } from '../../../../core/models/producto/producto.model';


@Component({
  selector: 'app-lista-productos-page',
  imports: [CommonModule],
  templateUrl: './lista-productos-page.html',
  styleUrl: './lista-productos-page.css'
})
export class ListaProductosPage {

  private location: Location;
  private api: ProductosService;

  isLoading: boolean = false;
  private initialLoadDone: boolean = false;
  errorMessage: string | null = null;
  private productosSubject = new BehaviorSubject<ProductoModel[]>([]);
  productosData$: Observable<ProductoModel[]> = this.productosSubject.asObservable();

  constructor() {
    this.location = inject(Location);
    this.api = inject(ProductosService);
  }

  ngOnInit(): void {
    this.listarProductos()
  }

  listarProductos() {
    this.errorMessage = null;
    this.isLoading = true;

    const EstadoFiltro: RequestListaProductosModel = { estado: 2 };
    const api$ = this.api.listaProductos(EstadoFiltro).pipe(
      timeout({ each: 7000 }),
      map((response: ResponseListaProductos) => {
        return response.exito ? response.productos : [];
      }),
      catchError((err) => {
        this.errorMessage = 'No se pudo conectar al servidor. Revisa tu red o inténtalo más tarde.';
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
    console.log('--- ACCIÓN FUTURA: Navegando al formulario para crear un nuevo producto ---');
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

  // Método para el botón de Volver
  volverCatalogos(): void {
    this.location.back();
  }
}
