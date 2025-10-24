import { Component, inject } from '@angular/core';
import { ProductosService } from '../../../../core/services/productos/productos-service';
import { BehaviorSubject, catchError, map, Observable, of, timeout } from 'rxjs';
import { ProductoModel } from '../../../../core/models/producto/producto.model';
import { RequestListaProductosModel } from '../../../../core/models/producto/request/listaProductos.request';
import { ResponseListaProductos } from '../../../../core/models/producto/response/listaProductos.response';

@Component({
  selector: 'app-listar-ventas-page',
  imports: [],
  templateUrl: './listar-ventas-page.html',
  styleUrl: './listar-ventas-page.css'
})
export class ListarVentasPage {


}
