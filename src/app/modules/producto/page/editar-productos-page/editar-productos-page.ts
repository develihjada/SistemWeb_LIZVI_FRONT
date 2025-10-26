import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { ProductosService } from '../../../../core/services/productos/productos-service';
import { SubfamiliasService } from '../../../../core/services/subfamilias/subfamilias-service';
import { FamiliasService } from '../../../../core/services/familias/familias-service';
import { MarcasService } from '../../../../core/services/marcas/marcas-service';
import { UnidadesMedidaService } from '../../../../core/services/unidadesMedida/unidades-medida-service';
import { RequestActualizarProducto } from '../../../../core/models/producto/request/actualizarProducto.request';
import { RequestDetalleProducto } from '../../../../core/models/producto/request/detalleProducto.request';
import { SubfamiliaModel } from '../../../../core/models/subfamilia/subfamilia.model';
import { FamiliaModel } from '../../../../core/models/familia/familia.model';
import { MarcaModel } from '../../../../core/models/marca/marca.model';
import { UnidadMedidaModel } from '../../../../core/models/unidadMedida/unidadmedida.model';
import { RequestListaSubfamiliasModel } from '../../../../core/models/subfamilia/request/listaSubfamilias.request';
import { RequestListaFamiliasModel } from '../../../../core/models/familia/request/listaFamilias.request';
import { RequestListaMarcasModel } from '../../../../core/models/marca/request/listaMarcas.request';
import { RequestListaUnidadesMedidaModel } from '../../../../core/models/unidadMedida/request/listaUnidadesMedida.request';
import { MapingDetalleProductos } from '../../../../core/models/producto/response/detalleProducto.response';
import { ModalExitoActualizacionComponent } from '../../components/modal-exito-actualizacion/modal-exito-actualizacion.component';

@Component({
  selector: 'app-editar-productos-page',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, ModalExitoActualizacionComponent],
  templateUrl: './editar-productos-page.html',
  styleUrl: './editar-productos-page.css'
})
export class EditarProductosPage implements OnInit {
  private location: Location;
  private productosService: ProductosService;
  private subfamiliasService: SubfamiliasService;
  private familiasService: FamiliasService;
  private marcasService: MarcasService;
  private unidadesMedidaService: UnidadesMedidaService;
  private router: Router;
  private route: ActivatedRoute;

  // Propiedades del producto
  productoId: number = 0;
  producto: RequestActualizarProducto = new RequestActualizarProducto();

  // Para manejar la familia seleccionada
  familiaSeleccionada: number = 0;

  // Estados de la UI
  isLoading: boolean = false;
  isLoadingData: boolean = true;
  errorMessage: string = '';
  showSuccessModal: boolean = false;
  modalMessage: string = '';

  // Estados de validación de imagen
  imagenError: boolean = false;
  imagenValida: boolean = false;
  imagenCargando: boolean = false;
  imagenErrorMessage: string = '';

  // Datos para selects
  familias: FamiliaModel[] = [];
  todasLasSubfamilias: SubfamiliaModel[] = [];
  subfamilias: SubfamiliaModel[] = [];
  marcas: MarcaModel[] = [];
  unidadesMedida: UnidadMedidaModel[] = [];

  constructor() {
    this.location = inject(Location);
    this.productosService = inject(ProductosService);
    this.subfamiliasService = inject(SubfamiliasService);
    this.familiasService = inject(FamiliasService);
    this.marcasService = inject(MarcasService);
    this.unidadesMedidaService = inject(UnidadesMedidaService);
    this.router = inject(Router);
    this.route = inject(ActivatedRoute);
  }

  ngOnInit(): void {
    // Obtener el ID del producto desde la ruta
    this.route.params.subscribe(params => {
      this.productoId = +params['id'];
      if (this.productoId) {
        this.cargarDatosIniciales();
      }
    });
  }

  cargarDatosIniciales(): void {
    this.isLoadingData = true;

    // Primero cargar los catálogos básicos
    Promise.all([
      this.cargarFamilias(),
      this.cargarTodasLasSubfamilias(),
      this.cargarMarcas(),
      this.cargarUnidadesMedida()
    ]).then(() => {
      // Después cargar el producto y configurar las selecciones
      return this.cargarProducto();
    }).then(() => {
      this.isLoadingData = false;
    }).catch(() => {
      this.isLoadingData = false;
      this.errorMessage = 'Error al cargar los datos necesarios';
    });
  }

