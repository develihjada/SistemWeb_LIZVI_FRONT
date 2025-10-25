import { CommonModule, Location, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../../../core/services/productos/productos-service';
import { ClientesService } from '../../../../core/services/clientes/clientes-service';
import { VentasService } from '../../../../core/services/ventas/ventas-service';
import { FamiliasService } from '../../../../core/services/familias/familias-service';
import { SubfamiliasService } from '../../../../core/services/subfamilias/subfamilias-service';
import { BehaviorSubject, catchError, map, Observable, of, timeout } from 'rxjs';
import { ProductoModel } from '../../../../core/models/producto/producto.model';
import { ClienteModel } from '../../../../core/models/cliente/cliente.models';
import { FamiliaModel } from '../../../../core/models/familia/familia.model';
import { SubfamiliaModel } from '../../../../core/models/subfamilia/subfamilia.model';
import { RequestListaProductosModel } from '../../../../core/models/producto/request/listaProductos.request';
import { RequestListaFamiliasModel } from '../../../../core/models/familia/request/listaFamilias.request';
import { RequestListaSubfamiliasModel } from '../../../../core/models/subfamilia/request/listaSubfamilias.request';
import { RequestListaClientesModel } from '../../../../core/models/cliente/request/listaClientes.request';
import { ResponseListaProductos } from '../../../../core/models/producto/response/listaProductos.response';
import { ResponseListaClientes } from '../../../../core/models/cliente/response/listaClientes.response';
import { ResponseListaFamilias } from '../../../../core/models/familia/response/listaFamilias.response';
import { ResponseListaSubfamilias } from '../../../../core/models/subfamilia/response/listaSubfamilias.response';
import { RequestRegistroVenta, DetalleVentaRequest } from '../../../../core/models/venta/request/registroVenta.request';
import { ResponseGeneral } from '../../../../shared/model/general.response';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-registrar-ventas-page',
  imports: [NgClass, CommonModule, FormsModule],
  templateUrl: './registrar-ventas-page.html',
  styleUrl: './registrar-ventas-page.css'
})
export class RegistrarVentasPage implements OnInit {

  private location: Location;
  private api: ProductosService;
  private clientesApi: ClientesService;
  private ventasApi: VentasService;
  private familiasApi: FamiliasService;
  private subfamiliasApi: SubfamiliasService;

  activeTab: 'familias' | 'productos' = 'familias';
  isCartOpen: boolean = false;
  isConfirmClearModalOpen: boolean = false;

  // Flujo de finalizar venta
  isClienteModalOpen: boolean = false;
  isComprobanteModalOpen: boolean = false;
  isComprobanteGeneradoModalOpen: boolean = false;
  isResultadoVentaModalOpen: boolean = false;

  // Lista de clientes
  clientes: ClienteModel[] = [];
  clienteSeleccionado: number | null = null; // ID del cliente seleccionado

  // Lista de familias
  familias: FamiliaModel[] = [];
  familiaSeleccionada: number | null = null; // ID de la familia seleccionada

  // Lista de subfamilias
  subfamilias: SubfamiliaModel[] = [];

  // Datos del cliente y venta (mantener para compatibilidad)
  clienteNombre: string = '';
  clienteDocumento: string = '';
  tipoComprobante: 'boleta' | 'factura' | '' = '';
  numeroComprobante: string = '';
  fechaVenta: string = '';
  horaVenta: string = '';

  // Estados del proceso de guardar venta
  isGuardandoVenta: boolean = false;
  ventaGuardadaExitosamente: boolean = false;
  errorGuardarVenta: string = '';

  // Resultado de la venta
  resultadoVentaResponse: ResponseGeneral | null = null;

  cartItems: CartItem[] = [];

  constructor() {
    this.location = inject(Location);
    this.api = inject(ProductosService);
    this.clientesApi = inject(ClientesService);
    this.ventasApi = inject(VentasService);
    this.familiasApi = inject(FamiliasService);
    this.subfamiliasApi = inject(SubfamiliasService);
  }

  volverInicio() {
    this.location.back();
  }

  /**
   * Cambia el tab activo entre familias y productos
   */
  setActiveTab(tabName: 'familias' | 'productos'): void {
    this.activeTab = tabName;
  }

  /**
   * Maneja el error de carga de imagen del producto
   */
  onImageError(producto: ProductoModel): void {
    producto.imagenError = true;
  }

