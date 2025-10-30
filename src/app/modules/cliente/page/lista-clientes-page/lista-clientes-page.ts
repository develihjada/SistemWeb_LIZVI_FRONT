import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, timeout } from 'rxjs';
import { ClientesService } from '../../../../core/services/clientes/clientes-service';
import { ClienteModel } from '../../../../core/models/cliente/cliente.models';
import { RequestListaClientesModel } from '../../../../core/models/cliente/request/listaClientes.request';
import { ResponseListaClientes } from '../../../../core/models/cliente/response/listaClientes.response';

@Component({
  selector: 'app-lista-clientes-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-clientes-page.html',
  styleUrls: ['./lista-clientes-page.css']
})
export class ListaClientesPage implements OnInit {

  isLoading: boolean = false;
  private initialLoadDone: boolean = false;
  errorMessage: string | null = null;
  private clientesSubject = new BehaviorSubject<ClienteModel[]>([]);
  clientesData$: Observable<ClienteModel[]> = this.clientesSubject.asObservable();

  constructor(
    private api: ClientesService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.listarClientes();
  }

  listarClientes() {
    this.errorMessage = null;
    this.isLoading = true;

    const EstadoFiltro: RequestListaClientesModel = { estado: 2 };
    const api$ = this.api.listaClientes(EstadoFiltro).pipe(
      timeout({ each: 7000 }),
      map((response: ResponseListaClientes) => {
        return response.exito ? response.cliente : [];
      }),
      catchError((err) => {
        this.errorMessage = 'No se pudo conectar al servidor. Revisa tu red o inténtalo más tarde.';
        return of([] as ClienteModel[]);
      })
    );

    const sub = api$.subscribe({
      next: (list) => {
        let toPush: ClienteModel[] = [];
        if (Array.isArray(list)) {
          toPush = list;
          console.log("✅ Procesando como array, elementos:", list.length);
        } else if (list && typeof list === 'object') {
          toPush = [list as ClienteModel];
          console.log("✅ Procesando como objeto único");
        } else {
          toPush = [];
          console.log("⚠️ Procesando como array vacío");
        }

        // Siempre empujamos el resultado (incluso vacío) para que la UI refleje la búsqueda
        this.clientesSubject.next(toPush);
        console.log('🚀 clientesSubject después de actualizar:', this.clientesSubject.getValue());
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

  registrarCliente() {
    this.router.navigate(['/cliente/registrar-cliente']);
  }

  editarCliente(clienteId: number) {
    this.router.navigate(['/cliente/editar-cliente', clienteId]);
  }

  verDetalleCliente(clienteId: number) {
    this.router.navigate(['/cliente/detalle-cliente', clienteId]);
  }

  eliminarCliente(clienteId: number) {
    if (confirm('¿Está seguro que desea eliminar este cliente?')) {
      console.log('Eliminar cliente:', clienteId);
      // Implementar lógica de eliminación
    }
  }

  // Método para el botón de Volver
  volverCatalogos(): void {
    this.router.navigate(['/configuraciones']);
  }
}
