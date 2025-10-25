import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { RequestListaUnidadesMedidaModel } from '../../models/unidadMedida/request/listaUnidadesMedida.request';
import { ResponseListaUnidadesMedida } from '../../models/unidadMedida/response/listaUnidadesMedida.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnidadesMedidaService {
  private url = environment.api;

  listaUnidadesMedida(req: RequestListaUnidadesMedidaModel): Observable<ResponseListaUnidadesMedida> {
    const fullUrl = `${this.url}/UnidadMedida/Mostrar`;

    return this.http.post<ResponseListaUnidadesMedida>(fullUrl, req, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  constructor(private http: HttpClient) {}
}
