import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RequestListaProductosModel } from '../../models/producto/request/listaProductos.request';
import { RequestRegistroProducto } from '../../models/producto/request/registroProducto.request';
import { RequestDetalleProducto } from '../../models/producto/request/detalleProducto.request';
import { RequestActualizarEstadoProducto } from '../../models/producto/request/actualizarEstadoProducto.request';
import { RequestActualizarProducto } from '../../models/producto/request/actualizarProducto.request';
import { ResponseListaProductos } from '../../models/producto/response/listaProductos.response';
import { ResponseGeneral } from '../../../shared/model/general.response';
import { Observable } from 'rxjs';
import { ResponseDetalleProductoData } from '../../models/producto/response/detalleProducto.response';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private url = environment.api

  listaProductos(req: RequestListaProductosModel): Observable<ResponseListaProductos> {
    const fullUrl = `${this.url}/Productos/Mostrar`;

    return this.http.post<ResponseListaProductos>(fullUrl, req, {
        headers: { 'Content-Type': 'application/json' },
      });
  }

  registrarProducto(req: RequestRegistroProducto): Observable<ResponseGeneral> {
    const fullUrl = `${this.url}/Productos/Insertar`;

    return this.http.post<ResponseGeneral>(fullUrl, req, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  detalleProducto(req: RequestDetalleProducto): Observable<ResponseDetalleProductoData> {
    const fullUrl = `${this.url}/Productos/Detalle`;

    return this.http.post<ResponseDetalleProductoData>(fullUrl, req, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  actualizarEstadoProducto(req: RequestActualizarEstadoProducto): Observable<ResponseGeneral> {
    const fullUrl = `${this.url}/Productos/actualizarestado`;

    return this.http.post<ResponseGeneral>(fullUrl, req, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  actualizarProducto(req: RequestActualizarProducto): Observable<ResponseGeneral> {
    const fullUrl = `${this.url}/Productos/actualizar`;

    return this.http.post<ResponseGeneral>(fullUrl, req, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  constructor(private http: HttpClient) {}
}