  /**
   * Agrega un producto al carrito de compras con confirmación y validación de stock
   */
  agregarAlCarrito(producto: ProductoModel): void {
    // Verificar si el producto tiene stock disponible
    if (producto.stock <= 0) {
      return;
    }

    // Verificar si el producto ya existe en el carrito
    const existingItem = this.cartItems.find(item => item.id === producto.id);

    if (existingItem) {
      // Verificar que no exceda el stock disponible
      if (existingItem.quantity >= producto.stock) {
        return;
      }
      // Si ya existe, incrementar cantidad
      existingItem.quantity += 1;
    } else {
      // Si no existe, agregarlo como nuevo item
      const newItem: CartItem = {
        id: producto.id,
        name: producto.descripcion,
        quantity: 1,
        price: producto.precio
      };
      this.cartItems.push(newItem);
    }    // Actualizar totales automáticamente
    this.actualizarTotales();
  }

  /**
   * Calcula el subtotal del carrito
   */
  calcularSubtotal(): number {
    return this.cartItems.reduce((subtotal, item) => {
      return subtotal + (item.price * item.quantity);
    }, 0);
  }

  /**
   * Calcula el total del carrito (por ahora igual al subtotal)
   */
  calcularTotal(): number {
    return this.calcularSubtotal();
  }

  /**
   * Actualiza los totales del carrito
   */
  actualizarTotales(): void {
    // Método para actualización de totales (sin logs)
  }

  /**
   * Obtiene la cantidad total de items en el carrito
   */
  obtenerCantidadItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Remueve un item del carrito directamente
   */
  removerDelCarrito(itemId: number): void {
    const item = this.cartItems.find(item => item.id === itemId);
    if (!item) return;

    const index = this.cartItems.findIndex(item => item.id === itemId);
    if (index > -1) {
      this.cartItems.splice(index, 1);
      this.actualizarTotales();
    }
  }

  /**
   * Abre el modal de confirmación para limpiar carrito
   */
  limpiarCarrito(): void {
    if (this.cartItems.length === 0) return;
    this.isConfirmClearModalOpen = true;
  }

  /**
   * Confirma y limpia completamente el carrito de compras
   */
  confirmarLimpiarCarrito(): void {
    this.cartItems = [];
    this.actualizarTotales();
    this.isConfirmClearModalOpen = false;
  }

  /**
   * Cancela la operación de limpiar carrito
   */
  cancelarLimpiarCarrito(): void {
    this.isConfirmClearModalOpen = false;
  }

  /**
   * Inicia el flujo de finalizar venta
   */
  finalizarVenta(): void {
    if (this.cartItems.length === 0) return;
    // Resetear la selección del cliente
    this.clienteSeleccionado = null;
    this.clienteNombre = '';
    this.clienteDocumento = '';
    this.isClienteModalOpen = true;
  }

  /**
   * Cancela el modal de cliente
   */
  cancelarCliente(): void {
    this.isClienteModalOpen = false;
    this.clienteSeleccionado = null;
    this.clienteNombre = '';
    this.clienteDocumento = '';
  }

  /**
   * Continúa con la selección de comprobante
   */
  continuarConComprobante(): void {
    this.isClienteModalOpen = false;
    this.isComprobanteModalOpen = true;
  }

  /**
   * Cancela el modal de comprobante
   */
  cancelarComprobante(): void {
    this.isComprobanteModalOpen = false;
    this.tipoComprobante = '';
  }

  /**
   * Selecciona el tipo de comprobante y genera el número
   */
  seleccionarComprobante(tipo: 'boleta' | 'factura'): void {
    this.tipoComprobante = tipo;
    // Generar número de comprobante
    const fecha = new Date();
    const timestamp = fecha.getTime().toString().slice(-6);
    this.numeroComprobante = tipo === 'boleta' ? `B001-${timestamp}` : `F001-${timestamp}`;
  }

  /**
   * Finaliza la venta y procesa la compra
   */
  procesarVenta(): void {
    // Generar fecha y hora de la venta
    const fechaActual = new Date();
    this.fechaVenta = fechaActual.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.horaVenta = fechaActual.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Guardar la venta en la base de datos
    this.guardarVenta();
  }

