import { Component, inject, OnInit } from '@angular/core';
import { ProductoModel } from '../../../../core/models/producto/producto.model';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { ProductosService } from '../../../../core/services/productos/productos-service';
import { SubfamiliasService } from '../../../../core/services/subfamilias/subfamilias-service';
import { FamiliasService } from '../../../../core/services/familias/familias-service';
import { MarcasService } from '../../../../core/services/marcas/marcas-service';
import { UnidadesMedidaService } from '../../../../core/services/unidadesMedida/unidades-medida-service';
import { RequestRegistroProducto } from '../../../../core/models/producto/request/registroProducto.request';
import { SubfamiliaModel } from '../../../../core/models/subfamilia/subfamilia.model';
import { FamiliaModel } from '../../../../core/models/familia/familia.model';
import { MarcaModel } from '../../../../core/models/marca/marca.model';
import { UnidadMedidaModel } from '../../../../core/models/unidadMedida/unidadmedida.model';
import { RequestListaSubfamiliasModel } from '../../../../core/models/subfamilia/request/listaSubfamilias.request';
import { RequestListaFamiliasModel } from '../../../../core/models/familia/request/listaFamilias.request';
import { RequestListaMarcasModel } from '../../../../core/models/marca/request/listaMarcas.request';
import { RequestListaUnidadesMedidaModel } from '../../../../core/models/unidadMedida/request/listaUnidadesMedida.request';
import { ResponseGeneral } from '../../../../shared/model/general.response';
import { catchError, of, timeout } from 'rxjs';

@Component({
  selector: 'app-registrar-productos-page',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './registrar-productos-page.html',
  styleUrl: './registrar-productos-page.css'
})
export class RegistrarProductosPage implements OnInit {



  // Instancia del modelo para el two-way data binding
  newProduct: ProductoModel = new ProductoModel();

  // Servicios
  private router: Router;
  private location: Location;
  private productosService: ProductosService;
  private subfamiliasService: SubfamiliasService;
  private familiasService: FamiliasService;
  private marcasService: MarcasService;
  private unidadesMedidaService: UnidadesMedidaService;

  // Datos de catálogos
  familias: FamiliaModel[] = [];

  subfamilias: SubfamiliaModel[] = []; // Subfamilias filtradas por familia seleccionada
  marcas: MarcaModel[] = [];
  unidadesMedida: UnidadMedidaModel[] = [];

  // Control del filtrado
  familiaSeleccionada: number = 0;

  // Estados
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Modal de confirmación
  showSuccessModal: boolean = false;
  modalMessage: string = '';

  constructor() {
    this.router = inject(Router);
    this.location = inject(Location);
    this.productosService = inject(ProductosService);
    this.subfamiliasService = inject(SubfamiliasService);
    this.familiasService = inject(FamiliasService);
    this.marcasService = inject(MarcasService);
    this.unidadesMedidaService = inject(UnidadesMedidaService);
  }

  ngOnInit(): void {
    // Cargar datos de catálogos
    this.cargarFamilias();
    this.cargarSubfamilias();
    this.cargarMarcas();
    this.cargarUnidadesMedida();
  }

