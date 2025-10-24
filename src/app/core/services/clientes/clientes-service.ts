import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { RequestListaClientesModel } from '../../models/cliente/request/listaClientes.request';
import { ResponseListaClientes } from '../../models/cliente/response/listaClientes.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private url = environment.api

  listaClientes(req: RequestListaClientesModel): Observable<ResponseListaClientes> {
    const fullUrl = `${this.url}/Cliente/Mostrar`;

    return this.http.post<ResponseListaClientes>(fullUrl, req, {
        headers: { 'Content-Type': 'application/json' },
      });
  }

  constructor(private http: HttpClient) {}
}