  /**
   * Guarda la venta en la base de datos
   */
  guardarVenta(): void {
    // Limpiar estados anteriores
    this.isGuardandoVenta = true;
    this.ventaGuardadaExitosamente = false;
    this.errorGuardarVenta = '';

    // Preparar los datos para el request
    const fechaISO = new Date().toISOString();

    // Crear detalles de la venta desde el carrito
    const detalles: DetalleVentaRequest[] = this.cartItems.map(item => ({
      idproducto: item.id,
      cantidad: item.quantity,
      subtotal: item.price * item.quantity
    }));

    // Crear el request
    const requestVenta: RequestRegistroVenta = {
      fechaventa: fechaISO,
      idcliente: this.clienteSeleccionado || 0,
      total: this.calcularTotal(),
      detalles: detalles
    };

    // Enviar al servicio
    this.ventasApi.insertarVenta(requestVenta).pipe(
      timeout({ each: 10000 }),
      catchError((err) => {
        this.errorGuardarVenta = 'Error al conectar con el servidor. Por favor, inténtalo nuevamente.';
        this.isGuardandoVenta = false;
        return of({ exito: false, mensaje: 'Error de conexión' } as ResponseGeneral);
      })
    ).subscribe({
      next: (response: ResponseGeneral) => {
        this.isGuardandoVenta = false;
        this.resultadoVentaResponse = response;

        if (response.exito) {
          this.ventaGuardadaExitosamente = true;
        } else {
          this.errorGuardarVenta = response.mensaje || 'Error desconocido del servidor';
        }

        // Cerrar modal de comprobante y mostrar resultado
        this.isComprobanteModalOpen = false;
        this.isResultadoVentaModalOpen = true;
      },
      error: (err) => {
        this.isGuardandoVenta = false;
        this.errorGuardarVenta = 'Error inesperado. Por favor, inténtalo nuevamente.';

        // Crear response de error para mostrar en el modal
        this.resultadoVentaResponse = {
          exito: false,
          mensaje: this.errorGuardarVenta
        };

        // Cerrar modal de comprobante y mostrar resultado
        this.isComprobanteModalOpen = false;
        this.isResultadoVentaModalOpen = true;
      }
    });
  }

  /**
   * Cierra el modal del comprobante y limpia los datos
   */
  cerrarComprobanteGenerado(): void {
    // Limpiar todos los datos después de mostrar el comprobante
    this.cartItems = [];
    this.clienteNombre = '';
    this.clienteDocumento = '';
    this.tipoComprobante = '';
    this.numeroComprobante = '';
    this.fechaVenta = '';
    this.horaVenta = '';

    // Limpiar estados de guardado
    this.clienteSeleccionado = null;
    this.isGuardandoVenta = false;
    this.ventaGuardadaExitosamente = false;
    this.errorGuardarVenta = '';

    this.isComprobanteGeneradoModalOpen = false;
    this.actualizarTotales();
  }

  /**
   * Cierra el modal de resultado de venta y maneja las acciones posteriores
   */
  cerrarResultadoVenta(): void {
    const ventaExitosa = this.resultadoVentaResponse?.exito || false;

    // Limpiar datos del modal
    this.isResultadoVentaModalOpen = false;
    this.resultadoVentaResponse = null;

    if (ventaExitosa) {
      // Si la venta fue exitosa, mostrar el comprobante y limpiar todo
      this.isComprobanteGeneradoModalOpen = true;

      // Refrescar la lista de productos para actualizar stock
      this.actualizarListaProductos();
    } else {
      // Si hubo error, solo limpiar los estados de guardado pero mantener la venta
      this.isGuardandoVenta = false;
      this.ventaGuardadaExitosamente = false;
      this.errorGuardarVenta = '';
    }
  }

  /**
   * Actualiza la lista de productos para reflejar cambios en stock
   */
  actualizarListaProductos(): void {
    // Recargar productos para actualizar stock después de la venta
    this.listarProductos();
  }  /**
   * Imprime el comprobante
   */
  imprimirComprobante(): void {
    window.print();
  }