  // Método de manejo de la subida de imagen
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.match(/image\/(jpeg|png|gif)/)) {
        this.newProduct.imagen = "";
        this.newProduct.imagenError = true;
        return;
      }
      this.newProduct.imagenError = false;

      // Leer el archivo para la previsualización
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newProduct.imagen = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Método llamado al enviar el formulario
  guardarProducto(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Preparar el request
    const request: RequestRegistroProducto = {
      producto: this.newProduct.producto.trim(),
      descripcion: this.newProduct.descripcion.trim(),
      precio: this.newProduct.precio,
      stock: this.newProduct.stock,
      idsubfamilia: this.newProduct.idsubfamilia,
      idunidadmedida: this.newProduct.idunidadmedida,
      idmarca: this.newProduct.idmarca,
      imagen: this.newProduct.imagen || ''
    };

    console.log('--- Producto a Guardar ---');
    console.log(request);

    // Llamar al servicio
    this.productosService.registrarProducto(request).pipe(
      timeout({ each: 10000 }),
      catchError((err) => {
        console.error('Error al registrar producto:', err);
        this.isLoading = false;
        this.errorMessage = 'Error al conectar con el servidor. Por favor, inténtelo de nuevo.';
        return of(null);
      })
    ).subscribe({
      next: (response: ResponseGeneral | null) => {
        this.isLoading = false;

        if (response && response.exito) {
          this.modalMessage = response.mensaje || 'Producto registrado exitosamente';
          this.showSuccessModal = true;
        } else {
          this.errorMessage = response?.mensaje || 'Error al registrar el producto. Verifique los datos e inténtelo de nuevo.';
        }
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading = false;
        this.errorMessage = 'Error inesperado. Por favor, inténtelo de nuevo.';
      }
    });
  }

  // Método para el botón de Volver/Cancelar
  cancelarRegistro(): void {
    this.router.navigate(['/lista-productos']);
  }

  // Método para limpiar el formulario
  limpiarFormulario(): void {
    this.newProduct = new ProductoModel();
    this.familiaSeleccionada = 0; // Resetear filtro de familia
    this.onFamiliaChange(); // Actualizar subfamilias disponibles
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Método para el botón de Volver al listado de productos
  volverCatalogos(): void {
    this.router.navigate(['/lista-productos']);
  }

  // Métodos para cargar datos de catálogos
  cargarFamilias(): void {
    const request: RequestListaFamiliasModel = { estado: 1 };

    this.familiasService.listaFamilias(request).pipe(
      timeout({ each: 7000 }),
      catchError((err) => {
        console.error('Error al cargar familias:', err);
        return of(null);
      })
    ).subscribe({
      next: (response) => {
        if (response && response.exito) {
          this.familias = response.familia || [];
        }
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  cargarSubfamilias(): void {
    // Cargar todas las subfamilias inicialmente
    this.cargarSubfamiliasPorFamilia(0);
  }

  // Método para cargar subfamilias por familia usando el endpoint del backend
  cargarSubfamiliasPorFamilia(idFamilia: number): void {
    const request: RequestListaSubfamiliasModel = {
      estado: 1,
      idfamilia: idFamilia
    };

    this.subfamiliasService.listaSubfamilias(request).pipe(
      timeout({ each: 7000 }),
      catchError((err) => {
        console.error('Error al cargar subfamilias:', err);
        return of(null);
      })
    ).subscribe({
      next: (response) => {
        if (response && response.exito) {
          this.subfamilias = response.subFamilia || [];
        }
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  cargarMarcas(): void {
    const request: RequestListaMarcasModel = { estado: 1 };

    this.marcasService.listaMarcas(request).pipe(
      timeout({ each: 7000 }),
      catchError((err) => {
        console.error('Error al cargar marcas:', err);
        return of(null);
      })
    ).subscribe({
      next: (response) => {
        if (response && response.exito) {
          this.marcas = response.marca || [];
        }
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  cargarUnidadesMedida(): void {
    const request: RequestListaUnidadesMedidaModel = { estado: 1 };

    this.unidadesMedidaService.listaUnidadesMedida(request).pipe(
      timeout({ each: 7000 }),
      catchError((err) => {
        console.error('Error al cargar unidades de medida:', err);
        return of(null);
      })
    ).subscribe({
      next: (response) => {
        if (response && response.exito) {
          this.unidadesMedida = response.unidadmedida || [];
        }
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  // Método para filtrar subfamilias por familia seleccionada
  onFamiliaChange(): void {
    // Convertir a número si viene como string del HTML
    const idFamilia = Number(this.familiaSeleccionada) || 0;

    // Cargar subfamilias usando el endpoint del backend
    this.cargarSubfamiliasPorFamilia(idFamilia);

    // Limpiar selección de subfamilia cuando cambia la familia
    this.newProduct.idsubfamilia = 0;
  }

  // Métodos para el modal de éxito
  cerrarModalYVolver(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/lista-productos']);
  }

  cerrarModal(): void {
    this.showSuccessModal = false;
  }
}