  cargarProducto(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = { id: this.productoId };

      this.productosService.detalleProducto(request).subscribe({
        next: (response) => {
          if (response.exito) {
            const detalle = response.producto;

            // Mapear los datos del detalle al modelo de actualización
            this.producto.id = detalle.id;
            this.producto.producto = detalle.producto;
            this.producto.descripcion = detalle.descripcion;
            this.producto.precio = detalle.precio;
            this.producto.stock = detalle.stock;
            this.producto.estado = detalle.estado;
            this.producto.idsubfamilia = detalle.idsubfamilia;
            this.producto.idunidadmedida = detalle.idunidadmedida;
            this.producto.idmarca = detalle.idmarca;
            this.producto.imagen = detalle.imagen || '';

            // Configurar la familia seleccionada y configurar subfamilias
            this.familiaSeleccionada = detalle.idfamilia;
            this.configurarSubfamilias();

            // Verificar que la subfamilia del producto esté en la lista filtrada
            console.log('Producto idsubfamilia:', this.producto.idsubfamilia);
            console.log('Familia seleccionada:', this.familiaSeleccionada);
            console.log('Subfamilias filtradas:', this.subfamilias);
            console.log('¿Subfamilia encontrada?', this.subfamilias.find(s => s.id === this.producto.idsubfamilia));

            // Asegurar que la subfamilia esté seleccionada correctamente
            this.establecerSubfamiliaSeleccionada();

            resolve();
          } else {
            this.errorMessage = response.mensaje || 'Error al cargar el producto';
            reject();
          }
        },
        error: (error) => {
          console.error('Error al cargar producto:', error);
          this.errorMessage = 'Error de conexión al cargar el producto';
          reject();
        }
      });
    });
  }

  cargarFamilias(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request: RequestListaFamiliasModel = { estado: 1 };

      this.familiasService.listaFamilias(request).subscribe({
        next: (response) => {
          if (response.exito) {
            this.familias = response.familia || [];
            resolve();
          } else {
            reject();
          }
        },
        error: () => reject()
      });
    });
  }

  cargarTodasLasSubfamilias(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request: RequestListaSubfamiliasModel = {
        estado: 1,
        idfamilia: 0 // 0 para traer todas las subfamilias
      };

      this.subfamiliasService.listaSubfamilias(request).subscribe({
        next: (response) => {
          if (response.exito) {
            this.todasLasSubfamilias = response.subFamilia || [];
            resolve();
          } else {
            reject();
          }
        },
        error: () => reject()
      });
    });
  }

  cargarMarcas(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request: RequestListaMarcasModel = { estado: 1 };

      this.marcasService.listaMarcas(request).subscribe({
        next: (response) => {
          if (response.exito) {
            this.marcas = response.marca || [];
            resolve();
          } else {
            reject();
          }
        },
        error: () => reject()
      });
    });
  }

  cargarUnidadesMedida(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request: RequestListaUnidadesMedidaModel = { estado: 1 };

      this.unidadesMedidaService.listaUnidadesMedida(request).subscribe({
        next: (response) => {
          if (response.exito) {
            this.unidadesMedida = response.unidadmedida || [];
            resolve();
          } else {
            reject();
          }
        },
        error: () => reject()
      });
    });
  }

  // Método para configurar las subfamilias (mostrar todas para edición)
  configurarSubfamilias(): void {
    // En edición, mostrar todas las subfamilias disponibles
    this.subfamilias = this.todasLasSubfamilias;

    // Verificar que la subfamilia del producto esté disponible
    if (this.producto.idsubfamilia > 0) {
      const subfamiliaEncontrada = this.subfamilias.find(sub => sub.id === this.producto.idsubfamilia);
      if (!subfamiliaEncontrada) {
        console.error('Subfamilia no encontrada. ID:', this.producto.idsubfamilia);
      } else {
        console.log('✅ Subfamilia encontrada y disponible:', subfamiliaEncontrada);
      }
    }

    console.log('Total de subfamilias disponibles:', this.subfamilias.length);
    console.log('Subfamilia del producto (ID):', this.producto.idsubfamilia);
  }

  // Método para filtrar subfamilias por familia (opcional, para cuando cambie la familia)
  filtrarSubfamiliasPorFamiliaSeleccionada(): void {
    if (this.familiaSeleccionada && this.familiaSeleccionada > 0) {
      this.subfamilias = this.todasLasSubfamilias.filter(sub => sub.idFamilia === this.familiaSeleccionada);
    } else {
      this.subfamilias = this.todasLasSubfamilias;
    }
  }  // Método para establecer la subfamilia seleccionada después de cargar los datos
  establecerSubfamiliaSeleccionada(): void {
    // Verificar que el producto tenga una subfamilia asignada y que esté en la lista
    if (this.producto.idsubfamilia > 0) {
      const subfamiliaEncontrada = this.subfamilias.find(sub => sub.id === this.producto.idsubfamilia);
      if (subfamiliaEncontrada) {
        console.log('✅ Subfamilia del producto encontrada:', subfamiliaEncontrada.descripcion);
        // Forzar la actualización del ngModel
        setTimeout(() => {
          console.log('Valor final de producto.idsubfamilia:', this.producto.idsubfamilia);
        }, 200);
      } else {
        console.warn('⚠️ Subfamilia del producto no encontrada en la lista disponible');
        console.log('ID buscado:', this.producto.idsubfamilia);
        console.log('IDs disponibles:', this.subfamilias.map(s => s.id));
      }
    }
  }

  // Método que se ejecuta cuando cambia la familia seleccionada
  onFamiliaChange(): void {
    // Filtrar subfamilias por la nueva familia seleccionada
    this.filtrarSubfamiliasPorFamiliaSeleccionada();

    // Limpiar la subfamilia seleccionada si no pertenece a la nueva familia
    if (this.producto.idsubfamilia > 0) {
      const subfamiliaValida = this.subfamilias.find(sub => sub.id === this.producto.idsubfamilia);
      if (!subfamiliaValida) {
        this.producto.idsubfamilia = 0;
      }
    }
  }

  actualizarProducto(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.productosService.actualizarProducto(this.producto).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.exito) {
          this.mostrarModalExito('Producto actualizado correctamente');
        } else {
          this.errorMessage = response.mensaje || 'Error al actualizar el producto';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al actualizar producto:', error);
        this.errorMessage = 'Error de conexión. No se pudo actualizar el producto.';
      }
    });
  }

  validarFormulario(): boolean {
    if (!this.producto.producto.trim()) {
      this.errorMessage = 'El nombre del producto es obligatorio';
      return false;
    }
    if (!this.producto.descripcion.trim()) {
      this.errorMessage = 'La descripción es obligatoria';
      return false;
    }
    if (this.producto.precio <= 0) {
      this.errorMessage = 'El precio debe ser mayor a 0';
      return false;
    }
    if (this.producto.stock < 0) {
      this.errorMessage = 'El stock no puede ser negativo';
      return false;
    }
    if (this.familiaSeleccionada <= 0) {
      this.errorMessage = 'Debe seleccionar una familia';
      return false;
    }
    if (this.producto.idsubfamilia <= 0) {
      this.errorMessage = 'Debe seleccionar una subfamilia';
      return false;
    }
    if (this.producto.idunidadmedida <= 0) {
      this.errorMessage = 'Debe seleccionar una unidad de medida';
      return false;
    }
    if (this.producto.idmarca <= 0) {
      this.errorMessage = 'Debe seleccionar una marca';
      return false;
    }
    return true;
  }

  mostrarModalExito(mensaje: string): void {
    this.modalMessage = mensaje;
    this.showSuccessModal = true;
  }

  cerrarModalYVolver(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/lista-productos']);
  }

  cerrarModal(): void {
    this.showSuccessModal = false;
  }

  // Métodos para validación de imágenes
  onImageUrlChange(): void {
    this.resetImageValidation();

    if (!this.producto.imagen || this.producto.imagen.trim() === '') {
      return;
    }

    // Verificar si es un enlace de Facebook
    if (this.esFacebookUrl(this.producto.imagen)) {
      this.imagenError = true;
      this.imagenErrorMessage = 'Los enlaces de Facebook no funcionan como URLs de imagen. Necesitas una URL directa de imagen.';
      return;
    }

    // Verificar si es un enlace de Instagram
    if (this.esInstagramUrl(this.producto.imagen)) {
      this.imagenError = true;
      this.imagenErrorMessage = 'Los enlaces de Instagram no funcionan como URLs de imagen. Necesitas una URL directa de imagen.';
      return;
    }

    // Verificar si es una URL válida de imagen
    if (this.esUrlImagenValida(this.producto.imagen)) {
      this.imagenCargando = true;
      // La validación final se hará en onImageLoad/onImageError
    } else {
      this.imagenError = true;
      this.imagenErrorMessage = 'La URL debe terminar en .jpg, .jpeg, .png, .gif, .webp o .svg';
    }
  }

  onImageLoad(): void {
    this.imagenCargando = false;
    this.imagenValida = true;
    this.imagenError = false;
  }

  onImageError(): void {
    this.imagenCargando = false;
    this.imagenValida = false;
    this.imagenError = true;
    this.imagenErrorMessage = 'No se pudo cargar la imagen. Verifica que la URL sea correcta y accesible.';
  }

  private resetImageValidation(): void {
    this.imagenError = false;
    this.imagenValida = false;
    this.imagenCargando = false;
    this.imagenErrorMessage = '';
  }

  private esFacebookUrl(url: string): boolean {
    return url.includes('facebook.com') || url.includes('fb.com') || url.includes('fbcdn.net');
  }

  private esInstagramUrl(url: string): boolean {
    return url.includes('instagram.com') || url.includes('cdninstagram.com');
  }

  private esUrlImagenValida(url: string): boolean {
    const extensionesValidas = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const urlLower = url.toLowerCase();
    return extensionesValidas.some(ext => urlLower.includes(ext));
  }

  volverSinGuardar(): void {
    this.location.back();
  }


}