  /**
   * Obtiene la fecha actual formateada
   */
  obtenerFechaActual(): string {
    return new Date().toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Debug del estado actual del componente
   */
  debugVentasTab(): void {
    // Método de debug (sin logs en producción)
  }

  isLoading: boolean = false;
  private initialLoadDone: boolean = false;
  errorMessage: string | null = null;
  private productosSubject = new BehaviorSubject<ProductoModel[]>([]);
  productosData$: Observable<ProductoModel[]> = this.productosSubject.asObservable();

  // Datos de familias
  private familiasSubject = new BehaviorSubject<FamiliaModel[]>([]);
  familiasData$: Observable<FamiliaModel[]> = this.familiasSubject.asObservable();

  // Mantener todos los productos sin filtrar
  private todosLosProductos: ProductoModel[] = [];

  ngOnInit(): void {
    this.listarProductos();
    this.cargarClientes();
    this.cargarFamilias();
    this.cargarSubfamilias();
  }

  listarProductos() {
      this.errorMessage = null;
      this.isLoading = true;

      const EstadoFiltro: RequestListaProductosModel = { estado: 2, idfamilia: 0, idsubfamilia: 0 };

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

          this.todosLosProductos = [...toPush]; // Guardar copia de todos los productos
          this.productosSubject.next(toPush);
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

  cargarClientes() {
    const EstadoFiltro: RequestListaClientesModel = { estado: 1 };

    this.clientesApi.listaClientes(EstadoFiltro).pipe(
      timeout({ each: 7000 }),
      map((response: ResponseListaClientes) => {
        return response.exito ? response.cliente : [];
      }),
      catchError((err) => {
        return of([] as ClienteModel[]);
      })
    ).subscribe({
      next: (clientes: ClienteModel[]) => {
        this.clientes = clientes;
      },
      error: (err) => {
        // Error al cargar clientes
      }
    });
  }

  cargarFamilias() {
    const EstadoFiltro: RequestListaFamiliasModel = { estado: 1 };

    this.familiasApi.listaFamilias(EstadoFiltro).pipe(
      timeout({ each: 7000 }),
      map((response: ResponseListaFamilias) => {
        return response.exito ? response.familia : [];
      }),
      catchError((err) => {
        return of([] as FamiliaModel[]);
      })
    ).subscribe({
      next: (familias: FamiliaModel[]) => {
        this.familias = familias;
        this.familiasSubject.next(familias);
      },
      error: (err) => {
        // Error al cargar familias
      }
    });
  }

  cargarSubfamilias() {
    const EstadoFiltro: RequestListaSubfamiliasModel = { estado: 1, idfamilia: 0 };

    this.subfamiliasApi.listaSubfamilias(EstadoFiltro).pipe(
      timeout({ each: 7000 }),
      map((response: ResponseListaSubfamilias) => {
        return response.exito ? response.subFamilia : [];
      }),
      catchError((err) => {
        return of([] as SubfamiliaModel[]);
      })
    ).subscribe({
      next: (subfamilias: SubfamiliaModel[]) => {
        this.subfamilias = subfamilias;
      },
      error: (err) => {
        // Error al cargar subfamilias
      }
    });
  }

  // Método para filtrar productos por familia
  filtrarProductosPorFamilia(familiaId: number | null) {
    this.familiaSeleccionada = familiaId;

    if (!familiaId) {
      // Si no hay familia seleccionada, mostrar todos los productos
      this.productosSubject.next(this.todosLosProductos);
    } else {
      // Obtener las subfamilias que pertenecen a la familia seleccionada
      const subfamiliasIds = this.subfamilias
        .filter(subfamilia => subfamilia.familia === familiaId)
        .map(subfamilia => subfamilia.id);

      if (subfamiliasIds.length === 0) {
        // Si no hay subfamilias para esta familia, mostrar array vacío
        this.productosSubject.next([]);
      } else {
        // Filtrar productos por subfamilias desde todos los productos
        const productosFiltrados = this.todosLosProductos.filter(producto =>
          subfamiliasIds.includes(producto.idsubfamilia)
        );
        this.productosSubject.next(productosFiltrados);
      }
    }
  }  // Método para obtener el nombre completo del cliente seleccionado
  obtenerNombreClienteSeleccionado(): string {
    if (!this.clienteSeleccionado) return '';
    // Convertir a número para comparar correctamente
    const clienteId = Number(this.clienteSeleccionado);
    const cliente = this.clientes.find(c => c.id === clienteId);
    return cliente ? `${cliente.nombres} ${cliente.apellidos}` : '';
  }

  // Método para obtener el cliente completo seleccionado
  obtenerClienteSeleccionadoCompleto(): any | null {
    if (!this.clienteSeleccionado) return null;
    // Convertir a número para comparar correctamente
    const clienteId = Number(this.clienteSeleccionado);
    const cliente = this.clientes.find(c => c.id === clienteId);
    return cliente || null;
  }

  // Método que se ejecuta cuando se selecciona un cliente
  onClienteSeleccionado() {
    // Convertir a número para comparar correctamente
    const clienteId = Number(this.clienteSeleccionado);
    const cliente = this.clientes.find(c => c.id === clienteId);

    if (cliente) {
      // Actualizar las variables existentes para compatibilidad
      this.clienteNombre = `${cliente.nombres} ${cliente.apellidos}`;
      this.clienteDocumento = cliente.id.toString(); // Usar ID como documento temporal
    } else {
      this.clienteNombre = '';
      this.clienteDocumento = '';
    }
  }
}
