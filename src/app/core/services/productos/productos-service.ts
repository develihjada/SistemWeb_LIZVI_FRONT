import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { RequestListaProductosModel } from '../../models/producto/request/listaProductos.request';
import { RequestRegistroProducto } from '../../models/producto/request/registroProducto.request';
import { ResponseListaProductos } from '../../models/producto/response/listaProductos.response';
import { ResponseGeneral } from '../../../shared/model/general.response';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}
}
